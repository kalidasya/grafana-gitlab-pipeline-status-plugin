import { PanelPlugin } from '@grafana/data';
import { GitlabCIPipelineStatusOptions } from './types';
import { GitlabCIPipelineStatusPanel } from './GitlabBuildStatusPanel';

export const plugin = new PanelPlugin<GitlabCIPipelineStatusOptions>(GitlabCIPipelineStatusPanel).setPanelOptions(
  (builder) => {
    return builder.addSelect({
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
    });
  }
);
