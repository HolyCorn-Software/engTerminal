/**
 * Copyright 2023 HolyCorn Software
 * The Engineer Terminal
 * This module allows engineers over the public web, to manage faculty settings
 */

import checkPermissions from "./checkPermissions.mjs";


/**
 * @extends faculty.managedsettings.BaseRemote
 */
export default class ETFacultySettingsTerminal extends Object {

    constructor() {
        super();

        return new RecursiveProxy(this, [])

    }


    /**
     * This method gets managed faculty settings for a faculty, or all faculties
     * @param {string} faculty If passed, only settings descriptors from this faculty will be returned
     */
    async getSettingsMetadata(faculty) {

        const data = (await FacultyPlatform.get().base.channel.remote.faculties()).filter(x => (typeof faculty !== 'undefined' ? faculty === x.name : true) && x.meta?.settings).map(x => ({ settings: x.meta.settings, name: x.name }))

        return data
    }




}





class RecursiveProxy {


    /**
     * 
     * @param {ETFacultySettingsTerminal} origin
     * @param {string[]} properties 
     */
    constructor(origin, properties = []) {


        return new Proxy(() => undefined, {
            get: (target, property) => new RecursiveProxy(origin, (property === '$0') && (properties.length == 0) ? [] : [...properties, property]),
            apply: async (target, thisArg, [ignore, inputMain]) => {
                const argArray = inputMain.slice(1)


                const settingsInterface = () => FacultyPlatform.get().base.channel.remote.settings

                let fxn = settingsInterface()

                let _nwThisArg = settingsInterface();


                //This variable allows us to call methods on the previous object
                //That is, call someobject.property.method() on property
                let isFirstIteration = true

                if (properties.at(-1) === 'apply') {
                    properties.pop()
                }

                let isInternal;

                for (const property of properties) {

                    const callingInternal = (typeof origin[property] !== 'undefined') && isFirstIteration;

                    if (callingInternal) {
                        //Let's allow methods from the ETFacultySettingsTerminal object
                        fxn = origin[property]
                        _nwThisArg = origin
                        isInternal = true
                    } else {
                        fxn = fxn[property]
                        if (!isFirstIteration) {
                            _nwThisArg = _nwThisArg[property]
                        }
                        isFirstIteration = false
                    }

                }

                //Every method being called must be authenticated
                await checkPermissions(inputMain[0])


                //Now, let's actually call the method
                //We're using this conditional because we cannot apply() remote methods (Function.prototype.apply)
                const response = await (isInternal ? fxn.apply(_nwThisArg, argArray) : fxn(...argArray));
                if ((properties.at(-1) == 'set') || (properties.at(-1) == 'clear')) {
                    // Then the admin just set a new setting.
                    // In that case, clear the admin's cache of any old entries of the given setting.
                    // This is based on the assumption, that the entry is tag like faculty.managedsettings.<namespace>.<name>
                    /** @type {GetFxnParams<fxn['set']>['1']} */
                    const params = argArray[1]
                    return new JSONRPC.MetaObject(response, {
                        rmCache: [`faculty.managedsettings.${argArray[0]}.${params?.namespace}.${params?.name}`]
                    })
                }

                return response
            }
        })

    }


}