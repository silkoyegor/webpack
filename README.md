# Training project: Webpack



Задачи, которые решает **Webpack** - настройка инфраструктуры вокруг веб-приложения

---

```bash
npm init
npm install -D webpack webpack-cli
```

По умолчанию **Webpack** ищет файл ***webpack.config.js***

```javascript
const path = require('path')

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}
```

**mode** - режим сборки пакета. Если не указать данный параметр, то сборка произойдет в режиме **production**. Полученный файл, который герерируется с помощью **webpack** будет записан в сжатом виде . Елси указать параметр **mode: 'development'** -сборка произойдет в режиме разработки и собранные файлы будут записаны в развернутом виде, пригодном для чтения человеком.

С помощью **entry** мы указывает путь ко входному файлу для нашего приложения

**output** отвечает за выходные файлы. Имеет параметры 

- **filename**, в котором записано имя выходного файла(обычно это *bundle.js*) 
- **path**, в котором указывается директория в которую **webpack** выполняет сборку. В **nodejs** подключается встроенный модуль **path** который позволяет комфортно работать с путями на платформе



#### Динамическое создание имен/паттерны  

**(Webpack filename templates):**

filename: '**[name]**.**[contenthash]**.bundle.js'

- name  - имя модуля
- contenthash - хэш содержимого  в модуле

