const c2d = require('..')
const fs = require('fs')
const path = require('path')
const https = require('https')


;(async () => {
  const css = await new Promise(_res => {
    https.get('https://cdn.jsdelivr.net/gh/Lukas-W/font-logos@v0.11/assets/font-logos.css', res => {
      var html = ""
      res.on("data", (data) => {
        html += data
      })

      res.on("end", () => {
        _res(html)
      })
    })
  })


  const _ = c2d({
    css,
    outputClassName: 'FlutterDart',
    outputFontFamily: 'iconfont',
  })

  fs.writeFileSync(path.join(__dirname, './dev.dart'), _)

})();