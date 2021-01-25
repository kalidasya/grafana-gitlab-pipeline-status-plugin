import { DataSourcePlugin } from '@grafana/data';
import { GitlabPipelineDataSource } from './DataSource';
import { ConfigEditor } from './ConfigEditor';
import { QueryEditor } from './QueryEditor';
import { GitlabPipelineQuery, GitlabPipelineDataSourceOptions } from './types';

export const plugin = new DataSourcePlugin<
  GitlabPipelineDataSource,
  GitlabPipelineQuery,
  GitlabPipelineDataSourceOptions
>(GitlabPipelineDataSource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);
