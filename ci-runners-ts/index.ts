import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { CodebuildProjectArgs, createCodebuildProject } from "./codebuild-project";

const config = new pulumi.Config();
// The GitHub repository where the codebuild project will be used.
const repository = config.require("repository");
// The name of the code connection that will be created to connect the codebuild projects to GitHub.
const codeConnectionName = config.require("codeConnectionName");
const githubConnection = new aws.codeconnections.Connection("github_connection", {
    name: codeConnectionName,
    providerType: "GitHub",
});
// Grant CodeBuild project IAM role access to use the connection, as documented in
// https://docs.aws.amazon.com/codebuild/latest/userguide/connections-github-app.html#connections-github-role-access
const codebuildPolicyDoc = aws.iam.getPolicyDocumentOutput({
    statements: [{
        effect: "Allow",
        principals: [{
            type: "Service",
            identifiers: ["codebuild.amazonaws.com"],
        }],
        actions: ["sts:AssumeRole"],
    }],
});
const codebuildRole = new aws.iam.Role("codebuild_role", {
    name: "codebuild-github-runner-role",
    assumeRolePolicy: codebuildPolicyDoc.apply(codebuildPolicyDoc => codebuildPolicyDoc.json),
});
const codebuildPolicy = new aws.iam.RolePolicy("codebuild_policy", {
    name: "codebuild-github-runner-policy",
    role: codebuildRole.id,
    policy: pulumi.jsonStringify({
        Version: "2012-10-17",
        Statement: [{
            Effect: "Allow",
            Action: [
                "codeconnections:GetConnectionToken",
                "codeconnections:GetConnection",
            ],
            Resource: [githubConnection.arn],
        }],
    }),
});

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
