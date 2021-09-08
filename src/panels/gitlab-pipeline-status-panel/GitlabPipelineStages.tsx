import React from 'react';
import { css } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import {
  CachedBlack18dp,
  CheckCircleOutlineBlack18dp,
  HighlightOffBlack18dp,
  PendingBlack18dp,
} from './img/GitlabPipelineImgs';

import { GitlabCIPipelineStageData } from './types';
import { GrafanaTheme2 } from '@grafana/data';

const getSource = (status: string) => {
  if (status.indexOf('passed') >= 0) {
    return CheckCircleOutlineBlack18dp;
  }
  if (status === 'failed') {
    return HighlightOffBlack18dp;
  }
  if (status === 'running') {
    return CachedBlack18dp;
  }
  return PendingBlack18dp;
};

const getStagesStyles = (theme: GrafanaTheme2) =>
  css`
    list-style-type: none;
  `;
const getStageStyles = (theme: GrafanaTheme2) =>
  css`
    display: inline;
  `;

const GitlabPipelineStage: React.FC<GitlabCIPipelineStageData> = ({ name, status, detailsPath, displayNames }) => {
  const styles = useStyles2(getStageStyles);
  const Icon = getSource(status);

  return (
    <li className={styles}>
      <span>
        <a href={detailsPath}>
          <Icon size={18} defaultValue={name} />
          {displayNames ? name : ''}
        </a>
      </span>
    </li>
  );
};

export const GitlabPipelineStages: React.FC<any> = ({ stages }) => {
  const styles = useStyles2(getStagesStyles);
  const allPassed = stages.reduce(
    (acc: boolean, [name, status, path]: any) => acc && status.indexOf('passed') >= 0,
    true
  );

  return (
    <ul className={styles}>
      {stages.map(([name, status, detailsPath]: any) => {
        return (
          <GitlabPipelineStage
            {...{ name: name, status: status, detailsPath: detailsPath }}
            displayNames={!allPassed}
            key={name}
          />
        );
      })}
    </ul>
  );
};
