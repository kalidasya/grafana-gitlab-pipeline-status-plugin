# Grafana GitlabCI pipeline status plugin

This plugin creates a datasource and a panel to visualize GitlabCI pipeline status in Grafana.

I had problems with the existing GitlabCI Pipeline dashboards, they displayed too many branches for each project, required yet another thing to deploy, so I thought why not do it in Grafana. This is the first (well 2nd) iteration, the visualization is limited, you can create queries with a gitlab group and a branch name. 

Note: to see the datasource plugin you need to enable the plugin in the plugins page, after installation. 

## Configuration

[Enable plugin](https://raw.githubusercontent.com/kalidasya/grafana-gitlab-pipeline-status-plugin/main/docs/img/screenshots/grafana-gitlab-enable-plugin.webm)

[Create datasource](https://raw.githubusercontent.com/kalidasya/grafana-gitlab-pipeline-status-plugin/main/docs/img/screenshots/grafana-gitlab-create-datasource.webm)

[Create panel](https://raw.githubusercontent.com/kalidasya/grafana-gitlab-pipeline-status-plugin/main/docs/img/screenshots/grafana-gitlab-create-panel.webm)

## Screenshots

![Dashboard](https://raw.githubusercontent.com/kalidasya/grafana-gitlab-pipeline-status-plugin/main/docs/img/screenshots/dashboard-view.png)
![Datasource config](https://raw.githubusercontent.com/kalidasya/grafana-gitlab-pipeline-status-plugin/main/docs/img/screenshots/datasource-config.png)
![Settings page](https://raw.githubusercontent.com/kalidasya/grafana-gitlab-pipeline-status-plugin/main/docs/img/screenshots/settings-page.png)



## Code metrics

[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=kalidasya_grafana-gitlab-pipeline-status-plugin&metric=code_smells)](https://sonarcloud.io/dashboard?id=kalidasya_grafana-gitlab-pipeline-status-plugin)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=kalidasya_grafana-gitlab-pipeline-status-plugin&metric=alert_status)](https://sonarcloud.io/dashboard?id=kalidasya_grafana-gitlab-pipeline-status-plugin)
