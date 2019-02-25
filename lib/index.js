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
  return template(data)
}
