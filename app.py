"""
Web application
"""
import json
import os
import re
from urllib.parse import parse_qs

from beaker.middleware import SessionMiddleware

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VALID_LANGS = ['ES', 'EN', 'PT']

content_types = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
}

def load_perfiles():
    """ Load profiles from the index file."""
    index_path = os.path.join(BASE_DIR, 'datos', 'index.json')
    try:
        with open(index_path, 'r', encoding='utf-8') as f:
            content = f.read()
            match = re.search(r'(?:const\s+\w+\s*=\s*)(\[[\s\S]*\])', content)
            if match:
                return json.loads(match.group(1))
            return json.loads(content)
    except Exception:
        return []

def load_perfil(ci):
    """ Load profile for the given CI."""
    perfil_path = os.path.join(BASE_DIR, ci, 'perfil.json')
    with open(perfil_path, 'r', encoding='utf-8') as f:
        content = f.read()
        if '=' in content:
            json_str = content.split('=', 1)[1].strip()
        else:
            json_str = content.strip()
        if json_str.endswith(';'):
            json_str = json_str[:-1]
        return json.loads(json_str)

def render_perfil_html(perfil, config):
    """ Generate HTML for the profile page using data from JSON."""
    if not perfil:
        return b'<html><body><h1>Perfil no encontrado</h1></body></html>'

    ci = perfil.get('ci', '')
    name = perfil.get('nombre', '')
    desc = perfil.get('descripcion', '')
    color = perfil.get('color', '')
    email = perfil.get('email', '')

    libros = perfil.get('libro', [])
    if isinstance(libros, list):
        libros = ', '.join(libros)

    musica = perfil.get('musica', [])
    if isinstance(musica, list):
        musica = ', '.join(musica)

    video_juegos = perfil.get('video_juego', [])
    if isinstance(video_juegos, list):
        video_juegos = ', '.join(video_juegos)

    lenguajes = perfil.get('lenguajes', [])
    if isinstance(lenguajes, list):
        lenguajes = ', '.join(lenguajes)

    email_text = config.get('email', '').replace(' [email]', '').replace('[email]', '').strip()

    html = f'''<!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="icon" href="https://campusvirtualucv.org/ead/pluginfile.php/1116432/mod_resource/content/2/favicon.ico" />
            <title>{name}</title>
            <link rel="stylesheet" href="./css/style.css" />
        </head>
        <body class="card-profile">
            <div class="photo">
                <img id="profile-photo" src="{ci}/{ci}.jpg" alt="Foto de {name}" />
            </div>
            <div class="content">
                <div>
                    <h2 id="profile-name" class="name">{name}</h2>
                    <p id="profile-desc" class="desc">{desc}</p>
                </div>
                <div class="container-list">
                    <div class="list">
                        <span>{config.get('color', 'Color')}:</span>
                        <span>{color}</span>
                    </div>
                    <div class="list">
                        <span>{config.get('libro', 'Libro')}:</span>
                        <span>{libros}</span>
                    </div>
                    <div class="list">
                        <span>{config.get('musica', 'Música')}:</span>
                        <span>{musica}</span>
                    </div>
                    <div class="list">
                        <span>{config.get('video_juego', 'Video juegos')}:</span>
                        <span>{video_juegos}</span>
                    </div>
                    <div class="list">
                        <span>{config.get('lenguajes', 'Lenguajes')}:</span>
                        <span>{lenguajes}</span>
                    </div>
                </div>
                <p>
                    <span>{email_text}</span>
                    <a id="profile-email" class="email" href="mailto:{email}">{email}</a>
                </p>
            </div>
        </body>
        </html>
    '''
    return html.encode('utf-8')

def load_config(lang):
    """ Load configuration for the given language."""
    config_path = os.path.join(BASE_DIR, 'conf', f'config{lang}.json')
    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            content = f.read()
            pattern = r'(?:const\s+\w+\s*=\s*)(\{[\s\S]*\})'
            match = re.search(pattern, content)
            return json.loads(match.group(1) if match else content)
    except Exception:
        return {}

def static_file(filepath, start_response):
    """ Serve static files."""
    ext = os.path.splitext(filepath)[1].lower()
    content_type = content_types.get(ext, 'application/octet-stream')
    try:
        with open(filepath, 'rb') as f:
            content = f.read()
        start_response('200 OK', [('Content-Type', content_type)])
        return [content]
    except FileNotFoundError:
        start_response('404 Not Found', [('Content-Type', 'text/plain')])
        return [b'File Not Found']

def get_valid_lang(lang):
    """ Validate language."""
    return lang.upper() in VALID_LANGS and lang.upper() or 'ES'

def app(environ, start_response):
    """ Main application function."""
    path = environ.get('PATH_INFO', '/')
    method = environ.get('REQUEST_METHOD', 'GET')
    query_string = environ.get('QUERY_STRING', '')
    params = parse_qs(query_string)

    session = environ.get('beaker.session')

    if path in ['/', '/index.py', '/ATI/index.py'] and method == 'GET':
        index_path = os.path.join(BASE_DIR, 'index.html')
        return static_file(index_path, start_response)

    session_lang = session.get('lang') if session else None
    lang_param = params.get('lang', [None])[0]
    if lang_param:
        lang = get_valid_lang(lang_param)
    elif session_lang:
        lang = get_valid_lang(session_lang)
    else:
        lang = 'ES'

    if session:
        session['lang'] = lang
        session.save()

    if path in ['/perfil.py', '/ATI/perfil.py'] and method == 'GET':
        ci = params.get('ci', [None])[0]
        config = load_config(lang)
        perfil = load_perfil(ci) if ci else None

        html_content = render_perfil_html(perfil, config)

        headers = [
            ('Content-Type', 'text/html; charset=utf-8'),
            ('Set-Cookie', f'lang={lang}; Path=/; SameSite=Lax'),
        ]
        start_response('200 OK', headers)
        return [html_content]

    if path == '/api' and method == 'GET':
        ci = params.get('ci', [None])[0]

        config = load_config(lang)

        response_data = {
            'lang': lang,
            'config': config
        }

        if ci:
            perfil = load_perfil(ci)
            response_data['perfil'] = perfil
        else:
            perfiles = load_perfiles()
            response_data['perfiles'] = perfiles

        response_body = json.dumps(response_data, ensure_ascii=False).encode('utf-8')

        headers = [
            ('Content-Type', 'application/json; charset=utf-8'),
            ('Set-Cookie', f'lang={lang}; Path=/; SameSite=Lax'),
            ('Access-Control-Allow-Origin', '*'),
            ('Access-Control-Allow-Credentials', 'true')
        ]

        start_response('200 OK', headers)
        return [response_body]

    static_path = path.lstrip('/')
    if static_path.startswith('ATI/'):
        static_path = static_path[4:]

    filepath = os.path.join(BASE_DIR, static_path)
    if os.path.isfile(filepath):
        return static_file(filepath, start_response)

    start_response('404 Not Found', [('Content-Type', 'text/plain')])
    return [b'Not Found']


session_opts = {
    'session.type': 'file',
    'session.cookie_expires': True,
    'session.data_dir': '/tmp/sessions',
    'session.auto': True
}

application = SessionMiddleware(app, session_opts)
