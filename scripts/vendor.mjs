// Copia Three.js y las fuentes a www/vendor para que la app funcione sin internet
// y no haga ninguna conexión a terceros (requisito de la Política de Familias de Google Play).
import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
const out = 'www/vendor';
mkdirSync(`${out}/fonts`, { recursive: true });
cpSync('node_modules/three/build/three.min.js', `${out}/three.min.js`);
cpSync('node_modules/three/examples/js/controls/OrbitControls.js', `${out}/OrbitControls.js`);
const fonts = [
  ['Barlow', 'barlow', 400], ['Barlow', 'barlow', 500], ['Barlow', 'barlow', 600],
  ['Barlow Condensed', 'barlow-condensed', 600], ['Barlow Condensed', 'barlow-condensed', 700],
];
let css = '';
for (const [family, pkg, w] of fonts) {
  const file = `${pkg}-latin-${w}-normal.woff2`;
  cpSync(`node_modules/@fontsource/${pkg}/files/${file}`, `${out}/fonts/${file}`);
  css += `@font-face{font-family:"${family}";font-weight:${w};font-style:normal;font-display:swap;src:url(fonts/${file}) format("woff2")}\n`;
}
writeFileSync(`${out}/fonts.css`, css);
console.log('vendor listo');
