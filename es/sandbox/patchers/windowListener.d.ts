import { noop } from '../../utils';
export default function patch(global: WindowProxy): () => typeof noop;
