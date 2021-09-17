const cssparse = require("./common/cssparse")

/**
 * 
 * @param {string} raw 
 * @return {string}
 */
const selector2DartclassName = (raw)=>{
  if (raw[0] == '.' && raw.endsWith(':before')) {
    const _ = raw.split('.')[1].split(':before')[0].replace(/-/g, '_')
    return _
  }
  return ''
}

/**
 * 
 * @param {string} raw 
 */
const value2dartIconDataValue = (raw)=>{
  return raw.replace('\\', '0x').replace(/\"|\'/g, '')
}

/**
 * 
 * @param {object} options 
 * @param {Array<any>} options.raw
 * @param {string} options.outputClassName
 * @param {string} options.outputFontFamily font family
 * @param {string} options.outputFontPkg if the module `package`, need font pkg
 */
const js2dart = (options)=>{
  const fontPkg = options.outputFontPkg
  let _i = ''
  options.raw.map((item, index)=>{
    const { iconData, dartClassName } = item
    const _ = `${ index != 0 ? '  ' : '' }static const IconData ${ dartClassName } = IconData(${ iconData }, fontFamily: _family,${ fontPkg ? ' fontPackage: _kFontPkg' : '' });\n`
    _i += _
  })
  const template = `// auto generated DOT EDIT!!!
  
import 'package:flutter/widgets.dart';

class ${ options.outputClassName } {
  static const String _family = '${ options.outputFontFamily }';
  ${ fontPkg ? `\nstatic const String _kFontPkg = '${ fontPkg }';` : ''}
  ${ options.outputClassName }._();\n
  ${ _i }
}
  `
  return template
}

/**
 * 
 * @param {object} options 
 * @param {string} options.css
 * @param {string} options.outputClassName
 * @param {string} options.outputFontFamily font family
 * @param {string} options.outputFontPkg if the module `package`, need font pkg
 */
module.exports = (options) => {
  const parse = cssparse(options.css)

  /**
   * @type {object}
   */
  const stylesheet = parse.stylesheet

  if (!stylesheet) return

  /**
   * @type {Array<any>}
   */
  const rules = stylesheet.rules

  /**
   * @type {Array<>}
   */
  let result = []

  /**
   * 该匹配的规则为大部分字体文件的实现方式
   *   => 1. 必须是伪类
   *   => 2. 值的前缀必须是 '\
   */
  rules.forEach(item => {
    if (item['type'] == 'rule' && !!item['declarations'] && !!item['declarations'].length) {
      const _ = item['declarations'][0]
      /**
       * @type {string}
       */
      const value = _['value']
      const checkF = value.startsWith("'\\") || value.startsWith("\"\\")
      if (_['property'] == 'content' && checkF) {
        /**
         * @type {string}
         */
        const sele = item['selectors'][0]
        const dartClassName = selector2DartclassName(sele)
        if (!dartClassName) return
        const iconData = value2dartIconDataValue(value)
        result.push({
          iconData,
          dartClassName,
        })
      }
    }
    return false
  })
  return js2dart({
    ...options,
    raw: result,
  })
}
