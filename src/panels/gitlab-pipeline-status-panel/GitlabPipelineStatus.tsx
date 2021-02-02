import React from 'react';

import { dateTime } from '@grafana/data';

import { GitlabCIPipelineStatusData } from './types';

export const GitlabPipelineStatus: React.FC<GitlabCIPipelineStatusData> = ({
  name,
  id,
  link,
  status,
  updatedAt,
  className,
}) => {
  const elapsed = updatedAt !== null ? dateTime(updatedAt).from(dateTime()) : 'n.a.';
  return (
    <div className={className}>
      <a href={link}>
        <div>{name}</div>
        <div>
          #{id} {status}
        </div>
        <div>{elapsed}</div>
      </a>
    </div>
  );
};
