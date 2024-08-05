# import logging
import os.path
import os
from pathlib import Path

print('In docker : ', os.getenv('CORESETTINGS_IN_DOCKER'))

from split_settings.tools import include, optional

# from core.general.utils.pytest import is_pytest_running
# C:\Users\HP\Documents\ywnauttest\autland-test\backend\core\general\utils\collections.py
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
ENVVAR_SETTINGS_PREFIX = 'CORESETTINGS_'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

# Application definition
LOCAL_SETTINGS_PATH = os.getenv(f'{ENVVAR_SETTINGS_PREFIX}LOCAL_SETTINGS_PATH')
if not LOCAL_SETTINGS_PATH:
    LOCAL_SETTINGS_PATH = 'local/settings.dev.py'

if not os.path.isabs(LOCAL_SETTINGS_PATH):
    LOCAL_SETTINGS_PATH = str(BASE_DIR / LOCAL_SETTINGS_PATH)

# yapf: disable
include(
    'base.py',
    'custom.py',
    # 'logging.py',
    # 'rest_framework.py',
    # 'channels.py',
    optional(LOCAL_SETTINGS_PATH),
    'envvars.py',
    # 'post.py',
    'docker.py',
)
# yapf: enable

# logging.captureWarnings(True)

# if not is_pytest_running():
#     assert SECRET_KEY is not NotImplemented  # type: ignore # noqa: F821