import { ParcelConfigObject } from 'single-spa';
import { FrameworkConfiguration, FrameworkLifeCycles, LoadableApp } from './interfaces';
export declare type ParcelConfigObjectGetter = (remountContainer?: string | HTMLElement) => ParcelConfigObject;
export declare function loadApp<T extends object>(app: LoadableApp<T>, configuration?: FrameworkConfiguration, lifeCycles?: FrameworkLifeCycles<T>): Promise<ParcelConfigObjectGetter>;
