/**
 * Copyright 2022 HolyCorn Software
 * The HCTS Project
 * This faculty provides a usable frontend for managing various aspects of the platform, such as languages and strings
 */


import EngineerTerminalPublicMethods from "./terminals/public.mjs";



const faculty = FacultyPlatform.get()


export default async function init() {


    //Finally, make public methods available
    faculty.remote.public = new EngineerTerminalPublicMethods()


    console.log(`${faculty.descriptor.label.white.underline} is up and running`)


}