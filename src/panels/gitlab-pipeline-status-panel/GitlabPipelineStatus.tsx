import React from 'react';
import { css, cx, keyframes } from '@emotion/css';
import { GrafanaTheme2, dateTime } from '@grafana/data';
import { useStyles2, useTheme2 } from '@grafana/ui';

import { GitlabCIPipelineStatusData } from './types';
import { GitlabPipelineStages } from './GitlabPipelineStages';

const getStyles = (theme: GrafanaTheme2) => css`
  flex-grow: 0;
  flex-shrink: 0;
  border-radius: 10px;
  padding: 10px;
  margin: 2px;
`;

const getBackgroundColor = (
  status: string,
  { passed, failed, other, runningStart, runningEnd }: any,
  theme: GrafanaTheme2
) => {
  if (status === 'success') {
    return css`
      background-color: ${theme.visualization.getColorByName(passed)};
    `;
  }
  if (status === 'failed') {
    return css`
      background-color: ${theme.visualization.getColorByName(failed)};
    `;
  }
  if (status === 'running') {
    const blinking = keyframes`
      0%		{ background-color: ${theme.visualization.getColorByName(runningStart)};}
      50%	  { background-color: ${theme.visualization.getColorByName(runningEnd)};}
      100%	{ background-color: ${theme.visualization.getColorByName(runningStart)};}
    `;
    return css`
      animation: ${blinking} 3s ease infinite;
    `;
  }
  return css`
    background-color: ${theme.visualization.getColorByName(other)};
  `;
};

const getTimeForStatus = (status: string, { startedAt, updatedAt, finishedAt }: any) => {
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
  const theme = useTheme2();
  const styles = useStyles2(getStyles);
  const cssClass = cx(getBackgroundColor(status, panelOptions, theme), styles);
  const elapsed = getTimeForStatus(status, times);

  return (
    <div className={cssClass}>
      <a href={link}>
        <div>{name}</div>
        <div>
          #{id} {status}
        </div>
        <div>{elapsed}</div>
        <div>
          <GitlabPipelineStages stages={stages || []} />
        </div>
      </a>
    </div>
  );
};
