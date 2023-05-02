/**
 * Copyright 2023 HolyCorn Software
 * The appearance-settings widget
 * This module contains type definitions for the widget
 */

import { Collection } from "mongodb"

global {
    namespace faculty.managedsettings {

        type NamespaceSettingWidgetStatedata = htmlhc.lib.alarm.AlarmObject<
            {
                descriptors: faculty.managedsettings.SettingDescriptor[]
                values: { [key: string]: string | number | boolean | object }
                namespace: string
                namespaceData: SettingNamespace
                faculty: string
            }
        >

        type SettingWidgetData = SettingDescriptor & Pick<SettingValue, "value">

    }
}