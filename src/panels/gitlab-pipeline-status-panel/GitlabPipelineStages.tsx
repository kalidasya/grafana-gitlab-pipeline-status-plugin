import React from 'react';
import { css } from 'emotion';
import { stylesFactory, useTheme } from '@grafana/ui';
import {
  CachedBlack18dp,
  CheckCircleOutlineBlack18dp,
  HighlightOffBlack18dp,
  PendingBlack18dp,
} from './img/GitlabPipelineImgs';

import { GitlabCIPipelineStageData } from './types';

const getStyles = stylesFactory(theme => {
  return {
    stages: css`
      list-style-type: none;
    `,
    stage: css`
      display: inline;
    `,
  };
});

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

const GitlabPipelineStage: React.FC<GitlabCIPipelineStageData> = ({ name, status, detailsPath, displayNames }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const Icon = getSource(status);

  return (
    <li className={styles.stage}>
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
  const theme = useTheme();
  const styles = getStyles(theme);
  const allPassed = stages.reduce(
    (acc: boolean, [name, status, path]: any) => acc && status.indexOf('passed') >= 0,
    true
  );

  return (
    <ul className={styles.stages}>
      {stages.map(([name, status, detailsPath]: any) => {
        return (
          <GitlabPipelineStage
            {...{ name: name, status: status, detailsPath: detailsPath }}
            displayNames={!allPassed}
          />
        );
      })}
    </ul>
  );
};
