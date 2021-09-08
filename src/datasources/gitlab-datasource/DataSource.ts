import { ApolloClient, InMemoryCache, NormalizedCacheObject, gql } from '@apollo/client';

import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
  dateTime,
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
    console.log('query', options);
    const query = options.targets
      .filter((v) => !v.hide)
      .reduce(
        (v, q) =>
          v +
          `${q.refId}: group(fullPath: "${q.groupName}") {
        projects (first: 75) {
          nodes {
            webUrl
            fullPath
            pipelines(ref: "${q.branchName}", first: 1) {
              nodes {
                id
                status
                finishedAt
                startedAt
                updatedAt          
                stages {
                  nodes {
                    name
                    detailedStatus {
                      label
                      detailsPath
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
        fetchPolicy: 'network-only',
      })
      .then((response) => {
        console.log('response', response);
        const frame = new MutableDataFrame({
          fields: [
            { name: 'Project', type: FieldType.string },
            { name: 'Id', type: FieldType.string },
            { name: 'Link', type: FieldType.string },
            { name: 'Status', type: FieldType.string },
            { name: 'FinishedAt', type: FieldType.time },
            { name: 'UpdatedAt', type: FieldType.time },
            { name: 'StarteddAt', type: FieldType.time },
            { name: 'Stages', type: FieldType.other },
          ],
        });
        Object.keys(response.data)
          .reduce<any[]>((acc, val) => [...acc, ...response.data[val].projects.nodes], [])
          .filter((v: any) => v.pipelines.nodes.length > 0)
          .sort(
            (
              {
                pipelines: {
                  nodes: [current],
                },
              }: any,
              {
                pipelines: {
                  nodes: [next],
                },
              }: any
            ) => {
              const [left, right] =
                next.startedAt && current.startedAt
                  ? [current.startedAt, next.startedAt]
                  : [current.finishedAt, next.finishedAt];
              return dateTime(right).valueOf() - dateTime(left).valueOf();
            }
          )
          .forEach((project: any) => {
            const pipeline = project.pipelines.nodes[0];
            const id = pipeline.id.split('/').pop();
            frame.appendRow([
              project.fullPath,
              id,
              `${project.webUrl}/pipelines/${id}`,
              pipeline.status.toLocaleLowerCase(),
              pipeline.startedAt,
              pipeline.updatedAt,
              pipeline.finishedAt,
              pipeline.stages.nodes.map((stage: any) => {
                // remove the duplicated group/project
                const path = stage.detailedStatus.detailsPath.split('/').slice(3).join('/');
                return [stage.name, stage.detailedStatus.label, `${project.webUrl}/${path}`];
              }),
            ]);
          });
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
