const path = require('path');

module.exports = {
  // Include common folder into ts lint loader rule
  chainWebpack: config => {
    config
      .module
        .rule('ts')
          .include
            .add(path.join(__dirname, '../common'))
  }
}
