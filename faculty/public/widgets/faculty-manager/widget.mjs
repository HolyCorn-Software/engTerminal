/**
 * Copyright 2022 HolyCorn Software
 * This widget allows an engineer to manage faculties in the system
 */

import setup from "./logic.mjs";
import { hc, Widget } from "/$/system/static/html-hc/lib/widget/index.mjs";
import FileExplorer from "/$/system/static/html-hc/widgets/file-explorer/widget.mjs";


export default class FacultyManager extends Widget {


    constructor() {

        super();

        this.html = hc.spawn(
            {
                classes: ['hc-engTerminal-faculty-manager'],
                innerHTML: `
                    <div class='container'>
                        <div class='explorer'></div>
                    </div>
                `
            }
        );

        /** @type {FileExplorer} */ this.explorer

        this.widgetProperty(
            {
                selector: ['', ...FileExplorer.classList].join('.'),
                parentSelector: '.container >.explorer',
                property: 'explorer',
                childType: 'widget'
            }
        );

        this.explorer = new FileExplorer()

        this.waitTillDOMAttached().then(() => {
            setup(this)
        })


    }


}