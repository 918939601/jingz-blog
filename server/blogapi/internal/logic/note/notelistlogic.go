package note

import (
	"context"
	"fmt"
	"strings"
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

	// Build query with optional tags filter
	var query string
	args := []interface{}{}
	argIndex := 1

	if req.Tags != "" {
		// Query with tags filter (case-insensitive)
		query = `SELECT DISTINCT n."id", n."slug", n."title", n."content", n."isPublished", n."createdAt"
			 FROM "Note" n
			 INNER JOIN "_NoteToNoteTag" nnt ON n."id" = nnt."A"
			 INNER JOIN "NoteTag" nt ON nnt."B" = nt."id"
			 WHERE ($` + fmt.Sprint(argIndex) + ` = '' OR n."title" ILIKE $` + fmt.Sprint(argIndex+1) + ` OR n."content" ILIKE $` + fmt.Sprint(argIndex+1) + `)
			 AND LOWER(nt."tagName") IN (`

		args = append(args, req.Query, q)
		argIndex += 2

		tagNames := strings.Split(req.Tags, ",")
		for i, tag := range tagNames {
			if i > 0 {
				query += `, `
			}
			query += `LOWER($` + fmt.Sprint(argIndex) + `)`
			args = append(args, strings.TrimSpace(tag))
			argIndex++
		}
		query += `)
			 ORDER BY n."createdAt" DESC
			 LIMIT $` + fmt.Sprint(argIndex) + ` OFFSET $` + fmt.Sprint(argIndex+1)
		args = append(args, size, offset)
		logx.Infof("Note list with tags filter - query: %s, args: %v", query, args)
	} else {
		// Query without tags filter
		query = `SELECT DISTINCT n."id", n."slug", n."title", n."content", n."isPublished", n."createdAt"
			 FROM "Note" n
			 WHERE ($` + fmt.Sprint(argIndex) + ` = '' OR n."title" ILIKE $` + fmt.Sprint(argIndex+1) + ` OR n."content" ILIKE $` + fmt.Sprint(argIndex+1) + `)
			 ORDER BY n."createdAt" DESC
			 LIMIT $` + fmt.Sprint(argIndex+2) + ` OFFSET $` + fmt.Sprint(argIndex+3)
		args = append(args, req.Query, q, size, offset)
		logx.Infof("Note list without tags filter - query: %s, args: %v", query, args)
	}

	rows, err := db.QueryContext(l.ctx, query, args...)
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
		n.Tags = make([]types.NoteTag, 0)

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

	// Count total with same filters
	var countQuery string
	countArgs := []interface{}{}
	countArgIndex := 1

	if req.Tags != "" {
		countQuery = `SELECT COUNT(DISTINCT n."id") FROM "Note" n
                      INNER JOIN "_NoteToNoteTag" nnt ON n."id" = nnt."A"
                      INNER JOIN "NoteTag" nt ON nnt."B" = nt."id"
                      WHERE ($` + fmt.Sprint(countArgIndex) + ` = '' OR n."title" ILIKE $` + fmt.Sprint(countArgIndex+1) + ` OR n."content" ILIKE $` + fmt.Sprint(countArgIndex+1) + `)
                      AND LOWER(nt."tagName") IN (`
		countArgs = append(countArgs, req.Query, q)
		countArgIndex += 2

		tagNames := strings.Split(req.Tags, ",")
		for i, tag := range tagNames {
			if i > 0 {
				countQuery += `, `
			}
			countQuery += `LOWER($` + fmt.Sprint(countArgIndex) + `)`
			countArgs = append(countArgs, strings.TrimSpace(tag))
			countArgIndex++
		}
		countQuery += `)`
	} else {
		countQuery = `SELECT COUNT(DISTINCT n."id") FROM "Note" n
                      WHERE ($` + fmt.Sprint(countArgIndex) + ` = '' OR n."title" ILIKE $` + fmt.Sprint(countArgIndex+1) + ` OR n."content" ILIKE $` + fmt.Sprint(countArgIndex+1) + `)`
		countArgs = append(countArgs, req.Query, q)
	}

	var total int64
	if err := db.QueryRowContext(l.ctx, countQuery, countArgs...).Scan(&total); err != nil {
		return nil, err
	}

	return &types.NoteListResp{Items: items, Total: total, Page: page, PageSize: size}, nil
}
