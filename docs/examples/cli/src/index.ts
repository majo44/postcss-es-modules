import { collectStyles } from 'css-es-modules';
import styles from './index.module.styles';
// styles.inject();
const collector = collectStyles();
console.log(styles.title);
console.log(collector.html);
