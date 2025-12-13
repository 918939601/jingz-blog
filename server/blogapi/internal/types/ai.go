package types

// AiContext represents the context for AI requests
type AiContext struct {
	Title string   `json:"title,optional"`
	Tags  []string `json:"tags,optional"`
}

// AskAiReq represents the request for asking AI
type AskAiReq struct {
	Question string    `json:"question"`
	Context  AiContext `json:"context,optional"`
	Provider string    `json:"provider,optional"`
}

// AskAiResp represents the response from asking AI
type AskAiResp struct {
	Ok       bool   `json:"ok"`
	Answer   string `json:"answer,optional"`
	Message  string `json:"message,optional"`
	Provider string `json:"provider,optional"`
}
