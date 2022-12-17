/**
 * Copyright 2022 HolyCorn Software
 * The Engineer Terminal
 * This module (logic) permits the faculty-manager widget to actually function.
 */

import pluginLogic from './plugin/logic.mjs'
import FacultyManager from "./widget.mjs";
import engTerminal from "/$/engTerminal/static/rpc.mjs";

/** @type {FacultyPublicInfo} */
const map = (await (await fetch("/$/system/maps/faculties")).json())

const supportMap = await engTerminal.faculty.plugin.getFacultyCapabilities()


/**
 * This method is used to set up the FacultyManager widget
 * @param {FacultyManager} widget 
 * @returns {Promise<void>}
 */
export default async function setup(widget) {
    widget.explorer.statedata.items = []

    for (let faculty in map) {
        facultyOptions(faculty, widget)
    }

    widget.explorer.statedata.current_path = ''
}



/**
 * This adds options for managing a single faculty
 * @param {string} faculty 
 * @param {FacultyManager} widget 
 * @returns {Promise<void>}
 */
async function facultyOptions(faculty, widget) {
    widget.explorer.statedata.items.push(
        {
            id: `${faculty}`,
            parent: '',
            icon: new URL('./res/faculty.png', import.meta.url,).href,
            label: map[faculty].label
        }
    );

    const supports = supportMap[faculty];
    widget.explorer.statedata.items.push(
        {
            id: `${faculty}$plugin`,
            icon: new URL('./res/plugins.png', import.meta.url,).href,
            label: supports ? `Plugins` : `Plugins not supported`,
            navigable: supports,
            parent: faculty
        }
    )

    if (supports) {
        pluginLogic(widget, faculty)
    }
}