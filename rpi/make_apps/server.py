# server.py
#
# Copyright (C) 2016 Kano Computing Ltd.
# License: http://www.gnu.org/licenses/gpl-2.0.txt GNU GPL v2
#

from flask import Flask, request
import json
import os
import time
import logging

from kano.utils import ensure_dir
from kano.utils import play_sound
from kano.logging import logger


APP_NAME = 'make-apps'
DEFAULT_PORT = 8000
PARENT_PID = None

CHALLENGE_DIR = os.path.expanduser('~/Make-Apps-content')
STATIC_ASSET_DIR = os.path.join('/usr', 'share', 'make-apps')

ensure_dir(CHALLENGE_DIR)


def _get_static_dir():
    SCRIPT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

    # Use local asets when not installed in /usr
    if not SCRIPT_DIR.startswith('/usr'):
        print SCRIPT_DIR
        return os.path.join(SCRIPT_DIR, '../www')

    return STATIC_ASSET_DIR


def _get_image_from_str(img_str):
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

    filepath = os.path.join(CHALLENGE_DIR, '{}.draw'.format(filename))
    json_path = os.path.join(CHALLENGE_DIR, '{}.json'.format(filename))
    img_path = os.path.join(CHALLENGE_DIR, '{}.png'.format(filename))

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
    os.kill(PARENT_PID, signal.SIGINT)


@server.errorhandler(404)
def page_not_found(err):
    err_msg = 'Cannot find file {}'.format(request.path)

    return err_msg, 404


@server.route('/play_sound/<path:filename>', methods=['POST'])
def play_sounds(filename):
    print os.path.realpath(os.path.join(_get_static_dir(), filename))
    sound_file = os.path.realpath(os.path.join(_get_static_dir(), filename))
    play_sound(sound_file)

    return ''


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
