package model

import "github.com/zeromicro/go-zero/core/stores/sqlx"

var _ EchoModel = (*customEchoModel)(nil)

type (
	// EchoModel is an interface to be customized, add more methods here,
	// and implement the added methods in customEchoModel.
	EchoModel interface {
		echoModel
		withSession(session sqlx.Session) EchoModel
	}

	customEchoModel struct {
		*defaultEchoModel
	}
)

// NewEchoModel returns a model for the database table.
func NewEchoModel(conn sqlx.SqlConn) EchoModel {
	return &customEchoModel{
		defaultEchoModel: newEchoModel(conn),
	}
}

func (m *customEchoModel) withSession(session sqlx.Session) EchoModel {
	return NewEchoModel(sqlx.NewSqlConnFromSession(session))
}
