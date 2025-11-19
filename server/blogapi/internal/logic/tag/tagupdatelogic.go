package tag

import (
	"context"

	"github.com/zeromicro/go-zero/core/logx"
	"server/blogapi/internal/svc"
	"server/blogapi/internal/types"
)

type TagUpdateLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewTagUpdateLogic(ctx context.Context, svcCtx *svc.ServiceContext) *TagUpdateLogic {
	return &TagUpdateLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *TagUpdateLogic) TagUpdate(req *types.TagUpdateReq) (*types.Tag, error) {
	db, err := l.svcCtx.Conn.RawDB()
	if err != nil {
		return nil, err
	}

	var tag types.Tag

	// Try to find and update in BlogTag first
	err = db.QueryRowContext(l.ctx,
		`UPDATE "BlogTag" SET "tagName" = $1 WHERE "id" = $2 RETURNING "id", "tagName", "tagType"`,
		req.TagName, req.Id,
	).Scan(&tag.Id, &tag.TagName, &tag.TagType)

	if err == nil {
		return &tag, nil
	}

	// If not found in BlogTag, try NoteTag
	err = db.QueryRowContext(l.ctx,
		`UPDATE "NoteTag" SET "tagName" = $1 WHERE "id" = $2 RETURNING "id", "tagName", "tagType"`,
		req.TagName, req.Id,
	).Scan(&tag.Id, &tag.TagName, &tag.TagType)

	if err != nil {
		return nil, err
	}

	return &tag, nil
}
