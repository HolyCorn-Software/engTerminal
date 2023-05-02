/**
 * Copyright 2022 HolyCorn Software
 * The Engineer Terminal
 * This module (logic) permits the faculty-manager widget to actually function.
 */

import pluginLogic from './plugin/logic.mjs'
import SettingsNamespaceWidget from './settings/namespace.mjs';
import FacultyManager from "./widget.mjs";
import hcRpc from '/$/system/static/comm/rpc/aggregate-rpc.mjs';
import { handle } from '/$/system/static/errors/error.mjs';

/** @type {FacultyPublicInfo} */
let map
const getMap = async () => map ||= (await (await fetch("/$/system/maps/faculties")).json())

let supportMap;

/**
 * Get map of how plugins are supported in various faculties
 * @returns {Promise<import('system/base/plugin/types.js').PluginSupportMap>}
 */
const getSupportMap = async () => supportMap ||= await hcRpc.engTerminal.faculty.plugin.getFacultyCapabilities()


const settingsMeta = async () => await hcRpc.engTerminal.faculty.settings.getSettingsMetadata()


/**
 * This method is used to set up the FacultyManager widget
 * @param {FacultyManager} widget 
 * @returns {Promise<void>}
 */
export default async function setup(widget) {
    widget.explorer.statedata.items = []

    widget.explorer.statedata.current_path = ''

    for (let faculty in await getMap()) {
        await facultyOptions(faculty, widget)
    }

}



/**
 * This adds options for managing a single faculty
 * @param {string} faculty 
 * @param {FacultyManager} widget 
 * @returns {Promise<void>}
 */
async function facultyOptions(faculty, widget) {


    const fOptsID = `faculty-${faculty}`;

    widget.explorer.statedata.items.push(
        {
            id: fOptsID,
            parent: '',
            icon: new URL('./res/faculty.png', import.meta.url,).href,
            label: (await getMap())[faculty].label
        }
    );

    const supportsPlugins = await getSupportMap()[faculty];


    if (supportsPlugins) {
        widget.explorer.statedata.items.push(
            {
                id: `${fOptsID}$plugins`,
                icon: new URL('./res/plugins.png', import.meta.url,).href,
                label: `Plugins`,
                parent: fOptsID
            }
        )
        pluginLogic(widget, faculty)
    }

    //Now, the logic for managing faculty settings

    const thisSettings = (await settingsMeta()).find(x => x.name === faculty)

    const thisFacultySettingsID = `${faculty}$engTerminal-settings`;

    console.log(`thisSettings is `, thisSettings)
    if (thisSettings) {
        widget.explorer.statedata.items.push(
            {
                id: thisFacultySettingsID,
                label: `Settings`,
                icon: new URL('./res/settings.png', import.meta.url).href,
                parent: fOptsID
            }
        );


        //Wait for the engineer to navigate to the section for this faculty options
        widget.explorer.waitTillPath(fOptsID).then(async () => {

            //Then start loading the options
            widget.explorer.statedata.loading_items.push(thisFacultySettingsID)

            try {


                //Now, for each of the namespaces
                const namespaces = Reflect.ownKeys(thisSettings.settings)

                const values = await hcRpc.engTerminal.faculty.settings.getAll(faculty)

                for (const namespace of namespaces) {

                    const nsWidget = new SettingsNamespaceWidget()
                    nsWidget.statedata.namespace = namespace
                    nsWidget.statedata.namespaceData = thisSettings.settings[namespace]
                    nsWidget.statedata.faculty = faculty
                    nsWidget.statedata.descriptors = thisSettings.settings[namespace].items
                    nsWidget.statedata.values = Object.fromEntries(values.filter(x => x.namespace === namespace).map(x => [x.name, x.value]))


                    const nsSettingsID = `${thisFacultySettingsID}-${namespace}`;
                    widget.explorer.statedata.items.push(
                        {
                            label: thisSettings.settings[namespace].label,
                            icon: thisSettings.settings[namespace].icon,
                            id: nsSettingsID,
                            parent: thisFacultySettingsID,
                        }
                    );

                    widget.explorer.statedata.items.push(
                        {
                            id: `${thisFacultySettingsID}-${namespace}`,
                            parent: nsSettingsID,
                            custom_html: nsWidget.html
                        }
                    )

                }

            } catch (e) {
                handle(e)
            }

            widget.explorer.statedata.loading_items = widget.explorer.statedata.loading_items.filter(x => x !== thisFacultySettingsID)


        })
    }

}