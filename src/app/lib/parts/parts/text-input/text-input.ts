import { DOMPart } from '../dom/dom.js';
import { part, property, component } from '../../decorators.js';
import { PartComponent } from '../../component.js';
import { EventEmitter, subscribeDOM } from '@kano/common/index.js';
import { transformLegacyTextInput } from './legacy.js';

class TextInputComponent extends PartComponent {
    @property({ type: String, value: '' })
    public value : string = '';

    @property({ type: String, value: '' })
    public placeholder : string = '';

    @property({ type: EventEmitter, value: new EventEmitter(), noReset: true })
    public change : EventEmitter = new EventEmitter();
}

@part('text-input')
export class TextInputPart extends DOMPart<HTMLInputElement> {
    @component(TextInputComponent)
    public core : TextInputComponent;
    static transformLegacy(app : any) {
        transformLegacyTextInput(app);
    }
    constructor() {
        super();
        this.core = this._components.get('core') as TextInputComponent;
        subscribeDOM(this._el, 'input', () => {
            if (!this.core) {
                return;
            }
            this.core.change.fire();
        }, this, this.subscriptions);
        this.core.invalidate();
    }
    getElement() : HTMLInputElement {
        const el = document.createElement('input');
        el.title = 'text-input';
        return el;
    }
    render() {
        super.render();
        if (!this.core.invalidated) {
            return;
        }
        this._el.value = this.core.value;
        this._el.placeholder = this.core.placeholder;
        this.core.apply();
    }
    get value() {
        return this.core.value;
    }
    set value(v : string) {
        this.core.value = v;
        this.core.invalidate();
    }
    get placeholder() {
        return this.core.placeholder;
    }
    set placeholder(p : string) {
        this.core.placeholder = p;
        this.core.invalidate();
    }
    onChange(callback : () => void) {
        this.core.change.event(callback, null, this.userSubscriptions);
    }
}
