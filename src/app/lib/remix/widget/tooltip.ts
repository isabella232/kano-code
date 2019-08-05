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
