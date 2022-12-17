/**
 * Copyright 2022 HolyCorn Software
 * The Engineer Terminal
 * This widget is part of the actions widget of the faculty-manager plugin widget.
 * It allows a plugin to be enabled, and disabled
 */

import engTerminal from "/$/engTerminal/static/rpc.mjs";
import { handle } from "/$/system/static/errors/error.mjs";
import DualSwitch from "/$/system/static/html-hc/widgets/dual-switch/switch.mjs";



export default class EnableSwitch extends DualSwitch {


    /**
     * 
     * @param {import("../types.js").PluginFrontendData} plugin0 
     */
    constructor(plugin0) {

        super(
            {
                positive: 'Enabled',
                negative: 'Disabled',
                value: plugin0.enabled,
            }
        );

        plugin0.$0.addEventListener('change', () => {
            console.trace(`plugin.enabled is now `, plugin0.enabled)
            this.silent_value = plugin0.enabled
        }, undefined, true)

        this.addEventListener('change', () => {
            this.loadWhilePromise(
                (async () => {
                    const { value } = this
                    try {
                        await engTerminal.faculty.plugin.toggleEnabledState({ plugin: plugin0.descriptor.name, faculty: plugin0.descriptor.faculty, state: value })
                        plugin0.enabled = value
                    } catch (e) {
                        this.silent_value = !value;
                        handle(e)
                    }
                })()
            )
        })

    }

}