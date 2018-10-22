import { SpeakerFactory } from '../../../app/lib/parts/parts/speaker/factory.js';
import { SamplesGenerator, SamplesDirGenerator } from '../../../app/lib/parts/parts/speaker/samples.js';

const root = '';

const samples = SamplesGenerator(root);
const samplesDir = SamplesDirGenerator(root);

export const Speaker = SpeakerFactory(root, samples, samplesDir, 'Drum Machine');

export default Speaker;
