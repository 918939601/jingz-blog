package blog

import (
	"context"
	"time"

	"github.com/zeromicro/go-zero/core/logx"
	"server/blogapi/internal/svc"
	"server/blogapi/internal/types"
)

type BlogDetailLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewBlogDetailLogic(ctx context.Context, svcCtx *svc.ServiceContext) *BlogDetailLogic {
	return &BlogDetailLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *BlogDetailLogic) BlogDetail(req *types.BlogDetailReq) (*types.Blog, error) {
	db, err := l.svcCtx.Conn.RawDB()
	if err != nil {
		return nil, err
	}

	var b types.Blog
	var createdAt, updatedAt time.Time
	if err := db.QueryRowContext(l.ctx,
		`SELECT "id", "slug", "title", "content", "isPublished", "createdAt", "updatedAt"
		 FROM "Blog" WHERE "slug" = $1`, req.Slug,
	).Scan(&b.Id, &b.Slug, &b.Title, &b.Content, &b.IsPublished, &createdAt, &updatedAt); err != nil {
		return nil, err
	}

	b.CreatedAt = createdAt.UTC().Format(time.RFC3339)
	b.UpdatedAt = updatedAt.UTC().Format(time.RFC3339)

	// Fetch tags
	tagRows, err := db.QueryContext(l.ctx,
		`SELECT bt."id", bt."tagName", bt."tagType"
		 FROM "BlogTag" bt
		 INNER JOIN "_BlogToBlogTag" bbt ON bt."id" = bbt."B"
		 WHERE bbt."A" = $1`, b.Id,
	)
	if err == nil {
		defer tagRows.Close()
		tags := make([]types.BlogTag, 0)
		for tagRows.Next() {
			var tag types.BlogTag
			if err := tagRows.Scan(&tag.Id, &tag.TagName, &tag.TagType); err == nil {
				tags = append(tags, tag)
			}
		}
		b.Tags = tags
	}

	return &b, nil
}
