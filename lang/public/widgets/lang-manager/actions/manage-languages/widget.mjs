/**
 * Copyright 2022 HolyCorn Software
 * The HCTS Project
 * This widget is part of the lang-manager actions widget.
 * This widget allows the engineer to manage
 */

import LanguageManagerActions from "../widget.mjs";
import LanguageCreatePopup from "./create.mjs";
import engTerminal from "/$/engTerminal/static/rpc.mjs";
import ActionButton from "/$/system/static/html-hc/widgets/action-button/button.mjs"
import BrandedBinaryPopup from "/$/system/static/html-hc/widgets/branded-binary-popup/widget.mjs";
// import { HCTSBrandedPopup } from "/$/system/static/lib/hc/branded-popup/popup.js";
import { hc, Widget } from "/$/system/static/html-hc/lib/widget/index.mjs";
import HCTSBrandedPopup  from "/$/system/static/html-hc/widgets/branded-popup/popup.mjs";

hc.importModuleCSS()

export default class ManageLanguages extends HCTSBrandedPopup {


    /**
     * @param {LanguageManagerActions} actions 
     */
    constructor(actions) {

        super();
        this.actions

        this.content = hc.spawn(
            {
                classes: ManageLanguages.classList,
                innerHTML: `
                    <div class='container'>
                        <div class='entries'></div>
                        <div class='actions'></div>
                    </div>
                `
            }
        );

        /** @type  {[{code:string, label:string}]}*/ this.entries
        this.pluralWidgetProperty(
            {
                selector: ['', ...LanguageEntry.classList].join('.'),
                parentSelector: '.container >.entries',
                property: 'entries',
                transforms: {
                    /**
                     * 
                     * @param {{code:string, label:string}} langData 
                     */
                    set: (langData) => {
                        const entry = new LanguageEntry(langData)
                        entry.addEventListener("delete", () => {
                            new BrandedBinaryPopup(
                                {
                                    title: `Delete ${langData.label} (${langData.code})?`,
                                    question: `Do you want to delete the language ${langData.label}, and all its associated strings? 
                                    Doing so would mean users who have set this as their default language would be forced to another random language.
                                    Are you sure about this?
                                    `,
                                    positive: `Delete It`,
                                    negative: `Go back`,
                                    execute: async () => {
                                        await engTerminal.lang.deleteLanguage(langData.code)
                                        delete this.advancedThis.manager.statedata.strings[langData.code]
                                        this.advancedThis.manager.statedata.languages = this.advancedThis.manager.statedata.languages.filter(x => x.code !== langData.code)
                                    }
                                }
                            ).show()
                        })
                        return entry.html
                    },
                    get: (html) => {
                        return { code: html?.widgetObject.code, label: html?.widgetObject?.label }
                    }
                }
            }
        );


        /** @type {[ActionButton]} */ this.actions
        this.pluralWidgetProperty(
            {
                selector: ['', ...ActionButton.classList].join('.'),
                parentSelector: '.container >.actions',
                property: 'actions',
                childType: 'widget'
            }
        );

        this.actions.push(
            new ActionButton(
                {
                    content: `Create Language`,
                    onclick: () => {
                        const popup = new LanguageCreatePopup(this)
                        popup.show()
                        popup.addEventListener('execute', () => setTimeout(() => popup.hide(), 1300))
                    }
                }
            )
        )

        this.advancedThis.manager = actions.manager

        this.onlanguagesChange()
    }

    /**
     * This returns a reference to this object ManageLanguages, having the advanced property "manager", such that it reading or writing to
     * this property takes care of issues where the list of languages have changed.
     * 
     * In fact, we are just borrowing from the way manager was defined at LanguageManagerActions, so that we don't have to repeat it.
     * @returns { typeof this & Pick<LanguageManagerActions, "manager">}
     */
    get advancedThis() {
        for (let property of ['manager']) {
            if (!Reflect.getOwnPropertyDescriptor(this, property)) {
                Reflect.defineProperty(this, property, Reflect.getOwnPropertyDescriptor(LanguageManagerActions.prototype, property))
            }
        }

        return this
    }

    onlanguagesChange() {
        this.entries = this.advancedThis.manager.statedata.languages
    }

    static get classList() {
        return ['hc-hcts-language-manager-manage-languages']
    }

}




class LanguageEntry extends Widget {


    /**
     * 
     * @param {object} param0 
     * @param {string} param0.label
     * @param {string} param0.code
     */
    constructor({ label, code } = {}) {
        super();

        this.html = hc.spawn(
            {
                classes: LanguageEntry.classList,
                innerHTML: `
                    <div class='container'>
                        <div class='main'>
                            <div class='data-section'>
                                <div class='label'>English</div>
                                <div class='code'>en</div>
                            </div>

                            <div class='actions-section'>
                                <div class='delete action'><img src='${new URL('./res/trash.png', import.meta.url).href}'></div>
                            </div>
                            
                        </div>
                        
                    </div>
                `
            }
        );

        /** @type {string} */ this.label
        this.htmlProperty('.container >.main >.data-section >.label', 'label', 'innerHTML')

        /** @type {string} */ this.code
        this.htmlProperty('.container >.main >.data-section >.code', 'code', 'innerHTML')


        /** @type {function('delete', (CustomEvent)=>void, AddEventListenerOptions)} */ this.addEventListener
        /** @type {function('delete', (CustomEvent)=>void)} */ this.removeEventListener

        this.html.$('.container >.main >.actions-section >.action.delete').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('delete'))
        })


        Object.assign(this, arguments[0])



    }

    static get classList() {
        return ['hc-hcts-language-manager-manage-languages-language-entry']
    }


}