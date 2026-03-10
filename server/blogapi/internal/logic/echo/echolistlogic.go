package echo

import (
	"context"
	"server/blogapi/internal/svc"
	"server/blogapi/internal/types"
	"time"

	"github.com/zeromicro/go-zero/core/logx"
)

type EchoListLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewEchoListLogic(ctx context.Context, svcCtx *svc.ServiceContext) *EchoListLogic {
	return &EchoListLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}
func (l *EchoListLogic) EchoList(req *types.EchoListReq) (*types.EchoListResp, error) {
	page, size := req.Page, req.PageSize
	if page <= 0 {
		page = 1
	}
	if size <= 0 {
		size = 20
	}
	offset := (page - 1) * size
	q := "%" + req.Query + "%"

	db, err := l.svcCtx.Conn.RawDB()
	if err != nil {
		logx.Errorf("rawdb: %v", err)
		return &types.EchoListResp{Items: []types.Echo{}, Total: 0, Page: page, PageSize: size}, nil
	}

	rows, err := db.QueryContext(l.ctx, `SELECT "id","reference","content","isPublished","createdAt"
		FROM "Echo"
		WHERE ($1 = '' OR "reference" ILIKE $2 OR "content" ILIKE $2)
		ORDER BY "createdAt" DESC
		LIMIT $3 OFFSET $4`, req.Query, q, size, offset)
	if err != nil {
		logx.Errorf("list query: %v", err)
		return &types.EchoListResp{Items: []types.Echo{}, Total: 0, Page: page, PageSize: size}, nil
	}
	defer rows.Close()

	items := make([]types.Echo, 0, size)
	for rows.Next() {
		var e types.Echo
		var createdAt time.Time
		if err := rows.Scan(&e.Id, &e.Reference, &e.Content, &e.IsPublished, &createdAt); err != nil {
			logx.Errorf("list scan: %v", err)
			continue
		}
		e.CreatedAt = createdAt.UTC().Format(time.RFC3339)
		items = append(items, e)
	}

	var total int64
	if err := db.QueryRowContext(l.ctx, `SELECT COUNT(1) FROM "Echo"
		WHERE ($1 = '' OR "reference" ILIKE $2 OR "content" ILIKE $2)`,
		req.Query, q).Scan(&total); err != nil {
		logx.Errorf("list count: %v", err)
		return &types.EchoListResp{Items: items, Total: 0, Page: page, PageSize: size}, nil
	}

	return &types.EchoListResp{Items: items, Total: total, Page: page, PageSize: size}, nil
}
