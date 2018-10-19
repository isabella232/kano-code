import './vendor/pong.js';
import * as code from '../../index.js';
import * as modules from '../../modules.js';
/* globals Pong */

// Define what the output will be, In this case, an instance of Pong.js
class PongOutputView extends code.OutputViewProvider {
    constructor(...args) {
        super(...args);
        this.root = document.createElement('div');
        this.root.style.width = '100%';
        this.root.style.height = '420px';
        this.pong = new Pong(this.root);
        // Add keyboard controls for player A
        this.pong.players.a.addControls({
            up: 'w',
            down: 's',
        });
    }
    // Every time the output restarts, resets all values
    start() {
        this.pong.reset();
        this.pong.setBackgroundColor(0x000000);
        this.pong.setBallColor(0xffffff);
        this.pong.setBallSize(10);
        setTimeout(() => {
            this.pong.resize();
            this.pong.start();
        });
    }
}

// Pong runner module. It just sets the methods to be the instance of pong running
// In more complex situations, you will need to wrap the methods to not expose the
// whole API to the VM
class PongModule extends code.AppModule {
    static get id() { return 'pong'; }
    constructor(...args) {
        super(...args);
        this.addLifecycleStep('start', '_start');
    }
    _start() {
        const { outputView } = this.output;
        this.methods = outputView.pong;
    }
}

class AIModule extends code.AppModule {
    static get id() { return 'ai'; }
    constructor(...args) {
        super(...args);
        const { outputView } = this.output;
        this.pong = outputView.pong;
        this.addMethod('position', '_position');
        this.addMethod('move', '_move');
    }
    _position() {
        return this.pong.players.b.y;
    }
    _move(amount) {
        this.pong.players.b.move(amount);
    }
}

class BallModule extends code.AppModule {
    static get id() { return 'ball'; }
    constructor(...args) {
        super(...args);
        const { outputView } = this.output;
        this.pong = outputView.pong;
        this.addMethod('position', '_position');
    }
    _position() {
        if (!this.pong.balls.length) {
            return 0;
        }
        return this.pong.balls[0].y;
    }
}

export class PongOutputProfile extends code.OutputProfile {
    get id() { return 'pong'; }
    get outputViewProvider() { return new PongOutputView(); }
    get modules() { return [PongModule, AIModule, BallModule, modules.TimeModule]; }
}

export default PongOutputProfile;
