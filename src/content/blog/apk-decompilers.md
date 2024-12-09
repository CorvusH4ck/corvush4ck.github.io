---
title: APK Decompilers
date: 2024-11-21
category: ['pentest mobile', 'android']
tags: ['decompilers']
summary: Técnicas de De-ofuscación Manual
---

# Introducción

Comencemos con lo que los archivos JAR y APK tienen en común. Cuando se construye una aplicación Android, las fuentes primero se compilan en bytecode de la JVM. Después de eso, el bytecode de la JVM se compila en bytecode Dalvik. Mientras que el bytecode de la JVM se encuentra en archivos `.class` dentro de los JARs, el bytecode Dalvik se encuentra en archivos `.dex` dentro de los APKs.

Esto significa que, para reconstruir el código fuente de un archivo APK, hay dos enfoques posibles:

- Encontrar un descompilador que reconstruya directamente el código fuente a partir del bytecode Dalvik

- Traducir el bytecode Dalvik a bytecode de la JVM y, desde allí, usar un descompilador de Java estándar.

Para el primer enfoque, [jadx](https://github.com/skylot/jadx) es la herramienta adecuada. Si tu objetivo es analizar un archivo APK, definitivamente deberías probar esta herramienta. He visto que muchos analizadores de APK dependen de ella, lo que probablemente significa que realiza un buen trabajo.

El segundo enfoque requiere un mecanismo para traducir los archivos `.dex` en archivos `.class`. [dex2jar](https://github.com/pxb1988/dex2jar) es, sin duda, la herramienta más conocida para esto. Sin embargo, me encontré con [Enjarify](https://github.com/Storyyeller/enjarify), que promete funcionar mejor en varios casos límite:

```text
[dex2jar] funciona razonablemente bien la mayor parte del tiempo, pero muchas características poco comunes o casos límite pueden hacer que falle o incluso produzca resultados incorrectos de forma silenciosa. Por el contrario, Enjarify está diseñado para funcionar en tantos casos como sea posible, incluso en código donde dex2jar fallaría.
```

Puedes encontrar más detalles en el [archivo README del proyecto](https://github.com/Storyyeller/enjarify/blob/master/README.md).

Enjarify genera, como sugiere su nombre, un archivo JAR. A partir de ahí, se pueden usar varias herramientas populares para reconstruir el código fuente en Java.

Para resumir, la siguiente figura ilustra ambas opciones que tenemos.

![APK](/static/images/decompilation.min.svg)


# Decompiladores

# CFR

CFR es capaz de decompilar características modernas de Java. Úsalo de la siguiente manera:

Para decompilación estándar: java -jar ./cfr.jar "app.jar" --outputdir "directorio_salida"

Para archivos JAR grandes, ajusta la asignación de memoria de la JVM: java -Xmx4G -jar ./cfr.jar "app.jar" --outputdir "directorio_salida"














Para más detalles sobre cada herramienta, consulta la publicación original de https://eiken.dev/blog/2021/02/how-to-break-your-jar-in-2021-decompilation-guide-for-jars-and-apks/#cfr

JD-Gui
Como el decompilador GUI Java pionero, JD-Gui te permite investigar el código Java dentro de archivos APK. Es fácil de usar; después de obtener el APK, simplemente ábrelo con JD-Gui para inspeccionar el código.

Jadx
Jadx ofrece una interfaz fácil de usar para decompilar código Java de aplicaciones Android. Se recomienda por su facilidad de uso en diferentes plataformas.

Para lanzar la GUI, navega al directorio bin y ejecuta: jadx-gui

Para uso en línea de comandos, decompila un APK con: jadx app.apk

Para especificar un directorio de salida o ajustar opciones de decompilación: `jadx app.apk -d <ruta al directorio de salida> --no-res --no-src --no-imports`

GDA-android-reversing-Tool
GDA, una herramienta solo para Windows, ofrece amplias características para la ingeniería inversa de aplicaciones Android. Instala y ejecuta GDA en tu sistema Windows, luego carga el archivo APK para análisis.

Bytecode-Viewer
Con Bytecode-Viewer, puedes analizar archivos APK utilizando múltiples decompiladores. Después de descargar, ejecuta Bytecode-Viewer, carga tu APK y selecciona los decompiladores que deseas usar para un análisis simultáneo.

Enjarify
Enjarify traduce bytecode Dalvik a bytecode Java, permitiendo que las herramientas de análisis de Java analicen aplicaciones Android de manera más efectiva.

Para usar Enjarify, ejecuta: enjarify app.apk Esto genera el bytecode Java equivalente del APK proporcionado.

CFR
CFR es capaz de decompilar características modernas de Java. Úsalo de la siguiente manera:

Para decompilación estándar: java -jar ./cfr.jar "app.jar" --outputdir "directorio_salida"

Para archivos JAR grandes, ajusta la asignación de memoria de la JVM: java -Xmx4G -jar ./cfr.jar "app.jar" --outputdir "directorio_salida"

Fernflower
Fernflower, un decompilador analítico, requiere ser construido desde el código fuente. Después de construir:

Decompila un archivo JAR: java -jar ./fernflower.jar "app.jar" "directorio_salida" Luego, extrae los archivos .java del JAR generado usando unzip.

Krakatau
Krakatau ofrece un control detallado sobre la decompilación, especialmente para manejar bibliotecas externas.

Usa Krakatau especificando la ruta de la biblioteca estándar y el archivo JAR a decompilar: ./Krakatau/decompile.py -out "directorio_salida" -skip -nauto -path "./jrt-extractor/rt.jar" "app.jar"

procyon
Para una decompilación sencilla con procyon:

Decompila un archivo JAR a un directorio especificado: procyon -jar "app.jar" -o "directorio_salida"

frida-DEXdump
Esta herramienta se puede usar para volcar el DEX de un APK en ejecución en memoria. Esto ayuda a superar la ofuscación estática que se elimina mientras la aplicación se ejecuta en memoria.