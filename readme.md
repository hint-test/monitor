# 监控数据文件
## 定时轮询数据文件, 当文件内容发生改变时, 保存下来
Note: 因为用的是GitHub Action的schedule, 所以定时的时间间隙是无法保证的, 有时候一小时才会触发一次. 如果对时间要求比较高, 可以改用其他定时器通过Web Hook的方式触发Action.
## 当文件内容符合特定条件时, 发送通知消息 (使用了群晖Synology Chat)
```json
{
	"id": "uefa_match_2036177_livescore",
	"url": "https://match.uefa.com/v5/livescore?matchId=2036177",
	"options": {},
	"format": true,
	"filters": [
		"hash",
		"minute"
	],
	"condition": "length",
	"notify": true,
	"notifyCondition": "length > 0"
}
```
