/**
 * Copyright 2023 HolyCorn Software
 * The Egineer Terminal
 * This module checks if a user has permissions to manage faculties
 */





import muser_common from "muser_common"


/**
 * 
 * @param {FacultyPublicJSONRPC} client 
 */
export default async function checkPermissions(client) {

    await muser_common.whitelisted_permission_check(
        {
            userid: (await muser_common.getUser(client)).id,
            permissions: ['permissions.engTerminal.faculty.manage']
        }
    )
}