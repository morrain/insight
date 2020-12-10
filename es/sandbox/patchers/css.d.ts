export declare class ScopedCSS {
    private static ModifiedTag;
    private readonly sheet;
    private readonly swapNode;
    constructor();
    process(styleNode: HTMLStyleElement, prefix?: string): void;
    private rewrite;
    private ruleStyle;
    private ruleMedia;
    private ruleSupport;
}
export declare const InSightCSSRewriteAttr = "data-insight";
export declare const process: (appWrapper: HTMLElement, stylesheetElement: HTMLStyleElement | HTMLLinkElement, appName: string) => void;
