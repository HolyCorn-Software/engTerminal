/**
 * Copyright 2022 HolyCorn Software
 * The Engineer Terminal
 * This module (terminal) allows an engineer to manage the running faculties, as well as some aspects of them
 */

import muser_common from "muser_common"
import PluginManagerTerminal from "./plugin.terminal.mjs"



export default class FacultyManagerTerminal {


    constructor(){
        this.plugin = new PluginManagerTerminal()
    }
    
}




async function checkPermissions(userid) {

    await muser_common.whitelisted_permission_check(
        {
            userid,
            permissions: ['permissions.engTerminal.lang.manage']
        }
    )
}

/**
 * @type {[import("faculty/modernuser/permission/data/types.js").PermissionData]}
 */
export const permissions = [
    {
        label: `Manage Faculties`,
        name: 'permissions.engTerminal.faculty.manage'
    }
]