/**
 * Copyright 2022 HolyCorn Software
 * The HCTS Project
 * This module (types) contains type definitions for the lang-manager widget
 */

import { LanguageConfig, SummedLanguageStrings } from "system/base/lang/types"
import {AlarmObject} from "/$/system/static/html-hc/lib/alarm/alarm-types";


export interface LanguageManagerStateDataStructure {

    strings: SummedLanguageStrings

    languages: [LanguageConfig]

}


export type LanguageManagerStateData = AlarmObject<LanguageManagerStateDataStructure>