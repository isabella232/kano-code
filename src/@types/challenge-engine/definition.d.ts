/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

declare module 'challenge-engine/definition.js' {
    type IEventChecker = (validation : any, e : any) => boolean;
    type IOppositeAction = (validation : any, e : any) => void;
    type IFallbackAction = (validation : any, e : any) => void;
    type IShorthand = (data : any) => any;
    type IBehaviorAction = (data : any) => any;
    class Challenge {
        steps : any[];
        setSteps(steps : any[]) : void;
        addValidation(name : string, check : IEventChecker) : void;
        addOppositeAction(expected : string, actual : string, action : IOppositeAction) : void;
        addMatchFallback(name : string, check : IFallbackAction) : void;
        defineShorthand(name : string, check : IShorthand) : void;
        defineBehavior(name : string, enter : IBehaviorAction, exit : IBehaviorAction) : void;
        createStore(name : string) : void;
        _checkEvent(validation : any, e : any) : boolean;
        addToStore(store : string, name : string, value : any) : void;
        getFromStore(store : string, name : string) : any;
        _stores : { [K : string] : any };
        stepIndex : number;
        _updateStep() : void;
        trigger(name : string) : void;
        start() : void;
        nextStep() : void;
        triggerEvent(name : string, data? : any) : void;
        definePropertyProcessor(props : string[], processor : Function) : void;
        _expandSteps() : any[];
        _steps : any[];
        _shorthands : { [K : string] : Function };
    }
    export default Challenge;
}