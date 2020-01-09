/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import '@kano/styles/typography.js'
import '@kano/styles/color.js'
import { circle } from '@kano/icons/ui.js';
import { DismissableTooltip } from '../../widget/dismissable-tooltip.js';


export class RemixTooltip extends DismissableTooltip {
    addStatusIcon() {
        const instance = circle.content.cloneNode(true);
        this.getTextNode().insertBefore(instance, this.getTextNode().firstChild);
    }
}
