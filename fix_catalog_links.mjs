import fs from 'fs';

const p = 'src/app/pro-tools/page.tsx';
let content = fs.readFileSync(p, 'utf8');

content = content.replace(
  'routePath: "/pro-tools/" + tool.tool_id',
  'routePath: "/tools/premium/" + tool.tool_id'
);

fs.writeFileSync(p, content, 'utf8');
console.log('Fixed catalog links');
