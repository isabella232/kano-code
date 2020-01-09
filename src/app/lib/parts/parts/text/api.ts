/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { IPartAPI } from '../../api.js';
import { TextPart } from './text.js';
import { text } from '@kano/icons/parts.js';
import { TransformAPI, onTransformInstall } from '../transform/api.js';
import { Editor } from '../../../index.js';
import { _ } from '../../../i18n/index.js';

export const TexAPI : IPartAPI = {
    type: TextPart.type,
    label: _('PART_TEXT_LABEL', 'Text'),
    color: '#00c7b6',
    icon: text,
    symbols: [{
        type: 'variable',
        name: 'value',
        verbose: _('PART_TEXT_VALUE', 'value'),
        setter: true,
        returnType: String,
        default: 'Text',
    }, {
        type: 'variable',
        name: 'color',
        verbose: _('PART_TEXT_COLOR', 'color'),
        setter: true,
        getter: false,
        returnType: 'Color',
        default: '#000000',
    }, {
        type: 'variable',
        name: 'font',
        verbose: _('PART_TEXT_FONT', 'font'),
        setter: true,
        getter: false,
        returnType: 'Enum',
        enum: [
            [
                _('PART_TEXT_Bariol', 'Bariol'),
                'bariol',
            ],
            [
                _('PART_TEXT_ARIAL', 'Arial'),
                'arial',
            ],
            [
                _('PART_TEXT_TIMES', 'Times'),
                'times',
            ],
            [
                _('PART_TEXT_HELVETICA', 'Helvetica'),
                'helvetica',
            ],
            [
                _('PART_TEXT_VERDANA', 'Verdana'),
                'verdana',
            ],
            [
                _('PART_TEXT_OPTIMA', 'Optima'),
                'optima',
            ],
            [
                _('PART_TEXT_CAMBRIA', 'Cambria'),
                'cambria',
            ],
            [
                _('PART_TEXT_GARAMOND', 'Garamond'),
                'garamond',
            ],
            [
                _('PART_TEXT_MONACO', 'Monaco'),
                'monaco',
            ],
            [
                _('PART_TEXT_DIDOT', 'Didot'),
                'didot',
            ],
            [
                _('PART_TEXT_BRUSH', 'Brush Script MT'),
                'brush script mt',
            ],
        ]
    }, ...TransformAPI],
    onInstall(editor : Editor, part : TextPart) {
        onTransformInstall(editor, part);
    },
}