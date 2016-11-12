/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2011 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Flyout tray containing blocks which may be created.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Flyout');

/**
 * Class for a flyout.
 * @param {!Object} workspaceOptions Dictionary of options for the workspace.
 * @constructor
 */
Blockly.Flyout = function(workspaceOptions) {
  
};

/**
 * Corner radius of the flyout background.
 * @type {number}
 * @const
 */
Blockly.Flyout.prototype.CORNER_RADIUS = 8;

/**
 * Number of pixels the mouse must move before a drag/scroll starts. Because the
 * drag-intention is determined when this is reached, it is larger than
 * Blockly.DRAG_RADIUS so that the drag-direction is clearer.
 */
Blockly.Flyout.prototype.DRAG_RADIUS = 10;

/**
 * Margin around the edges of the blocks in the flyout.
 * @type {number}
 * @const
 */
Blockly.Flyout.prototype.MARGIN = Blockly.Flyout.prototype.CORNER_RADIUS;

/**
 * Gap between items in horizontal flyouts. Can be overridden with the "sep"
 * element.
 * @const {number}
 */
Blockly.Flyout.prototype.GAP_X = Blockly.Flyout.prototype.MARGIN * 3;

/**
 * Gap between items in vertical flyouts. Can be overridden with the "sep"
 * element.
 * @const {number}
 */
Blockly.Flyout.prototype.GAP_Y = Blockly.Flyout.prototype.MARGIN * 3;

/**
 * Top/bottom padding between scrollbar and edge of flyout background.
 * @type {number}
 * @const
 */
Blockly.Flyout.prototype.SCROLLBAR_PADDING = 2;

/**
 * Width of flyout.
 * @type {number}
 * @private
 */
Blockly.Flyout.prototype.width_ = 0;

/**
 * Height of flyout.
 * @type {number}
 * @private
 */
Blockly.Flyout.prototype.height_ = 0;

/**
 * Is the flyout dragging (scrolling)?
 * DRAG_NONE - no drag is ongoing or state is undetermined.
 * DRAG_STICKY - still within the sticky drag radius.
 * DRAG_FREE - in scroll mode (never create a new block).
 * @private
 */
Blockly.Flyout.prototype.dragMode_ = Blockly.DRAG_NONE;

/**
 * Range of a drag angle from a flyout considered "dragging toward workspace".
 * Drags that are within the bounds of this many degrees from the orthogonal
 * line to the flyout edge are considered to be "drags toward the workspace".
 * Example:
 * Flyout                                                  Edge   Workspace
 * [block] /  <-within this angle, drags "toward workspace" |
 * [block] ---- orthogonal to flyout boundary ----          |
 * [block] \                                                |
 * The angle is given in degrees from the orthogonal.
 *
 * This is used to know when to create a new block and when to scroll the
 * flyout. Setting it to 360 means that all drags create a new block.
 * @type {number}
 * @private
*/
Blockly.Flyout.prototype.dragAngleRange_ = 70;

/**
 * Stop binding to the global mouseup and mousemove events.
 * @private
 */
Blockly.Flyout.terminateDrag_ = function() {
  if (Blockly.Flyout.startFlyout_) {
    // User was dragging the flyout background, and has stopped.
    if (Blockly.Flyout.startFlyout_.dragMode_ == Blockly.DRAG_FREE) {
      Blockly.Touch.clearTouchIdentifier();
    }
    Blockly.Flyout.startFlyout_.dragMode_ = Blockly.DRAG_NONE;
    Blockly.Flyout.startFlyout_ = null;
  }
  if (Blockly.Flyout.onMouseUpWrapper_) {
    Blockly.unbindEvent_(Blockly.Flyout.onMouseUpWrapper_);
    Blockly.Flyout.onMouseUpWrapper_ = null;
  }
  if (Blockly.Flyout.onMouseMoveBlockWrapper_) {
    Blockly.unbindEvent_(Blockly.Flyout.onMouseMoveBlockWrapper_);
    Blockly.Flyout.onMouseMoveBlockWrapper_ = null;
  }
  if (Blockly.Flyout.onMouseMoveWrapper_) {
    Blockly.unbindEvent_(Blockly.Flyout.onMouseMoveWrapper_);
    Blockly.Flyout.onMouseMoveWrapper_ = null;
  }
  Blockly.Flyout.startDownEvent_ = null;
  Blockly.Flyout.startBlock_ = null;
};
