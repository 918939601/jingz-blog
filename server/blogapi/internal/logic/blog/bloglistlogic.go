package blog

import (
	"context"
	"fmt"
	"strings"
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

	// Build query with optional tags filter
	var query string
	args := []interface{}{}
	argIndex := 1

	if req.Tags != "" {
		// Query with tags filter (case-insensitive)
		query = `SELECT DISTINCT b."id", b."slug", b."title", b."content", b."isPublished", b."createdAt", b."updatedAt"
			 FROM "Blog" b
			 INNER JOIN "_BlogToBlogTag" bbt ON b."id" = bbt."A"
			 INNER JOIN "BlogTag" bt ON bbt."B" = bt."id"
			 WHERE LOWER(bt."tagName") IN (`

		tagNames := strings.Split(req.Tags, ",")
		for i, tag := range tagNames {
			if i > 0 {
				query += `, `
			}
			query += `LOWER($` + fmt.Sprint(argIndex) + `)`
			args = append(args, strings.TrimSpace(tag))
			argIndex++
		}
		query += `)
			 ORDER BY b."createdAt" DESC
			 LIMIT $` + fmt.Sprint(argIndex) + ` OFFSET $` + fmt.Sprint(argIndex+1)
		args = append(args, size, offset)
		logx.Infof("Blog list with tags filter - query: %s, args: %v", query, args)
	} else {
		// Query without tags filter
		query = `SELECT DISTINCT b."id", b."slug", b."title", b."content", b."isPublished", b."createdAt", b."updatedAt"
			 FROM "Blog" b
			 ORDER BY b."createdAt" DESC
			 LIMIT $` + fmt.Sprint(argIndex) + ` OFFSET $` + fmt.Sprint(argIndex+1)
		args = append(args, size, offset)
		logx.Infof("Blog list without tags filter - query: %s, args: %v", query, args)
	}

	rows, err := db.QueryContext(l.ctx, query, args...)
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
		b.Tags = make([]types.BlogTag, 0)

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

	// Count total with same filters
	var countQuery string
	countArgs := []interface{}{}
	countArgIndex := 1

	if req.Tags != "" {
		countQuery = `SELECT COUNT(DISTINCT b."id") FROM "Blog" b
                      INNER JOIN "_BlogToBlogTag" bbt ON b."id" = bbt."A"
                      INNER JOIN "BlogTag" bt ON bbt."B" = bt."id"
                      WHERE LOWER(bt."tagName") IN (`
		tagNames := strings.Split(req.Tags, ",")
		for i, tag := range tagNames {
			if i > 0 {
				countQuery += `, `
			}
			countQuery += `LOWER($` + fmt.Sprint(countArgIndex) + `)`
			countArgs = append(countArgs, strings.TrimSpace(tag))
			countArgIndex++
		}
		countQuery += `)`
	} else {
		countQuery = `SELECT COUNT(DISTINCT b."id") FROM "Blog" b`
	}

	var total int64
	if err := db.QueryRowContext(l.ctx, countQuery, countArgs...).Scan(&total); err != nil {
		logx.Errorf("list count: %v", err)
		return &types.BlogListResp{Items: items, Total: 0, Page: page, PageSize: size}, nil
	}

	return &types.BlogListResp{Items: items, Total: total, Page: page, PageSize: size}, nil
}
