/** 
 * Copyright 2022 HolyCorn Software
 * The HCTS Project
 * This module (rpc) allows easy access of public methods from the engTerminal faculty
*/

import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.js";



/** @type {import('../terminals/public.mjs').default} */
const engTerminal = hcRpc.engTerminal

export default engTerminal