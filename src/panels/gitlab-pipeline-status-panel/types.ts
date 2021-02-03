export interface GitlabCIPipelineStatusOptions {
  justify: string;
}

export interface GitlabCIPipelineStageData {
  name: string;
  status: string;
  detailsPath: string;
  displayNames: boolean;
}

export interface GitlabCIPipelineStatusData {
  link: string;
  name: string;
  status: string;
  times: any;
  id: string;
  panelOptions: any;
  stages: GitlabCIPipelineStageData[];
}
