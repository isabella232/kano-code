/**
@group Kano Elements
@hero hero.svg

### Styling

The following custom properties and mixins are available for styling:

Custom property | Description | Default
----------------|-------------|----------
`--kano-pixel-editor-bitmap-container` | Mixin applied to the bitmap container | '{}'
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
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/av-icons.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/paper-input/paper-input.js';
import '@kano/kwc-icons/kwc-icons.js';
import '@kano/kwc-color-wheel/kwc-color-wheel.js';
import { AppEditorBehavior } from '../behaviors/kano-app-editor-behavior.js';
import '../inputs/kano-input-text/kano-input-text.js';
import '../inputs/kano-input-color/kano-input-color.js';
import '../kano-icons/parts.js';
import '../kano-icons/kc-ui.js';
import '../kano-code-shared-styles/kano-code-shared-styles.js';
import '../kano-style/themes/dark.js';
import '../kano-tooltip/kano-tooltip.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: html`
        <style include="kano-code-shared-styles">
            :host {
                display: flex;
flex-direction: column;
                background-color: #292f35;
                --part-theme: #00d9c7;
            }
            :host label {
                align-self: flex-start;
                display: inline-block;
                font-family: var(--font-body);
                font-size: 14px;
                font-weight: bold;
                text-align: left;
                text-transform: uppercase;
                color: rgba(255,255,255,0.5);
                margin-bottom: 19px;
            }
            iron-icon  {
                --iron-icon-height: 32px;
                --iron-icon-width: 32px;
                transition: fill 300ms;
            }
            .center-panel {
                display: flex;
flex-direction: row;
                flex: 1 1 auto;
            }
            .side-menu {
                display: flex;
flex-direction: column;
                border-right: 1px solid var(--kano-app-part-editor-border);
            }
            .side-menu button {
                @apply --kano-button;
                display: block;
                width: 56px;
                height: 56px;
                background-color: transparent;
                border-radius: 0;
                padding: 0;
            }
            .side-menu button iron-icon {
                fill: rgba(255,255,255,0.5);
            }
            .side-menu button:hover {
                background: #54595d;
            }
            .side-menu button.selected {
                background: #5b646b;
            }
            .side-menu button:hover iron-icon,
            .side-menu button.selected iron-icon {
                fill: #fff;
            }
            #palette {
                display: flex;
flex-direction: row;
                justify-content: space-between;
                width: 148px;
                text-align: left;
            }
            .bitmap-container {
                flex: 1 1 auto;
                display: flex;
flex-direction: column;
                justify-content: center;
                align-items: center;
                @apply --kano-pixel-editor-bitmap-container;
            }
            .bitmap-container iron-pages {
                display: flex;
flex-direction: row;
                justify-content: center;
                margin-top: -1px;
                margin-left: -1px;
            }
            .control-container {
                display: flex;
flex-direction: row;
                width: 268px;
                border-left: 1px solid var(--kano-app-part-editor-border);
            }
            .control-container label {
                margin: 34px 0 20px 1px;
            }
            .control-content {
                flex: 1 1 auto;
                display: flex;
flex-direction: row;
                height: 344px;
                padding: 0 28px;
            }
            .control-content>* {
                flex: 1 1 auto;
                display: flex;
flex-direction: column;
            }
            .control-content .custom-colour-header {
                display: flex;
flex-direction: row;
                align-items: center;
                justify-content: space-between;
                margin: 0 14px 20px 0;
            }
            .control-content .custom-colour-header button {
                @apply --kano-button;
                display: flex;
flex-direction: row;
                align-items: center;
                font-size: 14px;
                line-height: 18px;
                font-weight: bold;
                background-color: transparent;
                color: rgba(255,255,255,0.5);
                padding: 0;
                transition: background-color 300ms;
            }
            .control-content .custom-colour-header label {
                margin: 0 18px 0 1px;
            }
            .control-content .custom-colour-header button:not(:last-child) {
                margin-right: 14px;
            }
            .control-content .custom-colour-header iron-icon {
                --iron-icon-height: 16px;
                --iron-icon-width: 16px;
                margin-right: 4px;
            }
            .control-content .custom-colour-header button:hover {
                color: #fff;
            }
            .control-content .custom-colour-header button:hover iron-icon {
                fill: var(--part-theme);
            }
            .control-content kano-tooltip {
                z-index: 10;
                --kano-tooltip-border-color: var(--color-dark);
                --kano-tooltip-background-color: var(--color-dark);
                --kano-tooltip-caret: {
                    background: var(--color-dark);
                    @apply(--shadow-elevation-2dp);
                };
            }
            #default-palette,
            #custom-palette {
                --kano-input-color-size: 32px;
                --kano-input-color-margin: 0.5px;
                --kano-color-input-field: {
                    margin: 0;
                    padding: 2px;
                };
            }
            #default-palette {
                margin-bottom: 38px;
            }
            #custom-palette {
                height: 105px;
                width: 97%;
                overflow: auto;
                margin-bottom: 0;
            }
            .settings {
                display: flex;
flex-direction: column;
                flex: 1 1 auto;
            }
            button.add-frame iron-icon {
                --iron-icon-height: 18px;
                --iron-icon-width: 18px;
                fill: #999;
            }
            :host button.add-frame:hover iron-icon {
                fill: var(--color-kano-orange);
            }
            button.add-frame:disabled {
                opacity: 0.3;
            }
            kwc-color-wheel {
                --kwc-color-wheel-magn-border: 1px solid var(--color-dark);
            }
        </style>
        <div class="center-panel">
            <div class="side-menu">
                <iron-selector selected="[[penType]]" attr-for-selected="name">
                    <button id="draw-button" class="side-menu-button" on-tap="_penControlTapped" name="draw">
                        <iron-icon icon="kc-ui:paint-draw"></iron-icon>
                    </button>
                    <button id="fill-button" class="side-menu-button" on-tap="_penControlTapped" name="fill">
                        <iron-icon icon="kc-ui:paint-fill"></iron-icon>
                    </button>
                    <button id="erase-button" class="side-menu-button" on-tap="_penControlTapped" name="erase">
                        <iron-icon icon="kc-ui:paint-erase"></iron-icon>
                    </button>
                </iron-selector>
                <button id="settings-button" class="side-menu-button" on-tap="_settingsTapped">
                    <iron-icon icon="kc-ui:settings"></iron-icon>
                </button>
            </div>
            <div class="bitmap-container">
                <slot name="bitmap"></slot>
            </div>
            <div class="control-container">
                <iron-pages class="control-content" selected="[[controlPanel]]" attr-for-selected="name">
                    <div name="palette">
                        <label>Colors</label>
                        <kano-input-color id="default-palette" on-value-changed="_onColorChange" idle="[[customPaletteActive]]" row-size="6"></kano-input-color>
                        <div class="custom-colour-header">
                            <label>Custom</label>
                            <kano-tooltip id="tooltip" position="right" target="[[tooltipTarget]]" opened="{{wheelOpened}}" auto-close="">
                                <kwc-color-wheel id="wheel" on-value-changed="_addCustomColor" render-later=""></kwc-color-wheel>
                            </kano-tooltip>
                            <button id="custom-colour-add" type="button" on-tap="_openWheel">
                                <iron-icon class="add-icon" icon="kc-ui:add"></iron-icon>
                                <span>Add</span>
                            </button>
                        </div>
                        <kano-input-color id="custom-palette" on-value-changed="_onColorChange" idle="[[!customPaletteActive]]" row-size="6"></kano-input-color>
                    </div>
                    <div name="settings" class="settings">
                        <label>Settings</label>
                        <slot name="settings"></slot>
                    </div>
                </iron-pages>
            </div>
        </div>
`,

  is: 'kano-pixel-editor',

  behaviors: [
      AppEditorBehavior
  ],

  properties: {
      selected: {
          type: Object,
          notify: true
      },
      name: {
          type: String
      },
      penType: {
          type: String,
          computed: '_computePenType(_penType, _isShiftPressed)',
          notify: true
      },
      penColor: {
          type: String,
          observer: '_penColorChanged',
          notify: true
      },
      wheelOpened: {
          type: Boolean,
          observer: '_wheelStatusChanged'
      },
      controlPanel: {
          type: String,
          value: 'palette'
      },
      customPaletteActive: {
          type: Boolean,
          value: false
      },
      _isShiftPressed:{
          type: Boolean,
          value: false
      }
  },

  observers: [
      '_onControlPanelChanged(controlPanel, penType)'
  ],

  attached () {
      this.set('_penType', 'draw');
  },

  _addCustomColor (e) {
      this.$['custom-palette'].addColor(e.detail.value);
      this.$.tooltip.close();
      this.fire('tracking-event', {
          name: 'custom_color_added'
      });
  },

  _computePalette (colors) {
      this.debounce('palette', () => {
          let palette = colors.slice(0);
          palette.push(this.penColor);

          // Remove duplicates and color already in the default palette
          palette = palette.filter((elem, pos, self) => {
              return self.indexOf(elem) === pos && this.$['default-palette'].colors.indexOf(elem) === -1 &&
                      elem !== null && typeof elem !== 'undefined';
          });
          this.$['custom-palette'].set('colors', palette);
          this.$['default-palette'].set('value', '#ffffff');
      }, 16);
  },

  _computePenType (penType, shiftPressed) {
      return shiftPressed ? 'fill' : penType;
  },

  _penControlTapped (e) {
      if (this._isShiftPressed) {
          return;
      }
      const target = e.currentTarget ? e.currentTarget : e.composedPath()[0];
      let penType = target.getAttribute('name');
      this.controlPanel = 'palette';
      this.set('_penType', penType);
      this.fire('tracking-event', {
          name: `${penType}_tool_selected`
      });
  },

  _settingsTapped () {
      this.controlPanel = 'settings';
      this.fire('tracking-event', {
          name: 'pixel_editor_settings_opened'
      });
  },

  _onControlPanelChanged (panel, penType) {
      if (panel === 'palette' && this._isShiftPressed) {
          return;
      } else if (panel === 'palette') {
          this._highlightSideMenuButton(`${penType}-button`);
      } else {
          this._highlightSideMenuButton(`${panel}-button`);
      }
  },

  _highlightSideMenuButton (id) {
      dom(this.root).querySelectorAll('.side-menu-button').forEach((el) => {
          this.toggleClass('selected', el.id === id, el);
      }, this)
  },

  _openWheel (e) {
      const target = e.currentTarget ? e.currentTarget : e.composedPath()[0],
          viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
          editorWidth = this.offsetWidth;
      // if editor is full screen, open color wheel to left
      if (viewportWidth === editorWidth) {
          this.$.tooltip.position = 'left';
      }
      this._renderWheel();
      this.async(() => {
          this.$.tooltip.set('target', target.getBoundingClientRect());
          this.$.tooltip.open();
      });
      this.fire('tracking-event', {
          name: 'custom_color_wheel_opened'
      });
  },

  _renderWheel () {
      if (this._wheelRendered) {
          return;
      }
      this._wheelRendered = true;
      this.$.wheel.render();
  },

  _onColorChange (e) {
      if (e.detail.value) {
          this.customPaletteActive = dom(e).localTarget.id === 'custom-palette';
          this.penColor = e.detail.value;
      }
  },

  _penColorChanged (newValue, oldValue) {
      if (newValue && oldValue) {
          this.notifyChange('light-animation-color-changed', { value: newValue });
      }
  },

  _wheelStatusChanged (opened) {
      const event = opened ? 'light-animation-wheel-open' : 'light-animation-wheel-close';
      this.notifyChange(event);
  },

  getElementsRegistry () {
      return {
          'brush-button': this.$['draw-button'],
          'bucket-button': this.$['fill-button'],
          'colors': this.$['default-palette'].getColorField(),
          'add-color-button': this.$['add-color'],
          'color-wheel': this.$['wheel']
      }
  }
});