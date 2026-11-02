// Golden test: stamp-lib.js must draw the same SVG as page-embeds/stamps.py.
// Run: python3 tools/dump_stamp_cases.py > cases.json && node tools/test_stamp_lib.js cases.json
const fs = require('fs');
const L = require('../stamp-lib.js');
L.setIcons(JSON.parse(fs.readFileSync(__dirname + '/../stamp-icons.json', 'utf8')));
const un = s => s.replace(/&(?:amp|lt|gt|quot|Oacute|oacute|Aacute|aacute|Eacute|eacute|Iacute|iacute|Uacute|uacute|Ntilde|ntilde);/g, m => ({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&Oacute;':'Ó','&oacute;':'ó','&Aacute;':'Á','&aacute;':'á','&Eacute;':'É','&eacute;':'é','&Iacute;':'Í','&iacute;':'í','&Uacute;':'Ú','&uacute;':'ú','&Ntilde;':'Ñ','&ntilde;':'ñ'}[m]));
const norm = s => un(un(s)).replace(/(\d)\.(\d+?)0{4,}\d*/g, '$1.$2').replace(/1\.7999999999999998/g, '1.8').replace(/1\.7999999999999998/g,'1.8');
const cases = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
let bad = 0;
for (const c of cases) {
  const js = L.svg({uid: c.uid, top: un(c.top), bottom: un(c.bottom), icon: c.icon, year: c.year, ink: c.ink, rot: c.rot, seed: c.seed, bold: c.bold, extra: c.extra});
  if (norm(js) !== norm(c.out)) {
    bad++;
    let i = 0; const a = norm(js), b = norm(c.out); while (a[i] === b[i]) i++;
    console.log('DIFF', c.icon, c.top, '\n JS:', a.slice(Math.max(0, i - 50), i + 80), '\n PY:', b.slice(Math.max(0, i - 50), i + 80));
  }
}
console.log(cases.length - bad + '/' + cases.length + ' identical');
process.exit(bad ? 1 : 0);
