// Copyright (c) Vidar Tonaas Fauske
// Distributed under the terms of the Modified BSD License.

import {
  Application
} from '@phosphor/application';

import {
  Widget
} from '@phosphor/widgets';

import {
  IJupyterWidgetRegistry
 } from '@jupyter-widgets/base';

import { TimeModel, TimeView } from './time';

import { DatetimeModel, DatetimeView } from './datetime';

import { NaiveDatetimeModel } from './naive';

import {
  MODULE_NAME, MODULE_VERSION
} from './version';

const EXTENSION_ID = 'jupyter-widget-datetime:plugin';

/**
 * The widget plugin.
 */
const plugin = {
// TODO: Reintroduce typing when phosphor/lumino transition completed
//const plugin: IPlugin<Application<Widget>, void> = {
  id: EXTENSION_ID,
  requires: [IJupyterWidgetRegistry],
  activate: activateWidgetExtension,
  autoStart: true
};

export default plugin;


/**
 * Activate the widget extension.
 */
function activateWidgetExtension(app: Application<Widget>, registry: IJupyterWidgetRegistry): void {
  registry.registerWidget({
    name: MODULE_NAME,
    version: MODULE_VERSION,
    exports: {
      TimeModel,
      TimeView,
      DatetimeModel,
      DatetimeView,
      NaiveDatetimeModel,
    },
  });
}
