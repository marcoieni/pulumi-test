import * as github from "@pulumi/github";
import * as pulumi from "@pulumi/pulumi";
import * as service from "@pulumi/pulumiservice";

const settings = new service.DeploymentSettings("deployment_settings", {
    organization: "service-provider-test-org",
    project: "test-deployment-settings-project",
    stack: "dev",
    github: {
      previewPullRequests: true,
      repository: "marcoieni/pulumi-test",
    },

    sourceContext: {
        git: {
            repoUrl: "https://github.com/pulumi/deploy-demos.git",
            branch: "refs/heads/main",
            repoDir: "pulumi-programs/simple-resource"
        }
    }

});
