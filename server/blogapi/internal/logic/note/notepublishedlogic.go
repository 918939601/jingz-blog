package note

import (
	"context"
	"time"

	"server/blogapi/internal/svc"
	"server/blogapi/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type NotePublishedLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewNotePublishedLogic(ctx context.Context, svcCtx *svc.ServiceContext) *NotePublishedLogic {
	return &NotePublishedLogic{Logger: logx.WithContext(ctx), ctx: ctx, svcCtx: svcCtx}
}

func (l *NotePublishedLogic) NotePublished() ([]types.Note, error) {
	db, err := l.svcCtx.Conn.RawDB()
	if err != nil {
		return nil, err
	}

	rows, err := db.QueryContext(l.ctx,
		`SELECT "id","slug","title","content","isPublished","createdAt"
     FROM "Note"
     WHERE "isPublished"=true
     ORDER BY "createdAt" DESC
     LIMIT 50`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	res := make([]types.Note, 0, 50)
	for rows.Next() {
		var n types.Note
		var t time.Time
		if err := rows.Scan(&n.Id, &n.Slug, &n.Title, &n.Content, &n.IsPublished, &t); err != nil {
			return nil, err
		}
		n.CreatedAt = t.UTC().Format(time.RFC3339)
		res = append(res, n)
	}
	return res, nil
}
