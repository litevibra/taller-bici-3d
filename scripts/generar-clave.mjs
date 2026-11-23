// Genera la "clave de subida" (upload key) para firmar la app ANTES de subirla a Play Store.
// Se ejecuta UNA sola vez en tu compu:  npm run generar-clave
// Crea:
//   upload-key.p12        -> guardalo en un lugar seguro (Drive personal, pendrive). NO lo subas a GitHub.
//   upload-key.base64.txt -> el texto que se pega en el secreto ANDROID_KEYSTORE_BASE64 de GitHub.
// Si algún día la perdés, Google permite resetear la clave de subida desde Play Console
// (porque la firma final la guarda Google con "Firma de apps de Play").
import forge from 'node-forge';
import { writeFileSync, existsSync } from 'node:fs';
import { createInterface } from 'node:readline';

if (existsSync('upload-key.p12')) {
  console.error('Ya existe upload-key.p12. No lo pises: si lo reemplazás, las próximas versiones no van a poder subirse.');
  process.exit(1);
}
const rl = createInterface({ input: process.stdin, terminal: false });
const lines = rl[Symbol.asyncIterator]();
const ask = async (q) => { process.stdout.write(q); const { value } = await lines.next(); return (value ?? '').trim(); };
const pass = await ask('Elegí una contraseña para la clave (mínimo 8 caracteres): ');
const nombre = (await ask('Tu nombre y apellido (va dentro del certificado): ')) || 'Desarrolladora';
rl.close();
if (pass.length < 8) { console.error('La contraseña tiene que tener al menos 8 caracteres.'); process.exit(1); }

console.log('Generando clave RSA de 2048 bits (puede tardar unos segundos)...');
const keys = forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });
const cert = forge.pki.createCertificate();
cert.publicKey = keys.publicKey;
cert.serialNumber = '01' + forge.util.bytesToHex(forge.random.getBytesSync(8));
cert.validity.notBefore = new Date();
cert.validity.notAfter = new Date();
cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 30); // Play pide validez más allá de 2033
const attrs = [{ name: 'commonName', value: nombre }, { name: 'countryName', value: 'AR' }];
cert.setSubject(attrs);
cert.setIssuer(attrs);
cert.sign(keys.privateKey, forge.md.sha256.create());

const p12 = forge.pkcs12.toPkcs12Asn1(keys.privateKey, [cert], pass, { algorithm: '3des', friendlyName: 'upload' });
const der = forge.asn1.toDer(p12).getBytes();
writeFileSync('upload-key.p12', Buffer.from(der, 'binary'));
writeFileSync('upload-key.base64.txt', Buffer.from(der, 'binary').toString('base64'));

console.log('\nListo. Cargá estos 4 secretos en GitHub (Settings > Secrets and variables > Actions):');
console.log('  ANDROID_KEYSTORE_BASE64  = todo el contenido de upload-key.base64.txt');
console.log('  ANDROID_KEYSTORE_PASSWORD = la contraseña que elegiste');
console.log('  ANDROID_KEY_ALIAS        = upload');
console.log('  ANDROID_KEY_PASSWORD     = la misma contraseña');
console.log('\nDespués BORRÁ upload-key.base64.txt y guardá upload-key.p12 fuera del proyecto.');
