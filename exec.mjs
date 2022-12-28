/**
 * Copyright 2022 HolyCorn Software
 * The HCTS Project
 * This faculty provides a usable frontend for managing various aspects of the platform, such as languages and strings
 */


import EngineerTerminalPublicMethods from "./terminals/public.mjs";
import { FacultyPublicJSONRPC } from "../../system/comm/rpc/faculty-public-rpc.mjs";
import { permissions as langPermissions } from "./lang/terminal.mjs";
import { permissions as facultyPermissions } from "./faculty/terminal.mjs";
import muser_common from "muser_common";



const faculty = FacultyPlatform.get()


export default async function init() {



    // Take our own share the system HTTP traffic
    const http = await HTTPServer.new()

    faculty.base.shortcutMethods.http.claim(
        {
            remotePath: faculty.standard.httpPath,
            http,
            localPath: '/'
        }
    )

    //Finally, make public methods available
    faculty.remote.public = new EngineerTerminalPublicMethods()

    //To do that, we need to claim our share of the socket traffic
    await faculty.base.shortcutMethods.http.websocket.claim(
        {
            http,
            base: {
                point: faculty.standard.publicRPCPoint
            },
            local: {
                path: '/'
            }
        }
    );

    //And then make provisions for receiving the client
    http.websocketServer.route(
        {
            path: '/',
            callback: (msg, client) => {
                new FacultyPublicJSONRPC(client)
            }
        }
    );


    for (const permission of [...langPermissions, ...facultyPermissions]) {
        (await muser_common.getConnection()).permissions.data.createPermission(permission)
    }



    console.log(`${faculty.descriptor.label.white.underline} is up and running`)


}