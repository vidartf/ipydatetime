// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import expect = require('expect.js');

import {
  // Add any needed widget imports here (or from controls)
} from '@jupyter-widgets/base';

import {
  createTestModel, createTestView, createTestModelFromSerialized
} from './utils.spec';

// @jupyter-widgets/controls depend on
// jquery-ui, and karma(-typescript) requires some workarounds:
import 'jquery-ui/ui/version';
import 'jquery-ui/ui/plugin';
import 'jquery-ui/ui/widget';
import 'jquery-ui/ui/widgets/mouse';
import 'jquery-ui/ui/widgets/slider';

import {
  DatetimeModel, DatetimeView
} from '../../src';

describe('Datetime', () => {

  const date = new Date();

  describe('DatetimeModel', () => {

    it('should be createable', () => {
      let model = createTestModel(DatetimeModel);
      expect(model).to.be.an(DatetimeModel);
      expect(model.get('value')).to.be(null);
    });

    it('should be createable with a value', () => {
      let state = { value: date };
      let model = createTestModel(DatetimeModel, state);
      expect(model).to.be.an(DatetimeModel);
      expect(model.get('value')).to.be(date);
    });

    it('should serialize as expected', async () => {
      const state_in = {
        value: {
          year: 2002,
          month: 2,
          date: 20,
          hours: 20,
          minutes: 2,
          seconds: 20,
          milliseconds: 2
        }
      };

      const model = await createTestModelFromSerialized(DatetimeModel, state_in);
      model.widget_manager.register_model(model.model_id, Promise.resolve(model));

      const state_out = await model.widget_manager.get_state();
      const models = Object.keys(state_out.state).map(k => state_out.state[k].state);
      expect(models.length).to.be(1);
      expect(models[0]._model_name).to.be('TimeModel');
      expect(models[0].value).to.eql(state_in.value);
    });

    it('should deserialize to Date object', async () => {
      const state_in = {
        value: {
          year: 2002,
          month: 2,
          date: 20,
          hours: 20,
          minutes: 2,
          seconds: 20,
          milliseconds: 2
        }
      };

      const model = await createTestModelFromSerialized(DatetimeModel, state_in);
      expect(model.get('value')).to.eql(new Date(Date.UTC(2002, 2, 20, 20, 2, 20, 2)));
    });


    it('should deserialize null', async () => {
      const state_in = { value: null };

      const model = await createTestModelFromSerialized(DatetimeModel, state_in);
      expect(model.get('value')).to.be(null);
    });

    it('should deserialize undefined', async () => {
      const state_in = {};
      const model = await createTestModelFromSerialized(DatetimeModel, state_in);
      expect(model.get('value')).to.be(null);
    });

  });

  describe('DatetimeView', () => {

    it('should be createable', async () => {
      const state = {};
      const model = createTestModel(DatetimeModel, state);
      const view = await createTestView(model, DatetimeView);
      expect(view).to.be.a(DatetimeView);
      expect(view.model).to.be(model);
    });

  });

});
