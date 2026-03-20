package note

import (
	"context"
	"os"
	"time"

	"server/blogapi/internal/svc"
	"server/blogapi/internal/types"
	"server/blogapi/internal/util"

	"github.com/zeromicro/go-zero/core/logx"
)

type NoteToggleLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewNoteToggleLogic(ctx context.Context, svcCtx *svc.ServiceContext) *NoteToggleLogic {
	return &NoteToggleLogic{Logger: logx.WithContext(ctx), ctx: ctx, svcCtx: svcCtx}
}

func (l *NoteToggleLogic) NoteToggle(req *types.NoteToggleReq) (*types.Note, error) {
	db, err := l.svcCtx.Conn.RawDB()
	if err != nil {
		return nil, err
	}

	if _, err := db.ExecContext(l.ctx,
		`UPDATE "Note" SET "isPublished"=$1 WHERE "id"=$2`,
		req.IsPublished, req.Id,
	); err != nil {
		return nil, err
	}

	var n types.Note
	var t time.Time
	if err := db.QueryRowContext(l.ctx,
		`SELECT "id","slug","title","content","isPublished","createdAt" FROM "Note" WHERE "id"=$1`, req.Id,
	).Scan(&n.Id, &n.Slug, &n.Title, &n.Content, &n.IsPublished, &t); err != nil {
		return nil, err
	}
	n.CreatedAt = t.UTC().Format(time.RFC3339)

	util.RevalidateConfiguredNext(l.svcCtx.Config.NextSiteURL, os.Getenv("REVALIDATE_SECRET"), []string{"/note", "/admin/note", "/note/" + n.Slug})
	return &n, nil
}
