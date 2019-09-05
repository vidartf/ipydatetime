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

import {
  serialize_time
} from './time';

export interface SerializedDatetime {
    /**
     * UTC full year
     */
    year: number;

    /**
     * UTC zero-based month (0 means January, 11 means December)
     */
    month: number;

    /**
     * UTC day of month
     */
    date: number;

    /**
     * UTC hour (24H format)
     */
    hours: number;

    /**
     * UTC minutes
     */
    minutes: number;

    /**
     * UTC seconds
     */
    seconds: number;

    /**
     * UTC millisconds
     */
    milliseconds: number;
}

export function serialize_datetime(value: Date): SerializedDatetime | null {
  if (value === null) {
    return null;
  } else {
    return {
      year: value.getUTCFullYear(),
      month: value.getUTCMonth(),
      date: value.getUTCDate(),
      hours: value.getUTCHours(),
      minutes: value.getUTCMinutes(),
      seconds: value.getUTCSeconds(),
      milliseconds: value.getUTCMilliseconds(),
    };
  }
}

export function deserialize_datetime(value: SerializedDatetime) {
    if (value === null) {
        return null;
    } else {
      let date = new Date();
      date.setUTCFullYear(value.year, value.month, value.date);
      date.setUTCHours(
        value.hours,
        value.minutes,
        value.seconds,
        value.milliseconds);
      return date;
    }
}

export const datetime_serializers = {
  serialize: serialize_datetime,
  deserialize: deserialize_datetime
}

export class DatetimeModel extends CoreDescriptionModel {
  defaults() {
    return {...super.defaults(),
      _model_name: DatetimeModel.model_name,
      _model_module: DatetimeModel.model_module,
      _model_module_version: DatetimeModel.model_module_version,
      _view_name: DatetimeModel.view_name,
      _view_module: DatetimeModel.view_module,
      _view_module_version: DatetimeModel.view_module_version,
      value : null,
      disabled: false,
      min: null,
      max: null,
    };
  }

  static serializers: ISerializers = {
      ...CoreDescriptionModel.serializers,
      value: datetime_serializers,
      min: datetime_serializers,
      max: datetime_serializers,
    }

  static model_name = 'TimeModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'TimeView';
  static view_module = MODULE_NAME;
  static view_module_version = MODULE_VERSION;
}


export class DatetimeView extends DescriptionView {
  render() {
    super.render();
    this.el.classList.add('jupyter-widgets');
    this.el.classList.add('widget-inline-hbox');
    this.el.classList.add('widget-datetimepicker');

    const test = document.createElement('input');
    test.type = 'datetime-local';
    if (test.type === 'text') {
      // No native support, split into date and time input:
      this._datepicker = document.createElement('input');
      this._datepicker.setAttribute('type', 'date');
      this._datepicker.id = this.label.htmlFor = uuid();

      this._timepicker = document.createElement('input');
      this._timepicker.setAttribute('type', 'time');
      this._timepicker.id = uuid();

      this.el.appendChild(this._datepicker);
      this.el.appendChild(this._timepicker);
    } else {
      this._datetimepicker = test;
      this._datetimepicker.id = this.label.htmlFor = uuid();
      this.el.appendChild(this._datetimepicker);
    }

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
      if (this._datetimepicker) {
        this._datetimepicker.disabled = this.model.get('disabled');
      } else {
        this._datepicker!.disabled = this.model.get('disabled');
        this._timepicker!.disabled = this.model.get('disabled');
      }
    }
    return super.update();
  }

  events(): {[e: string]: string} {
      // Typescript doesn't understand that these functions are called, so we
      // specifically use them here so it knows they are being used.
      void this._picker_change;
      void this._picker_focusout;
      return {
          'change [type="date"]': '_picker_change',
          'change [type="time"]': '_picker_change',
          'change [type="datetime-local"]': '_picker_change',
          'focusout [type="date"]': '_picker_focusout',
          'focusout [type="datetime-local"]': '_picker_focusout',
          'focusout [type="time"]': '_picker_focusout'
      };
  }

  private _update_value() {
    const value = this.model.get('value') as Date | null;
    if (this._datetimepicker) {
      this._datetimepicker.value = value ? value.toISOString().slice(0, -1) : '';
    } else {
      this._datepicker!.valueAsDate = value;
      const iso = value && value.toISOString().split('T', 2)[1].slice(0, -1);
      this._timepicker!.value = iso || '';
    }
  }

  private _picker_change() {
    if (this._datetimepicker) {
      if (!this._datetimepicker.validity.badInput) {
        this.model.set('value', new Date(this._datetimepicker.value));
        this.touch();
      }
    } else {
      if (
        !this._datepicker!.validity.badInput
        && !this._timepicker!.validity.badInput
      ) {
        const date = this._datepicker!.valueAsDate;
        const time = serialize_time(this._timepicker!.value);
        if (date !== null && time !== null) {
          // * Use local time *
          date.setHours(
            time.hours,
            time.minutes,
            time.seconds,
            time.milliseconds);
        }
        this.model.set('value', time !== null && date);
        this.touch();
      }
    }
  }

  private _picker_focusout() {
    const pickers = [
      this._datetimepicker,
      this._datepicker,
      this._timepicker
    ];
    if (pickers.some(p => p && p.validity.badInput)) {
      this.model.set('value', null);
      this.touch();
    }
  }

  private _datetimepicker: HTMLInputElement | undefined;
  private _timepicker: HTMLInputElement | undefined;
  private _datepicker: HTMLInputElement | undefined;
}
