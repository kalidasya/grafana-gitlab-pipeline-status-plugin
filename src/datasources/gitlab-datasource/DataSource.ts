import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
} from '@grafana/data';

import { getBackendSrv } from '@grafana/runtime'; //FetchResponse,
import { GitlabPipelineQuery, GitlabPipelineDataSourceOptions } from './types';

export class GitlabPipelineDataSource extends DataSourceApi<GitlabPipelineQuery, GitlabPipelineDataSourceOptions> {
  url: string;
  groupName: string;

  constructor(instanceSettings: DataSourceInstanceSettings<GitlabPipelineDataSourceOptions>) {
    super(instanceSettings);
    this.url = instanceSettings.url || 'http://localhost:9099/';
    this.groupName = instanceSettings.jsonData.groupName || '';
  }

  async getAndFilterPipeline(i: any) {
    const url = `${this.url}/projects/${i.id}/pipelines`;
    let response = { data: [] };
    try {
      response = await this.doRequest(url);
    } catch (err) {
      console.log(err);
    }
    const master_pipelines = response.data.filter((pipeline: any) => pipeline.ref === 'master');
    return {
      ...i,
      pipelines: master_pipelines.sort((first: any, second: any) => (first.id < second.id ? 1 : -1))[0] || undefined,
    };
  }

  async query(options: DataQueryRequest<GitlabPipelineQuery>): Promise<DataQueryResponse> {
    const promise = this.doRequest(`${this.url}/groups/?search=${this.groupName}`)
      .then(response => {
        const groupId = response.data.filter((i: any) => i.name === this.groupName).pop().id;
        return this.doRequest(`${this.url}/groups/${groupId}/projects?per_page=100`);
      })
      .then(response => {
        // TODO
        // do some filtering based on query here
        // const projects = response.data.filter((i:any) => {
        //   i.name
        // })
        const pipelines = response.data.map(this.getAndFilterPipeline, this);
        return Promise.all(pipelines);
      })
      .then(response => {
        const frame = new MutableDataFrame({
          fields: [
            { name: 'Project', type: FieldType.string },
            { name: 'Id', type: FieldType.string },
            { name: 'Link', type: FieldType.string },
            { name: 'Status', type: FieldType.string },
            { name: 'UpdatedAt', type: FieldType.time },
          ],
        });
        response.forEach((project: any) => {
          console.log(project);
          if (project.pipelines) {
            frame.appendRow([
              project.name_with_namespace,
              project.pipelines.id,
              project.pipelines.web_url,
              project.pipelines.status,
              project.pipelines.updated_at,
            ]);
          }
        });
        return frame;
      });

    return promise.then(data => ({ data: [data] } as DataQueryResponse));
  }

  async doRequest(url: string) {
    // console.log(`do request to ${url}`);
    const result = getBackendSrv().datasourceRequest({
      method: 'GET',
      url: url,
    });
    return result;
  }

  async testDatasource() {
    // Implement a health check for your data source.
    return this.doRequest(`${this.url}/groups?search=${this.groupName}`).then(res => {
      console.log(res);
      if (res.data.length === 0) {
        throw new Error('Match not found.');
      }
      return res;
    });
  }
}
/*
query {
  group (fullPath: "appcloud") {
    projects {
      nodes {
        id
        name
        pipelines (
          ref: "master"
          last:1
        ) {
          nodes {
            id
            status
            duration
            finishedAt
            stages {
              nodes {
                name
                detailedStatus {
                  label
                }
              }
            }
          }
        }  
      }
    }
  }
}
*/
