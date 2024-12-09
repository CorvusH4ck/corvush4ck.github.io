---
title: ADB y Comandos ADB
date: 2024-11-19
category: ['pentest mobile', 'android']
tags: ['adb', 'comando']
summary: ADB (Android Debug Bridge)
---

ADB (Android Debug Bridge) es una herramienta de línea de comandos que permite la comunicación entre una computadora y un dispositivo Android. ADB ofrece una variedad de comandos que permiten a los desarrolladores y testers de seguridad interactuar con un dispositivo Android, transferir archivos, instalar o eliminar aplicaciones, y recopilar información para depuración o pruebas de seguridad.

# Instalación

Para la instalación se puede descargar el software desde la página oficial: http://adbshell.com/
En mi caso como todo lo haré desde Kali Linux lo instalo de la siguiente forma:

```bash
sudo apt install adb
```

# Conexión

```bash
adb devices
```

Esto enumerará los dispositivos conectados; si aparece ***"unathorised"***, esto significa que debes **desbloquear** tu **móvil** y **aceptar** la conexión.

Esto indica al dispositivo que debe iniciar un servidor adb en el puerto 5555:

```bash
adb tcpip 5555
```

Conéctate a esa IP y ese Puerto:

```bash
adb connect <IP>:<PORT>
```

Si obtienes un error como el siguiente en un software de Android Virtual (como Genymotion):

```bash
adb server version (41) doesn't match this client (36); killing...
```

Es porque estás intentando conectarte a un servidor ADB con una versión diferente. Solo intenta encontrar el binario adb que el software está utilizando (ve a `C:\Program Files\Genymobile\Genymotion y busca adb.exe`)

# Varios dispositivos

Siempre que encuentres varios dispositivos conectados a tu máquina necesitarás especificar en cuál deseas ejecutar el comando adb.

```bash
adb devices
List of devices attached
192.168.100.32:5555     device
```
adb devices
List of devices attached
10.10.10.247:42135	offline
127.0.0.1:5555	device
```bash
adb -s 192.168.100.32:5555 shell
x86_64:/ # whoami
root
```

# Gestor de Paquetes

## Instalar/Desinstalar

### `adb install [opción] <ruta>`

```bash
adb install test.apk

adb install -l test.apk # aplicación con bloqueo de reenvío

adb install -r test.apk # reemplazar aplicación existente

adb install -t test.apk # permitir paquetes de prueba

adb install -s test.apk # instalar aplicación en la tarjeta SD

adb install -d test.apk # permitir la reducción del código de versión

adb install -p test.apk # instalación parcial de la aplicación
```

### `adb uninstall [options] <PACKAGE>`

```bash
adb uninstall com.test.app

adb uninstall -k com.test.app Mantener los directorios de datos y caché después de la eliminación del paquete.
```

## Paquetes

Imprime todos los paquetes, opcionalmente solo aquellos cuyo nombre de paquete contiene el texto en `<FILTER>`.

```bash
adb shell pm list packages [opciones] <FILTRO-STR>

adb shell pm list packages <FILTRO-STR>

adb shell pm list packages -f <FILTRO-STR> # Ver su archivo asociado.

adb shell pm list packages -d <FILTRO-STR> # Filtrar para mostrar solo paquetes deshabilitados.

adb shell pm list packages -e <FILTRO-STR> # Filtrar para mostrar solo paquetes habilitados.

adb shell pm list packages -s <FILTRO-STR> # Filtrar para mostrar solo paquetes del sistema.

adb shell pm list packages -3 <FILTRO-STR> # Filtrar para mostrar solo paquetes de terceros.

adb shell pm list packages -i <FILTRO-STR> # Ver el instalador de los paquetes.

adb shell pm list packages -u <FILTRO-STR> # Incluir también paquetes desinstalados.

adb shell pm list packages --user <USER_ID> <FILTRO-STR> # Espacio de usuario a consultar.
```

### `adb shell pm path <PACKAGE>`

Imprime la ruta al APK del dado.

```bash
adb shell pm path com.android.phone
```

### `adb shell pm clear <PACKAGE>`

Elimina todos los datos asociados con un paquete.

```bash
adb shell pm clear com.test.abc
```

# Administrador de archivos

### `adb pull <remote> [local]`

Descarga un archivo especificado de un emulador/dispositivo a tu computadora.

```bash
adb pull /sdcard/demo.mp4 ./
```

### `adb push <local> <remote>`

Sube un archivo especificado desde tu computadora a un emulador/dispositivo.

```bash
adb push test.apk /sdcard
```

# Captura de pantalla/Grabación de pantalla

### `adb shell screencap <filename>`

Tomando una captura de pantalla de la pantalla del dispositivo.

```bash
adb shell screencap /sdcard/screen.png
```

### `adb shell screenrecord [options] <filename>`

Grabando la pantalla de dispositivos que ejecutan Android 4.4 (nivel de API 19) y superior.

