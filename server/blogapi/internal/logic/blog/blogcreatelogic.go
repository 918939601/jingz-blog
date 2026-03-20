package blog

import (
	"context"
	"time"

	"github.com/zeromicro/go-zero/core/logx"
	"os"
	"server/blogapi/internal/svc"
	"server/blogapi/internal/types"
	"server/blogapi/internal/util"
)

type BlogCreateLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewBlogCreateLogic(ctx context.Context, svcCtx *svc.ServiceContext) *BlogCreateLogic {
	return &BlogCreateLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *BlogCreateLogic) BlogCreate(req *types.BlogCreateReq) (*types.Blog, error) {
	db, err := l.svcCtx.Conn.RawDB()
	if err != nil {
		return nil, err
	}

	var id int64
	if err := db.QueryRowContext(l.ctx,
		`INSERT INTO "Blog"("slug", "title", "content", "isPublished", "createdAt", "updatedAt")
		 VALUES ($1, $2, $3, $4, now(), now()) RETURNING "id"`,
		req.Slug, req.Title, req.Content, req.IsPublished,
	).Scan(&id); err != nil {
		return nil, err
	}

	// Handle tags
	if len(req.RelatedTagNames) > 0 {
		for _, tagName := range req.RelatedTagNames {
			var tagId int64
			// Try to find existing tag
			err := db.QueryRowContext(l.ctx,
				`SELECT "id" FROM "BlogTag" WHERE "tagName" = $1 AND "tagType" = 'BLOG'`, tagName,
			).Scan(&tagId)

			if err != nil {
				// Create new tag
				err = db.QueryRowContext(l.ctx,
					`INSERT INTO "BlogTag"("tagName", "tagType") VALUES ($1, 'BLOG') RETURNING "id"`,
					tagName,
				).Scan(&tagId)
				if err != nil {
					logx.Errorf("create tag: %v", err)
					continue
				}
			}

			// Associate tag with blog
			_, err = db.ExecContext(l.ctx,
				`INSERT INTO "_BlogToBlogTag"("A", "B") VALUES ($1, $2)
				 ON CONFLICT DO NOTHING`,
				id, tagId,
			)
			if err != nil {
				logx.Errorf("associate tag: %v", err)
			}
		}
	}

	// Fetch created blog
	var b types.Blog
	var createdAt, updatedAt time.Time
	if err := db.QueryRowContext(l.ctx,
		`SELECT "id", "slug", "title", "content", "isPublished", "createdAt", "updatedAt"
		 FROM "Blog" WHERE "id" = $1`, id,
	).Scan(&b.Id, &b.Slug, &b.Title, &b.Content, &b.IsPublished, &createdAt, &updatedAt); err != nil {
		return nil, err
	}

	b.CreatedAt = createdAt.UTC().Format(time.RFC3339)
	b.UpdatedAt = updatedAt.UTC().Format(time.RFC3339)

	util.RevalidateConfiguredNext(l.svcCtx.Config.NextSiteURL, os.Getenv("REVALIDATE_SECRET"), []string{"/blog", "/admin/blog", "/blog/" + b.Slug})
	return &b, nil
}
