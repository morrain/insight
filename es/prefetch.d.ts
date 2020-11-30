import { ImportEntryOpts } from './import-html-entry';
import { AppMetadata, PrefetchStrategy } from './interfaces';
declare type RequestIdleCallbackHandle = any;
interface RequestIdleCallbackOptions {
    timeout: number;
}
interface RequestIdleCallbackDeadline {
    readonly didTimeout: boolean;
    timeRemaining: () => number;
}
declare global {
    interface Window {
        requestIdleCallback: (callback: (deadline: RequestIdleCallbackDeadline) => void, opts?: RequestIdleCallbackOptions) => RequestIdleCallbackHandle;
        cancelIdleCallback: (handle: RequestIdleCallbackHandle) => void;
    }
    interface Navigator {
        connection: {
            saveData: boolean;
            effectiveType: string;
            type: 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown';
        };
    }
}
export declare function prefetchImmediately(apps: AppMetadata[], opts?: ImportEntryOpts): void;
export declare function doPrefetchStrategy(apps: AppMetadata[], prefetchStrategy: PrefetchStrategy, importEntryOpts?: ImportEntryOpts): void;
export {};
