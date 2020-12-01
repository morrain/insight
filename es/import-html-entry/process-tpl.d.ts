/**
 * parse the script link from the template
 * 1. collect stylesheets
 * 2. use global eval to evaluate the inline scripts
 *    see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function#Difference_between_Function_constructor_and_function_declaration
 *    see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#Do_not_ever_use_eval!
 * @param tpl
 * @param baseURI
 * @stripStyles whether to strip the css links
 * @returns {{template: void | string | *, scripts: *[], entry: *}}
 */
export default function processTpl(tpl: any, baseURI: any): {
    template: void | string | any;
    scripts: any[];
    entry: any;
};
export function genLinkReplaceSymbol(linkHref: any, preloadOrPrefetch?: boolean): string;
export function genScriptReplaceSymbol(scriptSrc: any, async?: boolean): string;
export const inlineScriptReplaceSymbol: "<!-- inline scripts replaced by import-html-entry -->";
export function genIgnoreAssetReplaceSymbol(url: any): string;
export function genModuleScriptReplaceSymbol(scriptSrc: any, moduleSupport: any): string;
