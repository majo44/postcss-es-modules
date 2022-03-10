import * as assert from 'assert';
// simple import generated module
import { styles, key, css } from './index.css';

//assertion
assert.match(styles.title, /_title_/);
assert.ok(key.length > 1);
assert.match(css, /font-size: 24px;/);

// and logging the generated values
console.log('title class name: ', styles.title);
console.log('stylesheet key: ', key);
console.log('raw css: ', css)
