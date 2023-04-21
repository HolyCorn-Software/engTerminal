/**
 * Copyright 2022 HolyCorn Software
 * The Engineer Terminal
 * This widget (start-button) is part of the plugin actions widget, and allows for a plugin to be started, and stopped
 */

import PluginManagementActions from "./widget.mjs";
import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.mjs";
import { handle } from "/$/system/static/errors/error.mjs";
import ActionButton from "/$/system/static/html-hc/widgets/action-button/button.mjs";
import BrandedBinaryPopup from "/$/system/static/html-hc/widgets/branded-binary-popup/widget.mjs";


export default class StartButton extends ActionButton {


    /**
     * 
     * @param {import("../types.js").PluginFrontendData} pluginData 
     * @param {PluginManagementActions} actionsWidget
     */
    constructor(pluginData, actionsWidget) {

        super(
            {
                content: `...`,
                onclick: async () => {
                    this.loadWhilePromise(
                        (async () => {
                            try {


                                if (pluginData.state === 'active') {

                                    let yes;

                                    await new Promise((resolve, reject) => {
                                        const popup = new BrandedBinaryPopup(
                                            {
                                                title: `Stop plugin?`,
                                                question: `If you stop ${pluginData.descriptor.label} (${pluginData.descriptor.name}), code components won't be able to use it right-away, and the plugin will be asked to stop. ${pluginData.enabled ? `However, since it is enabled, it will automatically start when the server is rebooted.` : `In addition, it won't automatically start when the server boots next time, since it is disabled.`} \nDo you want to stop it?`,
                                                positive: `Yes`,
                                                negative: `No`,
                                                execute: () => {
                                                    yes = true
                                                }
                                            }
                                        );

                                        popup.show()

                                        popup.addEventListener('hide', () => resolve())
                                    })

                                    if (!yes) {
                                        return;
                                    }

                                    await hcRpc.engTerminal.faculty.plugin.stop({ faculty: pluginData.descriptor.faculty, plugin: pluginData.descriptor.name })
                                } else {
                                    await hcRpc.engTerminal.faculty.plugin.start({ faculty: pluginData.descriptor.faculty, plugin: pluginData.descriptor.name })
                                }
                            } catch (e) {

                                handle(e)
                            }

                            try {
                                const thisPlugin = (await hcRpc.engTerminal.faculty.plugin.getPlugins({ faculty: pluginData.descriptor.faculty }))[pluginData.descriptor.faculty].find(x => x.descriptor.name === pluginData.descriptor.name)
                                Object.assign(pluginData, thisPlugin)
                            } catch { }

                        })()
                    )
                }
            }
        );

        const updateContent = () => {
            this.content = pluginData.state === 'active' ? 'Stop Plugin' : 'Start Plugin'
        }


        pluginData.$0.addEventListener('change', () => updateContent(), {}, true)


    }

}