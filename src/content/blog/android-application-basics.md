---
title: Android Application Basics
date: 2024-11-22
category: ['pentest mobile', 'android']
tags: ['app']
summary: Android Application Basics
---

# Modelo de Seguridad de Android

## Hay dos capas:

- El **SO**, que mantiene las aplicaciones instaladas aisladas entre sí.

- La **aplicación en sí**, que permite a los desarrolladores **exponer ciertas funcionalidades** y configura las capacidades de la aplicación.

# Separación de UID

**A cada aplicación se le asigna un ID de usuario específico.** Esto se hace durante la instalación de la aplicación para que **la aplicación solo pueda interactuar con archivos propiedad de su ID de usuario o archivos compartidos.** Por lo tanto, solo la propia aplicación, ciertos componentes del SO y el usuario root pueden acceder a los datos de la aplicación.

# Compartición de UID

**Dos aplicaciones pueden configurarse para usar el mismo UID.** Esto puede ser útil para compartir información, pero si una de ellas se ve comprometida, los datos de ambas aplicaciones se verán comprometidos. Por esta razón, este comportamiento es **desaconsejado**.
**Para compartir el mismo UID, las aplicaciones deben definir el mismo valor** `android:sharedUserId` **en sus manifiestos.**

# Sandbox

El **Sandbox de Aplicaciones Android** permite ejecutar **cada aplicación** como un **proceso separado bajo un ID de usuario separado**. Cada proceso tiene su propia máquina virtual, por lo que el código de una aplicación se ejecuta en aislamiento de otras aplicaciones.
Desde Android 5.0(L), se aplica **SELinux**. Básicamente, SELinux deniega todas las interacciones de procesos y luego crea políticas para **permitir solo las interacciones esperadas entre ellos.**

# Permisos

Cuando instalas una **aplicación y solicita permisos**, la aplicación está pidiendo los permisos configurados en los elementos `uses-permission` en el archivo **AndroidManifest.xml**. El elemento uses-permission indica el nombre del permiso solicitado dentro del **atributo name**. También tiene el atributo maxSdkVersion que detiene la solicitud de permisos en versiones superiores a la especificada.
Ten en cuenta que las aplicaciones de Android no necesitan pedir todos los permisos al principio, también pueden **solicitar permisos dinámicamente**, pero todos los permisos deben ser **declarados** en el **manifiesto**.

Cuando una aplicación expone funcionalidad, puede limitar el **acceso solo a aplicaciones que tengan un permiso específico**.
Un elemento de permiso tiene tres atributos:

- El **nombre** del permiso
- El atributo **permission-group**, que permite agrupar permisos relacionados.
- El **nivel de protección** que indica cómo se otorgan los permisos. Hay cuatro tipos:
    - **Normal:** Se utiliza cuando no **hay amenazas conocidas** para la aplicación. No se **requiere la aprobación del usuario**.
    - **Peligroso:** Indica que el permiso otorga a la aplicación solicitante algún **acceso elevado**. **Se solicita la aprobación de los usuarios**.
    - **Firma:** Solo **las aplicaciones firmadas por el mismo certificado que el que** exporta el componente pueden recibir permiso. Este es el tipo de protección más fuerte.
    - **FirmaOSistema:** Solo **las aplicaciones firmadas por el mismo certificado que el que** exporta el componente o **las aplicaciones que se ejecutan con acceso a nivel de sistema** pueden recibir permisos.

# Aplicaciones Preinstaladas

Estas aplicaciones generalmente se encuentran en los directorios `/system/app` o `/system/priv-app` y algunas de ellas están **optimizadas** (puede que ni siquiera encuentres el archivo `classes.dex`). Estas aplicaciones valen la pena revisar porque a veces están **ejecutándose con demasiados permisos** (como root).

- Las que se envían con el **AOSP** (Android OpenSource Project) **ROM**
- Agregadas por el **fabricante** del dispositivo
- Agregadas por el **proveedor de telefonía móvil** (si se compró a ellos)

# Rooting

Para obtener acceso root en un dispositivo Android físico, generalmente necesitas **explotar** 1 o 2 **vulnerabilidades** que suelen ser **específicas** para el **dispositivo** y **versión**.
Una vez que la explotación ha funcionado, generalmente se copia el binario de Linux `su` en una ubicación especificada en la variable de entorno PATH del usuario, como `/system/xbin`.

