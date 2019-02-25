## 用于将pug转换成html的webpack loader。搭配html-loader一块使用

``` bash
# install dependencies
npm i -D pug-to-html-loader
```

```js
{
        test: /\.pug$/,
        include: [path.resolve(__dirname, 'src')],
        use: [
          {
            loader: 'html-loader',
            options: {
              attrs: [
                ':data-src',
                ':data-href',
                ':data-pc',
                ':data-mb',
                'img:src'
              ],
              minimize: {
                collapseWhitespace: false
              }
            }
          },
          {
            loader: 'pug-to-html-loader',
            query: {
              data: { name: '[name]' },
              pretty: true
            }
          }
        ]
      }
```