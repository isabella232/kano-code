# kano_content_utils.py
#
# Copyright (C) 2016 Kano Computing Ltd.
# License: http://www.gnu.org/licenses/gpl-2.0.txt GNU GPL v2
#
import os
import tarfile

from kano.logging import logger
from kano.utils.user import get_home
from kano.utils.file_operations import ensure_dir
from kano_content.api import ContentManager

K_CONTENT_EXTRACT_DIR = os.path.join(get_home(), '.make-apps-static')


def extract_tar_file(tar_file_path, destination_path):
    """ Extract a tar file from a given path to a destination path.
    On error logs the appropriate message using the kano logger
    :param tar_file_path: Path to tar file
    :type tar_file_path: str
    :param destination_path: Path where the contents of the tarfile will be put
    :type destination_path: str
    :returns: True on success or False otherwise
    :rtype: bool
    """
    try:
        with tarfile.open(tar_file_path) as tarball:
            tarball.extractall(path=destination_path)
        return True
    except (IOError, OSError) as exc_err:
        err_msg = ("Couldn't open file '{}', [{}]"
                   .format(tar_file_path, exc_err))
        logger.error(err_msg)
        return False
    except tarfile.ReadError as exc_err:
        err_msg = ("Error parsing tarfile '{}', [{}]"
                   .format(tar_file_path, exc_err))
        logger.error(err_msg)
        return False


def check_co_file_count(cobj):
    """ Check how many files are included within a content object
    """
    co_files = cobj.get_data('').get_content()
    if len(co_files) != 1:
        logger.warning(
            'Count of files other than 1 in co[{}], skipping'.format(
                cobj.get_data('').get_dir()
            )
        )
        return False
    return True


def _get_co_tar_file(cobj):
    """ Iterate over the files included in the content object and return the
    path to the first .tar.gz file
    :returns: absolute path to tar.gz file on success or None on failure
    :rtype: str or NoneType
    """
    co_files = cobj.get_data('').get_content()

    for co_file in co_files:
        if co_file.lower().endswith('.tar.gz'):
            return co_file
    return None


def latest_content_object_assets():
    """ Get a path to extracted assets of the most recent content object
    :returns: Absolute path to extracted co or None if there isn't one
    :rtype: str or NoneType
    """
    cman = ContentManager.from_local()

    dest_dir = None

    # Sort content objects most recent at the top
    co_list = sorted(
        cman.list_local_objects(spec='make-apps-assets'),
        key=lambda x: x.last_modified,
        reverse=True
    )

    for cobj in co_list:
        if not check_co_file_count(cobj):
            # Unexpected no of files
            continue

        filename_tar = _get_co_tar_file(cobj)
        dest_dir = os.path.join(K_CONTENT_EXTRACT_DIR, cobj.uid)
        if os.path.exists(dest_dir) and os.path.isdir(dest_dir):
            break
        elif os.path.exists(dest_dir) and not os.path.isdir(dest_dir):
            os.remove(dest_dir)

        ensure_dir(dest_dir)
        extract_success = extract_tar_file(filename_tar, dest_dir)
        if extract_success:
            break
        else:
            dest_dir = None

    return dest_dir