Una vez que el binario de su está configurado, se utiliza otra aplicación de Android para interactuar con el binario `su` y **procesar solicitudes de acceso root** como **Superuser** y **SuperSU** (disponible en Google Play Store).

:::caution
Ten en cuenta que el proceso de rooting es muy peligroso y puede dañar severamente el dispositivo.
:::

# ROMs

Es posible **reemplazar el SO instalando un firmware personalizado**. Haciendo esto, es posible extender la utilidad de un dispositivo antiguo, eludir restricciones de software o acceder al último código de Android.
**OmniROM** y **LineageOS** son dos de los firmwares más populares para usar.

Ten en cuenta que **no siempre es necesario rootear el dispositivo** para instalar un firmware personalizado. **Algunos fabricantes permiten** el desbloqueo de sus bootloaders de manera bien documentada y segura.

# Implicaciones

Una vez que un dispositivo está rooteado, cualquier aplicación podría solicitar acceso como root. Si una aplicación maliciosa lo obtiene, tendrá acceso a casi todo y podrá dañar el teléfono.

# Fundamentos de Aplicaciones Android

- El formato de las aplicaciones Android se conoce como *formato de archivo APK*. Es esencialmente un **archivo ZIP** (cambiando la extensión del archivo a .zip, se pueden extraer y ver los contenidos).
- Contenidos de APK (No exhaustivo)
    - **AndroidManifest.xml**
    - resources.arsc/strings.xml
    - resources.arsc: contiene recursos precompilados, como XML binario.
        - res/xml/files_paths.xml
    - META-INF/
        - ¡Aquí es donde se encuentra el Certificado!
    - **classes.dex**
        - Contiene bytecode Dalvik, que representa el código Java (o Kotlin) compilado que la aplicación ejecuta por defecto.
    - lib/
        - Alberga bibliotecas nativas, segregadas por arquitectura de CPU en subdirectorios.
            - armeabi: código para procesadores basados en ARM
            - armeabi-v7a: código para procesadores ARMv7 y superiores
            - x86: código para procesadores X86
            - mips: código solo para procesadores MIPS
    - assets/
        - Almacena archivos diversos necesarios para la aplicación, que pueden incluir bibliotecas nativas adicionales o archivos DEX, a veces utilizados por autores de malware para ocultar código adicional.
    - res/
        - Contiene recursos que no están compilados en resources.arsc

# Dalvik y Smali

En el desarrollo de Android, se utiliza **Java o Kotlin** para crear aplicaciones. En lugar de usar la JVM como en las aplicaciones de escritorio, Android compila este código en **bytecode ejecutable Dalvik (DEX)**. Anteriormente, la máquina virtual Dalvik manejaba este bytecode, pero ahora, el Android Runtime (ART) se encarga en las versiones más nuevas de Android.

Para la ingeniería inversa, **Smali** se vuelve crucial. Es la versión legible por humanos del bytecode DEX, actuando como un lenguaje ensamblador al traducir el código fuente en instrucciones de bytecode. Smali y baksmali se refieren a las herramientas de ensamblaje y desensamblaje en este contexto.

# Intenciones

Las intenciones son el medio principal por el cual las aplicaciones Android se comunican entre sus componentes o con otras aplicaciones. Estos objetos de mensaje también pueden transportar datos entre aplicaciones o componentes, similar a cómo se utilizan las solicitudes GET/POST en las comunicaciones HTTP.

Así que una Intención es básicamente un **mensaje que se pasa entre componentes**. Las Intenciones **pueden ser dirigidas** a componentes o aplicaciones específicas, o **pueden enviarse sin un destinatario específico**.
Para ser simple, la Intención se puede usar:
- Para iniciar una Actividad, típicamente abriendo una interfaz de usuario para una aplicación
- Como transmisiones para informar al sistema y a las aplicaciones sobre cambios
- Para iniciar, detener y comunicarse con un servicio en segundo plano
- Para acceder a datos a través de ContentProviders
- Como callbacks para manejar eventos

Si es vulnerable, **las Intenciones pueden ser utilizadas para realizar una variedad de ataques**.

# Filtro de Intención

**Los Filtros de Intención** definen **cómo una actividad, servicio o Receptor de Transmisión puede interactuar con diferentes tipos de Intenciones**. Esencialmente, describen las capacidades de estos componentes, como qué acciones pueden realizar o los tipos de transmisiones que pueden procesar. El lugar principal para declarar estos filtros es dentro del **archivo AndroidManifest.xml**, aunque para los Receptores de Transmisión, también es una opción codificarlos.

