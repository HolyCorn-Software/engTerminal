/**
 * Copyright 2022 HolyCorn Software
 * The Engineer Terminal
 * This widget, is part of the plugin management widget, and it allows specific actions to be taken on a plugin.
 * Actions such as configuration, enablement, disablement
 */

import StartButton from "./start-button.mjs";
import CredentialsInputPopup from "./credentials-input.mjs";
import EnableSwitch from "./enable-switch.mjs";
import { handle } from "/$/system/static/errors/error.mjs";
import { hc, Widget } from "/$/system/static/html-hc/lib/widget/index.mjs";
import ActionButton from "/$/system/static/html-hc/widgets/action-button/button.mjs";
import BrandedBinaryPopup from "/$/system/static/html-hc/widgets/branded-binary-popup/widget.mjs";
import HCTSBrandedPopup from "/$/system/static/html-hc/widgets/branded-popup/popup.mjs";
import DualSwitch from "/$/system/static/html-hc/widgets/dual-switch/switch.mjs";
import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.mjs";




export default class PluginManagementActions extends Widget {


    /**
     * 
     * @param {import("../types.js").PluginFrontendData} plugin 
     */
    constructor(plugin) {

        super()


        this.html = hc.spawn(
            {
                classes: PluginManagementActions.classList,
                innerHTML: `
                    <div class='container'>
                        <div class='main'></div>
                    </div>
                `
            }
        );


        /** @type {(ActionButton|DualSwitch)[]} */ this.main
        this.pluralWidgetProperty(
            {
                selector: ['', ...ActionButton.classList].join('.'),
                parentSelector: '.container >.main',
                property: 'main',
                childType: 'widget'
            }
        );
        /** @type {function(('uninstall'|'require-refresh'), function(CustomEvent), AddEventListenerOptions)} */ this.addEventListener

        this.main = [

            new EnableSwitch(
                plugin
            ),

            new StartButton(plugin, this),

            new ActionButton(
                {
                    content: `Uninstall`,
                    onclick: async () => {

                        try {

                            new BrandedBinaryPopup(
                                {
                                    title: `Uninstall?`,
                                    question: `Do you really want to uninstall ${plugin.descriptor.label} (${plugin.descriptor.name})?`,
                                    positive: `Yes!`,
                                    negative: `No!`,
                                    execute: async () => {
                                        const warning = await hcRpc.engTerminal.faculty.plugin.uninstall({ plugin: plugin.descriptor.name, faculty: plugin.descriptor.faculty })
                                        if (warning) {
                                            new HCTSBrandedPopup(
                                                {
                                                    content: hc.spawn(
                                                        {
                                                            innerHTML: warning.replaceAll('\n', '<br>'),
                                                        }
                                                    )
                                                }
                                            ).show()
                                        }
                                        this.dispatchEvent(new CustomEvent('uninstall'))
                                    }
                                }
                            ).show()

                        } catch (e) {
                            handle(e)
                        }
                    }
                }
            ),
            new ActionButton(
                {
                    content: `Credentials`,
                    state: plugin.descriptor.credentials?.form ? 'initial' : 'disabled',
                    onclick: () => {
                        new CredentialsInputPopup(plugin).show()
                    }
                }
            ),
        ]



    }
    static get classList() {
        return ['hc-engTerminal-plugin-manager-item-actions'];
    }

}