package echo

import (
	"context"
	"server/blogapi/internal/svc"
	"server/blogapi/internal/types"
	"time"

	"github.com/zeromicro/go-zero/core/logx"
	"os"
	"server/blogapi/internal/util"
)

type EchoToggleLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewEchoToggleLogic(ctx context.Context, svcCtx *svc.ServiceContext) *EchoToggleLogic {
	return &EchoToggleLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *EchoToggleLogic) EchoToggle(req *types.EchoToggleReq) (*types.Echo, error) {
	db, err := l.svcCtx.Conn.RawDB()
	if err != nil {
		return nil, err
	}

	if _, err := db.ExecContext(l.ctx,
		`UPDATE "Echo" SET "isPublished"=$1 WHERE "id"=$2`,
		req.IsPublished, req.Id,
	); err != nil {
		return nil, err
	}

	var e types.Echo
	var createdAt time.Time
	if err := db.QueryRowContext(l.ctx,
		`SELECT "id","reference","content","isPublished","createdAt" FROM "Echo" WHERE "id"=$1`, req.Id,
	).Scan(&e.Id, &e.Reference, &e.Content, &e.IsPublished, &createdAt); err != nil {
		return nil, err
	}
	e.CreatedAt = createdAt.UTC().Format(time.RFC3339)
	util.RevalidateConfiguredNext(l.svcCtx.Config.NextSiteURL, os.Getenv("REVALIDATE_SECRET"), []string{"/admin/echo"})
	return &e, nil
}
