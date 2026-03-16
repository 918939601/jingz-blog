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

type BlogUpdateLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewBlogUpdateLogic(ctx context.Context, svcCtx *svc.ServiceContext) *BlogUpdateLogic {
	return &BlogUpdateLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *BlogUpdateLogic) BlogUpdate(req *types.BlogUpdateReq) (*types.Blog, error) {
	db, err := l.svcCtx.Conn.RawDB()
	if err != nil {
		return nil, err
	}

	// Update blog
	_, err = db.ExecContext(l.ctx,
		`UPDATE "Blog" SET "slug" = COALESCE(NULLIF($1, ''), "slug"),
		                   "title" = COALESCE(NULLIF($2, ''), "title"),
		                   "content" = COALESCE(NULLIF($3, ''), "content"),
		                   "isPublished" = COALESCE(NULLIF($4::boolean, false), "isPublished"),
		                   "updatedAt" = now()
		 WHERE "id" = $5`,
		req.Slug, req.Title, req.Content, req.IsPublished, req.Id,
	)
	if err != nil {
		return nil, err
	}

	// Handle tags if provided
	if len(req.RelatedTagNames) > 0 {
		// Delete existing tags
		_, err = db.ExecContext(l.ctx,
			`DELETE FROM "_BlogToBlogTag" WHERE "A" = $1`, req.Id,
		)
		if err != nil {
			logx.Errorf("delete tags: %v", err)
		}

		// Add new tags
		for _, tagName := range req.RelatedTagNames {
			var tagId int64
			err := db.QueryRowContext(l.ctx,
				`SELECT "id" FROM "BlogTag" WHERE "tagName" = $1 AND "tagType" = 'BLOG'`, tagName,
			).Scan(&tagId)

			if err != nil {
				err = db.QueryRowContext(l.ctx,
					`INSERT INTO "BlogTag"("tagName", "tagType") VALUES ($1, 'BLOG') RETURNING "id"`,
					tagName,
				).Scan(&tagId)
				if err != nil {
					logx.Errorf("create tag: %v", err)
					continue
				}
			}

			_, err = db.ExecContext(l.ctx,
				`INSERT INTO "_BlogToBlogTag"("A", "B") VALUES ($1, $2)`,
				req.Id, tagId,
			)
			if err != nil {
				logx.Errorf("associate tag: %v", err)
			}
		}
	}

	// Fetch updated blog
	var b types.Blog
	var createdAt, updatedAt time.Time
	if err := db.QueryRowContext(l.ctx,
		`SELECT "id", "slug", "title", "content", "isPublished", "createdAt", "updatedAt"
		 FROM "Blog" WHERE "id" = $1`, req.Id,
	).Scan(&b.Id, &b.Slug, &b.Title, &b.Content, &b.IsPublished, &createdAt, &updatedAt); err != nil {
		return nil, err
	}

	b.CreatedAt = createdAt.UTC().Format(time.RFC3339)
	b.UpdatedAt = updatedAt.UTC().Format(time.RFC3339)

	util.RevalidateConfiguredNext(l.svcCtx.Config.NextSiteURL, os.Getenv("REVALIDATE_SECRET"), []string{"/blog", "/admin/blog"})
	return &b, nil
}
