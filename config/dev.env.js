'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"'
})
module.exports = {
  LOGIN_IMG_URL: '"../../assets/images/login_bg.png"'
}
