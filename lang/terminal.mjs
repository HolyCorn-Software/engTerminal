/**
 * Copyright 2022 HolyCorn Software
 * The HCTS Project
 * This module allows engineers to manage the languages of the platform, from the public web
 */

import muser_common from "muser_common";



const faculty = FacultyPlatform.get()


const controller = Symbol()

export default class EngLangPublicMethods {


    constructor() {



    }


    /**
     * This method is used to set the value of some strings
     * @param {import("system/base/lang/types.js").StringEnsureArgs} strings 
     * @returns {Promise<void>}
     */
    async setStrings(strings) {

        await checkPermissions((await muser_common.getUser(arguments[0])).id);
        await this[controller].setStrings(arguments[1])
    }



    get [controller]() {
        return faculty.base.channel.remote.lang;
    }

    /**
     * This method is used to create a language in the platform.
     * If the language already exists, it will be updated
     * @param {import("system/base/lang/types.js").LanguageConfig} data 
     * @returns {Promise<void>}
     */
    async createLanguage(data) {
        await checkPermissions((await muser_common.getUser(arguments[0])).id);
        await this[controller].createLanguage(arguments[1])
    }

    /**
     * This method deletes a language compeletely, with all strings
     * @param {string} code 
     * @returns {Promise<void>}
     */
    async deleteLanguage(code) {
        await checkPermissions((await muser_common.getUser(arguments[0])).id)
        await this[controller].deleteLanguage(arguments[1])
    }

    /**
     * This method deletes multiple strings
     * @param {object} param0
     * @param {[string]} param0.codes  The codes of the strings to be delete
     * @param {string} param0.lang The language from which the strings will be deleted
     * @returns {Promise<void>}
     */
    async deleteStrings({ codes, lang }) {
        await checkPermissions((await muser_common.getUser(arguments[0])).id)
        await this[controller].deleteStrings({ strings: arguments[1]?.codes, lang: arguments[1]?.lang })
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
        label: `Manage Platform Strings`,
        name: 'permissions.engTerminal.lang.manage'
    }
]