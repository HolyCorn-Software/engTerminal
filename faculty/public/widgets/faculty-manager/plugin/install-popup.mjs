/**
 * Copyright 2022 HolyCorn Software
 * The Engineer Terminal
 * This widget (install-popup) allows an engineer to install a plugin in a faculty
 */

import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.mjs";
import { handle } from "/$/system/static/errors/error.mjs";
import { hc } from "/$/system/static/html-hc/lib/widget/index.mjs";
import ActionButton from "/$/system/static/html-hc/widgets/action-button/button.mjs";
import HCTSBrandedPopup from "/$/system/static/html-hc/widgets/branded-popup/popup.mjs";
import { MultiFlexFormConfiguration } from "/$/system/static/html-hc/widgets/multi-flex-form/config.mjs";
import MultiFlexForm from "/$/system/static/html-hc/widgets/multi-flex-form/flex.mjs";


export default class InstallPopup extends HCTSBrandedPopup {


    constructor({faculty}={}) {

        super()

        this.content = hc.spawn(
            {
                classes: InstallPopup.classList,
                innerHTML: `
                    <div class='container'>
                        <div class='type-form'></div>
                        <div class='data-form'></div>
                        <div class='action'></div>
                    </div>
                `
            }
        );

        /** @type {MultiFlexForm} */ this.typeForm
        /** @type {MultiFlexForm} */ this.dataForm

        const properties = ['type', 'data']
        for (let property of properties) {
            this.widgetProperty(
                {
                    selector: ['', ...MultiFlexForm.classList].join('.'),
                    parentSelector: `${['', ...InstallPopup.classList].join('.')} >.container >.${property}-form`,
                    property: `${property}Form`,
                    childType: 'widget'
                }
            )
            this[`${property}Form`] = new MultiFlexForm()
        }

        this.waitTillDOMAttached().then(() => {



            this.typeForm.quickStructure = [
                [
                    {
                        label: 'Installation Type',
                        type: 'choose',
                        name: 'installationType',
                        values: {
                            git: 'Git URL',
                            zipUrl: 'Zip URL',
                            zipFile: 'Zip File'
                        }
                    }
                ]
            ];

            const fileConfig = MultiFlexFormConfiguration.quickCreate(
                [
                    [
                        {
                            type: 'uniqueFileUpload',
                            name: 'url',
                            label: `Upload File`,
                            url: '/$/uniqueFileUpload/upload'
                        }
                    ]
                ]
            );

            const gitConfig = MultiFlexFormConfiguration.quickCreate(
                [
                    [
                        {
                            type: 'text',
                            name: 'url',
                            label: 'URL'
                        }
                    ]
                ]
            );


            const zipUrlConfig = MultiFlexFormConfiguration.quickCreate(
                [
                    [
                        {
                            type: 'text',
                            name: 'url',
                            label: 'URL'
                        }
                    ]
                ]
            );


            this.typeForm.addEventListener('change', () => {
                if (this.typeForm.value.installationType == 'zipFile') {
                    fileConfig.apply(this.dataForm)
                } else {
                    (this.typeForm.value.installationType === 'git' ? gitConfig : zipUrlConfig).apply(this.dataForm)
                }

                this.action.state = 'initial'
            })

        })

        /** @type {ActionButton} */ this.action
        this.widgetProperty(
            {
                selector: ['', ...ActionButton.classList].join('.'),
                parentSelector: `${['', ...InstallPopup.classList].join('.')} >.container >.action`,
                property: 'action',
                childType: 'widget'
            }
        );

        /** @type {function(('success'), function(CustomEvent), AddEventListenerOptions)} */ this.addEventListener

        let installed = false;

        this.action = new ActionButton(
            {
                content: `Install`,
                state: 'disabled',
                onclick: async () => {
                    if (installed) {
                        return
                    }
                    this.loadBlock()
                    try {
                        await hcRpc.engTerminal.faculty.plugin.installPlugin({ faculty: this.faculty, url: this.dataForm.value.url })
                        this.action.state = 'success'
                        installed = true
                        this.dispatchEvent(new CustomEvent('success'))
                    } catch (e) {
                        handle(e)
                    }
                    this.loadUnblock()
                }
            }
        )

        Object.assign(this, arguments[0]);
        /** @type {string} */ this.faculty


    }

    static get classList() {
        return ['hc-engTerminal-faculty-plugin-manager-install-popup']
    }

}


hc.importModuleCSS(import.meta.url)