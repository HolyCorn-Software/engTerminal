/**
 * Copyright 2023 HolyCorn Software
 * The Engineer Terminal
 * This widget is used to allow the user modify a single setting
 */

import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.mjs";
import { handle } from "/$/system/static/errors/error.mjs";
import { hc, Widget } from "/$/system/static/html-hc/lib/widget/index.mjs";
import ActionButton from "/$/system/static/html-hc/widgets/action-button/button.mjs";
import MultiFlexForm from "/$/system/static/html-hc/widgets/multi-flex-form/flex.mjs";

/** 
 * This variable contains the original value of a setting, as known by the server.
 * It allows us to know if the current value differs, and if we can update
 */
const originalValue = Symbol()

export default class SettingView extends Widget {


    /**
     * 
     * @param {faculty.managedsettings.SettingWidgetData} data 
     */
    constructor(data) {
        super();
        super.html = hc.spawn(
            {
                classes: SettingView.classList,
                innerHTML: `
                    <div class='container'>
                        <div class='description'></div>
                        <div class='form'></div>
                        <div class='actions'></div>
                    </div>
                `
            }
        );

        /** @type {MultiFlexForm} */ this.form
        this.widgetProperty(
            {
                selector: ['', ...MultiFlexForm.classList].join('.'),
                parentSelector: '.container >.form',
                childType: 'widget',
                property: 'form',
            }
        );
        this.form = new MultiFlexForm()

        /** @type {faculty.managedsettings.SettingDescriptor['description']} */ this.description
        this.htmlProperty('.container >.description', 'description', 'innerHTML')

        /** @type {ActionButton[]} */ this.actions
        this.pluralWidgetProperty(
            {
                selector: ['', ...ActionButton.classList].join('.'),
                parentSelector: '.container >.actions',
                childType: 'widget',
                property: 'actions'
            }
        );

        const doUpdate = this.updateData.bind(this)
        const doClear = this.clearData.bind(this)

        this.actions = [
            new ActionButton(
                {
                    content: `Update`,
                    onclick: function () {
                        this.loadWhilePromise(doUpdate()).then(x => {
                            this.state = 'success'
                        }).catch(e => handle(e))
                    },
                    state: 'disabled'
                }
            ),
            new ActionButton(
                {
                    content: `Clear`,
                    onclick: function () {
                        this.loadWhilePromise(doClear()).then(x => {
                            this.state = 'success'
                        }).catch(e => handle(e))
                    }
                }
            )
        ];




        /** @type {faculty.managedsettings.SettingDescriptor['label']} */ this.label
        /** @type {faculty.managedsettings.SettingDescriptor['name']} */ this.name
        /** @type {string} */ this.faculty
        /** @type {string} */ this.namespace

        /** @type {string|number|object|boolean} */ this.value
        Reflect.defineProperty(this, 'value', {
            get: () => {
                const v = this.form.value[this.name]
                return v === '' ? undefined : v
            },
            set: value => {
                this.form.values[this.name] = value || ''
                this[originalValue] ??= value
                setTimeout(() => this.updateButtons(), 2000)
            },
            configurable: true,
            enumerable: true
        });

        const originalValue0 = Symbol()
        /** @type {typeof this.value} */ this[originalValue]
        Reflect.defineProperty(this, originalValue, {
            get: () => this[originalValue0] === '' ? undefined : this[originalValue0],
            set: (v) => {
                this[originalValue0] = v
                setTimeout(() => this.updateButtons(), 2000)
            },
            configurable: true,
            enumerable: true
        })

        /** @type {faculty.managedsettings.SettingDescriptor['input']} */  this.input
        Reflect.defineProperty(this, 'input', {
            get: () => this.form.quickStructure[0]?.[0],
            set: v => {
                this.form.quickStructure = [[{ ...v, name: this.name }]]
            },
            configurable: true,
            enumerable: true
        });

        this.form.addEventListener('change', () => this.updateButtons())

        Object.assign(this, data);

    }

    updateButtons() {
        this.actions[0].state = this[originalValue] === this.value ? 'disabled' : 'initial'
        this.actions[1].state = typeof this[originalValue] === 'undefined' ? 'disabled' : 'initial'
    }

    async updateData() {
        await hcRpc.engTerminal.faculty.settings.set(this.faculty, { namespace: this.namespace, name: this.name, value: this.value })
        this[originalValue] = this.value
    }
    async clearData() {
        await hcRpc.engTerminal.faculty.settings.clear(this.faculty, { namespace: this.namespace, name: this.name })
        this.value = this[originalValue] = undefined
    }
    static get classList() {
        return ['hc-faculty-managed-settings-item']
    }

}