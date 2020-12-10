export function getExternalStyleSheets(styles: any, fetch?: ((input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>) & typeof fetch): Promise<[any, any, any, any, any, any, any, any, any, any]>;
export function getExternalScripts(scripts: any, fetch?: ((input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>) & typeof fetch, errorCallback?: () => void): Promise<[any, any, any, any, any, any, any, any, any, any]>;
/**
 * FIXME to consistent with browser behavior, we should only provide callback way to invoke success and error event
 * @param entry
 * @param scripts
 * @param proxy
 * @param opts
 * @returns {Promise<unknown>}
 */
export function execScripts(entry: any, scripts: any, proxy?: Window & typeof globalThis, opts?: {}): Promise<unknown>;
export default function importHTML(url: any, opts?: {}): any;
export function importEntry(entry: any, opts?: {}): any;
