import { expect } from 'chai';
import { readCodeForEmbed } from './read-code-for-embed';

describe('read-code-for-embed', () => {
    it ('should read ts source', () => {
        const code = readCodeForEmbed('ts', 'esm');
        expect(code).contains('export function injectStyles');
    });
    it ('should read js source', () => {
        const code = readCodeForEmbed('js', 'esm');
        expect(code).contains('export function injectStyles');
    });
    it ('should read js source', () => {
        const code = readCodeForEmbed('js', 'cjs');
        expect(code).contains('exports.injectStyles =');
    });
});
