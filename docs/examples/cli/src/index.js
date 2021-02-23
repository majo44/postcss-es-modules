const assert = require('assert');
// simple import generated module
const { styles, key, css } = require('./index.css');

//assertion
assert.match(styles.title, /_title_/);
assert.ok(key.length > 1);
assert.match(css, /font-size: 24px;/);

// and logging the generated values
console.log('title class name: ', styles.title);
console.log('stylesheet key: ', key);
console.log('raw css: ', css)
