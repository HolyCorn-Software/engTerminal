/**
 * Copyright 2023 HolyCorn Software
 * The Engineer Terminal
 * This widget is a modified accordion widget, made to suit the faculty-manager/settings widget
 */

import SettingView from "./setting-view.mjs";
import { hc } from "/$/system/static/html-hc/lib/widget/index.mjs";
import AccordionItem from "/$/system/static/html-hc/widgets/arcordion/item.mjs";
import Accordion from "/$/system/static/html-hc/widgets/arcordion/widget.mjs";


/**
 * @extends Accordion<faculty.managedsettings.SettingDescriptor,SettingView>
 */
export default class CustomAccordion extends Accordion {

    constructor() {
        super()
    }


    /**
     * This method should is overridden so that the system can pass in data about an item, and receive a widget of type AccordionItem
     * @param {faculty.managedsettings.SettingWidgetData} input
     */
    dataToWidget(input) {
        return new AccordionItem(
            {
                label: `<div class='hc-faculty-managed-settings-item-accordion-label'><img src='${input.icon}'><div>${input.label}</div></div>`,
                content: new SettingView(input).html
            }
        )
    }

    /**
     * This method should is overridden so that the system can pass in a widget of type AccordionItem, and receive data about the widget. The data should be sufficient to re-construct a similar widget using the dataToWidget() method.
     * @param {AccordionItem<SettingView>} input
     * @returns {faculty.managedsettings.SettingDescriptor}
     */
    widgetToData(input) {
        const widget = input.content.widgetObject

        return {
            input: widget.input,
            label: widget.label,
            name: widget.name,
            description: widget.description
        }

    }



}

hc.importModuleCSS(import.meta.url);