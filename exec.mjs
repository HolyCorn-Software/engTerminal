/**
 * Copyright 2022 HolyCorn Software
 * The HCTS Project
 * This faculty provides a usable frontend for managing various aspects of the platform, such as languages and strings
 */


import EngineerTerminalPublicMethods from "./terminals/public.mjs";
import { permissions as langPermissions } from "./lang/terminal.mjs";
import { permissions as facultyPermissions } from "./faculty/terminal.mjs";
import muser_common from "muser_common";



const faculty = FacultyPlatform.get()


export default async function init() {


    //Finally, make public methods available
    faculty.remote.public = new EngineerTerminalPublicMethods()


    for (const permission of [...langPermissions, ...facultyPermissions]) {
        (await muser_common.getConnection()).permissions.data.createPermission(permission)
    }



    console.log(`${faculty.descriptor.label.white.underline} is up and running`)


}