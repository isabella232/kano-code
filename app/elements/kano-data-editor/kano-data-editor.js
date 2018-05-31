import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/paper-spinner/paper-spinner-lite.js';
import '@polymer/marked-element/marked-element.js';
import { AppEditorBehavior } from '../behaviors/kano-app-editor-behavior.js';
import '../inputs/kano-input/kano-input.js';
import '../inputs/kano-input-text/kano-input-text.js';
import '../kano-part-editor-topbar/kano-part-editor-topbar.js';
import '../kano-part-editor-topbar/kano-part-editor-topbar.js';
import '../kano-data-display/kano-data-display.js';
import '../kano-code-shared-styles/kano-code-shared-styles.js';
import './kano-what-is-json.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/* globals Polymer, Kano */
Polymer({
  _template: html`
        <style include="kano-code-shared-styles">
            :host {
                display: block;
                overflow: hidden;
            }
            .content {
                box-sizing: border-box;
                max-height: var(--kano-part-editor-content-height);
                padding: var(--kano-part-editor-padding);
                overflow: auto;
            }
            :host .config {
                @apply --layout-vertical;
                @apply --layout-flex-auto;
            }
            :host .line {
                @apply --layout-vertical;
                margin-bottom: var(--kano-part-editor-input-margin);
                text-align: left;
            }
            kano-input,
            kano-input-text {
                margin-bottom: var(--kano-part-editor-input-margin);
            }
            #refresh-toggle paper-toggle-button {
                --paper-toggle-button-label-color: #fff;
            }
            :host .refresh-button {
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --layout-center-justified;
                @apply --kano-icon-button;
                margin: 16px 8px 16px 0px;
                padding: 0;
                transition: transform ease-out 400ms;
            }
            :host .refresh-button iron-image {
                width: 18px;
                height: 18px;
            }
            :host .refresh-button:hover {
                transform: rotate(-45deg);
            }
            :host([loading]) kano-data-display {
                opacity: 0.2;
            }
            paper-spinner-lite {
                position: absolute;
                top: 164px;
                left: 50%;
                --paper-spinner-color: #fff;
            }
            #refresh-frequency paper-dropdown-menu {
                @apply --layout-vertical;
                border-radius: 3px;
                background: var(--color-abbey);

                --paper-dropdown-menu-ripple: {
                    display: none;
                };

                --paper-menu-button-content: {
                    background-color: transparent;
                };

                --paper-dropdown-menu-button: {
                    color: #fff;
                };
                --paper-input-container-input: {
                    color: #fff;
                    font-family: var(--font-body);
                    font-weight: bold;
                    font-size: 14px;
                };
                --paper-input-container: {
                    border-radius: 3px;
                    white-space: nowrap;
                    overflow: hidden;
                    background-color: var(--color-chateau);
                    font-size: 14px;
                    padding: 9px 8px 7px;
                };
                --paper-input-container-underline: {
                    border: none;
                };
                --paper-input-container-underline-focus: {
                    border: none;
                };

                --paper-dropdown-menu-icon: {
                    fill: #9b61bd;
                };
            }
            :host .line label {
                width: 80px;
                color: rgba(255, 255, 255, 0.5);
                text-align: left;
                text-transform: uppercase;
                font-size: 12px;
                line-height: 12px;
                font-family: var(--font-body);
                font-weight: bold;
                margin-bottom: 8px;
            }
            :host.loading .refresh-button iron-image {
                transform-origin: 46% 50%;
                animation: spin 1s linear infinite;
            }
            .dropdown-content {
                background-color: var(--color-black);
                color: #fff;
                padding: 0;
                --paper-menu-button-content: {
                    padding: 3px;
                    background-color: var(--color-black);
                };
                --paper-dropdown-menu-button: {
                     left: 0;
                     width: 100%;
                  };
                --paper-listbox: {
                    color: #fff;
                    box-sizing: border-box;
                    padding: 0;
                };

                --paper-listbox-color: #fff;
            }
            .dropdown-content paper-item {
                --paper-item: {
                    min-height: 36px;
                    font-family: var(--font-body);
                    font-weight: bold;
                    font-size: 14px;
                    box-sizing: border-box;
                    padding: 9px 8px 7px;
                    border-bottom: 1px solid var(--kano-app-part-editor-border);
                };

                --paper-item-focused: {
                    background-color: #9b61bd;
                };

            }
            .dropdown-content paper-item:last-of-type {
                --paper-item: {
                    min-height: 36px;
                    font-family: var(--font-body);
                    font-weight: bold;
                    font-size: 14px;
                    box-sizing: border-box;
                    padding: 9px 8px 7px;
                };
            }
            :host .dropdown-content paper-item:hover {
                --paper-icon-item: {
                    color: #fff;
                };
            }
            :host .data-header {
                @apply --layout-horizontal;
                @apply --layout-justified;
                padding: 0 8px;
            }
            :host .loading-overlay {
                position: absolute;
                top: 0px;
                bottom: 0px;
                right: 0px;
                left: 0px;
                @apply(--layout-vertical);
                @apply(--layout-center);
                @apply(--layout-center-justified);
                background-color: rgba(255, 255, 255, 0.4);
            }
            :host .data-browser {
                @apply --layout-vertical;
                position: relative;
                border-radius: 6px;
                margin: 16px 0 24px;
                border: 1px solid var(--kano-app-part-editor-border);
            }
            :host .param-description {
                font-family: var(--font-body);
                margin-top: 8px;
                width: 85%;
                color: rgba(255, 255, 255, 0.5);
                @apply --layout-self-end;
            }
            :host kano-what-is-json {
                position: absolute;
                top: 15px;
                right: 15px;
            }
            :host .info-button {
                width: 18px;
                height: 18px;
                border-radius: 50%;
                border: 0;
                background-color: #fff;
                margin-top: 13px;
                transition: transform linear 250ms;
            }
            :host .info-button:hover {
                transform: scale(1.1);
            }
            *[hidden] {
                display: none !important;
            }
            @keyframes spin {
                100% {transform: rotate(-360deg);}
            }
        </style>
        <kano-part-editor-topbar icon="[[element.type]]" label="[[element.label]]" theme="[[theme]]"></kano-part-editor-topbar>
        <div class="content">
            <div class="config">
                <kano-input-text label="Name" value="{{name}}" theme="[[theme]]"></kano-input-text>
                <template is="dom-repeat" items="[[selected.parameters]]" as="param">
                            <kano-input id="[[param.key]]" type="[[param.type]]" label="[[param.label]]" options="[[param.options]]" value="[[_computeInputValue(param.key, param.value, selected.config)]]" on-change="paramChanged" theme="[[theme]]"></kano-input>
                </template>
                <div class="line" id="refresh-frequency">
                    <label>Refresh</label>
                    <paper-dropdown-menu id="dropdown-menu" horizontal-align="left" no-label-float="" no-animations="" on-tap="_computeDropdownStyle">
                        <paper-listbox id="dropdown" slot="dropdown-content" class="dropdown-content" selected="{{selected.refreshFreq}}" attr-for-selected="value">
                            <paper-item value="5">Every 5 seconds</paper-item>
                            <paper-item value="30">Every 30 seconds</paper-item>
                            <paper-item value="60">Every minute</paper-item>
                            <paper-item value="3600">Every hour</paper-item>
                            <paper-item value="0">Don't refresh</paper-item>
                        </paper-listbox>
                    </paper-dropdown-menu>
                </div>
            </div>
                <div class="data-browser" id="data-browser">
                    <div class="data-header">
                        <button type="button" class="refresh-button" on-tap="refresh" id="refresh-button">
                            <iron-image src="/assets/icons/refresh-icon.svg" sizing="contain"></iron-image>
                        </button>
                        <button type="button" class="info-button" id="info-button" on-tap="openJsonInfo">?</button>
                    </div>
                    <template is="dom-repeat" items="[[dataArray]]" as="value">
                        <kano-data-display data-definition="[[selected.dataKeys]]" data-values="[[value]]" trailing-comma="[[!isLastItem(dataArray, index)]]"></kano-data-display>
                    </template>
                    <paper-tooltip position="left" for="info-button">Learn more about JSON</paper-tooltip>
                    <kano-what-is-json id="what-is-json"></kano-what-is-json>
                    <paper-spinner-lite active="[[loading]]"></paper-spinner-lite>
                </div>
        </div>
`,

  is: 'kano-data-editor',
  behaviors: [AppEditorBehavior],

  properties: {
      selected: {
          type: Object,
          notify: true
      },
      loading: {
          type: Boolean,
          value: false,
          reflectToAttribute: true
      },
      theme: {
          type: String,
          value: "#9b61bd"
      },
      name: {
          type: String,
          notify: true
      }
  },

  observers: [
      'computeDataArray(selected.data.*)',
      'computeRefreshEnabled(selected.refreshFreq)'
  ],

  attached () {
      this.jsonInfo = this.$['what-is-json'];
      document.body.appendChild(this.jsonInfo);
  },

  detached () {
      document.body.removeChild(this.jsonInfo);
  },

  openJsonInfo () {
      this.jsonInfo.openJsonInfo();
  },

  _computeDropdownStyle () {
      let containerWidth = this.$['dropdown-menu'].offsetWidth;
      this.$.dropdown.style.width = `${containerWidth}px`;
  },

  computeRefreshEnabled (freq) {
      if (freq) {
          this.set('selected.refreshEnabled', true);
          this.notifyChange('enable-refresh', { part: this.selected });
      } else {
          this.set('selected.refreshEnabled', false);
          this.notifyChange('disable-refresh', { part: this.selected });
      }
  },

  computeDataArray () {
      if (!this.selected) {
          return;
      }
      if (!this.selected.data) {
          this.set('dataArray', new Array(this.selected.dataLength));
          return;
      }
      this.set('dataArray', Array.isArray(this.selected.data) ? this.selected.data : [this.selected.data]);
  },

  refresh () {
      this.loading = true;
      this.selected.refresh().then((data) => {
          this.set('selected.data', data);
          this.loading = false;
      }).catch(() => {
          this.set('selected.data', {});
          this.loading = false;
      });
      this.notifyChange('manual-refresh', {});
  },

  paramChanged (e) {
      let key = e.model.get('param.key'),
          target = e.path ? e.path[0] : e.target,
          value = target.value;
      this.set(`selected.config.${key}`, value);
  },

  computeDataSample () {
      if (!this.selected || !this.selected.data) {
          return;
      }
      return this.selected.dataType === 'list' ? this.selected.data[0] : this.selected.data;
  },

  isLastItem(array, index) {
      return (array.length - 1) === index;
  },

  _computeInputValue (key, value, config) {
      return config[key] || value;
  }
});