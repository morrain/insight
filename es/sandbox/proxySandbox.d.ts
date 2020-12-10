import { SandBox, SandBoxType } from '../interfaces';
/**
 * 基于 Proxy 实现的沙箱
 */
export default class ProxySandbox implements SandBox {
    /** window 值变更记录 */
    private readonly updatedValueSet;
    name: string;
    type: SandBoxType;
    proxy: WindowProxy;
    sandboxRunning: boolean;
    active(): void;
    inactive(): void;
    constructor(name: string);
}
