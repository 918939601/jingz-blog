package blog

import (
	"context"

	"github.com/zeromicro/go-zero/core/logx"
	"os"
	"server/blogapi/internal/svc"
	"server/blogapi/internal/types"
	"server/blogapi/internal/util"
)

type BlogDeleteLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewBlogDeleteLogic(ctx context.Context, svcCtx *svc.ServiceContext) *BlogDeleteLogic {
	return &BlogDeleteLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *BlogDeleteLogic) BlogDelete(req *types.BlogDeleteReq) (*types.Blog, error) {
	db, err := l.svcCtx.Conn.RawDB()
	if err != nil {
		return nil, err
	}

	var slug string
	if err := db.QueryRowContext(l.ctx, `SELECT "slug" FROM "Blog" WHERE "id" = $1`, req.Id).Scan(&slug); err != nil {
		return nil, err
	}

	// Delete blog (cascade will delete BlogBlogTag entries)
	_, err = db.ExecContext(l.ctx, `DELETE FROM "Blog" WHERE "id" = $1`, req.Id)
	if err != nil {
		return nil, err
	}

	util.RevalidateConfiguredNext(l.svcCtx.Config.NextSiteURL, os.Getenv("REVALIDATE_SECRET"), []string{"/blog", "/admin/blog", "/blog/" + slug})
	return nil, nil
}
