/**
 * Copyright 2022 HolyCorn Software
 * The Engineer Terminal
 * This widget (item) is part of the plugin-manager widget.
 * This widget represents a single plugin, which can be managed.
 */

import PluginManagementActions from "./actions/widget.mjs";
import LastErrorPopup from "./last-error.item.mjs";
import { hc, Widget } from "/$/system/static/html-hc/lib/widget/index.mjs";
import HCTSBrandedPopup from "/$/system/static/html-hc/widgets/branded-popup/popup.mjs";


export default class PluginItem extends Widget {


    /**
     *  
     * @param {import("./types.js").PluginFrontendData} plugin 
     */
    constructor(plugin) {
        super();

        this.html = hc.spawn(
            {
                classes: ['hc-engTerminal-plugin-manager-item'],
                innerHTML: `
                    <div class='container'>
                        <div class='icon'>
                            <img src='/$/${plugin.descriptor.faculty}/$plugins/${plugin.descriptor.name}/@public/icon.png'>
                        </div>

                        <table class='information'>
                            <tbody></tbody>
                        </table>

                        <div class='actions'>
                        </div>
                        
                    </div>
                `
            }
        );

        /** @type {string[][]} */ this.information
        this.pluralWidgetProperty(
            {
                selector: 'tr',
                parentSelector: '.container >.information >tbody',
                property: 'information',
                transforms: {
                    /**
                     * 
                     * @param {string[]} stringArray 
                     */
                    set: (stringArray) => {
                        return hc.spawn(
                            {
                                tag: `tr`,
                                children: stringArray.map(string => hc.spawn(
                                    {
                                        innerHTML: typeof string === 'string' ? string : undefined,
                                        children: [string instanceof HTMLElement ? string : undefined].filter(x => typeof x !== 'undefined'),
                                        tag: 'td'
                                    }
                                ))
                            }
                        )
                    }
                }
            }
        );



        const setInformation = () => {

            const errorTrigger = hc.spawn({ innerHTML: `Tap to view`, classes: ['hc-engTerminal-plugin-manager-item-error-dialog-trigger'] });
            errorTrigger.addEventListener('click', () => {
                new LastErrorPopup(plugin).show()
            });
            const stateIndicator = hc.spawn({ innerHTML: `${plugin.state[0].toUpperCase()}${plugin.state.substring(1)}`, classes: ['hc-engTerminal-plugin-manager-item-state-indicator', plugin.state] })

            this.information = [
                ['Name', plugin.descriptor.label],
                ['Version', `${plugin.descriptor.version.label} (${plugin.descriptor.version.code})`],
                ['Codename', plugin.descriptor.name],
                ['Namespace', plugin.descriptor.namespace],
                ['State', stateIndicator],
                ['Last Error', plugin.error ? errorTrigger : '']
            ]

        }

        plugin.$0.addEventListener('change', () => {
            setInformation()
        })

        setInformation()


        /** @type {PluginManagementActions} */ this.actions
        this.widgetProperty(
            {
                selector: ['', ...PluginManagementActions.classList].join('.'),
                parentSelector: '.container >.actions',
                childType: 'widget',
                property: 'actions',
            }
        );

        this.actions = new PluginManagementActions(plugin)

        this.actions.addEventListener('uninstall', () => {


            const properties = ['width', 'height']
            for (const property of properties) {
                this.html.style.setProperty(`--initial-${property}`, `${this.html.getBoundingClientRect()[property]}px`)
            }


            let fxn;
            this.html.addEventListener('animationend', fxn = (event) => {

                if (event.target !== this.html) {
                    return
                }

                this.html.remove()
                this.html.removeEventListener('animationend', fxn)
            })

            this.html.classList.add('uninstall')

        });

        /** @type {function(("require-refresh"), function(CustomEvent), AddEventListenerOptions)} */ this.addEventListener
        
        this.actions.addEventListener('require-refresh', () => {
            this.dispatchEvent(new CustomEvent('require-refresh'))
        })


    }


}