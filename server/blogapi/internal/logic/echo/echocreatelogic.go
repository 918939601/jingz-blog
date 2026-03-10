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

type EchoCreateLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewEchoCreateLogic(ctx context.Context, svcCtx *svc.ServiceContext) *EchoCreateLogic {
	return &EchoCreateLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *EchoCreateLogic) EchoCreate(req *types.EchoCreateReq) (*types.Echo, error) {
	db, err := l.svcCtx.Conn.RawDB()
	if err != nil {
		return nil, err
	}

	var id int64
	if err := db.QueryRowContext(l.ctx,
		`INSERT INTO "Echo"("reference","content","isPublished","createdAt")
	   VALUES ($1,$2,$3,now()) RETURNING "id"`,
		req.Reference, req.Content, req.IsPublished,
	).Scan(&id); err != nil {
		return nil, err
	}

	var e types.Echo
	var createdAt time.Time
	if err := db.QueryRowContext(l.ctx,
		`SELECT "id","reference","content","isPublished","createdAt" FROM "Echo" WHERE "id"=$1`, id,
	).Scan(&e.Id, &e.Reference, &e.Content, &e.IsPublished, &createdAt); err != nil {
		return nil, err
	}
	e.CreatedAt = createdAt.UTC().Format(time.RFC3339)
	util.RevalidateNext("http://localhost:3000", os.Getenv("REVALIDATE_SECRET"), []string{"/admin/echo"})
	return &e, nil
}
