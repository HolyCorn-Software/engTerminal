/**
 * Copyright 2022 HolyCorn Software
 * The Engineer Terminal
 * This module (plugin.terminal) allows an engineer to manage the plugins of a faculty
 */

import muser_common from "muser_common"





export default class PluginManagerTerminal {


    constructor() {

    }

    /**
     * This method is used to retrieve information about all plugins in a given faculty
     * @param {object} param0 
     * @param {string} param0.faculty
     * @returns {Promise<import("system/base/plugin/types.js").FacultiesPlugins>}
     */
    async getPlugins({ faculty } = {}) {
        await checkPermissions(arguments[0])

        return await FacultyPlatform.get().base.channel.remote.plugin.getPlugins(arguments[1]?.faculty)
    }

    async getFacultyCapabilities() {
        await checkPermissions(arguments[0])
        return await FacultyPlatform.get().base.channel.remote.plugin.getCapabilities()
    }


    /**
     * This method is used to install a new plugin in a faculty
     * @param {object} param0 
     * @param {string} param0.faculty
     * @param {string} param0.url
     */
    async installPlugin({ faculty, url }) {
        await checkPermissions(arguments[0])
        return await FacultyPlatform.get().base.channel.remote.plugin.installPlugin({ ...arguments[1] })
    }

    /**
     * This method is used to set credentials for a plugin
     * @param {object} param0 
     * @param {string} param0.faculty
     * @param {string} param0.plugin
     * @param {object} param0.credentials
     * @returns {Promise<void>}
     */
    async setCredentials({ faculty, plugin, credentials }) {
        await checkPermissions(arguments[0])
        return await FacultyPlatform.get().base.channel.remote.plugin.setCredentials({ ...arguments[1] })

    }

    /**
     * This method is used to get credentials for a given plugin
     * @param {object} param0 
     * @param {string} param0.faculty
     * @param {string} param0.plugin
     * @returns {Promise<void>}
     */
    async getCredentials({ faculty, plugin }) {
        await checkPermissions(arguments[0])
        return await FacultyPlatform.get().base.channel.remote.plugin.getCredentials({ ...arguments[1] })

    }

    /**
     * This method is used to flip a plugin between enabled, and disabled
     * @param {object} param0 
     * @param {string} param0.faculty
     * @param {string} param0.plugin
     * @param {boolean} param0.state
     * @returns {Promise<void>}
     */
    async toggleEnabledState({ faculty, plugin, state }) {
        await checkPermissions(arguments[0])
        return await FacultyPlatform.get().base.channel.remote.plugin.toggleEnabledState({ ...arguments[1] })

    }

    /**
     * This method is start a plugin
     * @param {object} param0 
     * @param {string} param0.faculty
     * @param {string} param0.plugin
     * @returns {Promise<void>}
     */
    async start({ faculty, plugin }) {
        await checkPermissions(arguments[0])
        return await FacultyPlatform.get().base.channel.remote.plugin.start({ ...arguments[1] })

    }
    /**
     * This method is used to stop a plugin, and make it inactive
     * @param {object} param0 
     * @param {string} param0.faculty
     * @param {string} param0.plugin
     * @returns {Promise<void>}
     */
    async stop({ faculty, plugin }) {
        await checkPermissions(arguments[0])
        return await FacultyPlatform.get().base.channel.remote.plugin.stop({ ...arguments[1] })

    }

    /**
     * This method is used to uninstall a plugin
     * @param {object} param0 
     * @param {string} param0.faculty
     * @param {string} param0.plugin
     * @returns {Promise<string>}
     */
    async uninstall({ faculty, plugin }) {
        await checkPermissions(arguments[0])
        return await FacultyPlatform.get().base.channel.remote.plugin.uninstall({ ...arguments[1] })

    }
}





/**
 * 
 * @param {import("system/comm/rpc/faculty-public-rpc.mjs").FacultyPublicJSONRPC} client 
 */
async function checkPermissions(client) {

    await muser_common.whitelisted_permission_check(
        {
            userid: (await muser_common.getUser(client)).id,
            permissions: ['permissions.engTerminal.faculty.manage']
        }
    )
}