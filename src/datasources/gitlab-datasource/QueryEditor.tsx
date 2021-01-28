import defaults from 'lodash/defaults';

import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { GitlabPipelineDataSource } from './DataSource';
import { defaultQuery, GitlabPipelineDataSourceOptions, GitlabPipelineQuery } from './types';

const { FormField } = LegacyForms;

type Props = QueryEditorProps<GitlabPipelineDataSource, GitlabPipelineQuery, GitlabPipelineDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  onBranchNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, branchName: event.target.value });
  };

  onGroupnameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, groupName: event.target.value });
  };

  render() {
    // todo query gitlab to get list of groups (no graphql api)
    // and list of projects
    const { groupName, branchName } = defaults(this.props.query, defaultQuery);

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
          value={branchName || ''}
          onChange={this.onBranchNameChange}
          label="Branch name of the pipeline"
          tooltip="Only piplines with this branch will be displayed"
        />
      </div>
    );
  }
}
