package blog

import (
	"context"
	"time"

	"github.com/zeromicro/go-zero/core/logx"
	"server/blogapi/internal/svc"
	"server/blogapi/internal/types"
)

type BlogListLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewBlogListLogic(ctx context.Context, svcCtx *svc.ServiceContext) *BlogListLogic {
	return &BlogListLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *BlogListLogic) BlogList(req *types.BlogListReq) (*types.BlogListResp, error) {
	page := req.Page
	if page <= 0 {
		page = 1
	}
	size := req.PageSize
	if size <= 0 {
		size = 20
	}
	offset := (page - 1) * size

	db, err := l.svcCtx.Conn.RawDB()
	if err != nil {
		logx.Errorf("rawdb: %v", err)
		return &types.BlogListResp{Items: []types.Blog{}, Total: 0, Page: page, PageSize: size}, nil
	}

	// Simple query - just get all blogs for now
	rows, err := db.QueryContext(l.ctx,
		`SELECT "id","slug","title","content","isPublished","createdAt","updatedAt"
		 FROM "Blog"
		 ORDER BY "createdAt" DESC
		 LIMIT $1 OFFSET $2`,
		size, offset)
	if err != nil {
		logx.Errorf("list query: %v", err)
		return &types.BlogListResp{Items: []types.Blog{}, Total: 0, Page: page, PageSize: size}, nil
	}
	defer rows.Close()

	items := make([]types.Blog, 0, size)
	for rows.Next() {
		var b types.Blog
		var createdAt, updatedAt time.Time
		if err := rows.Scan(&b.Id, &b.Slug, &b.Title, &b.Content, &b.IsPublished, &createdAt, &updatedAt); err != nil {
			logx.Errorf("list scan: %v", err)
			continue
		}
		b.CreatedAt = createdAt.UTC().Format(time.RFC3339)
		b.UpdatedAt = updatedAt.UTC().Format(time.RFC3339)
		b.Tags = make([]types.BlogTag, 0) // Initialize empty tags array

		// Fetch tags for this blog
		tagRows, err := db.QueryContext(l.ctx,
			`SELECT bt."id", bt."tagName", bt."tagType"
			 FROM "BlogTag" bt
			 INNER JOIN "_BlogToBlogTag" bbt ON bt."id" = bbt."B"
			 WHERE bbt."A" = $1`,
			b.Id)
		if err == nil {
			defer tagRows.Close()
			for tagRows.Next() {
				var tag types.BlogTag
				if err := tagRows.Scan(&tag.Id, &tag.TagName, &tag.TagType); err != nil {
					logx.Errorf("tag scan: %v", err)
					continue
				}
				b.Tags = append(b.Tags, tag)
			}
		}

		items = append(items, b)
	}

	// Count total
	var total int64
	if err := db.QueryRowContext(l.ctx, `SELECT COUNT(1) FROM "Blog"`).Scan(&total); err != nil {
		logx.Errorf("list count: %v", err)
		return &types.BlogListResp{Items: items, Total: 0, Page: page, PageSize: size}, nil
	}

	return &types.BlogListResp{Items: items, Total: total, Page: page, PageSize: size}, nil
}
