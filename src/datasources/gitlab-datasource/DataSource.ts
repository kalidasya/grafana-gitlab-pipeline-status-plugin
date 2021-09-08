import { ApolloClient, InMemoryCache, NormalizedCacheObject, gql } from '@apollo/client';

import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
} from '@grafana/data';

import { GitlabPipelineQuery, GitlabPipelineDataSourceOptions } from './types';

export class GitlabPipelineDataSource extends DataSourceApi<GitlabPipelineQuery, GitlabPipelineDataSourceOptions> {
  url: string;
  client: ApolloClient<NormalizedCacheObject>;

  constructor(instanceSettings: DataSourceInstanceSettings<GitlabPipelineDataSourceOptions>) {
    super(instanceSettings);
    this.url = instanceSettings.url || 'http://localhost:9099/';
    this.client = new ApolloClient({
      uri: this.url,
      cache: new InMemoryCache(),
    });
  }

  async query(options: DataQueryRequest<GitlabPipelineQuery>): Promise<DataQueryResponse> {
    // console.log(options);
    // groups {  // if we want to display pipelines inside pipeline/stages/nodes
    //   nodes {
    //     name
    //     detailedStatus {
    //       label
    //     }
    //   }
    // }
    const query = options.targets
      .filter((v) => !v.hide)
      .reduce(
        (v, q) =>
          v +
          `${q.groupName}: group(fullPath: "${q.groupName}") {
        projects (first: 100) {
          nodes {
            webUrl
            fullPath
            pipelines(ref: "${q.branchName}", first: 1) {
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
          pageInfo {
            endCursor
          }
        }
      }`,
        ''
      );
    return this.client
      .query({
        query: gql`
          query {
            ${query}
          }
        `,
      })
      .then((response) => {
        const frame = new MutableDataFrame({
          fields: [
            { name: 'Project', type: FieldType.string },
            { name: 'Id', type: FieldType.string },
            { name: 'Link', type: FieldType.string },
            { name: 'Status', type: FieldType.string },
            { name: 'UpdatedAt', type: FieldType.time },
            { name: 'Stages', type: FieldType.other },
          ],
        });
        Object.keys(response.data).forEach((k) =>
          response.data[k].projects.nodes.forEach((project: any) => {
            if (project.pipelines.nodes.length > 0) {
              const pipeline = project.pipelines.nodes[0];
              const id = pipeline.id.split('/').pop();
              frame.appendRow([
                project.fullPath,
                id,
                `${project.webUrl}/pipelines/${id}`,
                pipeline.status.toLocaleLowerCase(),
                pipeline.finishedAt,
                pipeline.stages.nodes.map((stage: any) => [stage.name, stage.detailedStatus.label]),
              ]);
            }
          })
        );
        return frame;
      })
      .then((data) => ({ data: [data] } as DataQueryResponse));
  }

  async testDatasource() {
    // Implement a health check for your data source.
    return this.client
      .query({
        query: gql`
          query {
            currentUser {
              name
            }
          }
        `,
      })
      .then((res) => {
        if (res.data.length === 0) {
          throw new Error('Match not found.');
        }
        return res;
      });
  }
}
