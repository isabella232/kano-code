/*
### Styling

The following custom properties and mixins are available for styling:

Custom property | Description | Default
----------------|-------------|----------
`--kano-slider-handler-background` | Custom property applied to the handler | ''`
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '../kano-code-shared-styles/kano-code-shared-styles.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/* globals Polymer, Kano */

Polymer({
  _template: html`
        <style>
            :host {
                display: flex;
flex-direction: row;
                align-items: center;
            }
            input[type=range] {
                -webkit-appearance: none;
                width: 100%;
                /*We use padding so we can capture click events outside the bar*/
                padding: 5px 0;
                background: transparent;
                cursor: pointer;
            }
            input[type=range]:focus {
                outline: none;
            }
            input[type=range]::-webkit-slider-runnable-track {
                width: 100%;
                height: 5px;
                cursor: pointer;
                background: #292f35;
                border-radius: 6px;
            }
            input[type=range]::-webkit-slider-thumb {
                height: 16px;
                width: 12px;
                border: 2px solid #fff;
                border-radius: 500px;
                background: var(--kano-slider-handler-background, #ff6900);
                cursor: pointer;
                -webkit-appearance: none;
                margin-top: -6px;
            }
            input[type=range]:focus::-webkit-slider-runnable-track {
                background: #292f35;
            }
            input[type=range]:focus::-webkit-slider-thumb {
                border: none;
            }
            input[type=range]::-moz-range-track {
                width: 100%;
                height: 5px;
                cursor: pointer;
                background: #292f35;
                border-radius: 6px;
            }
            input[type=range]::-moz-range-thumb {
                height: 16px;
                width: 12px;
                border: 2px solid #fff;
                border-radius: 500px;
                background: var(--kano-slider-handler-background, #ff6900);
                cursor: pointer;
                -webkit-appearance: none;
                margin-top: -6px;
            }
            input[type=range]::-ms-track {
                width: 100%;
                height: 5px;
                cursor: pointer;
                background: #292f35;
                border-radius: 6px;
            }
            input[type=range]::-ms-fill-lower {
                width: 100%;
                height: 5px;
                cursor: pointer;
                background: #292f35;
                border-radius: 6px;
            }
            input[type=range]::-ms-fill-upper {
                width: 100%;
                height: 5px;
                cursor: pointer;
                background: #292f35;
                border-radius: 6px;
            }
            input[type=range]::-ms-thumb {
                height: 16px;
                width: 12px;
                border: 2px solid #fff;
                border-radius: 500px;
                background: var(--kano-slider-handler-background, #ff6900);
                cursor: pointer;
                -webkit-appearance: none;
                margin-top: -6px;
            }
            input[type=range]:focus::-ms-fill-lower {
                background: #292f35;
            }
            input[type=range]:focus::-ms-fill-upper {
                background: #292f35;
            }

        </style>
        <input type="range" min="[[min]]" max="[[max]]" value-as-number="{{value::input}}" id="fader" step="1" on-change="_handleChange">
`,

  is: 'kano-slider',

  properties: {
      value: {
          type: Number,
          notify: true
      },
      theme : {
        type: String,
        observer: '_onThemeChanged'
      }
  },

  _handleChange () {
      this.fire('slider-changed');
  },

  _onThemeChanged (theme) {
      this.updateStyles({
          '--kano-slider-handler-background': theme
      });
  }
});
