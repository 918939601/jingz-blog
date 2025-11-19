package note

import (
	"context"
	"time"

	"server/blogapi/internal/svc"
	"server/blogapi/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type NoteListLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewNoteListLogic(ctx context.Context, svcCtx *svc.ServiceContext) *NoteListLogic {
	return &NoteListLogic{Logger: logx.WithContext(ctx), ctx: ctx, svcCtx: svcCtx}
}

func (l *NoteListLogic) NoteList(req *types.NoteListReq) (*types.NoteListResp, error) {
	page := req.Page
	if page <= 0 {
		page = 1
	}
	size := req.PageSize
	if size <= 0 {
		size = 20
	}
	offset := (page - 1) * size
	q := "%" + req.Query + "%"

	db, err := l.svcCtx.Conn.RawDB()
	if err != nil {
		return nil, err
	}

	rows, err := db.QueryContext(l.ctx,
		`SELECT "id","slug","title","content","isPublished","createdAt"
     FROM "Note"
     WHERE ($1 = '' OR "title" ILIKE $2 OR "content" ILIKE $2)
     ORDER BY "createdAt" DESC
     LIMIT $3 OFFSET $4`,
		req.Query, q, size, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := make([]types.Note, 0, size)
	for rows.Next() {
		var n types.Note
		var t time.Time
		if err := rows.Scan(&n.Id, &n.Slug, &n.Title, &n.Content, &n.IsPublished, &t); err != nil {
			return nil, err
		}
		n.CreatedAt = t.UTC().Format(time.RFC3339)
		n.Tags = make([]types.NoteTag, 0) // Initialize empty tags array

		// Fetch tags for this note
		tagRows, err := db.QueryContext(l.ctx,
			`SELECT nt."id", nt."tagName", nt."tagType"
			 FROM "NoteTag" nt
			 INNER JOIN "_NoteToNoteTag" nnt ON nt."id" = nnt."B"
			 WHERE nnt."A" = $1`,
			n.Id)
		if err == nil {
			defer tagRows.Close()
			for tagRows.Next() {
				var tag types.NoteTag
				if err := tagRows.Scan(&tag.Id, &tag.TagName, &tag.TagType); err != nil {
					logx.Errorf("tag scan: %v", err)
					continue
				}
				n.Tags = append(n.Tags, tag)
			}
		}

		items = append(items, n)
	}

	var total int64
	if err := db.QueryRowContext(l.ctx,
		`SELECT COUNT(1) FROM "Note"
     WHERE ($1 = '' OR "title" ILIKE $2 OR "content" ILIKE $2)`,
		req.Query, q).Scan(&total); err != nil {
		return nil, err
	}

	return &types.NoteListResp{Items: items, Total: total, Page: page, PageSize: size}, nil
}
