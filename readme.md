# 监控数据文件
## 定时轮询数据文件, 当文件内容发生改变时, 保存下来
Note: 因为用的是GitHub Action的schedule, 所以定时的时间间隙是无法保证的. 如果对时间要求高, 可以改用其他定时器通过Web Hook的方式触发Action.
## 当文件内容符合特定条件时, 发送通知消息 (使用了群晖Synology Chat)
