/**
 * Copyright 2022 HolyCorn Software
 * The Engineer Terminal
 * This widget allows an Engineer to input credentials for a plugin
 */

import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.mjs";
import { handle } from "/$/system/static/errors/error.mjs";
import PopupForm from "/$/system/static/html-hc/widgets/popup-form/form.mjs";

const plugin = Symbol()

export default class CredentialsInputPopup extends PopupForm {


    /**
     * 
     * @param {import("../types.js").PluginFrontendData} pluginData 
     */
    constructor(pluginData) {
        super(
            {
                title: `Input Credentials`,
                caption: `Configure credentials for ${pluginData.descriptor.name}`,
                positive: 'Update',
                negative: 'Cancel',
                execute: async () => {
                    await hcRpc.engTerminal.faculty.plugin.setCredentials({ faculty: this[plugin].descriptor.faculty, plugin: this[plugin].descriptor.name, credentials: this.value })
                },
                form: pluginData.descriptor.credentials.form
            }
        )

        this[plugin] = pluginData

        this.getCredentials()

    }

    async getCredentials() {

        await this.blockWithAction(

            async () => {
                const credentials = await hcRpc.engTerminal.faculty.plugin.getCredentials({ faculty: this[plugin].descriptor.faculty, plugin: this[plugin].descriptor.name })
                setTimeout(() => this.value = credentials || {}, 1000)
            }

        )


    }

}