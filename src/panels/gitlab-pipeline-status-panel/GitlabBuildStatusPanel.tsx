import React from 'react';
import { css } from 'emotion';
import { PanelProps } from '@grafana/data';
import { stylesFactory, useTheme } from '@grafana/ui';

import { GitlabCIPipelineStatusOptions } from './types';
import { GitlabPipelineStatus } from './GitlabPipelineStatus';

interface Props extends PanelProps<GitlabCIPipelineStatusOptions> {}

const getStyles = stylesFactory((theme, { justify, alignContent, alignItems }) => {
  return {
    wrapper: css`
      display: flex;
      flex: auto;
      flex-flow: row wrap;
      align-items: ${alignItems};
      align-content: ${alignContent};
      height: 100%;
      justify-content: ${justify};
    `,
  };
});

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
  const theme = useTheme();
  const styles = getStyles(theme, options);
  const f = data.series.map(serie => serie.fields.map(v => v.values.toArray())).pop() || [];
  const pipelines: any[] = zip(...f);

  return (
    <div className={styles.wrapper}>
      {pipelines.map(([name, id, link, status, startedAt, updatedAt, finishedAt, stages]) => {
        return (
          <GitlabPipelineStatus
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
