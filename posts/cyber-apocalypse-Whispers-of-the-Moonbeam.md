---
title: 'Cyber Apocalypse CTF 2025: Whispers of the Moonbeam'
titleIcon: '/htb-logo.png'
tags: [ 'Command Injection', 'Very Easy' ]
categories: [ 'CTF', 'HTB', 'Web' ]
description: |
  Whispers of the Moonbeam es un reto web de nivel muy fácil. Descubriremos que los comandos en la terminal son instrucciones del sistema, así que ejecutaremos una inyección de comandos y conseguiremos la bandera.
---

<font size='5'>Whispers of the Moonbeam</font>

Creador del desafío: makelaris

Dificultad: <font color='green'>Muy fácil</font>

# Descripción

En el corazón de la bulliciosa capital de Valeria, la taberna Rayo de Luna se erige como un animado centro de susurros, apuestas y tratos ilícitos. Bajo las risas de los clientes borrachos y el tintineo de las jarras, se dice que la taberna alberga algo más que cerveza y alegría: es un punto de encuentro secreto para espías, ladrones y leales a la causa de Malakar. La Comunidad se ha enterado de que en las trastiendas ocultas de la Taberna Rayo de Luna se intercambia una información crucial: la ubicación del Cartógrafo Velo de Sombra, un informante que posee un mapa perdido hace mucho tiempo en el que se detallan las defensas de la fortaleza de Malakar. Si la hermandad quiere tener alguna posibilidad de entrar en la Ciudadela de Obsidiana, debe obtener este mapa antes de que caiga en manos enemigas.

# Sinopsis

Whispers of the Moonbeam es un reto web de nivel muy fácil. Descubriremos que los comandos en la terminal son instrucciones del sistema, así que ejecutaremos una inyección de comandos y conseguiremos la bandera.

## Habilidades requeridas

- Conocimientos de comandos Linux

## Habilidades aprendidas

- Inyección de comandos

# Solución

Cuando visitamos el sitio, nos recibe una aplicación de terminal que acepta comandos.

![](/htb/cyber-apocalypse/whispers-of-the-moonbeam/index.png)

![](/htb/cyber-apocalypse/whispers-of-the-moonbeam/gossip.png)

![](/htb/cyber-apocalypse/whispers-of-the-moonbeam/injection.png)

Tecleando comandos como `gossip`, `observe` y `examine` nos proporcionará aparentemente salidas de comandos de linux, indicando que está ejecutando comandos del sistema. También hay una sugerencia para usar `;` para la inyección de comandos.

![](/htb/cyber-apocalypse/whispers-of-the-moonbeam/gossip.png)

![](/htb/cyber-apocalypse/whispers-of-the-moonbeam/observe.png)

![](/htb/cyber-apocalypse/whispers-of-the-moonbeam/examine.png)

Vemos el `flag.txt` en el comando `gossip`, podemos usar inyección de comando para `cat flag.txt`, usando este payload:

```sh
observe; cat flag.txt
```

¡Y conseguimos la bandera!

![](/htb/cyber-apocalypse/whispers-of-the-moonbeam/flag.png)