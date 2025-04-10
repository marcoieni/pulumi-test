import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

export type CodebuildProjectArgs = {
    /**
     * The name of the project. What you need to write in the yaml GitHub Actions workflow.
     */
    name: pulumi.Input<string>;
    /**
     * The IAM role that AWS CodeBuild assumes to run the build.
     */
    serviceRole: pulumi.Input<string>;
    /**
     * Instance type.
     */
    computeType: pulumi.Input<string>;
    /**
     * The GitHub repository where the codebuild project will be used.
     */
    repository: pulumi.Input<string>;
    /**
     * Arn of the GitHub CodeConnection for the GitHub organization.
     */
    codeConnectionArn: pulumi.Input<any>;
}

export function createCodebuildProject(name: string, args: CodebuildProjectArgs, opts?: pulumi.ComponentResourceOptions): pulumi.ComponentResource {
    const component = new pulumi.ComponentResource("components:index:CodebuildProject", name, args, opts);

    const ubuntuProject = new aws.codebuild.Project(`${name}-ubuntu_project`, {
        name: args.name,
        serviceRole: args.serviceRole,
        artifacts: {
            type: "NO_ARTIFACTS",
        },
        cache: {
            type: "NO_CACHE",
        },
        buildTimeout: 60 * 6,
        environment: {
            computeType: args.computeType,
            image: "aws/codebuild/standard:7.0-25.01.30",
            type: "LINUX_CONTAINER",
            imagePullCredentialsType: "CODEBUILD",
            privilegedMode: true,
        },
        logsConfig: {
            cloudwatchLogs: {
                status: "DISABLED",
            },
        },
        source: {
            type: "GITHUB",
            location: `https://github.com/${args.repository}`,
            gitCloneDepth: 1,
            gitSubmodulesConfig: {
                fetchSubmodules: false,
            },
            auth: {
                type: "CODECONNECTIONS",
                resource: args.codeConnectionArn,
            },
        },
    }, {
        parent: component,
    });

    new aws.codebuild.Webhook(`${name}-ubuntu_project_webhook`, {
        projectName: ubuntuProject.name,
        buildType: "BUILD",
        filterGroups: [{
            filters: [{
                type: "EVENT",
                pattern: "WORKFLOW_JOB_QUEUED",
            }],
        }],
    }, {
        parent: component,
    });

    return component;
}
