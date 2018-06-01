import { Base } from '../../../../scripts/kano/make-apps/parts-api/base.js';

const Speaker = {
    play() {

    },
    say() {

    },
    loop() {

    },
    stop() {

    },
    setPlaybackRate() {

    },
    setVolume() {

    },
};


/**
 * @polymerBehavior
 */
export const speaker = Base.applyMixins({}, Base, Speaker);

export default speaker;
