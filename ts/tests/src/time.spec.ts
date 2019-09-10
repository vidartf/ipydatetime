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
  TimeModel, TimeView
} from '../../src';

describe('Time', () => {

  const timeString = (new Date())
    .toISOString()
    .split('T', 2)[1]
    .slice(0, -1);

  describe('TimeModel', () => {

    it('should be createable', () => {
      let model = createTestModel(TimeModel);
      expect(model).to.be.an(TimeModel);
      expect(model.get('value')).to.be(null);
    });

    it('should be createable with a value', () => {
      let state = { value: timeString };
      let model = createTestModel(TimeModel, state);
      expect(model).to.be.an(TimeModel);
      expect(model.get('value')).to.be(timeString);
    });

    it('should serialize as expected', async () => {
      const state_in = {
        value: {
          hours: 13,
          minutes: 37,
          seconds: 42,
          milliseconds: 333
        }
      };

      const model = await createTestModelFromSerialized(TimeModel, state_in);
      model.widget_manager.register_model(model.model_id, Promise.resolve(model));

      const state_out = await model.widget_manager.get_state();
      const models = Object.keys(state_out.state).map(k => state_out.state[k].state);
      expect(models.length).to.be(1);
      expect(models[0]._model_name).to.be('TimeModel');
      expect(models[0].value).to.eql(state_in.value);
    });

    it('should deserialize to short form', async () => {
      const state_in = {
        value: {
          hours: 13,
          minutes: 37,
          seconds: 0,
          milliseconds: 0
        }
      };

      const model = await createTestModelFromSerialized(TimeModel, state_in);
      expect(model.get('value')).to.be('13:37');
    });

    it('should deserialize to medium form', async () => {
      const state_in = {
        value: {
          hours: 13,
          minutes: 37,
          seconds: 42,
          milliseconds: 0
        }
      };

      const model = await createTestModelFromSerialized(TimeModel, state_in);
      expect(model.get('value')).to.be('13:37:42');
    });

    it('should not be thrown off by irrelevant zeroes', async () => {
      const state_in = {
        value: {
          hours: 0,
          minutes: 0,
          seconds: 0,
          milliseconds: 7
        }
      };

      const model = await createTestModelFromSerialized(TimeModel, state_in);
      expect(model.get('value')).to.be('00:00:00.007');
    });


    it('should deserialize null', async () => {
      const state_in = { value: null };

      const model = await createTestModelFromSerialized(TimeModel, state_in);
      expect(model.get('value')).to.be(null);
    });

    it('should deserialize undefined', async () => {
      const state_in = {};
      const model = await createTestModelFromSerialized(TimeModel, state_in);
      expect(model.get('value')).to.be(null);
    });

  });

  describe('TimeView', () => {

    it('should be createable', async () => {
      const state = {};
      const model = createTestModel(TimeModel, state);
      const view = await createTestView(model, TimeView);
      expect(view).to.be.a(TimeView);
      expect(view.model).to.be(model);
    });

    it('should be updated when the value changes', async () => {
      const state = {};
      const model = createTestModel(TimeModel, state);
      const view = await createTestView(model, TimeView);

      model.set('value', timeString);
      debugger;
      const picker = (view.el.querySelector('input[type="time"]') as HTMLInputElement);
      expect(picker.value).to.equal(timeString);
    });

  });

});
