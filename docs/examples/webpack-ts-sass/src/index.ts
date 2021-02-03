import styles, { css } from './index.scss'

console.log(css);
const div = document.createElement('div');
div.setAttribute('class', styles['my-class']);
div.innerText = 'Hello';
document.body.appendChild(div);
