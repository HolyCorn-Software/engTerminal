/** 
 * Copyright 2022 HolyCorn Software
 * The HCTS Project
 * This widget is part of the manage-languages widget, and allows an engineer to create a language
*/

import ManageLanguages from "./widget.mjs";
import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.mjs";
import PopupForm from "/$/system/static/html-hc/widgets/popup-form/form.mjs";


export default class LanguageCreatePopup extends PopupForm {

    /**
     * 
     * @param {ManageLanguages} manageLangs 
     */
    constructor(manageLangs) {
        super(
            {
                title: `Create New Language`,
                caption: `Enter details`
            }
        );


        super.form = [
            [
                {
                    label: `Label`,
                    name: 'label'
                }
            ],
            [
                {
                    label: `Code`,
                    name: 'code'
                }
            ]
        ];

        this.positive = `Create`
        this.negative = `Cancel`


        this.manageLangs = manageLangs
    }

    async execute() {

        /**
         * @type {import("system/base/lang/types.js").LanguageConfig}
         */
        const languageData = {
            code: this.value.code,
            label: this.value.label
        };
        
        await hcRpc.engTerminal.lang.createLanguage(languageData);

        this.manageLangs.advancedThis.manager.statedata.languages.push(languageData)
    }

}