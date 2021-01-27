import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface GitlabPipelineQuery extends DataQuery {
  projectNameList: string;
  groupName: string;
}

export const defaultQuery: Partial<GitlabPipelineQuery> = {
  projectNameList: '*',
  groupName: '',
};

/**
 * These are options configured for each DataSource instance
 */
export interface GitlabPipelineDataSourceOptions extends DataSourceJsonData {
  url: string;
  // groupName: string;
}

export interface GitlabPipelineDataSourceSecureOptions extends DataSourceJsonData {
  privateToken: string;
}