Los Filtros de Intención se componen de categorías, acciones y filtros de datos, con la posibilidad de incluir metadatos adicionales. Esta configuración permite que los componentes manejen Intenciones específicas que coincidan con los criterios declarados.

Un aspecto crítico de los componentes de Android (actividades/servicios/proveedores de contenido/receptores de transmisión) es su visibilidad o **estado público**. Un componente se considera público y puede interactuar con otras aplicaciones si está `exportado` con un valor de `true` o si se declara un Filtro de Intención para él en el manifiesto. Sin embargo, hay una manera para que los desarrolladores mantengan explícitamente estos componentes privados, asegurando que no interactúen con otras aplicaciones de manera no intencionada. Esto se logra configurando el atributo `exported` a `false` en sus definiciones de manifiesto.

Además, los desarrolladores tienen la opción de asegurar aún más el acceso a estos componentes al requerir permisos específicos. El atributo `permission` se puede establecer para hacer cumplir que solo las aplicaciones con el permiso designado puedan acceder al componente, agregando una capa adicional de seguridad y control sobre quién puede interactuar con él.

```html
<activity android:name=".MyActivity" android:exported="false">
<!-- Intent filters go here -->
</activity>
```

# Intenciones Implícitas

Las intenciones se crean programáticamente utilizando un constructor de Intención:

```python
Intent email = new Intent(Intent.ACTION_SEND, Uri.parse("mailto:"));
```

La Acción de la intención declarada previamente es ACTION_SEND y el Extra es un mailto Uri (el Extra es la información adicional que la intención está esperando).

Esta intención debe ser declarada dentro del manifiesto como en el siguiente ejemplo:

```html
<activity android:name="ShareActivity">
<intent-filter>
<action android:name="android.intent.action.SEND" />
<category android:name="android.intent.category.DEFAULT" />
</intent-filter>
</activity>
```

Un intent-filter necesita coincidir con la acción, datos y categoría para recibir un mensaje.

El proceso de "resolución de Intent" determina qué aplicación debe recibir cada mensaje. Este proceso considera el atributo de prioridad, que se puede establecer en la declaración de intent-filter, y el que tenga la mayor prioridad será seleccionado. Esta prioridad se puede establecer entre -1000 y 1000 y las aplicaciones pueden usar el valor SYSTEM_HIGH_PRIORITY. Si surge un conflicto, aparece una ventana de "elección" para que el usuario pueda decidir.

# Intents Explícitos

Un intent explícito especifica el nombre de la clase a la que está dirigido:

```python
Intent downloadIntent = new (this, DownloadService.class):
```

En otras aplicaciones, para acceder a la intención previamente declarada, puedes usar:

```python
Intent intent = new Intent();
intent.setClassName("com.other.app", "com.other.app.ServiceName");
context.startService(intent);
```

# Pending Intents

Estos permiten que otras aplicaciones realicen acciones en nombre de su aplicación, utilizando la identidad y los permisos de su app. Al construir un Pending Intent, se debe especificar un intent y la acción a realizar. Si el intent declarado no es explícito (no declara qué intent puede llamarlo), una aplicación maliciosa podría realizar la acción declarada en nombre de la app víctima. Además, si no se especifica una acción, la app maliciosa podrá hacer cualquier acción en nombre de la víctima.

# Broadcast Intents

A diferencia de los intents anteriores, que solo son recibidos por una app, los broadcast intents pueden ser recibidos por múltiples apps. Sin embargo, desde la versión de API 14, es posible especificar la app que debería recibir el mensaje usando Intent.setPackage.

Alternativamente, también es posible especificar un permiso al enviar el broadcast. La app receptora necesitará tener ese permiso.

Hay dos tipos de Broadcasts: Normal (asíncrono) y Ordenado (síncrono). El orden se basa en la prioridad configurada dentro del elemento receptor. Cada app puede procesar, retransmitir o descartar el Broadcast.

Es posible enviar un broadcast usando la función sendBroadcast(intent, receiverPermission) de la clase Context.\ También podría usar la función 
sendBroadcast
 de 
LocalBroadCastManager
 que asegura que el mensaje nunca salga de la app. Usando esto, ni siquiera necesitará exportar un componente receptor.

# Sticky Broadcasts

Este tipo de Broadcasts pueden ser accedidos mucho después de haber sido enviados.
Estos fueron desaprobados en el nivel de API 21 y se recomienda no usarlos.
Permiten que cualquier aplicación intercepte los datos, pero también los modifique.

