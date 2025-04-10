import pulumi
import pulumi_aws as aws

def create_codebuild_role(github_connection_arn):
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

    aws.iam.RolePolicy("codebuild_policy",
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
                "Resource": [github_connection_arn],
            }],
        }))

    return codebuild_role.arn
