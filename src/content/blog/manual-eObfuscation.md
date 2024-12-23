---
title: De-ofuscación manual
date: 2024-11-20
category: ['pentest mobile', 'android']
tags: ['de-ofuscación']
summary: Técnicas de De-ofuscación Manual
---

# Técnicas de De-ofuscación Manual

En el ámbito de la **seguridad del software**, el proceso de hacer que el código oscurecido sea comprensible, conocido como **de-ofuscación**, es crucial. Esta guía profundiza en varias estrategias para la de-obfuscación, centrándose en técnicas de análisis estático y reconociendo patrones de ofuscación. Además, introduce un ejercicio para la aplicación práctica y sugiere recursos adicionales para aquellos interesados en explorar temas más avanzados.

## Estrategias para la De-ofuscación Estática

Al tratar con **código ofuscado**, se pueden emplear varias estrategias dependiendo de la naturaleza de la ofuscación:

- **Código bytecode DEX (Java):** Un enfoque efectivo implica identificar los métodos de de-obfuscación de la aplicación, luego replicar estos métodos en un archivo Java. Este archivo se ejecuta para revertir la ofuscación en los elementos objetivo.

- **Código Java y Nativo:** Otro método es traducir el algoritmo de de-obfuscación a un lenguaje de scripting como Python. Esta estrategia destaca que el objetivo principal no es entender completamente el algoritmo, sino ejecutarlo de manera efectiva.

## Identificación de la Ofuscación

Reconocer el código ofuscado es el primer paso en el proceso de de-obfuscación. Los indicadores clave incluyen:

- La **ausencia o desorden de cadenas** en Java y Android, lo que puede sugerir ofuscación de cadenas.

- La **presencia de archivos binarios** en el directorio de assets o llamadas a `DexClassLoader`, lo que sugiere desempaquetado de código y carga dinámica.

- El uso de **bibliotecas nativas junto con funciones JNI no identificables**, indicando una posible ofuscación de métodos nativos.

# Análisis Dinámico en la De-ofuscación

Al ejecutar el código en un entorno controlado, el análisis dinámico permite **observar cómo se comporta el código ofuscado en tiempo real**. Este método es particularmente efectivo para descubrir el funcionamiento interno de patrones de ofuscación complejos que están diseñados para ocultar la verdadera intención del código.

## Aplicaciones del Análisis Dinámico

- **Desencriptación en Tiempo de Ejecución:** Muchas técnicas de ofuscación implican encriptar cadenas o segmentos de código que solo se desencriptan en tiempo de ejecución. A través del análisis dinámico, estos elementos encriptados pueden ser capturados en el momento de la desencriptación, revelando su forma verdadera.

- **Identificación de Técnicas de Ofuscación:** Al monitorear el comportamiento de la aplicación, el análisis dinámico puede ayudar a identificar técnicas específicas de ofuscación que se están utilizando, como virtualización de código, empaquetadores o generación dinámica de código.

- **Descubrimiento de Funcionalidades Ocultas:** El código ofuscado puede contener funcionalidades ocultas que no son evidentes a través del análisis estático solo. El análisis dinámico permite observar todos los caminos de código, incluidos aquellos ejecutados condicionalmente, para descubrir tales funcionalidades ocultas.

# Referencias y Lecturas Adicionales

- https://maddiestone.github.io/AndroidAppRE/obfuscation.html

- BlackHat USA 2018: “Desempaquetando el Desempaquetador Empaquetado: Ingeniería Inversa de una Biblioteca Anti-Análisis de Android” [video](https://www.youtube.com/watch?v=s0Tqi7fuOSU)

- Esta charla aborda la ingeniería inversa de una de las bibliotecas nativas anti-análisis más complejas que he visto utilizadas por una aplicación de Android. Cubre principalmente técnicas de ofuscación en código nativo.

- REcon 2019: “El Camino hacia la Carga Útil: Edición Android” [video](https://www.youtube.com/watch?v=mWNNeKuSuwI)

- Esta charla discute una serie de técnicas de ofuscación, únicamente en código Java, que un botnet de Android estaba utilizando para ocultar su comportamiento.