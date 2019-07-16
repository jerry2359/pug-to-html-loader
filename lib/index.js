/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Williams Medina @willyelm
*/
'use strict'
const util = require('loader-utils')
const pug = require('pug')

module.exports = function (source) {
  let query = {}
  if (this.cacheable) {
    this.cacheable(true)
  }
  if (typeof this.query === 'string') {
    query = util.parseQuery(this.query)
  } else {
    query = this.query
  }

  // 过滤query.data中的值是否含有[name]，有的话将它替换成当前pug文件名
  if (query.data) {
    let name = this.resourcePath.match(/.*(\\|\/)(.*).pug$/)[2];
    if (query.data.name) {
        query.data.name = name;
    }
  }

  // 模板继承扩展
  // 定义一些页面扩展的信息
  // 例如有一个新闻详情页模板，根据数据可生成N个新闻详情页
  if (query.data.extend) {
    const inExtendPage = (name, extendPages) => {
      let result = {
        isIn: false
      }
      const pages = Object.keys(extendPages)
      if (pages.indexOf(name) === -1) {
        for (let i = 0; i < pages.length; i++) {
          let extendPage = pages[i]
          if (name.indexOf(extendPage) >= 0) {
            result.isIn = true
            result.extendPage = extendPage
            break
          }
        }
      }
      return result
    }
    const extendResult = inExtendPage(query.data.name, query.data.extend.pages)
    query.data.srcPath = extendResult.isIn ? query.data.extend.srcPath[0] : query.data.extend.srcPath[1]
    query.data.page = query.data.name
    query.data.name = extendResult.isIn ? extendResult.extendPage : query.data.name
  }

  let req = util.getRemainingRequest(this)
  let options = Object.assign({
    filename: this.resourcePath,
    doctype: query.doctype || 'js',
    compileDebug: this.debug || false
  }, query)
  if (options.plugins){
    if (typeof options.plugins === 'object') {
      options.plugins = [options.plugins];
    }
  }
  let template = pug.compile(source, options)
  template.dependencies.forEach(this.addDependency)
  let data = query.data || {}
  data.env = process.env.NODE_ENV
  return template(data)
}
