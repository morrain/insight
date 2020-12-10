import { FrameworkLifeCycles } from '../interfaces';
export default function getAddOns<T extends object>(global: Window, publicPath: string): FrameworkLifeCycles<T>;
