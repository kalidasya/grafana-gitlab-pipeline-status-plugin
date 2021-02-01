import React from 'react';
import { css, cx } from 'emotion';

import { GrafanaTheme, dateTime } from '@grafana/data';
import { useStyles } from '@grafana/ui';

import { GitlabCIPipelineStatusData } from './types';

import './GitlabPipelineStatus.css';

const getComponentStyles = (theme: GrafanaTheme) => css`
  flex-grow: 0;
  flex-shrink: 0;
  border-radius: 10px;
  padding: 10px;
  margin: 2px;
`;

const getColor = (status: string) => {
  if (status === 'success') {
    return 'green';
  }
  if (status === 'failed') {
    return 'red';
  }
  if (status === 'running') {
    return 'blue';
  }
  return 'grey';
};

export const GitlabPipelineStatus: React.FC<GitlabCIPipelineStatusData> = ({ name, id, link, status, updatedAt }) => {
  let styles = cx(
    useStyles(getComponentStyles),
    css`
      background: ${getColor(status)};
    `
  );
  if (status === 'running') {
    styles += ' blink';
  }
  const elapsed = updatedAt !== null ? dateTime(updatedAt).from(dateTime()) : 'n.a.';
  return (
    <div className={styles}>
      <a href={link}>
        <div>{name}</div>
        <div>#{id}</div>
        <div>{elapsed}</div>
      </a>
    </div>
  );
};
