import * as code from '../../index.js';
import { SpiralEditorProfile } from './profile.js';

const editor = new code.Editor();

editor.registerProfile(new SpiralEditorProfile());

editor.inject();

editor.output.setRunningState(true);
