package note

import (
	"context"
	"time"

	"github.com/zeromicro/go-zero/core/logx"
	"server/blogapi/internal/svc"
	"server/blogapi/internal/types"
)

type NoteDetailHtmlLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewNoteDetailHtmlLogic(ctx context.Context, svcCtx *svc.ServiceContext) *NoteDetailHtmlLogic {
	return &NoteDetailHtmlLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *NoteDetailHtmlLogic) NoteDetailHtml(slug string) (*types.Note, error) {
	db, err := l.svcCtx.Conn.RawDB()
	if err != nil {
		return nil, err
	}

	var n types.Note
	var createdAt time.Time
	if err := db.QueryRowContext(l.ctx,
		`SELECT "id", "slug", "title", "content", "isPublished", "createdAt"
		 FROM "Note" WHERE "slug" = $1`, slug,
	).Scan(&n.Id, &n.Slug, &n.Title, &n.Content, &n.IsPublished, &createdAt); err != nil {
		return nil, err
	}

	n.CreatedAt = createdAt.UTC().Format(time.RFC3339)

	// Fetch tags
	tagRows, err := db.QueryContext(l.ctx,
		`SELECT nt."id", nt."tagName", nt."tagType"
		 FROM "NoteTag" nt
		 INNER JOIN "_NoteToNoteTag" nnt ON nt."id" = nnt."B"
		 WHERE nnt."A" = $1`, n.Id,
	)
	if err == nil {
		defer tagRows.Close()
		tags := make([]types.NoteTag, 0)
		for tagRows.Next() {
			var tag types.NoteTag
			if err := tagRows.Scan(&tag.Id, &tag.TagName, &tag.TagType); err == nil {
				tags = append(tags, tag)
			}
		}
		n.Tags = tags
	}

	return &n, nil
}
