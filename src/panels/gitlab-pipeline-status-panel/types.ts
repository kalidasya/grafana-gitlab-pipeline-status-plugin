export interface GitlabCIPipelineStatusOptions {
  justify: string;
  alignContent: string;
  alignItems: string;
  failed: string;
  passed: string;
  runningStart: string;
  runningEnd: string;
  other: string;
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
