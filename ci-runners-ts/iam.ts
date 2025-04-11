import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// Grant CodeBuild project IAM role access to use the connection, as documented in
// https://docs.aws.amazon.com/codebuild/latest/userguide/connections-github-app.html#connections-github-role-access
export function createCodebuildRole(githubConnectionArn: pulumi.Output<string>): aws.iam.Role {
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

    new aws.iam.RolePolicy("codebuild_policy", {
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
                Resource: [githubConnectionArn],
            }],
        }),
    });

    return codebuildRole;
}
