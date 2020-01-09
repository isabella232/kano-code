/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { MonacoSourceEditor } from '../dist/app/lib/source-editor/monaco.js';
import { registerSourceEditor } from '../dist/app/lib/source-editor/source-editor.js';

registerSourceEditor('monaco', MonacoSourceEditor);