Si encuentra funciones que contengan la palabra "sticky" como 
sendStickyBroadcast
 o 
sendStickyBroadcastAsUser
, verifique el impacto y trate de eliminarlas.

Deep links / URL schemes
En las aplicaciones de Android, deep links se utilizan para iniciar una acción (Intent) directamente a través de una URL. Esto se hace declarando un esquema de URL específico dentro de una actividad. Cuando un dispositivo Android intenta acceder a una URL con este esquema, se lanza la actividad especificada dentro de la aplicación.

El esquema debe ser declarado en el 
AndroidManifest.xml
:

```html
[...]
<activity android:name=".MyActivity">
<intent-filter>
<action android:name="android.intent.action.VIEW" />
<category android:name="android.intent.category.DEFAULT" />
<category android:name="android.intent.category.BROWSABLE" />
<data android:scheme="examplescheme" />
</intent-filter>
[...]
```

El esquema del ejemplo anterior es examplescheme:// (nota también la 
categoría BROWSABLE
)

Luego, en el campo de datos, puedes especificar el host y path:

```html
<data android:scheme="examplescheme"
android:host="example"
/>
```

Para acceder a ello desde la web, es posible establecer un enlace como:

```html
<a href="examplescheme://example/something">click here</a>
<a href="examplescheme://example/javascript://%250dalert(1)">click here</a>
```

Para encontrar el código que se ejecutará en la App, ve a la actividad llamada por el deeplink y busca la función 
onNewIntent
.

Aprende a llamar enlaces profundos sin usar páginas HTML.

# AIDL - Lenguaje de Definición de Interfaces de Android

El Lenguaje de Definición de Interfaces de Android (AIDL) está diseñado para facilitar la comunicación entre el cliente y el servicio en aplicaciones de Android a través de comunicación entre procesos (IPC). Dado que no se permite acceder directamente a la memoria de otro proceso en Android, AIDL simplifica el proceso al marshalling de objetos en un formato entendido por el sistema operativo, facilitando así la comunicación entre diferentes procesos.

# Conceptos Clave

Servicios Vinculados: Estos servicios utilizan AIDL para IPC, permitiendo que actividades o componentes se vinculen a un servicio, realicen solicitudes y reciban respuestas. El método onBind en la clase del servicio es crítico para iniciar la interacción, marcándolo como un área vital para la revisión de seguridad en busca de vulnerabilidades.

Messenger: Operando como un servicio vinculado, Messenger facilita IPC con un enfoque en el procesamiento de datos a través del método onBind. Es esencial inspeccionar este método de cerca en busca de cualquier manejo de datos inseguro o ejecución de funciones sensibles.

Binder: Aunque el uso directo de la clase Binder es menos común debido a la abstracción de AIDL, es beneficioso entender que Binder actúa como un controlador a nivel de núcleo que facilita la transferencia de datos entre los espacios de memoria de diferentes procesos. Para una comprensión más profunda, hay un recurso disponible en https://www.youtube.com/watch?v=O-UHvFjxwZ8.

# Componentes

Estos incluyen: Actividades, Servicios, Receptores de Difusión y Proveedores.

Actividad de Lanzamiento y otras actividades
En las aplicaciones de Android, las actividades son como pantallas, mostrando diferentes partes de la interfaz de usuario de la app. Una app puede tener muchas actividades, cada una presentando una pantalla única al usuario.

La actividad de lanzamiento es la puerta principal a una app, lanzada cuando tocas el ícono de la app. Se define en el archivo de manifiesto de la app con intenciones específicas MAIN y LAUNCHER:

```html
<activity android:name=".LauncherActivity">
<intent-filter>
<action android:name="android.intent.action.MAIN" />
<category android:name="android.intent.category.LAUNCHER" />
</intent-filter>
</activity>
```

No todas las aplicaciones necesitan una actividad de lanzamiento, especialmente aquellas sin una interfaz de usuario, como los servicios en segundo plano.

Las actividades pueden estar disponibles para otras aplicaciones o procesos marcándolas como "exportadas" en el manifiesto. Esta configuración permite que otras aplicaciones inicien esta actividad:

```html
<service android:name=".ExampleExportedService" android:exported="true"/>
```

Sin embargo, acceder a una actividad de otra aplicación no siempre es un riesgo de seguridad. La preocupación surge si se comparten datos sensibles de manera inapropiada, lo que podría llevar a filtraciones de información.

