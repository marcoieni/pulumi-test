import pulumi
import json
import pulumi_aws as aws

from codebuild import create_codebuild_projects

config = pulumi.Config()
# The GitHub repository where the codebuild project will be used.
repository = config.require("repository")
# The name of the code connection that will be created to connect the codebuild projects to GitHub.
code_connection_name = config.require("codeConnectionName")
github_connection = aws.codeconnections.Connection("github_connection",
    name=code_connection_name,
    provider_type="GitHub")
# Grant CodeBuild project IAM role access to use the connection, as documented in
# https://docs.aws.amazon.com/codebuild/latest/userguide/connections-github-app.html#connections-github-role-access
codebuild_policy_doc = aws.iam.get_policy_document_output(statements=[{
    "effect": "Allow",
    "principals": [{
        "type": "Service",
        "identifiers": ["codebuild.amazonaws.com"],
    }],
    "actions": ["sts:AssumeRole"],
}])
codebuild_role = aws.iam.Role("codebuild_role",
    name="codebuild-github-runner-role",
    assume_role_policy=codebuild_policy_doc.json)
codebuild_policy = aws.iam.RolePolicy("codebuild_policy",
    name="codebuild-github-runner-policy",
    role=codebuild_role.id,
    policy=pulumi.Output.json_dumps({
        "Version": "2012-10-17",
        "Statement": [{
            "Effect": "Allow",
            "Action": [
                "codeconnections:GetConnectionToken",
                "codeconnections:GetConnection",
            ],
            "Resource": [github_connection.arn],
        }],
    }))

create_codebuild_projects({
    'serviceRole': codebuild_role.arn,
    'repository': repository,
    'codeConnectionArn': github_connection.arn
})
