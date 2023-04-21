/**
 * Copyright 2022 HolyCorn Software
 * The Engineer Terminal
 * This module (logic), is part of the plugin manager widget, and controls it
 */

import FacultyManager from "../widget.mjs";
import InstallPopup from "./install-popup.mjs";
import PluginItem from "./item.mjs";
import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.mjs";
import { handle } from "/$/system/static/errors/error.mjs";
import AlarmObject from "/$/system/static/html-hc/lib/alarm/alarm.mjs";

/**
 * This method sets up the PluginManager widget to manage the plugins of a given faculty
 * @param {FacultyManager} widget 
 * @param {string} faculty 
 * @returns {Promise<void>}
 */
export default async function prepare(widget, faculty) {


    addPlugins(widget, faculty).catch(e => handle(e))
    addCreateOption(widget, faculty)


}

/**
 * This method add options for managing all the plugins that are of the faculty
 * @param {FacultyManager} widget 
 * @param {string} faculty 
 * @returns {Promise<void>}
 */
async function addPlugins(widget, faculty) {

    widget.loadWhilePromise(
        (async () => {


            try {
                const plugins = (await hcRpc.engTerminal.faculty.plugin.getPlugins({ faculty }))[faculty]

                /**
                 * This method returns a unique id derrived from the properties of the plugin
                 * @param {plugins['0']} plugin 
                 * @returns {string}
                 */
                function pluginID(plugin) {
                    return `plugin-${plugin.descriptor.faculty}-${plugin.descriptor.namespace}-${plugin.descriptor.name}`
                }

                for (const plugin of plugins) {

                    widget.explorer.deleteItem(pluginID(plugin));


                    widget.explorer.statedata.items.push(
                        {
                            id: pluginID(plugin),
                            custom_html: new PluginItem(new AlarmObject({ data: plugin })).html,
                            parent: `faculty-${faculty}$plugins`
                        }
                    )


                }

            } catch (e) {
                handle(e)
            }

        })()
    )

}


/**
 * This method adds the option of adding a new plugin to the faculty
 * @param {FacultyManager} widget 
 * @param {string} faculty 
 */
function addCreateOption(widget, faculty) {


    widget.explorer.addEventListener('draw', () => {
        if (widget.explorer.statedata.current_path == `faculty-${faculty}$plugins`) {
            widget.explorer.stageActions.push(
                {
                    label: `Install Plugin`,
                    locations: ['global_root'],
                    onclick: async () => {
                        const popup = new InstallPopup({ faculty });
                        popup.show()
                        popup.addEventListener('success', () => {
                            setTimeout(() => popup.hide(), 1300)
                            addPlugins(widget, faculty).catch(e => handle(e))
                        })
                    }
                }
            )
        }
    })


}