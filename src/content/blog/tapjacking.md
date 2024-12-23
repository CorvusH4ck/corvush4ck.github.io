---
title: Tapjacking
date: 2024-11-24
category: ['pentest mobile', 'android']
tags: ['app']
summary: Tapjacking
---

# Información Básica
Tapjacking es un ataque donde una aplicación maliciosa se lanza y se posiciona encima de una aplicación víctima. Una vez que oscurece visiblemente la aplicación víctima, su interfaz de usuario está diseñada de tal manera que engaña al usuario para que interactúe con ella, mientras pasa la interacción a la aplicación víctima.
En efecto, está cegando al usuario para que no sepa que realmente está realizando acciones en la aplicación víctima.

## Detección
Para detectar aplicaciones vulnerables a este ataque, debes buscar actividades exportadas en el manifiesto de Android (ten en cuenta que una actividad con un intent-filter se exporta automáticamente por defecto). Una vez que hayas encontrado las actividades exportadas, verifica si requieren algún permiso. Esto se debe a que la aplicación maliciosa también necesitará ese permiso.

## Protección
Android 12 (API 31,32) y superior
Según esta fuente, los ataques de tapjacking son automáticamente prevenidos por Android desde Android 12 (API 31 y 30) y superior. Así que, incluso si la aplicación es vulnerable, no podrás explotarla.

filterTouchesWhenObscured
Si 
android:filterTouchesWhenObscured
 está configurado en 
true
, la View no recibirá toques siempre que la ventana de la vista esté oscurecida por otra ventana visible.

setFilterTouchesWhenObscured
El atributo 
setFilterTouchesWhenObscured
 configurado en true también puede prevenir la explotación de esta vulnerabilidad si la versión de Android es inferior.
Si se establece en 
true
, por ejemplo, un botón puede ser automáticamente deshabilitado si está oscurecido:

```html
<Button android:text="Button"
android:id="@+id/button1"
android:layout_width="wrap_content"
android:layout_height="wrap_content"
android:filterTouchesWhenObscured="true">
</Button>
```

# Explotación

## Tapjacking-ExportedActivity
La aplicación de Android más reciente que realiza un ataque de Tapjacking (+ invocando antes de una actividad exportada de la aplicación atacada) se puede encontrar en: https://github.com/carlospolop/Tapjacking-ExportedActivity.

Sigue las instrucciones del README para usarla.

## FloatingWindowApp
Un proyecto de ejemplo que implementa FloatingWindowApp, que se puede usar para superponerse a otras actividades para realizar un ataque de clickjacking, se puede encontrar en FloatingWindowApp (un poco antiguo, buena suerte construyendo el apk).

## Qark
Parece que este proyecto ahora no está mantenido y esta funcionalidad ya no funciona correctamente.

Puedes usar qark con los parámetros --exploit-apk --sdk-path /Users/username/Library/Android/sdk para crear una aplicación maliciosa para probar posibles vulnerabilidades de Tapjacking.\

La mitigación es relativamente simple, ya que el desarrollador puede optar por no recibir eventos táctiles cuando una vista está cubierta por otra. Usando la Referencia del Desarrollador de Android:

A veces es esencial que una aplicación pueda verificar que una acción se está realizando con el pleno conocimiento y consentimiento del usuario, como conceder una solicitud de permiso, realizar una compra o hacer clic en un anuncio. Desafortunadamente, una aplicación maliciosa podría intentar engañar al usuario para que realice estas acciones, sin que se dé cuenta, al ocultar el propósito previsto de la vista. Como remedio, el marco ofrece un mecanismo de filtrado de toques que se puede utilizar para mejorar la seguridad de las vistas que proporcionan acceso a funcionalidades sensibles.

Para habilitar el filtrado de toques, llama a setFilterTouchesWhenObscured(boolean) o establece el atributo de diseño android:filterTouchesWhenObscured en verdadero. Cuando está habilitado, el marco descartará los toques que se reciban siempre que la ventana de la vista esté oscurecida por otra ventana visible. Como resultado, la vista no recibirá toques siempre que un toast, diálogo u otra ventana aparezca sobre la ventana de la vista.