El ciclo de vida de una actividad comienza con el método onCreate, configurando la interfaz de usuario y preparando la actividad para la interacción con el usuario.

Subclase de Aplicación
En el desarrollo de Android, una aplicación tiene la opción de crear una subclase de la clase Application, aunque no es obligatorio. Cuando se define tal subclase, se convierte en la primera clase en ser instanciada dentro de la aplicación. El método 
attachBaseContext
, si se implementa en esta subclase, se ejecuta antes del método 
onCreate
. Esta configuración permite una inicialización temprana antes de que comience el resto de la aplicación.

```python
  public class MyApp extends Application {
  @Override
  protected void attachBaseContext(Context base) {
  super.attachBaseContext(base);
  // Initialization code here
  }

  @Override
  public void onCreate() {
  super.onCreate();
  // More initialization code
  }
  }
```

Servicios
Servicios son operativos en segundo plano capaces de ejecutar tareas sin una interfaz de usuario. Estas tareas pueden continuar ejecutándose incluso cuando los usuarios cambian a diferentes aplicaciones, lo que hace que los servicios sean cruciales para operaciones de larga duración.

Los servicios son versátiles; pueden iniciarse de varias maneras, siendo Intents el método principal para lanzarlos como punto de entrada de una aplicación. Una vez que un servicio se inicia utilizando el método startService, su método onStart entra en acción y sigue ejecutándose hasta que se llama explícitamente al método stopService. Alternativamente, si el papel de un servicio depende de una conexión de cliente activa, se utiliza el método bindService para vincular al cliente con el servicio, activando el método onBind para el paso de datos.

Una aplicación interesante de los servicios incluye la reproducción de música en segundo plano o la obtención de datos de red sin obstaculizar la interacción del usuario con una aplicación. Además, los servicios pueden hacerse accesibles a otros procesos en el mismo dispositivo a través de exportación. Este no es el comportamiento predeterminado y requiere una configuración explícita en el archivo Android Manifest:

```html
<service android:name=".ExampleExportedService" android:exported="true"/>
```

Broadcast Receivers
Broadcast receivers actúan como oyentes en un sistema de mensajería, permitiendo que múltiples aplicaciones respondan a los mismos mensajes del sistema. Una aplicación puede registrar un receptor de dos maneras principales: a través del Manifest de la aplicación o dinámicamente dentro del código de la aplicación mediante la API 
registerReceiver
. En el Manifest, las transmisiones se filtran con permisos, mientras que los receptores registrados dinámicamente también pueden especificar permisos al registrarse.

Los filtros de intención son cruciales en ambos métodos de registro, determinando qué transmisiones activan el receptor. Una vez que se envía una transmisión coincidente, se invoca el método 
onReceive
 del receptor, lo que permite que la aplicación reaccione en consecuencia, como ajustar el comportamiento en respuesta a una alerta de batería baja.

Las transmisiones pueden ser asíncronas, alcanzando todos los receptores sin orden, o sincrónicas, donde los receptores reciben la transmisión según las prioridades establecidas. Sin embargo, es importante tener en cuenta el riesgo de seguridad potencial, ya que cualquier aplicación puede priorizarse a sí misma para interceptar una transmisión.

Para entender la funcionalidad de un receptor, busque el método 
onReceive
 dentro de su clase. El código de este método puede manipular la Intent recibida, destacando la necesidad de validación de datos por parte de los receptores, especialmente en Broadcasts Ordenados, que pueden modificar o eliminar la Intent.

Content Provider
Content Providers son esenciales para compartir datos estructurados entre aplicaciones, enfatizando la importancia de implementar permisos para garantizar la seguridad de los datos. Permiten que las aplicaciones accedan a datos de diversas fuentes, incluidos bases de datos, sistemas de archivos o la web. Permisos específicos, como 
readPermission
 y 
writePermission
, son cruciales para controlar el acceso. Además, se puede otorgar acceso temporal a través de configuraciones de 
grantUriPermission
 en el manifest de la aplicación, aprovechando atributos como path, pathPrefix y pathPattern para un control de acceso detallado.

La validación de entrada es primordial para prevenir vulnerabilidades, como la inyección SQL. Los Content Providers admiten operaciones básicas: insert(), update(), delete(), y query(), facilitando la manipulación y el intercambio de datos entre aplicaciones.

