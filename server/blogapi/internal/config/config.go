package config

import "github.com/zeromicro/go-zero/rest"

type Config struct {
	rest.RestConf
	DatabaseDSN   string
	Cors          []string
	AmapKey       string
	DefaultCity   string // Default city for localhost development
}
