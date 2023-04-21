/**
 * Copyright 2022 HolyCorn Software
 * The HCTS Project
 * The Engineer Terminal faculty.
 * This widget (lang-manager) allows an authorized personnel to manage language-related aspects of the platform
 */

import LanguageManagerActions from "./actions/widget.mjs";
import { handle } from "/$/system/static/errors/error.mjs";
import GenericListings from "/$/system/static/html-hc/widgets/generic-listings/widget.mjs";
import { hc } from "/$/system/static/html-hc/lib/widget/index.mjs";
import AlarmObject from "/$/system/static/html-hc/lib/alarm/alarm.mjs"
import { Widget } from "/$/system/static/html-hc/lib/widget/index.mjs";
import PopupForm from "/$/system/static/html-hc/widgets/popup-form/form.mjs";
import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.mjs";


hc.importModuleCSS(import.meta.url)

export default class LanguageManager extends Widget {

    constructor() {
        super();

        this.html = hc.spawn(
            {
                classes: LanguageManager.classList,
                innerHTML: `
                    <div class='container'>
                        <div class='listings'></div>
                    </div>
                `
            }
        );

        /** @type {import("./types.js").LanguageManagerStateData} */ this.statedata
        this.statedata = new AlarmObject()
        this.statedata.languages = []
        this.statedata.strings = {}



        /** @type {GenericListings} */ this.listings
        this.widgetProperty(
            {
                selector: ['', ...GenericListings.classList].join('.'),
                parentSelector: '.container >.listings',
                property: 'listings',
                childType: 'widget',

                /**
                 * 
                 * @param {GenericListings} widget 
                 */
                onchange: (widget) => {

                    widget.title = `Language Management`

                    widget.statedata.headers = [
                        {
                            label: `String`
                        },
                        {
                            label: `Content`
                        }
                    ]

                    const actions = new LanguageManagerActions(this)
                    widget.headerCustom.push(actions.html)

                    actions.languageSelect.addEventListener('change', () => this.drawStrings())

                    this.statedata.$0.addEventListener('strings.*-change', () => {
                        this.drawStrings()
                    });


                    //The logic of enabling, and disabling the delete button based on the number of selected items
                    widget.listings.addEventListener('selectionchange', ()=>{
                        const delBtn = actions.stringActions[1];
                        delBtn.state = widget.listings.checked_items.length > 0 ? 'initial': 'disabled'
                    })

                    this.drawStrings()

                }
            }
        );

        this.listings = new GenericListings()

        this.waitTillDOMAttached().then(() => this.load())


    }

    /**
     * @returns {LanguageManagerActions}
     */
    get actions() {
        return this.listings.headerCustom[0]?.widgetObject
    }

    /**
     * This method draws the strings of the current language
     */
    drawStrings() {
        /** @type {typeof this.listings.statedata.content} */
        const final = []

        const lang = this.actions.languageSelect.value;
        const btnAddStr = this.actions.stringActions[0]

        if (!lang) {
            this.listings.statedata.content = []
            btnAddStr.state = 'disabled'
            return
        }

        btnAddStr.state = 'initial'

        /** The strings of the language that is currently selected */

        for (let code in this.statedata.strings[lang]) {
            final.push(
                {
                    columns: [
                        {
                            content: code
                        },
                        {
                            content: hc.spawn(
                                {
                                    innerHTML: this.statedata.strings[lang][code],
                                    onclick: () => {
                                        const popup = new PopupForm(
                                            {
                                                title: `Edit string content`,
                                                caption: `Enter the contents of the string.`,
                                                form: [
                                                    [
                                                        {
                                                            label: `Content`,
                                                            name: 'content',
                                                            type: 'textarea'
                                                        }
                                                    ]
                                                ],
                                                positive: `Update`,
                                                negative: `Cancel`,
                                                execute: async () => {
                                                    await hcRpc.engTerminal.lang.setStrings({
                                                        [code]: {
                                                            [lang]: popup.value.content
                                                        }
                                                    });

                                                    this.statedata.strings[lang][code] = popup.value.content

                                                    //Now, for updating the UI
                                                    this.statedata.strings[lang] = this.statedata.strings[lang]

                                                    setTimeout(() => popup.hide(), 1200)
                                                }
                                            }
                                        )

                                        popup.formWidget.values.content = this.statedata.strings[lang][code]

                                        popup.show()
                                    }
                                }
                            ),
                            style: {
                                highlightable: true
                            }
                        }
                    ]
                }
            )
        }

        this.listings.statedata.content = final
    }

    /**
     * This method fetches data from the server and populates the widget
     * @returns {Promise<void>}
     */
    async load() {
        this.loadBlock()
        try {

            this.statedata.languages = await hcRpc.system.lang.getLanguages()
            this.statedata.strings = await hcRpc.system.lang.getStrings()
            const firstLanguage = this.statedata.languages[0]?.code

            if (firstLanguage) {
                this.actions.languageSelect.value = firstLanguage
            }

        } catch (e) {
            handle(e)
        }
        this.loadUnblock()
    }

    /**
     * @returns {LanguageManagerActions}
     */
    get actions() {
        return this.listings.headerCustom[0]?.widgetObject
    }

    static get classList() {
        return ['hc-hcts-lang-manager']
    }

}