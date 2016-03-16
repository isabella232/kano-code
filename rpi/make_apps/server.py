# server.py
#
# Copyright (C) 2016 Kano Computing Ltd.
# License: http://www.gnu.org/licenses/gpl-2.0.txt GNU GPL v2
#

from flask import Flask, request, jsonify
import json
from os import kill
from os.path import abspath, dirname, expanduser, join, realpath
import time
import logging

from kano.utils import ensure_dir, play_sound, run_cmd_bg
from kano.logging import logger

from .kano_content_utils import latest_content_object_assets


APP_NAME = 'make-apps'
DEFAULT_PORT = 8000
PARENT_PID = None

CHALLENGE_DIR = expanduser('~/Make-Apps-content')
STATIC_ASSET_DIR = join('/usr', 'share', 'make-apps')

ensure_dir(CHALLENGE_DIR)


def _get_static_dir():
    """ Returns the path to the static assets. To be used by setting up Flask.
    If the app runs form the standard installation dir
    (/usr/lib/python2.7/dist-packages/make_apps/) it will use either
    STATIC_ASSET_DIR or the dir to the extracted kano content provided assets
    Otherwise, if the app is run from an rsynced or a local version of the
    source it will use the local copy of the assets
    :returns: Absolute path to the static dir
    :rtype: str
    """
    script_dir = abspath(join(dirname(__file__), '..'))

    # Use local asets when not installed in /usr
    if not script_dir.startswith('/usr'):
        print script_dir
        return abspath(join(script_dir, '..', 'www'))

    cobj_static_path = latest_content_object_assets()

    if cobj_static_path is None:
        return STATIC_ASSET_DIR
    else:
        return cobj_static_path


def _get_image_from_str(img_str):
    """ Decode a base-64 encoded string. Possibly containing image data
    """
    import base64

    image_b64 = img_str.split(',')[-1]
    image_data = base64.b64decode(image_b64)

    return image_data


def _save(data):
    filename = data['filename']
    try:
        desc = data['description']
    except KeyError:
        desc = ''
    code = data['code']
    image = _get_image_from_str(data['image'])

    filepath = join(CHALLENGE_DIR, '{}.draw'.format(filename))
    json_path = join(CHALLENGE_DIR, '{}.json'.format(filename))
    img_path = join(CHALLENGE_DIR, '{}.png'.format(filename))

    with open(filepath, 'w') as f:
        f.write(code)

    with open(json_path, 'w') as f:
        f.write(
            json.dumps({
                'filename': filename,
                'description': desc
            })
        )

    with open(img_path, 'wb') as f:
        f.write(image)

    return (filename, filepath)


server = Flask(APP_NAME, static_folder=_get_static_dir(), static_url_path='/')
server_logger = logging.getLogger('werkzeug')
server_logger.setLevel(logging.ERROR)


@server.route('/')
# Redirect a localLoad back to index for routing in Angular
@server.route('/localLoad/<path:path>')
def root(path=None):
    return server.send_static_file('index.html')


@server.route('/<path:path>')
def static_proxy(path):
    # send_static_file will guess the correct MIME type
    return server.send_static_file(path)


@server.route('/shutdown', methods=['POST'])
def _shutdown():
    import signal

    try:
        server_shutdown = request.environ.get('werkzeug.server.shutdown')
        if server_shutdown is not None:
            logger.info('Will attempt to shutdown the server')
            server_shutdown()
    except Exception as exc:
        logger.error(
            'Error while trying to shut down the server: [{}]'.format(exc)
        )

    # Send signal to parent to initiate shutdown
    kill(PARENT_PID, signal.SIGINT)


@server.errorhandler(404)
def page_not_found(err):
    err_msg = 'Cannot find file {}'.format(request.path)

    return err_msg, 404


@server.route('/play_sound/<path:filename>', methods=['POST'])
def play_sounds(filename):
    print realpath(join(_get_static_dir(), filename))
    sound_file = realpath(join(_get_static_dir(), filename))
    play_sound(sound_file)

    return ''


def _error(msg):
    return jsonify(status='error', message=msg), 400


@server.route('/speak', methods=['POST'])
def speak():
    if not request.json:
        return _error('No payload received')

    req = request.json

    if not req.get('text'):
        return _error('Text is mandatory')

    opts = []

    if 'pitch' in req:
        if req['pitch'] >= 0 and req['pitch'] <= 2:
            p = int(req['pitch'] * 50)
            if p >= 100:
                p = 99

            opts += "-p {}".format(p)
        else:
            return _error('Pitch must be a float between 0 and 2 (default 1)')

    if 'rate' in req:
        if req['rate'] >= 0 and req['rate'] <= 10:
            r = int(req['rate'] * 160)
            opts += "-p {}".format(r)
        else:
            return _error('Rate must be a float between 0 and 10 (default 1)')

    supported_languages = {
        "en-GB": "english_rp",
        "en-US": "english-us",
        "fr-FR": "french",
        "de-DE": "german",
        "it-IT": "italian"
    }
    if 'language' in req:
        if req['language'] in supported_languages:
            opts += "-v {}".format(supported_languages[req['language']])
        else:
            return _error('Unknown language')

    cmd = "espeak {} \"{}\"".format(" ".join(opts), req['text'])
    run_cmd_bg(cmd)

    return jsonify(status='ok'), 200


def start(parent_pid=None):
    """
    The server process will receive any requests to shutdown but
    the app that runs this as a daemon will be unaware of this
    request so store the PID of the parent.
    """
    global PARENT_PID
    PARENT_PID = parent_pid

    # Run the server
    try:
        server.run(port=DEFAULT_PORT)
    except EnvironmentError as exc:
        if exc.errno == 98:
            msg = "Another server is running at port {}".format(DEFAULT_PORT)
            logger.error(msg)
            _shutdown()
    time.sleep(2)
