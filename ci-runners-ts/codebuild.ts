import * as pulumi from "@pulumi/pulumi";
import { createCodebuildProject } from "./codebuild-project";

// Common parameters for all CodeBuild projects
type CodebuildProjectArgs = {
    serviceRole: pulumi.Output<string>,
    repository: string,
    codeConnectionArn: pulumi.Output<string>,
}

export function createCodebuildProjects(commonParams: CodebuildProjectArgs) {

createCodebuildProject("ubuntu222c", {
    name: "ubuntu-22-2c",
    computeType: "BUILD_GENERAL1_SMALL",
    ...commonParams,
});

createCodebuildProject("ubuntu224c", {
    name: "ubuntu-22-4c",
    computeType: "BUILD_GENERAL1_MEDIUM",
    ...commonParams,
});

createCodebuildProject("ubuntu228c", {
    name: "ubuntu-22-8c",
    computeType: "BUILD_GENERAL1_LARGE",
    ...commonParams,
});

createCodebuildProject("ubuntu2236c", {
    name: "ubuntu-22-36c",
    computeType: "BUILD_GENERAL1_XLARGE",
    ...commonParams,
});

}