```bash
adb shell screenrecord /sdcard/demo.mp4
adb shell screenrecord --size <ANCHOxALTO>
adb shell screenrecord --bit-rate <TASA>
adb shell screenrecord --time-limit <TIEMPO> # Establece el tiempo máximo de grabación, en segundos. El valor predeterminado y máximo es 180 (3 minutos).
adb shell screenrecord --rotate # Gira 90 grados
adb shell screenrecord --verbose
```

(presiona Ctrl-C para detener la grabación)

**Puedes descargar los archivos (imágenes y videos) usando `_adb pull_`**

# Shell

### adb shell

Obtén un shell dentro del dispositivo

```bash
adb shell
```

### `adb shell <CMD>`

Ejecuta un comando dentro del dispositivo

```bash
adb shell ls
```

## pm

Los siguientes comandos se ejecutan dentro de un shell

```bash
pm list packages #Lista los paquetes instalados
pm path <nombre del paquete> #Obtén la ruta del archivo apk del paquete
am start [<opciones>] #Inicia una actividad. Sin opciones puedes ver el menú de ayuda
am startservice [<opciones>] #Inicia un servicio. Sin opciones puedes ver el menú de ayuda
am broadcast [<opciones>] #Envía una difusión. Sin opciones puedes ver el menú de ayuda
input [text|keyevent] #Enviar pulsaciones de teclas al dispositivo
```

# Processes

Si deseas obtener el PID del proceso de tu aplicación, puedes ejecutar:

```bash
adb shell ps
```

Y busca tu aplicación

O puedes hacer

```bash
adb shell pidof com.your.application
```

Y imprimirá el PID de la aplicación

# Sistema

```bash
adb root
```

Reinicia el demonio adbd con permisos de root. Luego, debes conectarte nuevamente al servidor ADB y serás root (si está disponible).

```bash
adb sideload <update.zip>
```

flashear/restaurar paquetes de actualización Android update.zip.

# Logs

## Logcat

Para filtrar los mensajes de solo una aplicación, obtén el PID de la aplicación y usa grep (linux/macos) o findstr (windows) para filtrar la salida de logcat:

```bash
adb logcat | grep 4526
adb logcat | findstr 4526
```

### adb logcat [opción] [filtro-specs]

```bash
adb logcat
```

Notas: presiona Ctrl-C para detener el monitor

```bash
adb logcat *:V # nivel de prioridad más bajo, filtra para mostrar solo el nivel Verbose
adb logcat *:D # filtra para mostrar solo el nivel Debug
adb logcat *:I # filtra para mostrar solo el nivel Info
adb logcat *:W # filtra para mostrar solo el nivel Warning
adb logcat *:E # filtra para mostrar solo el nivel Error
adb logcat *:F # filtra para mostrar solo el nivel Fatal
adb logcat *:S # Silencioso, la prioridad más alta, en la que nunca se imprime nada
```

### `adb logcat -b <Buffer>`

```bash
adb logcat -b # radio Ver el buffer que contiene mensajes relacionados con la radio/telefonía.
adb logcat -b # evento Ver el buffer que contiene mensajes relacionados con eventos.
adb logcat -b # principal predeterminado
adb logcat -c # Borra todo el registro y sale.
adb logcat -d # Vuelca el registro en la pantalla y sale.
adb logcat -f test.logs # Escribe la salida de los mensajes de registro en test.logs.
adb logcat -g # Imprime el tamaño del buffer de registro especificado y sale.
adb logcat -n <count> # Establece el número máximo de registros rotados en <count>.
```

## dumpsys

dumps datos del sistema

### adb shell dumpsys [opciones]

```bash
adb shell dumpsys
adb shell dumpsys meminfo
adb shell dumpsys battery
```

Notas: Un dispositivo móvil con las Opciones de Desarrollador habilitadas que ejecute Android 5.0 o superior.

```bash
adb shell dumpsys batterystats # Recopila datos de la batería de tu dispositivo
```

Notas: [Battery Historian](https://github.com/google/battery-historian) convierte esos datos en una visualización HTML. **PASO 1** *adb shell dumpsys batterystats > batterystats.txt* **PASO 2** *python historian.py batterystats.txt > batterystats.html*

```bash
adb shell dumpsys batterystats --reset # Borra los datos de la colección anterior
adb shell dumpsys activity
```

# Backup

Realizar un backup de un dispositivo android desde adb.

```bash
adb backup [-apk] [-shared] [-system] [-all] -f archivo.backup

# -apk -- Incluir APK de aplicaciones de terceros
# -shared -- Incluir almacenamiento removible
# -system -- Incluir aplicaciones del sistema
# -all -- Incluir todas las aplicaciones

adb shell pm list packages -f -3 # Listar paquetes
adb backup -f myapp_backup.ab -apk com.myapp # Hacer una copia de seguridad en un dispositivo
adb restore myapp_backup.ab # Restaurar en el mismo dispositivo o en cualquier otro
```

Si deseas inspeccionar el contenido de la copia de seguridad:

```bash
( printf "\x1f\x8b\x08\x00\x00\x00\x00\x00" ; tail -c +25 myapp_backup.ab ) |  tar xfvz -
```
