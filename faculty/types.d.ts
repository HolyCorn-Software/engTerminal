/**
 * Copyright 2023 HolyCorn Software
 * The Engineer Terminal
 * This module contains type definitions required a manage faculties from the engTerminal
 */

import { Collection } from "mongodb"


global {
    namespace modernuser.permission {
        interface AllPermissions {
            'permissions.engTerminal.faculty.manage': true
        }
    }

    type GetFxnParams<T> = T extends (...args: infer ArgType) => any ? ArgType : T
}