import React from 'react';
import { GrafanaTheme, PanelProps } from '@grafana/data';
import { GitlabCIPipelineStatusOptions } from './types';
import { GitlabPipelineStatus } from './GitlabPipelineStatus';
import { useStyles } from '@grafana/ui';
import { css, cx } from 'emotion';

interface Props extends PanelProps<GitlabCIPipelineStatusOptions> {}

const getComponentStyles = (theme: GrafanaTheme) => css`
  display: flex;
  flex: auto;
  flex-flow: row wrap;
  align-items: stretch;
  align-content: stretch;
  height: 100%;
`;

function zip(...iterables: any[]) {
  return Array.from({ length: iterables[0].length }).map((_, ind) =>
    iterables.reduce((all, list) => [...all, list[ind]], [])
  );
}

export const GitlabCIPipelineStatusPanel: React.FC<Props> = ({ options, data, width, height }) => {
  const justifyContent = options.justify;
  const styles = cx(
    useStyles(getComponentStyles),
    css`
      justify-content: ${justifyContent};
    `
  );
  const f = data.series.map(serie => serie.fields.map(v => v.values.toArray())).pop() || [];
  const pipelines: any[] = zip(...f);

  return (
    <div className={styles}>
      {pipelines.map((pipeline: any) => {
        return (
          <GitlabPipelineStatus
            name={pipeline[0]}
            id={pipeline[1]}
            link={pipeline[2]}
            status={pipeline[3]}
            updatedAt={pipeline[4]}
          />
        );
      })}
    </div>
  );
};
