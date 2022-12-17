/**
 * Copyright 2022 HolyCorn Software
 * The Engineer Terminal
 * This widget allows an engineer to view the last error of a plugin
 */

import { hc } from "/$/system/static/html-hc/lib/widget/index.mjs";
import HCTSBrandedPopup from "/$/system/static/html-hc/widgets/branded-popup/popup.mjs";


export default class LastErrorPopup extends HCTSBrandedPopup {


    /**
     * @param {import("./types.js").PluginFrontendData} plugin
     */
    constructor(plugin) {
        super(
            {
                content: hc.spawn(
                    {
                        classes: ['hc-engTerminal-plugin-manager-item-last-error'],
                        innerHTML: transform(plugin.error)
                    }
                )
            }
        );
    }

}


/**
 * This method transforms an error to be more human-friendly
 * @param {string} string 
 * @returns {string}
 */
function transform(string) {
    return string.replaceAll("\n", '<br>')
}

hc.importModuleCSS()