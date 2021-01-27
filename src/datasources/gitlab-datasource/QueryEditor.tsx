import defaults from 'lodash/defaults';

import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { GitlabPipelineDataSource } from './DataSource';
import { defaultQuery, GitlabPipelineDataSourceOptions, GitlabPipelineQuery } from './types';

const { FormField } = LegacyForms;

type Props = QueryEditorProps<GitlabPipelineDataSource, GitlabPipelineQuery, GitlabPipelineDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  onProjectNameListChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, projectNameList: event.target.value });
  };

  onGroupnameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, groupName: event.target.value });
  };

  render() {
    // todo query gitlab to get list of groups (no graphql api)
    // and list of projects
    const query = defaults(this.props.query, defaultQuery);
    const { groupName, projectNameList } = query;

    return (
      <div className="gf-form">
        <FormField
          labelWidth={20}
          value={groupName || ''}
          onChange={this.onGroupnameChange}
          label="Name of the gitlab group"
          tooltip="Use * for all groups"
        />
        <FormField
          labelWidth={20}
          value={projectNameList || ''}
          onChange={this.onProjectNameListChange}
          label="Comma separated list of project names"
          tooltip="Use * for all projects"
        />
      </div>
    );
  }
}
