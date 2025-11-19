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

type BlogToggleLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewBlogToggleLogic(ctx context.Context, svcCtx *svc.ServiceContext) *BlogToggleLogic {
	return &BlogToggleLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *BlogToggleLogic) BlogToggle(req *types.BlogToggleReq) (*types.Blog, error) {
	db, err := l.svcCtx.Conn.RawDB()
	if err != nil {
		return nil, err
	}

	_, err = db.ExecContext(l.ctx,
		`UPDATE "Blog" SET "isPublished" = $1, "updatedAt" = now() WHERE "id" = $2`,
		req.IsPublished, req.Id,
	)
	if err != nil {
		return nil, err
	}

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

	util.RevalidateNext("http://localhost:3000", os.Getenv("REVALIDATE_SECRET"), []string{"/blog", "/admin/blog"})
	return &b, nil
}
