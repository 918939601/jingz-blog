package svc

import (
	"server/blogapi/internal/config"
	"server/blogapi/internal/model"

	"github.com/zeromicro/go-zero/core/stores/sqlx"
)

type ServiceContext struct {
	Config    config.Config
	Conn      sqlx.SqlConn
	EchoModel model.EchoModel
}

func NewServiceContext(c config.Config) *ServiceContext {
	conn := sqlx.NewSqlConn("postgres", c.DatabaseDSN)
	return &ServiceContext{
		Config:    c,
		Conn:      conn,
		EchoModel: model.NewEchoModel(conn),
	}
}
