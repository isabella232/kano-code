/*
### Styling

The following custom properties and mixins are available for styling:

Custom property | Description | Default
----------------|-------------|----------
`--kano-pen-control`
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/iron-icon/iron-icon.js';
import '@kano/kwc-icons/kwc-icons.js';
import '@kano/kwc-color-wheel/kwc-color-wheel.js';
import { MediaQueryBehavior } from '../behaviors/kano-media-query-behavior.js';
import '../kano-media-query/kano-media-query.js';
import '../kano-tooltip/kano-tooltip.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <style>
            :host {
                display: block;
            }
            .pen-control {
                flex: 1 1 auto;
                margin-right: 16px;
                @apply --kano-pen-control;
            }
            :host([small-screen]) .pen-control {
                margin-right: 8px;
            }
            .palette {
                flex: 1 1 auto;
                display: flex;
flex-direction: column;
                align-items: flex-start;
            }
            .palette-content {
                display: flex;
flex-direction: column;
                flex-wrap: wrap;
                height: 150px;
            }
            :host([medium-screen]) .palette-content,
            :host([small-screen]) .palette-content {
                display: flex;
flex-direction: row;
                width: 216px;
                height: auto;
            }
            .palette-color, .pen-control button {
                width: 18px;
                height: 18px;
                cursor: pointer;
                border: 1px solid transparent;
                box-sizing: border-box;
                position: relative;
            }
            .palette-color {
                margin: 0 2px 4px;
            }
            .pen-control button {
                margin: 0 8px 8px 0;
            }
            :host([small-screen]) .palette-color {
                width: 18px;
                height: 18px;
            }
            :host([small-screen]) .pen-control button {
                width: 28px;
                height: 28px;
                margin-right: 4px;
                margin-bottom: 0;
            }
            .palette-color.selected {
                border-color: grey;
            }
            .palette-color.selected::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-size: 70% 70%;
                background-repeat: no-repeat;
                background-position: center;
                opacity: 0.7;
            }
            .palette-color.selected.fill::before {
                background-image: url(/assets/icons/bucket.svg);
            }
            .palette-color.selected.draw::before {
                background-image: url(/assets/icons/pencil.svg);
            }
            .add-color {
                display: flex;
flex-direction: column;
                align-items: center;
                justify-content: center;
                background: transparent;
                color: grey;
                font-size: 22px;
                font-family: monospace;
            }
            .add-color:focus {
                outline: none;
                color: var(--color-orange);
            }
            .pen-control button {
                @apply --kano-button;
                display: flex;
flex-direction: row;
                justify-content: center;
                width: 36px;
                height: 36px;
                border-radius: 3px;
                padding: 0;
                background-color: var(--color-chateau);
            }
            .pen-control button:hover iron-icon {
                fill: #fff;
            }
            .pen-control button iron-icon {
                --iron-icon-height: 15px;
                --iron-icon-width: 15px;
                fill: #999;
            }
            .pen-control iron-selector {
                display: flex;
flex-direction: column;
            }
            :host([medium-screen]) .pen-control iron-selector,
            :host([small-screen]) .pen-control iron-selector {
                display: flex;
flex-direction: row;
            }
            .pen-control button:focus {
                outline: none;
            }
            button.iron-selected {
                background-color: rgba(255, 255, 255, 0.4);
            }
            button.iron-selected iron-icon {
                fill: #fff;
            }
            :host label {
                display: inline-block;
                font-family: var(--font-body);
                font-size: 14px;
                font-weight: bold;
                color: rgba(255,255,255,0.5);
                margin-bottom: 24px;
                text-align: left;
            }
            kano-tooltip {
                --kano-tooltip-border-color: var(--color-dark);
                --kano-tooltip-background-color: var(--color-dark);
                --kano-tooltip-caret: {
                    @apply(--shadow-elevation-2dp);
                };
            }
            kwc-color-wheel {
                --kwc-color-wheel-magn-border: 1px solid var(--color-dark);
            }
        </style>
        <kano-media-query small-screen="{{smallScreen}}" medium-screen="{{mediumScreen}}" large-screen="{{largeScreen}}">
        </kano-media-query>
        <div class="pen-control">
            <label>Tools</label>
            <iron-selector selected="[[penType]]" attr-for-selected="name">
                <button id="brush-button" on-tap="_penControlTapped" name="draw">
                    <iron-icon icon="kano-icons:paint-brush"></iron-icon>
                </button>
                <button id="bucket-button" on-tap="_penControlTapped" name="fill">
                    <iron-icon icon="kano-icons:paint-bucket"></iron-icon>
                </button>
            </iron-selector>
        </div>
        <div class="palette">
            <label>Colors</label>
            <div class="palette-content" id="colors">
                <template is="dom-repeat" items="[[DEFAULT_PALETTE]]" as="color">
                    <div class\$="palette-color [[_computePaletteItemSelectedClass(color, penColor)]] [[penType]]" style\$="[[_computePaletteColor(color)]]" on-tap="_paletteItemTapped"></div>
                </template>
                <template is="dom-repeat" items="[[palette]]" as="color">
                    <div class\$="palette-color [[_computePaletteItemSelectedClass(color, penColor)]] [[penType]]" style\$="[[_computePaletteColor(color)]]" on-tap="_paletteItemTapped"></div>
                </template>
                <button id="add-color" class="palette-color add-color" on-tap="_openWheel">+</button>
            </div>
        </div>
        <kano-tooltip id="tooltip" class="tooltip" position="right" target="[[tooltipTarget]]" auto-close="" opened="{{wheelOpened}}">
            <kwc-color-wheel id="wheel" value="{{penColor}}" on-value-changed="_penColorChanged" render-later=""></kwc-color-wheel>
        </kano-tooltip>
`,

  is: 'kano-palette',
  behaviors: [MediaQueryBehavior],

  properties: {
      bitmaps: {
          type: Array,
          value: () => {
              return [['#000000']];
          }
      },
      penType: {
          type: String,
          computed: '_computePenType(_penType, _isShiftPressed)',
          notify: true,
      },
      penColor: {
          type: String,
          notify: true
      },
      wheelOpened: {
          type: Boolean,
          notify: true
      }
  },

  attached () {
      this._onKeyEvent = this._onKeyEvent.bind(this);
      document.addEventListener('keydown', this._onKeyEvent);
      document.addEventListener('keyup', this._onKeyEvent);
      this._penType = 'draw';
      this._isShiftPressed = false;
      this.previewButtonIconPaths = {
          stopped: 'M 10,4 l 16, 12, 0, 0, -16, 12, z',
          running: 'M 4,4 l 24, 0 0, 24, -24, 0, z'
      };
      this.previewState = 'stopped';
      this.DEFAULT_PALETTE = ['#ffffff', '#ce1124', '#fb823f', '#f7e548', '#44fb42', '#4397f9', '#f66af9',
                      '#8f35f7', '#000000', '#f85653', '#3ffde0'];
      this.penColor = this.DEFAULT_PALETTE[0];
      this.previewIndex = 0;
  },

  detached () {
      document.removeEventListener('keydown', this._onKeyEvent);
      document.removeEventListener('keyup', this._onKeyEvent);
  },

  getElementsRegistry () {
      return {
          'brush-button': this.$['brush-button'],
          'bucket-button': this.$['bucket-button'],
          'colors': this.$['colors'],
          'add-color-button': this.$['add-color'],
          'color-wheel': this.$['wheel']
      }
  },

  _computePenType (penType, shiftPressed) {
      return shiftPressed ? 'fill' : penType;
  },

  _onKeyEvent (e) {
      this.set('_isShiftPressed', e.shiftKey);
  },

  _penControlTapped (e) {
      let target = e.currentTarget;
      this.set('_penType', target.getAttribute('name'));
  },

  _penColorChanged () {
      this._computePalette();
      this._closeWheel();
  },

  _openWheel () {
      /* The hashed element library (this.$['add-color']) is not getting the most up-to-date clientRect value. Target is temporarly set to null to make sure that path is notified. */
      let target = this.$$('#add-color');
      this.$.tooltip.set('target', null);
      this._renderWheel();
      this.async(() => {
          this.$.tooltip.set('target', target);
          this.$.tooltip.open();
      });
  },

  _renderWheel () {
      if (this._wheelRendered) {
          return;
      }
      this._wheelRendered = true;
      this.$.wheel.render();
  },

  _paletteItemTapped (e) {
      let color = e.model.get('color');
      this.set('penColor', color);
  },

  _closeWheel () {
      this.$.tooltip.close();
  },

  _computePaletteColor (color) {
      return `background: ${color}`;
  },

  _computePalette () {
      this.debounce('palette', () => {
          let palette = this.bitmaps.reduce((acc, bitmap) => {
              return acc.concat(bitmap);
          }, []);

          palette.push(this.penColor);
          
          // Remove duplicates and color already in the default palette. Limit to 18 custom colors
          palette = palette.filter((elem, pos, self) => {
              return self.indexOf(elem) === pos && this.DEFAULT_PALETTE.indexOf(elem) === -1 &&
                      elem !== null && typeof elem !== 'undefined';
          }).splice(-6, 6);

          this.set('palette', palette);
          if (!this.penColor) {
              this.set('penColor', this.palette[0]);
          }
      }, 16);
  },

  _computePaletteItemSelectedClass (color, penColor, penType) {
      return color === penColor ? 'selected' : '';
  }
});