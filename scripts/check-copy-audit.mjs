import { readFile } from 'node:fs/promises';

const copy = await readFile('.factory/copy-audit.md', 'utf8');
const unresolved = copy.split('\n').filter((line) => /^\|.*\|\s*(?:over 22|banned)\s*\|$/i.test(line));
if (unresolved.length) throw new Error(`Copy audit has unresolved flags:\n${unresolved.join('\n')}`);
console.log('Copy audit OK: no unresolved long-sentence or banned-word flags');
