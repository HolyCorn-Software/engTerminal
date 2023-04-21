/**
 * Copyright 2022 HolyCorn Software
 * The Engineer Terminal
 * This module (terminal) allows an engineer to manage the running faculties, as well as some aspects of them
 */

import PluginManagerTerminal from "./plugin.terminal.mjs"
import ETFacultySettingsTerminal from "./setting.terminal.mjs";




export default class FacultyManagerTerminal {


    constructor() {
        this.settings = new ETFacultySettingsTerminal()
        this.plugin = new PluginManagerTerminal()
    }

}
