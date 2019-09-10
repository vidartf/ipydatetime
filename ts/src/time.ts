// Copyright (c) Vidar Tonaas Fauske
// Distributed under the terms of the Modified BSD License.

import {
  ISerializers
} from '@jupyter-widgets/base';

import {
  DescriptionView, uuid
} from '@jupyter-widgets/controls';

import {
  CoreDescriptionModel
} from '@jupyter-widgets/controls/lib/widget_core';

import {
  MODULE_NAME, MODULE_VERSION
} from './version';


const PARSER = /(\d\d):(\d\d)(:(\d\d)(.(\d{1,3})\d*)?)?/;

export interface SerializedTime {
    /**
     * Integer hour (24H format)
     */
    hours: number;

    /**
     * Integer minutes
     */
    minutes: number;

    /**
     * Integer seconds
     */
    seconds: number;

    /**
     * Millisconds
     */
    milliseconds: number;
}

export function serialize_time(value: string): SerializedTime | null {
  if (value === null) {
    return null;
  } else {
    const res = PARSER.exec(value);
    if (res === null) {
      return null;
    }
    return {
      hours: Math.min(23, parseInt(res[1], 10)),
      minutes: Math.min(59, parseInt(res[2], 10)),
      seconds: res[4] ? Math.min(59, parseInt(res[4], 10)) : 0,
      milliseconds: res[6] ? parseInt(res[6], 10) : 0,
    };
  }
}

export function deserialize_time(value: SerializedTime) {
    if (value === null) {
        return null;
    } else {
      const parts = [`${
          value.hours.toString().padStart(2, "0")
        }:${
          value.minutes.toString().padStart(2, "0")
        }`];
      if (value.seconds > 0 || value.milliseconds > 0) {
        parts.push(`:${value.seconds.toString().padStart(2, "0")}`);
        if (value.milliseconds > 0) {
          parts.push(`.${value.milliseconds.toString().padStart(3, "0")}`);
        }
      }
      return parts.join('');
    }
}

export const time_serializers = {
  serialize: serialize_time,
  deserialize: deserialize_time
}

export class TimeModel extends CoreDescriptionModel {
  defaults() {
    return {...super.defaults(),
      _model_name: TimeModel.model_name,
      _model_module: TimeModel.model_module,
      _model_module_version: TimeModel.model_module_version,
      _view_name: TimeModel.view_name,
      _view_module: TimeModel.view_module,
      _view_module_version: TimeModel.view_module_version,
      value : null,
      disabled: false,
      min: null,
      max: null,
      step: 60,
    };
  }

  static serializers: ISerializers = {
      ...CoreDescriptionModel.serializers,
      value: time_serializers,
      min: time_serializers,
      max: time_serializers,
    }

  static model_name = 'TimeModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'TimeView';
  static view_module = MODULE_NAME;
  static view_module_version = MODULE_VERSION;
}


export class TimeView extends DescriptionView {
  render() {
    super.render();
    this.el.classList.add('jupyter-widgets');
    this.el.classList.add('widget-inline-hbox');
    this.el.classList.add('widget-timepicker');

    this._timepicker = document.createElement('input');
    this._timepicker.setAttribute('type', 'time');
    this._timepicker.id = this.label.htmlFor = uuid();

    this.el.appendChild(this._timepicker);

    this.listenTo(this.model, 'change:value', this._update_value);
    this.update();
  }

  /**
   * Update the contents of this view
   *
   * Called when the model is changed. The model may have been
   * changed by another view or by a state update from the back-end.
   */
  update(options?: any) {
    if (options === undefined || options.updated_view !== this) {
      this._timepicker!.disabled = this.model.get('disabled');
    }
    return super.update();
  }

  events(): {[e: string]: string} {
      // Typescript doesn't understand that these functions are called, so we
      // specifically use them here so it knows they are being used.
      void this._picker_change;
      void this._picker_focusout;
      return {
          'change [type="time"]': '_picker_change',
          'focusout [type="time"]': '_picker_focusout'
      };
  }

  private _update_value() {
      this._timepicker!.value = this.model.get('value');
  }

  private _picker_change() {
    if (!this._timepicker!.validity.badInput) {
      this.model.set('value', this._timepicker!.value);
      this.touch();
    }
  }

  private _picker_focusout() {
    if (this._timepicker!.validity.badInput) {
      this.model.set('value', null);
      this.touch();
    }
  }

  private _timepicker: HTMLInputElement | undefined;
}
