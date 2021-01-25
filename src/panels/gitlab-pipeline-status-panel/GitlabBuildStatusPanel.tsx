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

export const GitlabCIPipelineStatusPanel: React.FC<Props> = ({ options, data, width, height }) => {
  const justifyContent = options.justify;
  console.log(options);
  const styles = cx(
    useStyles(getComponentStyles),
    css`
      justify-content: ${justifyContent};
    `
  );
  console.log(styles);
  let pipelines: any = [];
  for (let entry of data.series) {
    console.log(entry);
    pipelines = pipelines.concat(
      entry.fields[0].values
        .toArray()
        .map((v, i) => [
          v,
          entry.fields[1].values.toArray()[i],
          entry.fields[2].values.toArray()[i],
          entry.fields[3].values.toArray()[i],
          entry.fields[4].values.toArray()[i],
        ])
    );
  }

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
