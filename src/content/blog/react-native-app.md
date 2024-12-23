---
title: React Native Application
date: 2024-11-25
category: ['pentest mobile', 'android']
tags: []
summary: React Native Application
---

Análisis de Aplicaciones React Native
Para confirmar si la aplicación fue construida en el marco de React Native, sigue estos pasos:

Cambia el nombre del archivo APK con una extensión zip y extráelo a una nueva carpeta usando el comando cp com.example.apk example-apk.zip y unzip -qq example-apk.zip -d ReactNative.

Navega a la carpeta ReactNative recién creada y localiza la carpeta de assets. Dentro de esta carpeta, deberías encontrar el archivo index.android.bundle, que contiene el JavaScript de React en un formato minificado.

Usa el comando find . -print | grep -i ".bundle$" para buscar el archivo JavaScript.

Para analizar más a fondo el código JavaScript, crea un archivo llamado index.html en el mismo directorio con el siguiente código:

```html
<script src="./index.android.bundle"></script>
```

Puedes subir el archivo a https://spaceraccoon.github.io/webpack-exploder/ o seguir estos pasos:

Abre el archivo index.html en Google Chrome.

Abre la Barra de Herramientas del Desarrollador presionando Command+Option+J para OS X o Control+Shift+J para Windows.

Haz clic en "Sources" en la Barra de Herramientas del Desarrollador. Deberías ver un archivo JavaScript que está dividido en carpetas y archivos, formando el paquete principal.

Si encuentras un archivo llamado index.android.bundle.map, podrás analizar el código fuente en un formato no minificado. Los archivos de mapa contienen mapeo de origen, lo que te permite mapear identificadores minificados.

Para buscar credenciales y puntos finales sensibles, sigue estos pasos:

Identifica palabras clave sensibles para analizar el código JavaScript. Las aplicaciones de React Native a menudo utilizan servicios de terceros como Firebase, puntos finales del servicio AWS S3, claves privadas, etc.

En este caso específico, se observó que la aplicación estaba utilizando el servicio Dialogflow. Busca un patrón relacionado con su configuración.

Fue afortunado que se encontraran credenciales sensibles codificadas en el código JavaScript durante el proceso de reconocimiento.

Referencias
https://medium.com/bugbountywriteup/lets-know-how-i-have-explored-the-buried-secrets-in-react-native-application-6236728198f7