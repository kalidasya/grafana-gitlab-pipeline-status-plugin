import defaults from 'lodash/defaults';

import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { GitlabPipelineDataSource } from './DataSource';
import { defaultQuery, GitlabPipelineDataSourceOptions, GitlabPipelineQuery } from './types';

const { FormField } = LegacyForms;

type Props = QueryEditorProps<GitlabPipelineDataSource, GitlabPipelineQuery, GitlabPipelineDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  onQueryTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, projectNameList: event.target.value });
  };

  render() {
    const query = defaults(this.props.query, defaultQuery);
    const { projectNameList } = query;

    return (
      <div className="gf-form">
        <FormField
          labelWidth={20}
          value={projectNameList || ''}
          onChange={this.onQueryTextChange}
          label="Comma separated list of project names"
          tooltip="Use * for all projects"
        />
      </div>
    );
  }
}
