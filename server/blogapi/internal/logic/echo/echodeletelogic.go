package echo

import (
	"context"

	"server/blogapi/internal/svc"
	"server/blogapi/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
	"os"
	"server/blogapi/internal/util"
)

type EchoDeleteLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewEchoDeleteLogic(ctx context.Context, svcCtx *svc.ServiceContext) *EchoDeleteLogic {
	return &EchoDeleteLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *EchoDeleteLogic) EchoDelete(req *types.EchoDeleteReq) (*types.Echo, error) {
	db, err := l.svcCtx.Conn.RawDB()
	if err != nil {
		return nil, err
	}
	if _, err := db.ExecContext(l.ctx, `DELETE FROM "Echo" WHERE "id"=$1`, req.Id); err != nil {
		return nil, err
	}
	util.RevalidateConfiguredNext(l.svcCtx.Config.NextSiteURL, os.Getenv("REVALIDATE_SECRET"), []string{"/admin/echo"})
	return nil, nil
}
