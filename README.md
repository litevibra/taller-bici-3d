# Taller de Bicis 3D — app Android para Google Play

Configurador de bicis en 3D (Three.js) empaquetado como app Android con **Capacitor 8**.
Se compila en la nube con **GitHub Actions**, así que no hace falta instalar Android Studio.

| Dato | Valor |
|---|---|
| Nombre | Taller de Bicis 3D |
| ID de paquete | `com.lilisegretin.tallerbici3d` ⚠️ **no se puede cambiar después de la primera subida** |
| Android mínimo | 7.0 (API 24) |
| Target / Compile SDK | 36 (Android 16), lo que exige Play desde el 31/08/2026 |
| Internet | No la usa: Three.js y las fuentes van dentro de la app |
| Datos personales | Ninguno. No tiene anuncios ni compras. Cumple la Política de Familias |

```
www/                  el juego (index.html); www/vendor se genera con "npm run vendor"
android/              proyecto nativo generado por Capacitor (firma configurada en app/build.gradle)
assets/               ícono y splash fuente (para regenerarlos: npx @capacitor/assets generate --android)
scripts/vendor.mjs    copia Three.js y las fuentes para que funcione sin internet
scripts/generar-clave.mjs  crea la clave de subida en TU compu
.github/workflows/android.yml  compila el .aab y el .apk firmados
docs/privacidad.html  política de privacidad (se publica con GitHub Pages)
store/                ícono 512, gráfico destacado, capturas y textos de la ficha
```

---

## Paso 1 · Subir el proyecto a GitHub

Necesitás Node 20 o más y Git.

```bash
cd taller-bici-3d-app
npm install
git init && git add . && git commit -m "Taller de Bicis 3D v1"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/taller-bici-3d.git
git push -u origin main
```

**¿Repo público o privado?** Te conviene **público**, por dos razones:
1. GitHub Pages es gratis solo en repos públicos, y ahí se publica la política de privacidad.
2. La clave de firma **no** está en el repo (`.gitignore` la excluye) y entra como secreto, así que lo público es solo el código del juego.

Si lo querés privado, subí `docs/privacidad.html` a tu portfolio o a Google Sites y usá ese link.

## Paso 2 · Generar la clave de subida (una sola vez)

```bash
npm run generar-clave
```

Te pide una contraseña y tu nombre, y crea dos archivos:
- `upload-key.p12`: **guardalo fuera del proyecto** (Drive personal, pendrive). Con esa clave se firman todas las versiones.
- `upload-key.base64.txt`: lo usás en el paso 3 y después lo borrás.

> Si algún día perdés la clave, no se pierde la app: con "Firma de apps de Play", Google guarda la firma final y vos podés pedir un reseteo de la clave de subida desde Play Console.

## Paso 3 · Cargar los secretos en GitHub

En el repo, entrá a **Settings › Secrets and variables › Actions › New repository secret** y creá estos cuatro:

| Nombre | Valor |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | todo el contenido de `upload-key.base64.txt` |
| `ANDROID_KEYSTORE_PASSWORD` | tu contraseña |
| `ANDROID_KEY_ALIAS` | `upload` |
| `ANDROID_KEY_PASSWORD` | la misma contraseña |

## Paso 4 · Compilar

Entrá a **Actions › Compilar app Android › Run workflow**. Tarda entre 5 y 8 minutos.
Cuando termina, abrí la ejecución y bajá el artefacto `taller-bici-3d-...zip`. Trae dos archivos:
- `app-release.aab`: **el que se sube a Play Store**.
- `app-release.apk`: pasalo a tu celu e instalalo para probar antes de subir.

Para las versiones siguientes podés crear una etiqueta: `git tag v1.0.1 && git push --tags`.
El número interno de versión (`versionCode`) sube solo en cada ejecución.

## Paso 5 · Publicar la política de privacidad

Entrá a **Settings › Pages › Source: Deploy from a branch › main / docs**. El link queda así:
`https://TU_USUARIO.github.io/taller-bici-3d/privacidad.html`

⚠️ Antes, cambiá `TU_CORREO` por tu mail dentro de `docs/privacidad.html`. Google lo exige.

## Paso 6 · Crear la app en Play Console

**Crear app**: nombre *Taller de Bicis 3D*, idioma Español (Latinoamérica), tipo **Juego**, **Gratis**.

### Contenido de la app (Política › Contenido de la app)

| Sección | Qué responder |
|---|---|
| Política de privacidad | el link del paso 5 |
| Anuncios | **No**, la app no tiene anuncios |
| Acceso a la app | Toda la funcionalidad está disponible sin restricciones |
| Clasificación del contenido | Categoría *Juego*. Responder **No** a violencia, miedo, sexo, lenguaje, drogas, apuestas y compras. En "¿Los usuarios pueden interactuar o compartir contenido?" responder **No** (el código se copia al portapapeles, no se envía) |
| Público objetivo | Marcar las franjas que quieras, por ejemplo **9-12, 13-15, 16-17 y 18+**. Al incluir menores de 13 entra en la **Política de Familias**: aceptar las condiciones |
| Seguridad de los datos | "¿Tu app recopila o comparte alguno de los tipos de datos requeridos?" → **No** |
| Apps gubernamentales / Funciones financieras / Salud | **No** |

### Ficha de Play Store principal

Usá los textos de `store/textos-ficha.md` y las imágenes de la carpeta `store/`.

## Paso 7 · Prueba cerrada obligatoria (cuenta personal nueva)

Como tu cuenta personal se creó después del 13/11/2023, **antes de producción necesitás 12 testers anotados durante 14 días seguidos**.

1. Entrá a **Probar y publicar › Pruebas › Prueba cerrada › Crear segmento**.
2. Creá una versión y subí `app-release.aab`. Aceptá **Firma de apps de Play** si te lo pregunta.
3. En **Testers**, cargá una lista con los Gmail de **15 o más personas** (conviene tener margen por si alguien se da de baja).
4. Enviá la versión a revisión. Cuando esté aprobada, compartí el **link para unirse** que aparece en esa misma página.
5. Cada tester tiene que tocar "Convertirme en tester", **instalar la app desde Play y abrirla** varias veces durante los 14 días. Pediles que no se den de baja.
6. Después de los 14 días, en el **Panel** aparece **Solicitar acceso a producción**. Respondé el cuestionario contando qué probaron y qué corregiste.
7. Cuando lo aprueben, creá la versión en **Producción** con el mismo `.aab` (o uno nuevo) y enviala a revisión.

Ideas para conseguir testers: familia, colegas docentes y alumnos mayores de edad con cuenta de Google propia.

## Desarrollo local (opcional)

```bash
npm install
npm run vendor          # copia Three.js y las fuentes a www/vendor
npx http-server www     # o abrí www/index.html con Live Server
npm run sync            # copia www/ al proyecto Android
```

Si después instalás Android Studio: `npx cap open android`.
