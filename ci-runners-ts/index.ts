import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { CodebuildProjectArgs, createCodebuildProject } from "./codebuild-project";
import { createCodebuildRole } from "./iam";
import { createCodebuildProjects } from "./codebuild";

const config = new pulumi.Config();
// The GitHub repository where the codebuild project will be used.
const repository = config.require("repository");
// The name of the code connection that will be created to connect the codebuild projects to GitHub.
const codeConnectionName = config.require("codeConnectionName");
const githubConnection = new aws.codeconnections.Connection("github_connection", {
    name: codeConnectionName,
    providerType: "GitHub",
});

// Create the CodeBuild IAM role with the GitHub connection
const codebuildRole = createCodebuildRole(githubConnection.arn);

const commonParams = {
    serviceRole: codebuildRole.arn,
    repository: repository,
    codeConnectionArn: githubConnection.arn,
};

createCodebuildProjects(commonParams);
