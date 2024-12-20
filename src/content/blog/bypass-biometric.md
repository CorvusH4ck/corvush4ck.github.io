---
title: Bypass Biometric Authentication
date: 2024-11-26
category: ['pentest mobile', 'android']
tags: []
summary: Bypass Biometric Authentication
---

Método 1 – Bypass sin uso de Crypto Object
El enfoque aquí está en el onAuthenticationSucceeded callback, que es crucial en el proceso de autenticación. Investigadores de WithSecure desarrollaron un script de Frida, que permite el bypass del NULL CryptoObject en onAuthenticationSucceeded(...). El script fuerza un bypass automático de la autenticación de huellas dactilares al invocar el método. A continuación se muestra un fragmento simplificado que demuestra el bypass en un contexto de huellas dactilares de Android, con la aplicación completa disponible en GitHub.

```bash
biometricPrompt = new BiometricPrompt(this, executor, new BiometricPrompt.AuthenticationCallback() {
@Override
public void onAuthenticationSucceeded(@NonNull BiometricPrompt.AuthenticationResult result) {
Toast.makeText(MainActivity.this,"Success",Toast.LENGTH_LONG).show();
}
});
```

Comando para ejecutar el script de Frida:

```bash
frida -U -f com.generic.insecurebankingfingerprint --no-pause -l fingerprint-bypass.js
```

Método 2 – Enfoque de Manejo de Excepciones
Otro script de Frida de WithSecure aborda el bypass del uso inseguro de objetos criptográficos. El script invoca onAuthenticationSucceeded con un CryptoObject que no ha sido autorizado por una huella digital. Si la aplicación intenta usar un objeto de cifrado diferente, se generará una excepción. El script se prepara para invocar onAuthenticationSucceeded y manejar la javax.crypto.IllegalBlockSizeException en la clase Cipher, asegurando que los objetos subsecuentes utilizados por la aplicación estén cifrados con la nueva clave.

Comando para ejecutar el script de Frida:

```bash
frida -U -f com.generic.insecurebankingfingerprint --no-pause -l fingerprint-bypass-via-exception-handling.js
```

Al llegar a la pantalla de huellas dactilares y la iniciación de authenticate(), escribe bypass() en la consola de Frida para activar el bypass:

```bash
Spawning com.generic.insecurebankingfingerprint...
[Android Emulator 5554::com.generic.insecurebankingfingerprint]-> Hooking BiometricPrompt.authenticate()...
Hooking BiometricPrompt.authenticate2()...
Hooking FingerprintManager.authenticate()...
[Android Emulator 5554::com.generic.insecurebankingfingerprint]-> bypass()
```

Método 3 – Marcos de Instrumentación
Los marcos de instrumentación como Xposed o Frida se pueden utilizar para engancharse a los métodos de la aplicación en tiempo de ejecución. Para la autenticación de huellas dactilares, estos marcos pueden:

Simular los Callbacks de Autenticación: Al engancharse a los métodos onAuthenticationSucceeded, onAuthenticationFailed o onAuthenticationError de BiometricPrompt.AuthenticationCallback, puedes controlar el resultado del proceso de autenticación de huellas dactilares.

Eludir el SSL Pinning: Esto permite a un atacante interceptar y modificar el tráfico entre el cliente y el servidor, potencialmente alterando el proceso de autenticación o robando datos sensibles.

Ejemplo de comando para Frida:

```bash
frida -U -l script-to-bypass-authentication.js --no-pause -f com.generic.in
```

Método 4 – Ingeniería Inversa y Modificación de Código
Las herramientas de ingeniería inversa como APKTool, dex2jar y JD-GUI se pueden utilizar para descompilar una aplicación de Android, leer su código fuente y entender su mecanismo de autenticación. Los pasos generalmente incluyen:

Descompilación del APK: Convertir el archivo APK a un formato más legible para humanos (como código Java).

Análisis del Código: Buscar la implementación de la autenticación por huella dactilar e identificar posibles debilidades (como mecanismos de respaldo o comprobaciones de validación inadecuadas).

Recompilación del APK: Después de modificar el código para eludir la autenticación por huella dactilar, la aplicación se recompila, se firma e instala en el dispositivo para pruebas.

Método 5 – Uso de Herramientas de Autenticación Personalizadas
Existen herramientas y scripts especializados diseñados para probar y eludir mecanismos de autenticación. Por ejemplo:

Módulos MAGISK: MAGISK es una herramienta para Android que permite a los usuarios rootear sus dispositivos y agregar módulos que pueden modificar o suplantar información a nivel de hardware, incluidas las huellas dactilares.

Scripts Personalizados: Se pueden escribir scripts para interactuar con el Android Debug Bridge (ADB) o directamente con el backend de la aplicación para simular o eludir la autenticación por huella dactilar.

Referencias
https://securitycafe.ro/2022/09/05/mobile-pentesting-101-bypassing-biometric-authentication/