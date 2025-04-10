import pulumi
import json
import pulumi_aws as aws

from codebuild import create_codebuild_projects
from iam import create_codebuild_role

config = pulumi.Config()
# The GitHub repository where the codebuild project will be used.
repository = config.require("repository")
# The name of the code connection that will be created to connect the codebuild projects to GitHub.
code_connection_name = config.require("codeConnectionName")
github_connection = aws.codeconnections.Connection("github_connection",
    name=code_connection_name,
    provider_type="GitHub")

# Create IAM role for CodeBuild using the extracted function
codebuild_role_arn = create_codebuild_role(github_connection.arn)

create_codebuild_projects({
    'serviceRole': codebuild_role_arn,
    'repository': repository,
    'codeConnectionArn': github_connection.arn
})
