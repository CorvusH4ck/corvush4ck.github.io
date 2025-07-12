---
title: 'The Hackers Labs: Microchoft'
titleIcon: '/thl.png'
tags: [ 'Windows', 'SMB', 'Exploit', 'Eternalblue' ]
categories: [ 'CTF', 'The Hackers Labs', 'Principiante', 'Windows' ]
description: |
  Microchoft es una máquina de nivel principiante donde nos enfrentamos a un sistema Windows 7 vulnerable. A través de un escaneo SMB descubrimos que es susceptible a EternalBlue. Sin usar Metasploit, logramos explotar la vulnerabilidad manualmente con herramientas externas y obtuvimos acceso como SYSTEM.
---

<font size='5'>Microchoft</font>

Plataforma: `The Hackers Labs`

Dificultad: <font color='green'>Principiante</font>

🔗 **Link de la máquina:** [https://labs.thehackerslabs.com/machine/55](https://labs.thehackerslabs.com/machine/55)

![Grillo](/thl/principiante/microchoft/microchoft.png)

# Reconocimiento

Comenzamos con un escaneo de puertos para descubrir los servicios accesibles desde la red. Para ello, usamos `nmap` con opciones que nos permiten obtener resultados detallados y eficientes:

```bash
sudo nmap -p- --open -sS -sCV --min-rate 5000 -Pn -n -oN microchoft.txt 192.168.100.5
Starting Nmap 7.95 ( https://nmap.org ) at 2025-07-11 13:55 -03
Nmap scan report for 192.168.100.5
Host is up (0.00098s latency).                                                                                                                                                                                                              
Not shown: 60299 closed tcp ports (reset), 5227 filtered tcp ports (no-response)                                                                                                                                                            
Some closed ports may be reported as filtered due to --defeat-rst-ratelimit
PORT      STATE SERVICE      VERSION
135/tcp   open  msrpc        Microsoft Windows RPC
139/tcp   open  netbios-ssn  Microsoft Windows netbios-ssn
445/tcp   open  microsoft-ds Windows 7 Home Basic 7601 Service Pack 1 microsoft-ds (workgroup: WORKGROUP)
49152/tcp open  msrpc        Microsoft Windows RPC
49153/tcp open  msrpc        Microsoft Windows RPC
49154/tcp open  msrpc        Microsoft Windows RPC
49155/tcp open  msrpc        Microsoft Windows RPC
49156/tcp open  msrpc        Microsoft Windows RPC
49157/tcp open  msrpc        Microsoft Windows RPC
MAC Address: 00:0C:29:6A:58:09 (VMware)
Service Info: Host: MICROCHOFT; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-security-mode: 
|   2:1:0: 
|_    Message signing enabled but not required
| smb2-time: 
|   date: 2025-07-11T16:56:49
|_  start_date: 2025-07-11T16:52:41
| smb-security-mode: 
|   account_used: <blank>
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
|_clock-skew: mean: -40m01s, deviation: 1h09m16s, median: -1s
|_nbstat: NetBIOS name: MICROCHOFT, NetBIOS user: <unknown>, NetBIOS MAC: 00:0c:29:6a:58:09 (VMware)
| smb-os-discovery: 
|   OS: Windows 7 Home Basic 7601 Service Pack 1 (Windows 7 Home Basic 6.1)
|   OS CPE: cpe:/o:microsoft:windows_7::sp1
|   Computer name: Microchoft
|   NetBIOS computer name: MICROCHOFT\x00
|   Workgroup: WORKGROUP\x00
|_  System time: 2025-07-11T18:56:49+02:00

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 76.21 seconds
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

- 135/tcp (MSRPC)
- 139/tcp (NetBIOS-SSN)
- 445/tcp (Microsoft-DS)  
Se identifica el sistema como **Windows 7 Home Basic SP1**.

---

## Comprobación de Vulnerabilidad

Detectando que el sistema operativo es Windows 7, verificamos si es vulnerable al fallo crítico **MS17-010 (EternalBlue)** utilizando el siguiente script de Nmap:

```bash
sudo nmap -p 445 --script smb-vuln-ms17-010 192.168.100.5
Starting Nmap 7.95 ( https://nmap.org ) at 2025-07-11 14:17 -03
Nmap scan report for 192.168.100.5
Host is up (0.00047s latency).

PORT    STATE SERVICE
445/tcp open  microsoft-ds
MAC Address: 00:0C:29:6A:58:09 (VMware)

Host script results:
| smb-vuln-ms17-010: 
|   VULNERABLE:
|   Remote Code Execution vulnerability in Microsoft SMBv1 servers (ms17-010)
|     State: VULNERABLE
|     IDs:  CVE:CVE-2017-0143
|     Risk factor: HIGH
|       A critical remote code execution vulnerability exists in Microsoft SMBv1
|        servers (ms17-010).
|           
|     Disclosure date: 2017-03-14
|     References:
|       https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2017-0143
|       https://technet.microsoft.com/en-us/library/security/ms17-010.aspx
|_      https://blogs.technet.microsoft.com/msrc/2017/05/12/customer-guidance-for-wannacrypt-attacks/

Nmap done: 1 IP address (1 host up) scanned in 0.28 seconds
```

### Resultado:

El escaneo confirma que el sistema **es vulnerable** a ejecución remota de código a través de SMBv1.

> Vulnerabilidad: **MS17-010**  
> Estado: **Vulnerable**  
> CVE: **CVE-2017-0143**

---

# Explotación

En lugar de utilizar Metasploit, recurrimos a la herramienta **Win7Blue**, una opción externa que permite explotar EternalBlue manualmente.

🔗 **Link de la herramienta:** [https://github.com/d4t4s3c/Win7Blue](https://github.com/d4t4s3c/Win7Blue)

### 🛠️ Procedimiento:

1. Reconfirmamos la vulnerabilidad con el módulo `scanner`.

![scanner](/thl/principiante/microchoft/win7blue_nmap.png)

2. Determinamos la arquitectura del sistema con `arch`.

![arch](/thl/principiante/microchoft/win7blue_netexec.png)

4. Ejecutamos el exploit de EternalBlue.

Primeramente debemos ponernos en modo escucha para establecer una shell inversa en Netcat:

```bash
nc -lvnp 4444
```

![exploit](/thl/principiante/microchoft/win7blue_exploit.png)

---

## 🔐 Fase 4 - Escalada de Privilegios

Ya dentro del sistema, revisamos los usuarios y comprobamos que tenemos acceso con permisos elevados:

```bash
whoami
net user
```

Obtenemos acceso como `NT AUTHORITY\SYSTEM`, lo que nos otorga control total del sistema.

![revshell](/thl/principiante/microchoft/win7blue_revshell.png)

---

# 🎉 ¡Root conseguido!

La máquina **Microchoft** fue comprometida con éxito mediante una explotación manual de EternalBlue sin hacer uso de Metasploit. Esta experiencia demuestra cómo es posible ejecutar un ataque completo utilizando herramientas independientes y técnicas más discretas.

### Flag User

![user](/thl/principiante/microchoft/win7blue_user.png)

### Flag Root

![root](/thl/principiante/microchoft/win7blue_root.png)

Hemos completado exitosamente la máquina **Microchoft**  de TheHackersLabs.

