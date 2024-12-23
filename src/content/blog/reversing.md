---
title: Reversing Native Libraries
date: 2024-11-27
category: ['pentest mobile', 'android']
tags: []
summary: Reversing Native Libraries
---

Para más información consulta: https://maddiestone.github.io/AndroidAppRE/reversing_native_libs.html

Las aplicaciones de Android pueden usar bibliotecas nativas, típicamente escritas en C o C++, para tareas críticas de rendimiento. Los creadores de malware también utilizan estas bibliotecas, ya que son más difíciles de desensamblar que el bytecode DEX. La sección enfatiza las habilidades de ingeniería inversa adaptadas a Android, en lugar de enseñar lenguajes de ensamblaje. Se proporcionan versiones ARM y x86 de las bibliotecas para compatibilidad.

Puntos Clave:
Bibliotecas Nativas en Aplicaciones de Android:

Utilizadas para tareas intensivas en rendimiento.

Escritas en C o C++, lo que hace que la ingeniería inversa sea un desafío.

Se encuentran en formato .so (objeto compartido), similar a los binarios de Linux.

Los creadores de malware prefieren el código nativo para dificultar el análisis.

Interfaz Nativa de Java (JNI) y NDK de Android:

JNI permite que los métodos de Java se implementen en código nativo.

NDK es un conjunto de herramientas específico de Android para escribir código nativo.

JNI y NDK conectan el código de Java (o Kotlin) con bibliotecas nativas.

Carga y Ejecución de Bibliotecas:

Las bibliotecas se cargan en memoria usando System.loadLibrary o System.load.

JNI_OnLoad se ejecuta al cargar la biblioteca.

Los métodos nativos declarados en Java se vinculan a funciones nativas, habilitando la ejecución.

Vinculación de Métodos de Java a Funciones Nativas:

Vinculación Dinámica: Los nombres de las funciones en las bibliotecas nativas coinciden con un patrón específico, permitiendo la vinculación automática.

Vinculación Estática: Utiliza RegisterNatives para la vinculación, proporcionando flexibilidad en la nomenclatura y estructura de funciones.

Herramientas y Técnicas de Ingeniería Inversa:

Herramientas como Ghidra e IDA Pro ayudan a analizar bibliotecas nativas.

JNIEnv es crucial para entender las funciones e interacciones de JNI.

Se proporcionan ejercicios para practicar la carga de bibliotecas, la vinculación de métodos y la identificación de funciones nativas.

Recursos:
Aprendiendo Ensamblador ARM:

Sugerido para una comprensión más profunda de la arquitectura subyacente.

Conceptos Básicos de Ensamblador ARM de Azeria Labs es recomendado.

Documentación de JNI y NDK:

Especificación JNI de Oracle

Consejos de JNI de Android

Introducción al NDK

Depuración de Bibliotecas Nativas:

Depurar Bibliotecas Nativas de Android Usando JEB Decompiler