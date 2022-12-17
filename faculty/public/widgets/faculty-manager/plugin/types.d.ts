/**
 * Copyright 2022 HolyCorn Software
 * The Engineer Terminal
 * This module (types) contains type definitions used by the plugin widget of the faculty-manager widget
 */

import { PluginStatus } from "system/lib/libFaculty/plugins/types";
import { AlarmObject } from "/$/system/static/html-hc/lib/alarm/alarm-types";


type PluginFrontendData = AlarmObject<PluginStatus>