// Copyright (c) Vidar Tonaas Fauske
// Distributed under the terms of the Modified BSD License.

import {
  ISerializers
} from '@jupyter-widgets/base';

import {
  CoreDescriptionModel
} from '@jupyter-widgets/controls/lib/widget_core';

import {
  DatetimeModel
} from './datetime';


export interface SerializedNaiveDatetime {
    /**
     * full year
     */
    year: number;

    /**
     * zero-based month (0 means January, 11 means December)
     */
    month: number;

    /**
     * day of month
     */
    date: number;

    /**
     * hour (24H format)
     */
    hours: number;

    /**
     * minutes
     */
    minutes: number;

    /**
     * seconds
     */
    seconds: number;

    /**
     * millisconds
     */
    milliseconds: number;
}

export function serialize_naive(value: Date): SerializedNaiveDatetime | null {
  if (value === null) {
    return null;
  } else {
    return {
      year: value.getFullYear(),
      month: value.getMonth(),
      date: value.getDate(),
      hours: value.getHours(),
      minutes: value.getMinutes(),
      seconds: value.getSeconds(),
      milliseconds: value.getMilliseconds(),
    };
  }
}

export function deserialize_naive(value: SerializedNaiveDatetime) {
    if (value === null) {
        return null;
    } else {
      let date = new Date();
      date.setFullYear(value.year, value.month, value.date);
      date.setHours(
        value.hours,
        value.minutes,
        value.seconds,
        value.milliseconds);
      return date;
    }
}

export const naive_serializers = {
  serialize: serialize_naive,
  deserialize: deserialize_naive
}

export class NaiveDatetimeModel extends DatetimeModel {
  defaults() {
    return {...super.defaults(),
      _model_name: NaiveDatetimeModel.model_name,
      _view_name: NaiveDatetimeModel.view_name,
    };
  }

  static serializers: ISerializers = {
      ...CoreDescriptionModel.serializers,
      value: naive_serializers,
      min: naive_serializers,
      max: naive_serializers,
    }

  static model_name = 'NaiveDatetimeModel';
}
