/**
 * Copyright 2022 HolyCorn Software
 * The HCTS Project
 * This module provides publicly usable methods related to platform management, from the Engineer Terminal
 */

import { FacultyPublicMethods } from "../../../system/comm/rpc/faculty-public-methods.mjs";
import FacultyManagerTerminal from "../faculty/terminal.mjs";
import EngLangPublicMethods from "../lang/terminal.mjs";



export default class EngineerTerminalPublicMethods extends FacultyPublicMethods {

    /**
     * @returns {EngLangPublicMethods}
     */
    get lang() {
        return this[langTerminal] ||= new EngLangPublicMethods()
    }

    /**
     * @returns {FacultyManagerTerminal}
     */
    get faculty() {
        return this[facultyTerminal] ||= new FacultyManagerTerminal()
    }



}

const langTerminal = Symbol()
const facultyTerminal = Symbol()