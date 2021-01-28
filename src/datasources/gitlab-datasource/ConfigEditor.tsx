import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { GitlabPipelineDataSourceOptions, GitlabPipelineDataSourceSecureOptions } from './types';

const { FormField, SecretFormField } = LegacyForms;

interface Props extends DataSourcePluginOptionsEditorProps<GitlabPipelineDataSourceOptions> {}

interface State {}

export class ConfigEditor extends PureComponent<Props, State> {
  onURLChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      url: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  onPrivateTokenChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      secureJsonData: {
        ...options.secureJsonData,
        privateToken: event.target.value,
      },
    });
  };

  onResetPrivateToken = () => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      secureJsonFields: {
        ...options.secureJsonFields,
        privateToken: false,
      },
      secureJsonData: {
        ...options.secureJsonData,
        privateToken: '',
      },
    });
  };

  render() {
    const { options } = this.props;
    const { jsonData, secureJsonFields } = options;
    const secureJsonData = (options.secureJsonData || {}) as GitlabPipelineDataSourceSecureOptions;

    return (
      <div className="gf-form-group">
        <div className="gf-form">
          <FormField
            label="Url"
            labelWidth={6}
            inputWidth={20}
            onChange={this.onURLChange}
            value={jsonData.url || ''}
            placeholder="URL of gitlab api"
          />
        </div>
        <div className="gf-form">
          <SecretFormField
            label="Private token"
            labelWidth={6}
            inputWidth={20}
            onChange={this.onPrivateTokenChange}
            value={secureJsonData.privateToken || ''}
            placeholder="Gitlab private token"
            onReset={this.onResetPrivateToken}
            isConfigured={(secureJsonFields && secureJsonFields.privateToken) as boolean}
          />
        </div>
      </div>
    );
  }
}
