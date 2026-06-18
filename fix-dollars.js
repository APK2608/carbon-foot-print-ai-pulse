import fs from 'fs';
import path from 'path';

const files = [
  'src/components/Dashboard.tsx',
  'src/components/Simulator.tsx',
];

for (const file of files) {
  const p = path.resolve(file);
  let content = fs.readFileSync(p, 'utf-8');
  content = content.replace(/\\\$/g, '$');
  fs.writeFileSync(p, content, 'utf-8');
}
console.log('Fixed dollar signs.');
