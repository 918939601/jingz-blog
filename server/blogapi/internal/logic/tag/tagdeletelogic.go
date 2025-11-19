package tag

import (
	"context"

	"github.com/zeromicro/go-zero/core/logx"
	"server/blogapi/internal/svc"
	"server/blogapi/internal/types"
)

type TagDeleteLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewTagDeleteLogic(ctx context.Context, svcCtx *svc.ServiceContext) *TagDeleteLogic {
	return &TagDeleteLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *TagDeleteLogic) TagDelete(req *types.TagDeleteReq) (*types.Tag, error) {
	db, err := l.svcCtx.Conn.RawDB()
	if err != nil {
		return nil, err
	}

	var tag types.Tag

	// Try to delete from BlogTag first
	err = db.QueryRowContext(l.ctx,
		`DELETE FROM "BlogTag" WHERE "id" = $1 RETURNING "id", "tagName", "tagType"`,
		req.Id,
	).Scan(&tag.Id, &tag.TagName, &tag.TagType)

	if err == nil {
		return &tag, nil
	}

	// If not found in BlogTag, try NoteTag
	err = db.QueryRowContext(l.ctx,
		`DELETE FROM "NoteTag" WHERE "id" = $1 RETURNING "id", "tagName", "tagType"`,
		req.Id,
	).Scan(&tag.Id, &tag.TagName, &tag.TagType)

	if err != nil {
		return nil, err
	}

	return &tag, nil
}