FileProvider, un Content Provider especializado, se centra en compartir archivos de manera segura. Se define en el manifest de la aplicación con atributos específicos para controlar el acceso a carpetas, denotadas por android:exported y android:resource que apuntan a configuraciones de carpetas. Se aconseja precaución al compartir directorios para evitar exponer datos sensibles inadvertidamente.

Ejemplo de declaración de manifest para FileProvider:

```html
<provider android:name="androidx.core.content.FileProvider"
android:authorities="com.example.myapp.fileprovider"
android:grantUriPermissions="true"
android:exported="false">
<meta-data android:name="android.support.FILE_PROVIDER_PATHS"
android:resource="@xml/filepaths" />
</provider>
```

Y un ejemplo de especificar carpetas compartidas en filepaths.xml:

```html
<paths>
<files-path path="images/" name="myimages" />
</paths>
```

Para más información, consulta:

Android Developers: Content Providers

Android Developers: FileProvider

WebViews
WebViews son como mini navegadores web dentro de aplicaciones Android, extrayendo contenido ya sea de la web o de archivos locales. Enfrentan riesgos similares a los de los navegadores regulares, sin embargo, hay formas de reducir estos riesgos a través de configuraciones específicas.

Android ofrece dos tipos principales de WebView:

WebViewClient es excelente para HTML básico pero no soporta la función de alerta de JavaScript, afectando cómo se pueden probar los ataques XSS.

WebChromeClient actúa más como la experiencia completa del navegador Chrome.

Un punto clave es que los navegadores WebView no comparten cookies con el navegador principal del dispositivo.

Para cargar contenido, están disponibles métodos como loadUrl, loadData, y loadDataWithBaseURL. Es crucial asegurarse de que estas URLs o archivos sean seguros para usar. Las configuraciones de seguridad se pueden gestionar a través de la clase WebSettings. Por ejemplo, deshabilitar JavaScript con setJavaScriptEnabled(false) puede prevenir ataques XSS.

El "Bridge" de JavaScript permite que los objetos Java interactúen con JavaScript, requiriendo que los métodos estén marcados con @JavascriptInterface para seguridad desde Android 4.2 en adelante.

Permitir el acceso al contenido (setAllowContentAccess(true)) permite que los WebViews accedan a Content Providers, lo que podría ser un riesgo a menos que las URLs de contenido se verifiquen como seguras.

Para controlar el acceso a archivos:

Deshabilitar el acceso a archivos (setAllowFileAccess(false)) limita el acceso al sistema de archivos, con excepciones para ciertos activos, asegurando que solo se utilicen para contenido no sensible.

Otros Componentes de la Aplicación y Gestión de Dispositivos Móviles
Firma Digital de Aplicaciones
La firma digital es imprescindible para las aplicaciones Android, asegurando que sean auténticamente creadas antes de la instalación. Este proceso utiliza un certificado para la identificación de la aplicación y debe ser verificado por el administrador de paquetes del dispositivo al momento de la instalación. Las aplicaciones pueden ser autofirmadas o certificadas por una CA externa, protegiendo contra accesos no autorizados y asegurando que la aplicación permanezca sin alteraciones durante su entrega al dispositivo.

Verificación de Aplicaciones para Mayor Seguridad
A partir de Android 4.2, una función llamada Verificar Aplicaciones permite a los usuarios verificar la seguridad de las aplicaciones antes de la instalación. Este proceso de verificación puede advertir a los usuarios sobre aplicaciones potencialmente dañinas, o incluso prevenir la instalación de aquellas particularmente maliciosas, mejorando la seguridad del usuario.

Gestión de Dispositivos Móviles (MDM)
Las soluciones MDM proporcionan supervisión y seguridad para dispositivos móviles a través de la API de Administración de Dispositivos. Necesitan la instalación de una aplicación Android para gestionar y asegurar dispositivos móviles de manera efectiva. Las funciones clave incluyen hacer cumplir políticas de contraseñas, exigir cifrado de almacenamiento, y permitir el borrado remoto de datos, asegurando un control y seguridad completos sobre los dispositivos móviles.

```python
// Example of enforcing a password policy with MDM
DevicePolicyManager dpm = (DevicePolicyManager) getSystemService(Context.DEVICE_POLICY_SERVICE);
ComponentName adminComponent = new ComponentName(context, AdminReceiver.class);

if (dpm.isAdminActive(adminComponent)) {
// Set minimum password length
dpm.setPasswordMinimumLength(adminComponent, 8);
}
```