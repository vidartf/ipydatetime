// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import expect = require('expect.js');

import {
  // Add any needed widget imports here (or from controls)
} from '@jupyter-widgets/base';

import {
  createTestModel
} from './utils.spec';

// @jupyter-widgets/controls depend on
// jquery-ui, and karma(-typescript) requires some workarounds:
import 'jquery-ui/ui/version';
import 'jquery-ui/ui/plugin';
import 'jquery-ui/ui/widget';
import 'jquery-ui/ui/widgets/mouse';
import 'jquery-ui/ui/widgets/slider';

import {
  TimeModel
} from '../../src/';

describe('Time', () => {

  describe('TimeModel', () => {

    it('should be createable', () => {
      let model = createTestModel(TimeModel);
      expect(model).to.be.an(TimeModel);
      expect(model.get('value')).to.be(null);
    });

    it('should be createable with a value', () => {
      const timeString = (new Date()).toISOString().slice(0, -1);
      let state = { value: timeString };
      let model = createTestModel(TimeModel, state);
      expect(model).to.be.an(TimeModel);
      expect(model.get('value')).to.be(timeString);
    });

  });

});
