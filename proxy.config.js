'use strict';

const mockjs = require('mockjs');
const mock = {};

require('fs').readdirSync(require('path').join(__dirname + '/mock'))
  .forEach(function (file) {
    if (/\.js$/.test(file)) {
      if (~file.indexOf('.mock')) {
        const rules = require(`./mock/${file}`);
        for (let key in rules) {
          mock[key] = mockjs.mock(rules[key]);
        }
      } else {
        Object.assign(mock, require('./mock/' + file));
      }
    }
  });

module.exports = mock;
