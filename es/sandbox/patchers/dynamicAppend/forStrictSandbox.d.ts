import { Freer } from '../../../interfaces';
export declare function patchStrictSandbox(appName: string, appWrapperGetter: () => HTMLElement | ShadowRoot, proxy: Window, mounting?: boolean, scopedCSS?: boolean, excludeAssetFilter?: CallableFunction): Freer;
