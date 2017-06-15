/* global Blockly, goog */

Blockly.Trashcan.prototype.IMAGE_WIDTH = 18.15;
Blockly.Trashcan.prototype.IMAGE_HEIGHT = 24.43;
Blockly.Trashcan.prototype.WIDTH_ = 28;
Blockly.Trashcan.prototype.LID_HEIGHT_ = 8;
Blockly.Trashcan.prototype.BODY_HEIGHT_ = 16;

Blockly.Trashcan.prototype.createDom = function () {
    /* Here's the markup that will be generated:
    <g class="blocklyTrash">
    <clippath id="blocklyTrashBodyClipPath837493">
        <rect width="47" height="45" y="15"></rect>
    </clippath>
    <image width="64" height="92" y="-32" xlink:href="media/sprites.png"
        clip-path="url(#blocklyTrashBodyClipPath837493)"></image>
    <clippath id="blocklyTrashLidClipPath837493">
        <rect width="47" height="15"></rect>
    </clippath>
    <image width="84" height="92" y="-32" xlink:href="media/sprites.png"
        clip-path="url(#blocklyTrashLidClipPath837493)"></image>
    </g>
    */
    fetch('/assets/icons/blockly-bin.svg')
        .then(r => r.text())
        .then(svgText => {
            return (new DOMParser()).parseFromString(svgText, 'text/xml');
        })
        .then(svgDom => {
            let root = svgDom.documentElement,
                lid = root.querySelector('#lid'),
                body = root.querySelector('#body');

            lid.setAttribute('transform-origin', 'right bottom');

            this.binGroup.appendChild(lid);
            this.binGroup.appendChild(body);

            this.svgLid_ = lid;
        });
    this.svgGroup_ = Blockly.utils.createSvgElement('g', { class: 'blocklyTrash' }, null);
    this.rotationGroup = Blockly.utils.createSvgElement('g', {
        'transform-origin': 'center center'
    }, this.svgGroup_);
    this.binGroup = Blockly.utils.createSvgElement('g', {
        transform: `scale(${this.WIDTH_ / this.IMAGE_WIDTH}, ${this.WIDTH_ / this.IMAGE_WIDTH})`
    }, this.rotationGroup);
    // Group placeholder for before the svg finished loading
    this.svgLid_ = Blockly.utils.createSvgElement('g', {}, this.binGroup);

    Blockly.bindEventWithChecks_(this.svgGroup_, 'mouseup', this, this.click);
    this.animateLid_();
    return this.svgGroup_;
};

/**
 * Rotate the lid open or closed by one step.  Then wait and recurse.
 * @private
 */
Blockly.Trashcan.prototype.animateLid_ = function () {
    let lidAngle, opacity;
    this.lidOpen_ += this.isOpen ? 0.2 : -0.2;
    this.lidOpen_ = goog.math.clamp(this.lidOpen_, 0, 1);
    lidAngle = this.lidOpen_ * 45;
    this.svgLid_.setAttribute('transform', 'rotate(' + (this.workspace_.RTL ? -lidAngle : lidAngle) + ')');
    opacity = goog.math.lerp(0.5, 1, this.lidOpen_);
    this.svgGroup_.style.opacity = opacity;
    if (this.lidOpen_ > 0 && this.lidOpen_ < 1) {
        this.lidTask_ = goog.Timer.callOnce(this.animateLid_, 20, this);
    }
};

/**
 * Move the trash can to the bottom-right corner.
 */
Blockly.Trashcan.prototype.position = function() {
  var metrics = this.workspace_.getMetrics();
  if (!metrics) {
    // There are no metrics available (workspace is probably not visible).
    return;
  }
  if (this.workspace_.RTL) {
    this.left_ = this.MARGIN_SIDE_ + Blockly.Scrollbar.scrollbarThickness;
    if (metrics.toolboxPosition == Blockly.TOOLBOX_AT_LEFT) {
      this.left_ += metrics.flyoutWidth;
      if (this.workspace_.toolbox_) {
        this.left_ += metrics.absoluteLeft;
      }
    }
  } else {
    this.left_ = metrics.viewWidth + metrics.absoluteLeft -
        this.WIDTH_ - this.MARGIN_SIDE_ - Blockly.Scrollbar.scrollbarThickness;

    if (metrics.toolboxPosition == Blockly.TOOLBOX_AT_RIGHT) {
      this.left_ -= metrics.flyoutWidth;
    }
  }
  this.top_ = metrics.viewHeight + metrics.absoluteTop -
      (this.BODY_HEIGHT_ + this.LID_HEIGHT_) - this.bottom_;

  if (metrics.toolboxPosition == Blockly.TOOLBOX_AT_BOTTOM) {
    this.top_ -= metrics.flyoutHeight;
  }
  this.top_ -= 15;
  this.svgGroup_.setAttribute('transform',
      'translate(' + this.left_ + ',' + this.top_ + ')');
};


/**
 * Flip the lid shut.
 * Called externally after a drag.
 */
Blockly.Trashcan.prototype.close = function () {
    this.setOpen_(false);
    this.rotationGroup.animate({
        transform: [
            'rotate(0deg)',
            'rotate(10deg)',
            'rotate(0deg)',
            'rotate(-10deg)',
            'rotate(0deg)'
        ]
    }, {
        duration: 150,
        iterations: 3
    });
};

/**
 * Return the deletion rectangle for this trash can.
 * @return {goog.math.Rect} Rectangle in which to delete.
 */
Blockly.Trashcan.prototype.getClientRect = function() {
    if (!this.svgGroup_) {
        return null;
    }

    var trashRect = this.svgGroup_.getBoundingClientRect();
    var left = trashRect.left - this.MARGIN_HOTSPOT_;
    var top = trashRect.top - this.MARGIN_HOTSPOT_;
    var width = this.WIDTH_ + 2 * this.MARGIN_HOTSPOT_;
    var height = this.LID_HEIGHT_ + this.BODY_HEIGHT_ + 2 * this.MARGIN_HOTSPOT_;
    return new goog.math.Rect(left, top, width, height);

};
