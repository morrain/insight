export { addErrorHandler, removeErrorHandler } from 'single-spa';
export declare function addGlobalUncaughtErrorHandler(errorHandler: OnErrorEventHandlerNonNull): void;
export declare function removeGlobalUncaughtErrorHandler(errorHandler: (...args: any[]) => any): void;
