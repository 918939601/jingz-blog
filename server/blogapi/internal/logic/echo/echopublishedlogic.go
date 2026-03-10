package echo

import (
	"context"
	"server/blogapi/internal/svc"
	"server/blogapi/internal/types"
	"time"

	"github.com/zeromicro/go-zero/core/logx"
)

type EchoPublishedLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewEchoPublishedLogic(ctx context.Context, svcCtx *svc.ServiceContext) *EchoPublishedLogic {
	return &EchoPublishedLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *EchoPublishedLogic) EchoPublished() ([]types.Echo, error) {
	db, err := l.svcCtx.Conn.RawDB()
	if err != nil {
		return nil, err
	}
	rows, err := db.QueryContext(l.ctx,
		`SELECT "id","reference","content","isPublished","createdAt"
	   FROM "Echo"
	   WHERE "isPublished" = true
	   ORDER BY "createdAt" DESC
	   LIMIT 50`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	res := make([]types.Echo, 0, 50)
	for rows.Next() {
		var e types.Echo
		var createdAt time.Time
		if err := rows.Scan(&e.Id, &e.Reference, &e.Content, &e.IsPublished, &createdAt); err != nil {
			return nil, err
		}
		e.CreatedAt = createdAt.UTC().Format(time.RFC3339)
		res = append(res, e)
	}
	return res, nil
}
