// src/index-client.ts
// importing css file
import styles from './test.scss';

styles.inject();

// Simple use typescript in your client side code.
console.log('abc', styles['my-class']);


// this is needed because of tsconfig isolatedModules flag
export {}
