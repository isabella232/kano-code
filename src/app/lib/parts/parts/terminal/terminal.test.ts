/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { TerminalPart } from './terminal.js';
import { PartContextStub } from '../../../../../test/part-context-stub.js';

suite('TerminalPart', () => {
    test('#onInstall()', () => {
        const stub = new PartContextStub();
        const terminal = new TerminalPart();

        terminal.onInstall(stub);

        assert.equal((terminal as any).domNode, stub.dom.root.firstChild);
    });
    test('#render()', () => {
        const terminal = new TerminalPart();

        terminal.core.visible = true;

        terminal.render();

        assert.equal((terminal as any).domNode.style.visibility, 'visible');
    });
});
