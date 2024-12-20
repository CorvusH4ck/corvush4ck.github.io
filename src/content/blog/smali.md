---
title: Smali - Descompilar/[Modificar]/Compilar
date: 2024-11-28
category: ['pentest mobile', 'android']
tags: []
summary: Smali - Descompilar/[Modificar]/Compilar
---

A veces es interesante modificar el código de la aplicación para acceder a información oculta para ti (quizás contraseñas o flags bien ofuscadas). Entonces, podría ser interesante descompilar el apk, modificar el código y recompilarlo.

Opcodes reference: http://pallergabor.uw.hu/androidblog/dalvik_opcodes.html

Fast Way
Usando Visual Studio Code y la extensión APKLab, puedes descompilar automáticamente, modificar, recompilar, firmar e instalar la aplicación sin ejecutar ningún comando.

Otro script que facilita mucho esta tarea es https://github.com/ax/apk.sh

Decompile the APK
Usando APKTool puedes acceder al código smali y recursos:

```bash
apktool d APP.apk
```

Si apktool te da algún error, intenta instalar la última versión

Algunos archivos interesantes que deberías revisar son:

res/values/strings.xml (y todos los xml dentro de res/values/*)

AndroidManifest.xml

Cualquier archivo con extensión .sqlite o .db

Si apktool tiene problemas decodificando la aplicación, echa un vistazo a https://ibotpeaches.github.io/Apktool/documentation/#framework-files o intenta usar el argumento 
-r
 (No decodificar recursos). Entonces, si el problema estaba en un recurso y no en el código fuente, no tendrás el problema (tampoco descompilarás los recursos).

Cambiar código smali
Puedes cambiar instrucciones, cambiar el valor de algunas variables o agregar nuevas instrucciones. Yo cambio el código Smali usando VS Code, luego instalas la extensión smalise y el editor te dirá si alguna instrucción es incorrecta.
Algunos ejemplos se pueden encontrar aquí:

Ejemplos de cambios Smali

Google CTF 2018 - Shall We Play a Game?

O puedes revisar a continuación algunos cambios Smali explicados.

Recompilar el APK
Después de modificar el código, puedes recompilar el código usando:

```bash
apktool b . #In the folder generated when you decompiled the application
```

Compilará el nuevo APK dentro de la carpeta dist.

Si apktool lanza un error, intenta instalar la última versión

Firmar el nuevo APK
Luego, necesitas generar una clave (se te pedirá una contraseña y algo de información que puedes llenar aleatoriamente):

```bash
keytool -genkey -v -keystore key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias <your-alias>
```

Finalmente, firma el nuevo APK:

```bash
jarsigner -keystore key.jks path/to/dist/* <your-alias>
```

Optimizar nueva aplicación
zipalign es una herramienta de alineación de archivos que proporciona una optimización importante a los archivos de aplicación de Android (APK). Más información aquí.

```bash
zipalign [-f] [-v] <alignment> infile.apk outfile.apk
zipalign -v 4 infile.apk
```

Firma el nuevo APK (¿de nuevo?)
Si prefieres usar apksigner en lugar de jarsigner, debes firmar el apk después de aplicar la optimización con zipalign. PERO TEN EN CUENTA QUE SOLO TIENES QUE FIRMAR LA APLICACIÓN UNA VEZ CON jarsigner (antes de zipalign) O CON apksigner (después de zipalign).

```bash
apksigner sign --ks key.jks ./dist/mycompiled.apk
```

Modificando Smali
Para el siguiente código Java Hello World:

```bash
public static void printHelloWorld() {
System.out.println("Hello World")
}
```

El código Smali sería:

```bash
.method public static printHelloWorld()V
.registers 2
sget-object v0, Ljava/lang/System;->out:Ljava/io/PrintStream;
const-string v1, "Hello World"
invoke-virtual {v0,v1}, Ljava/io/PrintStream;->println(Ljava/lang/String;)V
return-void
.end method
```

El conjunto de instrucciones Smali está disponible aquí.

Cambios ligeros
Modificar valores iniciales de una variable dentro de una función
Algunas variables se definen al principio de la función utilizando el opcode const, puedes modificar sus valores, o puedes definir nuevos:

```bash
#Number
const v9, 0xf4240
const/4 v8, 0x1
#Strings
const-string v5, "wins"
```

Operaciones Básicas

```bash
#Math
add-int/lit8 v0, v2, 0x1 #v2 + 0x1 and save it in v0
mul-int v0,v2,0x2 #v2*0x2 and save in v0

#Move the value of one object into another
move v1,v2

#Condtions
if-ge #Greater or equals
if-le #Less or equals
if-eq #Equals

#Get/Save attributes of an object
iget v0, p0, Lcom/google/ctf/shallweplayagame/GameActivity;->o:I #Save this.o inside v0
iput v0, p0, Lcom/google/ctf/shallweplayagame/GameActivity;->o:I #Save v0 inside this.o

#goto
:goto_6 #Declare this where you want to start a loop
if-ne v0, v9, :goto_6 #If not equals, go to: :goto_6
goto :goto_6 #Always go to: :goto_6
```

Cambios Más Grandes
Registro

```bash
#Log win: <number>
iget v5, p0, Lcom/google/ctf/shallweplayagame/GameActivity;->o:I #Get this.o inside v5
invoke-static {v5}, Ljava/lang/String;->valueOf(I)Ljava/lang/String; #Transform number to String
move-result-object v1 #Move to v1
const-string v5, "wins" #Save "win" inside v5
invoke-static {v5, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I #Logging "Wins: <num>"
```

Recomendaciones:

Si vas a usar variables declaradas dentro de la función (declaradas v0,v1,v2...) coloca estas líneas entre el .local <número> y las declaraciones de las variables (const v0, 0x1)

Si quieres poner el código de registro en medio del código de una función:

Agrega 2 al número de variables declaradas: Ej: de .locals 10 a .locals 12

Las nuevas variables deben ser los siguientes números de las variables ya declaradas (en este ejemplo deberían ser v10 y v11, recuerda que comienza en v0).

Cambia el código de la función de registro y usa v10 y v11 en lugar de v5 y v1.

Toasting
Recuerda agregar 3 al número de .locals al principio de la función.

Este código está preparado para ser insertado en el medio de una función (cambia el número de las variables según sea necesario). Tomará el valor de this.o, lo transformará a String y luego hará un toast con su valor.

```bash
const/4 v10, 0x1
const/4 v11, 0x1
const/4 v12, 0x1
iget v10, p0, Lcom/google/ctf/shallweplayagame/GameActivity;->o:I
invoke-static {v10}, Ljava/lang/String;->valueOf(I)Ljava/lang/String;
move-result-object v11
invoke-static {p0, v11, v12}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;
move-result-object v12
invoke-virtual {v12}, Landroid/widget/Toast;->show()V
```