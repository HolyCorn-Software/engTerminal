/**
 * Copyright 2022 HolyCorn Software
 * The HCTS Project
 * This widget (actions) is part of the lang-manager widget, and controls the action on top of the parent widget.
 */

import LanguageManager from "../widget.mjs";
import ManageLanguages from "./manage-languages/widget.mjs";
import NewLanguageString from "./new-string.mjs";
import BrandedBinaryPopup from "/$/system/static/html-hc/widgets/branded-binary-popup/widget.mjs";
import { hc } from "/$/system/static/html-hc/lib/widget/index.mjs";
import { Widget } from "/$/system/static/html-hc/lib/widget/index.mjs";
import ActionButton from "/$/system/static/html-hc/widgets/action-button/button.mjs";
import { InlineSelect } from "/$/system/static/html-hc/widgets/inline-select/index.mjs";
import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.mjs";



export default class LanguageManagerActions extends Widget {


    /**
     * 
     * @param {LanguageManager} manager 
     */
    constructor(manager) {

        super();

        this.html = hc.spawn(
            {
                classes: LanguageManagerActions.classList,
                innerHTML: `
                    <div class='container'>
                        <div class='main'>
                            <div class='top'>
                                <div class='language-select'></div>
                                <div class='manage-languages'></div>
                            </div>
                            <div class='actions'></div>
                        </div>
                    </div>
                `
            }
        );

        /** @type {InlineSelect} */ this.languageSelect
        this.widgetProperty(
            {
                selector: ['', ...InlineSelect.classList].join('.'),
                parentSelector: '.container >.main >.top >.language-select',
                property: 'languageSelect',
                childType: 'widget'
            }
        );

        this.languageSelect = new InlineSelect(
            {
                label: ``,
                title: `Select Language`
            }
        );



        /** @type {ActionButton} */ this.btnManageLangs
        this.widgetProperty(
            {
                selector: ['', ...ActionButton.classList].join('.'),
                parentSelector: '.container >.main >.top >.manage-languages',
                childType: 'widget',
                property: 'btnManageLangs'
            }
        );

        this.btnManageLangs = new ActionButton(
            {
                content: `Manage Languages`,
                onclick: () => {
                    const popup = new ManageLanguages(this)
                    popup.show()
                }
            }
        )




        /** @type {ActionButton[]} */ this.stringActions
        this.pluralWidgetProperty(
            {
                selector: ['', ...ActionButton.classList].join('.'),
                parentSelector: '.container >.main >.actions',
                childType: 'widget',
                property: 'stringActions'
            }
        );

        this.stringActions = [
            new ActionButton(
                {
                    content: `Add String`,
                    onclick: () => {
                        const popup = new NewLanguageString(this)
                        popup.show()
                        popup.addEventListener('execute', () => {
                            setTimeout(() => popup.hide(), 1250)
                        })
                    }
                }
            ),
            new ActionButton(
                {
                    content: `Delete`,
                    state: 'disabled',
                    onclick: async () => {
                        const selected = this.manager.listings.listings.checked_items.map(x => x.columns[0].content)
                        const currentLang = this.manager.actions.languageSelect.value
                        new BrandedBinaryPopup(
                            {
                                title: `Delete ${selected.length} strings`,
                                question: `This decision is permanent. Make sure to check the strings you are about to delete.<br>Do you want to continue?`,
                                negative: `Go back`,
                                positive: `Yes, delete!`,
                                execute: async () => {
                                    await hcRpc.engTerminal.lang.deleteStrings({
                                        codes: selected,
                                        lang: currentLang
                                    });

                                    console.log(`selected `, selected)
                                    for (let string of selected) {
                                        delete this.manager.statedata.strings[currentLang][string]
                                    }
                                    //Make the UI refresh
                                    this.manager.statedata.strings[currentLang] = this.manager.statedata.strings[currentLang]
                                }
                            }
                        ).show()
                    }
                }
            ),

        ]

        this.manager = manager

    }

    /**
     * @param {LanguageManager} manager
     */
    set manager(manager) {

        if (!manager) {
            return;
        }

        if (this[managerSymbol]) {
            this[managerSymbol].statedata.$0.removeEventListener('languages-change', this[onchangeMethodSymbol])
            this[managerSymbol].statedata.$0.removeEventListener('languages-$array-item-change', this[onchangeMethodSymbol])
        }

        this[managerSymbol] = manager
        manager.statedata.$0.addEventListener('languages-change', this[onchangeMethodSymbol] = this.onlanguagesChange.bind(this))
        manager.statedata.$0.addEventListener('languages-$array-item-change', this[onchangeMethodSymbol] = this.onlanguagesChange.bind(this))
        if (manager.statedata.languages) {
            this.onlanguagesChange()
        }
    }
    get manager() {
        return this[managerSymbol]
    }
    onlanguagesChange() {
        const map = {}
        for (let language of this[managerSymbol].statedata.languages) {
            map[language.code] = language.label
        }
        this.languageSelect.values = map
    }

    static get classList() {
        return ['hc-hcts-language-manager-actions']
    }

}

const managerSymbol = Symbol()
const onchangeMethodSymbol = Symbol()