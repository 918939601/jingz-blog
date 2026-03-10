package tag

import (
	"context"

	"github.com/zeromicro/go-zero/core/logx"
	"server/blogapi/internal/svc"
	"server/blogapi/internal/types"
)

type TagListLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewTagListLogic(ctx context.Context, svcCtx *svc.ServiceContext) *TagListLogic {
	return &TagListLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *TagListLogic) TagList(req *types.TagListReq) ([]types.Tag, error) {
	db, err := l.svcCtx.Conn.RawDB()
	if err != nil {
		return nil, err
	}

	query := `SELECT "id", "tagName", "tagType" FROM "BlogTag"`
	args := []interface{}{}

	if req.TagType != "" {
		query += ` WHERE "tagType" = $1`
		args = append(args, req.TagType)
	}

	query += ` ORDER BY "tagName" ASC`

	rows, err := db.QueryContext(l.ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	tags := make([]types.Tag, 0)
	for rows.Next() {
		var tag types.Tag
		if err := rows.Scan(&tag.Id, &tag.TagName, &tag.TagType); err != nil {
			logx.Errorf("scan tag: %v", err)
			continue
		}
		
		// Count associated blogs
		var count int64
		countErr := db.QueryRowContext(l.ctx,
			`SELECT COUNT(*) FROM "_BlogToBlogTag" WHERE "B" = $1`,
			tag.Id,
		).Scan(&count)
		if countErr == nil {
			tag.Count = count
		}
		
		tags = append(tags, tag)
	}

	// Also get NoteTag
	query = `SELECT "id", "tagName", "tagType" FROM "NoteTag"`
	args = []interface{}{}

	if req.TagType != "" {
		query += ` WHERE "tagType" = $1`
		args = append(args, req.TagType)
	}

	query += ` ORDER BY "tagName" ASC`

	rows, err = db.QueryContext(l.ctx, query, args...)
	if err != nil {
		return tags, nil
	}
	defer rows.Close()

	for rows.Next() {
		var tag types.Tag
		if err := rows.Scan(&tag.Id, &tag.TagName, &tag.TagType); err != nil {
			logx.Errorf("scan tag: %v", err)
			continue
		}
		
		// Count associated notes
		var count int64
		countErr := db.QueryRowContext(l.ctx,
			`SELECT COUNT(*) FROM "_NoteToNoteTag" WHERE "B" = $1`,
			tag.Id,
		).Scan(&count)
		if countErr == nil {
			tag.Count = count
		}
		
		tags = append(tags, tag)
	}

	return tags, nil
}
