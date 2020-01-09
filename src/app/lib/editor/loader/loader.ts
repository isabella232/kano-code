/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { ContributionManager } from '../../contribution.js';
import Editor from '../editor.js';

export interface IFileLoader {
    load(editor : Editor, content : string) : any;
}

export const FileLoaders = new ContributionManager<IFileLoader>();
