# session warning

Warning: connect.session() MemoryStore is not
designed for a production environment, as it will leak
memory, and will not scale past a single process.

# Delta

```
delta {
  id
}
```

如果 当前 board 只有一个用户浏览，merge delta（存备份）， -> ok 204

若有非 delta 产生者，则传递 delta 给其它 client

客户端若有自己未收到回复的 delta request，undo 那个 delta, apply 别人的 delta 再 redo 待定 delta，如果冲突了，提醒用户（具体情况分析）
