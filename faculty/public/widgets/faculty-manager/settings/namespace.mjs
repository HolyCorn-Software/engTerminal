/**
 * Copyright 2023 HolyCorn Software
 * The Engineer Terminal
 * This widget allows an engineer to modify settings of a namespace
 */

import CustomAccordion from "./accordion.mjs";
import AlarmObject from "/$/system/static/html-hc/lib/alarm/alarm.mjs";
import { hc, Widget } from "/$/system/static/html-hc/lib/widget/index.mjs";



/**
 * This widget deals with the settings of a given namespace
 */
export default class SettingsNamespaceWidget extends Widget {

    constructor() {
        super();

        this.html = hc.spawn(
            {
                classes: SettingsNamespaceWidget.classList,
                innerHTML: `
                    <div class='container'>
                        <div class='main'>
                            <div class='top'>
                                <div class='title'></div>
                                <div class='caption'></div>
                            </div>
                            <div class='accordion'></div>
                        </div>
                    </div>
                `
            }
        );


        /** @type {CustomAccordion} */ this.accordion
        this.widgetProperty(
            {
                selector: ['', ...CustomAccordion.classList].join('.'),
                parentSelector: '.container >.main >.accordion',
                childType: 'widget',
                property: 'accordion'
            }
        );


        /** @type {faculty.managedsettings.NamespaceSettingWidgetStatedata} */ this.statedata = new AlarmObject

        this.accordion = new CustomAccordion()

        const updateViews = new DelayedAction(() => {
            this.accordion.items = this.statedata.descriptors

        }, 200).execute

        this.statedata.$0.addEventListener('namespaceData.description-change', () => {
            this.html.$('.container >.main >.top >.caption').innerHTML = this.statedata.namespaceData.description
        })

        const updateValues = new DelayedAction(
            () => {
                this.accordion.itemWidgets.forEach(itemW => {
                    const settingView = itemW.content.widgetObject
                    settingView.value = this.statedata.values[settingView.name]
                    settingView.faculty = this.statedata.faculty
                    settingView.namespace = this.statedata.namespace
                })
            }, 200
        ).execute


        this.statedata.$0.addEventListener('values-change', () => {
            updateValues()
        })
        this.statedata.$0.addEventListener('descriptors-change', () => {
            updateViews()
            setTimeout(() => updateValues(), 2000)
        });


    }
    static get classList() {
        return ['hc-faculty-managed-settings-namespace']
    }

}

class DelayedAction {
    constructor(action, delay) {
        let timeout;
        this.execute = () => {
            clearTimeout(timeout)
            timeout = setTimeout(action, delay)
        }
    }
}