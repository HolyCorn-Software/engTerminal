/**
 * Copyright 2022 HolyCorn Software
 * The HCTS Project
 * This faculty provides a usable frontend for managing various aspects of the platform, such as languages and strings
 */

import { StrictFileServer } from "../../system/http/strict-file-server.js";
import { HTTPServer } from "../../system/http/server.js";
import { FacultyPlatform } from "../../system/lib/libFaculty/platform.mjs";
import EngineerTerminalPublicMethods from "./terminals/public.mjs";
import { FacultyPublicJSONRPC } from "../../system/comm/rpc/faculty-public-rpc.mjs";


const faculty = FacultyPlatform.get()


export async function init() {



    // Take our own share the system HTTP traffic
    const http = await HTTPServer.new()

    faculty.base.shortcutMethods.http.claim(
        {
            remotePath: faculty.standard.httpPath,
            http,
            localPath: '/'
        }
    )

    //Make public files available

    for (let path of ['lang', undefined]) {

        //So, for example: lang/public will be available at server.com/$/engTerminal/lang/static/

        new StrictFileServer(
            {
                http,
                urlPath: `/${path ? `${path}/` : ''}static/`,
                refFolder: `./${path ? `${path}/` : ''}public/`
            },
            import.meta.url
        ).add(`./${path ? `${path}/`: ''}public/`)

    }

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




    console.log(`${faculty.descriptor.label.white.underline} is up and running`)


}