/**
 * Copyright 2023 HolyCorn Software
 * The Engineer Terminal
 * This module contains type definitions instrumental to the management of 
 * languages from engTerminal
 */

import { Collection } from "mongodb"

global {
    namespace modernuser.permission {
        interface AllPermissions {
            'permissions.engTerminal.lang.manage': true
        }
    }
}