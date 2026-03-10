package types

type BlogTag struct {
	Id      int64  `json:"id"`
	TagName string `json:"tagName"`
	TagType string `json:"tagType"`
}

type Blog struct {
	Id          int64      `json:"id"`
	Slug        string     `json:"slug"`
	Title       string     `json:"title"`
	Content     string     `json:"content"`
	IsPublished bool       `json:"isPublished"`
	CreatedAt   string     `json:"createdAt"`
	UpdatedAt   string     `json:"updatedAt"`
	Tags        []BlogTag  `json:"tags,omitempty"`
}

type BlogListReq struct {
	Query    string `form:"query,optional"`
	Tags     string `form:"tags,optional"`
	Published int    `form:"published,optional"`
	Page     int64  `form:"page,optional"`
	PageSize int64  `form:"pageSize,optional"`
}

type BlogListResp struct {
	Items    []Blog `json:"items"`
	Total    int64  `json:"total"`
	Page     int64  `json:"page"`
	PageSize int64  `json:"pageSize"`
}

type BlogDetailReq struct {
	Slug string `path:"slug"`
}

type BlogCreateReq struct {
	Slug              string   `json:"slug"`
	Title             string   `json:"title"`
	Content           string   `json:"content"`
	IsPublished       bool     `json:"isPublished"`
	RelatedTagNames   []string `json:"relatedTagNames,optional"`
}

type BlogUpdateReq struct {
	Id                int64    `path:"id"`
	Slug              string   `json:"slug,optional"`
	Title             string   `json:"title,optional"`
	Content           string   `json:"content,optional"`
	IsPublished       bool     `json:"isPublished,optional"`
	RelatedTagNames   []string `json:"relatedTagNames,optional"`
}

type BlogToggleReq struct {
	Id          int64 `path:"id"`
	IsPublished bool  `json:"isPublished"`
}

type BlogDeleteReq struct {
	Id int64 `path:"id"`
}
