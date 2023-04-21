/**
 * Copyright 2023 HolyCorn Software
 * The Egineer Terminal 
 * This module contains type definitions needed by the faculty at large
 */

import EngineerTerminalPublicMethods from "./terminals/public.mjs"




global {
    namespace faculty {
        interface faculties {
            engTerminal: {
                remote: {
                    internal: {}
                    public: EngineerTerminalPublicMethods
                }
            }
        }
    }
}