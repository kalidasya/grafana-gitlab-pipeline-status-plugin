import React from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2, PanelProps } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';

import { GitlabCIPipelineStatusOptions } from './types';
import { GitlabPipelineStatus } from './GitlabPipelineStatus';

interface Props extends PanelProps<GitlabCIPipelineStatusOptions> {}

const getStyles = (options: GitlabCIPipelineStatusOptions) => {
  return (theme: GrafanaTheme2) => css`
    display: flex;
    flex: auto;
    flex-flow: row wrap;
    align-items: ${options.alignItems};
    align-content: ${options.alignContent};
    height: 100%;
    justify-content: ${options.justify};
  `;
};

function zip(...iterables: any[]) {
  if (iterables.length === 0) {
    return [];
  }

  return Array.from({ length: iterables[0].length }).map((_, ind) =>
    iterables.reduce((all, list) => [...all, list[ind]], [])
  );
}

export const GitlabCIPipelineStatusPanel: React.FC<Props> = ({ options, data, width, height }) => {
  console.log('option', options);
  // const theme = useTheme2();
  const styles = useStyles2(getStyles(options));
  const f = data.series.map((serie) => serie.fields.map((v) => v.values.toArray())).pop() || [];
  const pipelines: any[] = zip(...f);

  return (
    <div className={styles}>
      {pipelines.map(([name, id, link, status, startedAt, updatedAt, finishedAt, stages]) => {
        return (
          <GitlabPipelineStatus
            key={id}
            name={name}
            id={id}
            link={link}
            status={status}
            times={{ startedAt: startedAt, updatedAt: updatedAt, finishedAt: finishedAt }}
            stages={stages}
            panelOptions={options}
          />
        );
      })}
    </div>
  );
};
