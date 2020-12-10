import { noop } from '../../utils';
export default function patch(global: Window): () => typeof noop;
