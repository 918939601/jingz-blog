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

type NoteCreateLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewNoteCreateLogic(ctx context.Context, svcCtx *svc.ServiceContext) *NoteCreateLogic {
	return &NoteCreateLogic{Logger: logx.WithContext(ctx), ctx: ctx, svcCtx: svcCtx}
}

func (l *NoteCreateLogic) NoteCreate(req *types.NoteCreateReq) (*types.Note, error) {
	db, err := l.svcCtx.Conn.RawDB()
	if err != nil {
		return nil, err
	}

	var id int64
	if err := db.QueryRowContext(l.ctx,
		`INSERT INTO "Note"("slug", "title", "content", "isPublished", "createdAt", "updatedAt")
		 VALUES ($1, $2, $3, $4, now(), now()) RETURNING "id"`,
		req.Slug, req.Title, req.Content, req.IsPublished,
	).Scan(&id); err != nil {
		return nil, err
	}

	// Handle tags
	if len(req.RelatedTagNames) > 0 {
		for _, tagName := range req.RelatedTagNames {
			var tagId int64
			// Try to find existing tag
			err := db.QueryRowContext(l.ctx,
				`SELECT "id" FROM "NoteTag" WHERE "tagName" = $1 AND "tagType" = 'NOTE'`, tagName,
			).Scan(&tagId)

			if err != nil {
				// Create new tag
				err = db.QueryRowContext(l.ctx,
					`INSERT INTO "NoteTag"("tagName", "tagType") VALUES ($1, 'NOTE') RETURNING "id"`,
					tagName,
				).Scan(&tagId)
				if err != nil {
					logx.Errorf("create tag: %v", err)
					continue
				}
			}

			// Associate tag with note
			_, err = db.ExecContext(l.ctx,
				`INSERT INTO "_NoteToNoteTag"("A", "B") VALUES ($1, $2)
				 ON CONFLICT DO NOTHING`,
				id, tagId,
			)
			if err != nil {
				logx.Errorf("associate tag: %v", err)
			}
		}
	}

	// Fetch created note
	var n types.Note
	var createdAt time.Time
	if err := db.QueryRowContext(l.ctx,
		`SELECT "id", "slug", "title", "content", "isPublished", "createdAt"
		 FROM "Note" WHERE "id" = $1`, id,
	).Scan(&n.Id, &n.Slug, &n.Title, &n.Content, &n.IsPublished, &createdAt); err != nil {
		return nil, err
	}

	n.CreatedAt = createdAt.UTC().Format(time.RFC3339)

	util.RevalidateNext("http://localhost:3000", os.Getenv("REVALIDATE_SECRET"), []string{"/note", "/admin/note"})
	return &n, nil
}
