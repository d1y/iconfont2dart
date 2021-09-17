
# iconfton to dart

可直接将 `iconfont.cn` 在线链接转为 `dart` 代码, 解放双手

![image.png](https://i.loli.net/2021/09/17/63hAVxECBp7iPsy.png)


```bash

# className: 转为的 dart class name
# icon_pkg: 若为package, 可添加 `icon_pkg`
# > ../dev.dart 写入到文件中
node c2d.js //at.alicdn.com/t/font_2820855_huu4is52a0n.css [className] [icon_pkg] > ../dev.dart

# install global
git clone https://github.com/d1y/iconfont2dart
cnpm i -g iconfont2dart
# iconfont2dart
```


# copyright

```
author: d1y<chenhonzhou@gmail.com>
```