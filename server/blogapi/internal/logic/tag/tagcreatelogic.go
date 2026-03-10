package tag

import (
	"context"

	"github.com/zeromicro/go-zero/core/logx"
	"server/blogapi/internal/svc"
	"server/blogapi/internal/types"
)

type TagCreateLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewTagCreateLogic(ctx context.Context, svcCtx *svc.ServiceContext) *TagCreateLogic {
	return &TagCreateLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *TagCreateLogic) TagCreate(req *types.TagCreateReq) (*types.Tag, error) {
	db, err := l.svcCtx.Conn.RawDB()
	if err != nil {
		return nil, err
	}

	var tag types.Tag
	var tableName string

	// Determine which table to use based on tagType
	if req.TagType == "BLOG" {
		tableName = "BlogTag"
	} else if req.TagType == "NOTE" {
		tableName = "NoteTag"
	} else {
		tableName = "BlogTag" // default
	}

	// Insert tag
	err = db.QueryRowContext(l.ctx,
		`INSERT INTO "`+tableName+`"("tagName", "tagType") VALUES ($1, $2) RETURNING "id", "tagName", "tagType"`,
		req.TagName, req.TagType,
	).Scan(&tag.Id, &tag.TagName, &tag.TagType)

	if err != nil {
		return nil, err
	}

	return &tag, nil
}
