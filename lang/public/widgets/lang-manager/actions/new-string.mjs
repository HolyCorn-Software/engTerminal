/**
 * Copyright 2022 HolyCorn Software
 * The HCTS Project
 * This widget (new-string) is part of the lang-manager actions widget.
 * This widget allows us to create a new string, and add it to a language
 */

import LanguageManagerActions from "./widget.mjs";
import engTerminal from "/$/engTerminal/static/rpc.mjs";
import PopupForm from "/$/system/static/html-hc/widgets/popup-form/form.mjs";


export default class NewLanguageString extends PopupForm {


    /**
     * 
     * @param {LanguageManagerActions} actions
     */
    constructor(actions) {
        super(
            {
                title: `New String`,
                caption: `The code should be unique, and the content could be anything.`,
                form: [
                    [
                        {
                            label: `Code`,
                            name: 'code'
                        }
                    ],
                    [
                        {
                            label: `Content`,
                            name: 'content',
                            type: 'textarea'
                        }
                    ]
                ],
                negative: `Cancel`,
                positive: `Add`,
                execute: async () => {

                    const currentLang = actions.languageSelect.value;
                    if (!currentLang) {
                        throw new Error(`Sorry but, there seems to be no language currently selected. Go to the language select option, and select a language.`)
                    }

                    await engTerminal.lang.setStrings({
                        [this.value.code]: {
                            [currentLang]: this.value.content
                        }
                    });

                    (actions.manager.statedata.strings[currentLang] ||= {})[this.value.code] = this.value.content;

                    //Just to trigger the right events, so that the UI can be updated
                    actions.manager.statedata.strings[currentLang] = actions.manager.statedata.strings[currentLang]
                }
            }
        )
    }

}