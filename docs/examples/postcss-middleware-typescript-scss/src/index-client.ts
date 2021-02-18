// src/index-client.ts
// importing css file
import styles from './index.scss';

// creating element
const div = document.createElement('div');
div.innerText = 'Hello word';
// setting class name
div.classList.add(styles['my-class'].trim());
// adding element to body
document.body.appendChild(div);