подробнее: [https://webpack.js.org/configuration/output/#outputfilename](https://webpack.js.org/configuration/output/#outputfilename)



#### Плагины для webpack

```bash
npm install -D html-webpack-plugin
npm install -D clean-webpack-plugin
```

```javascript
cosnt HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
	...,
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new CleanWebpackPlugin()
    ]
}
```

Плагины мы добавляет в виде массива, каждый плагин - инстанс класса, как в примере **new HTMLWebpackPlugin()**.  Данный плагин с ключем **template** добавляет в сборку файл  index.html (по умолчанию) и подтягивает шаблон с нашей директории **src**.  А так же, самое интересное, он добавляет тег script с именами модулей, созданных с помощью webpack.

**clean-webpack-plugin** позволяет автоматически очищать целевую директорию перед сборкой webpack 

подробнее: <https://webpack.js.org/plugins/>



#### Дополнительная автоматизация процесса сборки и работы с webpack

В файле **package.json** в поле **sctipts** 

```
  "scripts": {
    "dev": "webpack --mode development",
    "build": "webpack --mode production"
  },
```

для запуска скриптов мы можем написать команды

```bash
npm run dev
or
npm run build
```

Для указания рабочей директории (где лежат исходники приложения) у  webpack есть опция **context**:

```javascript
module.exports = {
    context: path.resolve(__dirname, 'src'),
    ...
}
```



#### Loaders

Конфигурация, которая позволяет **webpack** работать с другими типами файлов, отличных от **.js**

```javascript
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
```

use - webpack выполняет справа налево, то есть **use: ['style-loader', 'css-loader']** он сначала запустит **css-loader**, затем **style-loader**. Прежде эти пакеты необходимо установить:

```bash
npm i -D style-loader css-loader
```

для картинок надо поставить лоадер **file-loader**

```javascript
test: /.(png|jpg|svg|gif)$/,
use:['file-loader']
```

для шрифтов

```javascript
test: /\.(ttf|woff|woff2|eot)$/,
use: ['file-loader']
```

для взаимодействия с файлами xml

```javascript
test: /\.xml$/,
use: ['xml-loader']
```

по аналогии можно работать с файлами csv

```javascript
test: /\.csv$/,
use: ['csv-loader'] // он зависит от пакета papaparse
```



Улучшение для webpack. 

```
// package.json
// "main": "index.js"
"private": true    //заменяем на приватное поле, так как  нам не нужно публиковать npm пакет
```

это защита от случайной публикации пакета.



#### Extensions и Alias

```javascript
    resolve: {
        extensions: ['.js','.json'],
		alias: {
			'@models': path_resolve(__dirname, 'src/models')
		}
    }
```

**resolve.extensions** позволяет нам не писать расширения файлов в импортах. **resolve.alias** мы можем задать абсолютные пути к директориям проекта.



#### Библиотека jquery

```bash
npm i -S jquery
```

флаг **-S** говорит о том, что мы будем сохранять библиотеку, как зависимость для нашего приложения, и она будет объявлена в поле dependencies



Используя импорт в разных файлах одной и той же библиотеки - при сборке в каждом из файлов будет загружена эта библиотека.С этим можно справиться с помощью настройки **webpack.config.js**

```javascript
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
```

после этого webpack понимает, где есть повторяемые импорты и выносит этот код во внешний файл **vendors**...



#### Development

Для обновления в режиме обратке можно использовать **webpack-dev-server**

```bash
npm i -D webpack-dev-server
```

```javascript
// webpack.config.js 
    devServer: {
        port: 4200
    },

// package.json
	
```

**webpack-dev-server** так же собирает проект, как и **webpack**, только он складывает файлы в оперативную память для быстрого обновления.



```bash
npm i -D copy-webpack-plugin
```

```javascript
      const CopyWebpackPlugin = require('copy-webpack-plugin')

      new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'src/favicon.ico'),
                to: path.resolve(__dirname, 'dist')
            }
        ])
```



#### Оптимизация файлов для production mode

Оптимизация **.html**:

```javascript
//package.json
  "scripts": {
    "build": "cross-env NODE_ENV=production webpack --mode production"
      

//webpack.config.js
const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

module.exports = {
    //...
	plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: isProd
            }
        })
    ]
}
```



Оптимизация **.css**:

```bash
npm install terser-webpack-plugin --save-dev
npm install --save-dev optimize-css-assets-webpack-plugin
```

```javascript
//webpack.config.js
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }
    
    if (isProd) {
        config.minimizer = [
            new OptimizeCssAssetWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config
}

module.exports = {
    //...
    optimization: optimization()
}
```

теперь после команды **npm run build**  мы получаем сборку с минимизированными файлами **.html** и **.css**



#### Препроцессоры

less

```bash
npm i -D less-loader less
```

sass

```bash
npm i -D node-sass sass-loader
```



#### Babel

```bash
npm install --save-dev babel-loader @babel/core
npm install --save-dev @babel/preset-env
npm install --save @babel/polyfill
npm i -D @babel/plugin-proposal-class-properties
```

```javascript
// webpack.config.js
entry: {
        main: ['@babel/polyfill','./index.js']
},
module: {
  rules: [
    { 
        test: /\.js$/, 
        exclude: /node_modules/, 
        loader: {
            loader: 'babel-loader',
            options: {
                presets: [
                    '@babel/preset-env'
                ],
                plugins: [
                    '@babel/plugin-proposal-class-properties'
                ]
            }
        }
    }
  ]
}
```



##### **@babel/preset-typescript**

```bash
npm install --save-dev @babel/preset-typescript
```

```javascript
//webpack.config.js
{ 
    test: /\.ts$/, 
    exclude: /node_modules/, 
    loader: {
		loader: 'babel-loader',
		options: {
			 presets: [
				 '@babel/preset-env',
				 '@babe/preset-typescript'
			 ],
			plugins: [
				'@babel/plugin-proposal-class-properties'
			]
		}
	}
}
```



##### **@babel/preset-react**

```bash
npm install --save-dev @babel/preset-react
```



#### Source-map / Исходные карты

```javascript
//webpack.config.js
devTool: isDev ? 'source-map' : '',
```



**eslint**

```bash
npm i -D eslint-loader eslint

#для совместной работы с babel
npm i -D babel-eslint
```



#### Webpack Bundle Analyzer

В процессе разработки использовать плагин безполезно, так как проект не оптимизирован. Для этого создадим функцию plugins

```bash
npm install --save-dev webpack-bundle-analyzer
```

```javascript
// webpack.config.js
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

const plugins = () => {
    const base = [
        new HtmlWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'src/favicon.ico'),
                to: path.resolve(__dirname, 'dist')
            }
        ]),
        new MiniCssExtractPlugin({
            filename: filename('css')
        })
    ]

    if (isProd) {
        base.push(new BundleAnalyzerPlugin())
    }

    return base
}
```





#### Оптимизация

##### **cssLoader**

```javascript
const cssLoaders = extra => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                hmr: isDev,
                reloadAll: true
            }
        }, 
        'css-loader'
    ]

    if (extra) {
        loaders.pysh(extra)
    }

    return loaders
}

module.exports = {
    //...
    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.less$/,
                use: cssLoaders('less-loader')
            }
		]
    }
}
```



##### **babelOptions**

```javascript
//webpack.config.js
babelOptions = preset => {
    const opts = {
        presets: [
            '@babel/preset-env'            
        ],
        plugins: [
            // '@babe/babel-preset-preset-typescript',
            '@babel/plugin-proposal-class-properties'
        ]
    }

    if (preset) {
        opts.presets.push(preset)
    }

    return opts
}

module.exports = {
    //...
 module: {
        rules: [
            { 
                test: /\.js$/, 
                exclude: /node_modules/, 
                loader: babelOptions()
            },
            { 
                test: /\.ts$/, 
                exclude: /node_modules/, 
                loader: {
                    loader: 'babel-loader',
                    options: babelOptions('@babel/preset-typescript')
                }
            },
            { 
                test: /\.jsx$/, 
                exclude: /node_modules/, 
                loader: {
                    loader: 'babel-loader',
                    options: babelOptions('@babel/preset-react')
                }
            }
        ]
}
```



------

Links:

- [npm Documentation](https://docs.npmjs.com/)
- [NodeSchool workshops](https://nodeschool.io/)
- ​
- [npm-package.json](https://docs.npmjs.com/files/package.json)
- [webpack](https://webpack.js.org/guides/getting-started/)
  - [style-loader](https://webpack.js.org/loaders/style-loader/)
  - [css-loader](https://webpack.js.org/loaders/css-loader/)
- [normalize.css](https://necolas.github.io/normalize.css/)
- npm
  - [optimize-css-assets-webpack-plugin](https://www.npmjs.com/package/optimize-css-assets-webpack-plugin)
- [babel](https://babeljs.io/setup#installation)
  - [babel-preset-typescript](https://babeljs.io/docs/en/babel-preset-typescript)

- [Видеокурс](https://www.youtube.com/watch?v=eSaF8NXeNsA)