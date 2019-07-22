import { AppModule } from '../../app-modules/app-module.js';

export class StampModule extends AppModule {
    static get id() {
        return 'stamp';
    }
    constructor(output : any) {
        super(output);
        const stickers = output.resources.get('stickers');

        function random () {
            return stickers.getRandom()
        }

        function randomFrom (id : string) {
            return stickers.getRandomFrom(id);
        }
        
        this.addMethod('random', random);
        this.addMethod('randomFrom', randomFrom);
    }

}

export default StampModule;
