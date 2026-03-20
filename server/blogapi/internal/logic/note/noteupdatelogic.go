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

type NoteUpdateLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewNoteUpdateLogic(ctx context.Context, svcCtx *svc.ServiceContext) *NoteUpdateLogic {
	return &NoteUpdateLogic{Logger: logx.WithContext(ctx), ctx: ctx, svcCtx: svcCtx}
}

func (l *NoteUpdateLogic) NoteUpdate(req *types.NoteUpdateReq) (*types.Note, error) {
	db, err := l.svcCtx.Conn.RawDB()
	if err != nil {
		return nil, err
	}

	// Update note
	_, err = db.ExecContext(l.ctx,
		`UPDATE "Note" SET "slug" = COALESCE(NULLIF($1, ''), "slug"),
		                   "title" = COALESCE(NULLIF($2, ''), "title"),
		                   "content" = COALESCE(NULLIF($3, ''), "content"),
		                   "isPublished" = COALESCE(NULLIF($4::boolean, false), "isPublished"),
		                   "updatedAt" = now()
		 WHERE "id" = $5`,
		req.Slug, req.Title, req.Content, req.IsPublished, req.Id,
	)
	if err != nil {
		return nil, err
	}

	// Handle tags if provided
	if len(req.RelatedTagNames) > 0 {
		// Delete existing tags
		_, err = db.ExecContext(l.ctx,
			`DELETE FROM "_NoteToNoteTag" WHERE "A" = $1`, req.Id,
		)
		if err != nil {
			logx.Errorf("delete tags: %v", err)
		}

		// Add new tags
		for _, tagName := range req.RelatedTagNames {
			var tagId int64
			err := db.QueryRowContext(l.ctx,
				`SELECT "id" FROM "NoteTag" WHERE "tagName" = $1 AND "tagType" = 'NOTE'`, tagName,
			).Scan(&tagId)

			if err != nil {
				err = db.QueryRowContext(l.ctx,
					`INSERT INTO "NoteTag"("tagName", "tagType") VALUES ($1, 'NOTE') RETURNING "id"`,
					tagName,
				).Scan(&tagId)
				if err != nil {
					logx.Errorf("create tag: %v", err)
					continue
				}
			}

			_, err = db.ExecContext(l.ctx,
				`INSERT INTO "_NoteToNoteTag"("A", "B") VALUES ($1, $2)`,
				req.Id, tagId,
			)
			if err != nil {
				logx.Errorf("associate tag: %v", err)
			}
		}
	}

	// Fetch updated note
	var n types.Note
	var createdAt time.Time
	if err := db.QueryRowContext(l.ctx,
		`SELECT "id", "slug", "title", "content", "isPublished", "createdAt"
		 FROM "Note" WHERE "id" = $1`, req.Id,
	).Scan(&n.Id, &n.Slug, &n.Title, &n.Content, &n.IsPublished, &createdAt); err != nil {
		return nil, err
	}

	n.CreatedAt = createdAt.UTC().Format(time.RFC3339)

	util.RevalidateConfiguredNext(l.svcCtx.Config.NextSiteURL, os.Getenv("REVALIDATE_SECRET"), []string{"/note", "/admin/note", "/note/" + n.Slug})
	return &n, nil
}
