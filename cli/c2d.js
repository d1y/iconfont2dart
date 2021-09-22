#!/usr/bin/env node

const fs = require('fs');

const parse = require('..');

const cssparse = require('../common/cssparse');

const fetch = require('got').default;

const args = process.argv

let [ _, __, url, className, pkgName ] = args

className = className ? className : 'IconFont'

pkgName = pkgName ? pkgName : ''

// source code by npm/async-validator
const isUrl = (url)=>{
  const v = new RegExp('^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$', 'i');
  return v.test(url)
}

if (!url) {
  console.error('please enter iconfont url!')
  process.exit(0)
}

if (!isUrl(url)) {
  console.error('URL format error')
  process.exit(0)
}

;(async ()=>{
  try {
    let _url = !url.startsWith('http') ? `https:${ url }` : url
    const css = await fetch(_url)
    const _css = css.body
    const _ = cssparse(_css)
    let fontFamily = ''
    const fontfaceItem = _.stylesheet.rules.find(item=>{
      const is = item['type'] == 'font-face'
      if (is) {
        /**
         * @type {Array<any>}
         */
        const tmp = item['declarations']
        tmp.forEach(item=>{
          if (item['property'] == 'font-family') {
            fontFamily = item['value'].replace(/\"|\'/g, '')
          }
        })
      }
      return is
    })
    const _once = fontfaceItem['declarations'].find(item=>{
      return item['property'] == 'src'
    })
    /**
     * @type {Array<string>}
     */
    const values = _once['value'].split('\n')

    // fix: if the url is not iconfont.cn/*.css
    // `value` => null
    let value = values.find(item=>{
      return item.includes('truetype')
    })

    if (!value) {
      console.error('parse url not iconfont.cn!!')
      return
    }
    
    value = value.trim()
    const fontURL = `https:` + value.split(' ')[0].replace('url(\'', '').replace('\')', '')
    const dart = parse({
      css: _css,
      outputFontFamily: fontFamily,
      outputClassName: className,
      outputFontPkg: pkgName,
    })
    console.log(dart)
    console.log("// font download url:", fontURL)
  } catch (error) {
    console.error(error) 
  }
  
  
})()

