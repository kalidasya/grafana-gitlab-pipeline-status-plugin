import { PanelPlugin } from '@grafana/data';
import { GitlabCIPipelineStatusOptions } from './types';
import { GitlabCIPipelineStatusPanel } from './GitlabBuildStatusPanel';

export const plugin = new PanelPlugin<GitlabCIPipelineStatusOptions>(GitlabCIPipelineStatusPanel).setPanelOptions(
  builder => {
    return builder
      .addSelect({
        name: 'Justify',
        path: 'justify',
        description: 'Horizontal alignment of the cards',
        settings: {
          allowCustomValue: false,
          options: [
            { value: 'flex-start', label: 'Left aligned' },
            { value: 'flex-end', label: 'Right aligned' },
            { value: 'center', label: 'Center' },
            { value: 'space-between', label: 'Even distribution 1' },
            { value: 'space-around', label: 'Even distribution 2' },
            { value: 'space-evenly', label: 'Even distribution 3' },
          ],
        },
      })
      .addColorPicker({
        name: 'Failed',
        path: 'failed',
        description: 'Color of the failed pipelines',
        defaultValue: 'red',
        category: ['Color'],
        settings: {
          disableNamedColors: true,
          allowUndefined: false,
          textWhenUndefined: 'Please define a color',
        },
      })
      .addColorPicker({
        name: 'Passed',
        path: 'passed',
        description: 'Color of the passed pipelines',
        defaultValue: 'green',
        category: ['Color'],
        settings: {
          disableNamedColors: true,
          allowUndefined: false,
          textWhenUndefined: 'Please define a color',
        },
      })
      .addColorPicker({
        name: 'Running start',
        path: 'runningStart',
        description: 'First color of the running animation',
        defaultValue: '#1056c0',
        category: ['Color'],
        settings: {
          disableNamedColors: true,
          allowUndefined: false,
          textWhenUndefined: 'Please define a color',
        },
      })
      .addColorPicker({
        name: 'Running end',
        path: 'runningEnd',
        description: 'End color of the running animation',
        defaultValue: '#1056c0',
        category: ['Color'],
        settings: {
          disableNamedColors: true,
          allowUndefined: false,
          textWhenUndefined: 'Please define a color',
        },
      })
      .addColorPicker({
        name: 'other',
        path: 'other',
        description: 'Color of the other pipelines states (e.g. cancelled)',
        defaultValue: 'grey',
        category: ['Color'],
        settings: {
          disableNamedColors: true,
          allowUndefined: false,
          textWhenUndefined: 'Please define a color',
        },
      });
  }
);
