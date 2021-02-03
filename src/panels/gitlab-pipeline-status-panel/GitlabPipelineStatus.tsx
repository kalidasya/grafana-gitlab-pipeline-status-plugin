import React from 'react';
import { css, cx, keyframes } from 'emotion';
import { GrafanaTheme, dateTime, getColorForTheme } from '@grafana/data';
import { stylesFactory, useTheme } from '@grafana/ui';

import { GitlabCIPipelineStatusData } from './types';
import { GitlabPipelineStages } from './GitlabPipelineStages';

const getStyles = stylesFactory(theme => {
  return {
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

const getTimeForStatus = ({ startedAt, updatedAt, finishedAt }: any) => {
  if (status === 'running') {
    return dateTime(startedAt).from(dateTime());
  } else if (finishedAt) {
    return dateTime(finishedAt).from(dateTime());
  }
  return dateTime(updatedAt).from(dateTime());
};

export const GitlabPipelineStatus: React.FC<GitlabCIPipelineStatusData> = ({
  name,
  id,
  link,
  status,
  times,
  stages,
  panelOptions,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const cssClass = cx(getBackgroundColor(status, panelOptions, theme), styles.panel);
  const elapsed = getTimeForStatus(times);

  return (
    <div className={cssClass}>
      <a href={link}>
        <div>{name}</div>
        <div>
          #{id} {status}
        </div>
        <div>{elapsed}</div>
        <div>
          <GitlabPipelineStages stages={stages} />
        </div>
      </a>
    </div>
  );
};
