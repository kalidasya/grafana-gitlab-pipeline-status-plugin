import React from 'react';
import { css, cx, keyframes } from 'emotion';
import { GrafanaTheme, PanelProps } from '@grafana/data';
import { getColorForTheme } from '@grafana/data';
import { stylesFactory, useTheme } from '@grafana/ui';

import { GitlabCIPipelineStatusOptions } from './types';
import { GitlabPipelineStatus } from './GitlabPipelineStatus';

interface Props extends PanelProps<GitlabCIPipelineStatusOptions> {}

const getStyles = stylesFactory((theme, { justify }) => {
  return {
    wrapper: css`
      display: flex;
      flex: auto;
      flex-flow: row wrap;
      align-items: stretch;
      align-content: stretch;
      height: 100%;
      justify-content: ${justify};
    `,
    panel: css`
      flex-grow: 0;
      flex-shrink: 0;
      border-radius: 10px;
      padding: 10px;
      margin: 2px;
    `,
  };
});

const getBackgroundColor = (
  status: any,
  { passed, failed, other, runningStart, runningEnd }: any,
  theme: GrafanaTheme
) => {
  if (status === 'success') {
    return css`
      background-color: ${getColorForTheme(passed, theme)};
    `;
  }
  if (status === 'failed') {
    return css`
      background-color: ${getColorForTheme(failed, theme)};
    `;
  }
  if (status === 'running') {
    const blinking = keyframes`
      0%		{ background-color: ${getColorForTheme(runningStart, theme)};}
      50%	  { background-color: ${getColorForTheme(runningEnd, theme)};}
      100%	{ background-color: ${getColorForTheme(runningStart, theme)};}
    `;
    return css`
      animation: ${blinking} 3s ease infinite;
    `;
  }
  return css`
    background-color: ${getColorForTheme(other, theme)};
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
  const theme = useTheme();
  const styles = getStyles(theme, options);
  const f = data.series.map(serie => serie.fields.map(v => v.values.toArray())).pop() || [];
  const pipelines: any[] = zip(...f);

  return (
    <div className={styles.wrapper}>
      {pipelines.map(([name, id, link, status, updatedAt]) => {
        const cssClass = cx(getBackgroundColor(status, options, theme), styles.panel);
        return (
          <GitlabPipelineStatus
            name={name}
            id={id}
            link={link}
            status={status}
            updatedAt={updatedAt}
            className={cssClass}
          />
        );
      })}
    </div>
  );
};
