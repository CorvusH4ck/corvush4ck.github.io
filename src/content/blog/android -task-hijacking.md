---
title: Android Task Hijacking
date: 2024-11-19
category: ['pentest mobile']
tags: ['android']
summary: Tarea, Pila de Fondo y Actividades en Primer Plano
---

# Tarea, Pila de Fondo y Actividades en Primer Plano

En Android, una tarea es esencialmente un conjunto de actividades con las que los usuarios interactúan para completar un trabajo específico, organizadas dentro de una pila de actividades **(back stack)**. Esta pila ordena las actividades según cuándo fueron abiertas, con la actividad más reciente mostrada en la parte superior como la actividad en primer plano. En cualquier momento, solo esta actividad es visible en la pantalla, convirtiéndola en parte de la tarea en primer plano.

Aquí hay un desglose rápido de las transiciones de actividades:

- Actividad 1 comienza como la única actividad en primer plano.

- Lanzar Actividad 2 empuja Actividad 1 a la pila de fondo, llevando Actividad 2 al primer plano.

- Iniciar Actividad 3 mueve Actividad 1 y Actividad 2 más atrás en la pila, con Actividad 3 ahora al frente.

- Cerrar Actividad 3 trae Actividad 2 de vuelta al primer plano, mostrando el mecanismo de navegación de tareas optimizado de Android.

![diagram_backstack](https://developer.android.com/images/fundamentals/diagram_backstack.png)

https://developer.android.com/images/fundamentals/diagram_backstack.png

# Ataque de afinidad de tarea

## Descripción general de la afinidad de tarea y modos de lanzamiento

En las aplicaciones de Android, la **afinidad de tareas** especifica la tarea preferida de una actividad, alineándose típicamente con el nombre del paquete de la aplicación. Esta configuración es fundamental para crear una aplicación de prueba de concepto (PoC) para demostrar el ataque.

# Modos de lanzamiento

El atributo launchMode dirige el manejo de instancias de actividad dentro de las tareas. El modo `singleTask` es fundamental para este ataque, dictando tres escenarios basados en las instancias de actividad existentes y las coincidencias de afinidad de tarea. La explotación se basa en la capacidad de la aplicación del atacante para imitar la afinidad de tarea de la aplicación objetivo, engañando al sistema Android para que inicie la aplicación del atacante en lugar de la objetivo.

# Pasos detallados del ataque

- **Instalación de la aplicación maliciosa:** La víctima instala la aplicación del atacante en su dispositivo.

- **Activación inicial:** La víctima abre primero la aplicación maliciosa, preparando el dispositivo para el ataque.

- **Intento de lanzamiento de la aplicación objetivo:** La víctima intenta abrir la aplicación objetivo.

- **Ejecución del secuestro:** Debido a la coincidencia de afinidad de tarea, la aplicación maliciosa se lanza en lugar de la aplicación objetivo.

- **Engaño:** La aplicación maliciosa presenta una pantalla de inicio de sesión falsa que se asemeja a la aplicación objetivo, engañando al usuario para que ingrese información sensible.

Para una implementación práctica de este ataque, consulte el repositorio Task Hijacking Strandhogg en GitHub: [Task Hijacking Strandhogg](https://github.com/az0mb13/Task_Hijacking_Strandhogg).

# Medidas de prevención

Para prevenir tales ataques, los desarrolladores pueden establecer `taskAffinity` en una cadena vacía y optar por el modo de lanzamiento `singleInstance`, asegurando el aislamiento de su aplicación de otras. Personalizar la función `onBackPressed()` ofrece protección adicional contra el secuestro de tareas.

# Referencias

- https://blog.dixitaditya.com/android-task-hijacking/

- https://blog.takemyhand.xyz/2021/02/android-task-hijacking-with.html