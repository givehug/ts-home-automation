const path = require('path');

module.exports = {
  // Include common folder into ts lint loader rule
  // TODO: this is not supported yet/again?, is it needed?
  chainWebpack: config => {
    config
      .module
        .rule('ts')
          .include
            .add(path.join(__dirname, '../common'))
  }
}
