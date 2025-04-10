import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { CodebuildProjectArgs, createCodebuildProject } from "./codebuild-project";
import { createCodebuildRole } from "./iam";

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

createCodebuildProject("ubuntu222c", {
    name: "ubuntu-22-2c",
    serviceRole: codebuildRole.arn,
    computeType: "BUILD_GENERAL1_SMALL",
    repository: repository,
    codeConnectionArn: githubConnection.arn,
});

createCodebuildProject("ubuntu224c", {
    name: "ubuntu-22-4c",
    serviceRole: codebuildRole.arn,
    computeType: "BUILD_GENERAL1_MEDIUM",
    repository: repository,
    codeConnectionArn: githubConnection.arn,
});

createCodebuildProject("ubuntu228c", {
    name: "ubuntu-22-8c",
    serviceRole: codebuildRole.arn,
    computeType: "BUILD_GENERAL1_LARGE",
    repository: repository,
    codeConnectionArn: githubConnection.arn,
});

createCodebuildProject("ubuntu2236c", {
    name: "ubuntu-22-36c",
    serviceRole: codebuildRole.arn,
    computeType: "BUILD_GENERAL1_XLARGE",
    repository: repository,
    codeConnectionArn: githubConnection.arn,
});
