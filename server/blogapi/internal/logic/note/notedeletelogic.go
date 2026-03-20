package note

import (
	"context"
	"os"

	"server/blogapi/internal/svc"
	"server/blogapi/internal/types"
	"server/blogapi/internal/util"

	"github.com/zeromicro/go-zero/core/logx"
)

type NoteDeleteLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewNoteDeleteLogic(ctx context.Context, svcCtx *svc.ServiceContext) *NoteDeleteLogic {
	return &NoteDeleteLogic{Logger: logx.WithContext(ctx), ctx: ctx, svcCtx: svcCtx}
}

func (l *NoteDeleteLogic) NoteDelete(req *types.NoteDeleteReq) (*types.Note, error) {
	db, err := l.svcCtx.Conn.RawDB()
	if err != nil {
		return nil, err
	}

	var slug string
	if err := db.QueryRowContext(l.ctx, `SELECT "slug" FROM "Note" WHERE "id"=$1`, req.Id).Scan(&slug); err != nil {
		return nil, err
	}

	if _, err := db.ExecContext(l.ctx, `DELETE FROM "Note" WHERE "id"=$1`, req.Id); err != nil {
		return nil, err
	}

	util.RevalidateConfiguredNext(l.svcCtx.Config.NextSiteURL, os.Getenv("REVALIDATE_SECRET"), []string{"/note", "/admin/note", "/note/" + slug})
	return nil, nil
}
