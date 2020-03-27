import * as $ from 'jquery'
import Post from '@models/Post'
import React from 'react'
import {render} from 'react-dom'

import '@styles/styles.css'
import '@styles/less.less'
import '@styles/scss.scss'
import '@/babel'

const post = new Post('Webpack Post Title')

$('pre').addClass('code').html(post.toString())

const App = () => (
    <div class="container">
        <h1>Webpack</h1>
        <hr />
        <pre />
        <hr />
        <div class="box">
            <h2>Less</h2>
        </div>
        <div class="card">
            <h2>SCSS</h2>
        </div>
    </div>
)

render(<App/>, document.getElementById('app'))