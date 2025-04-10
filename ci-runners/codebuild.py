from codebuild_project import CodebuildProject
from typing import TypedDict

class CommonProps(TypedDict):
    serviceRole: str  # ARN of the IAM role for CodeBuild
    repository: str   # Repository name or URL
    codeConnectionArn: str  # ARN of the GitHub connection
    # Add any other optional properties with Optional
    # Optional[str], Optional[bool], etc.

# Define common properties for all CodeBuild projects
def create_codebuild_projects(common_props):
    CodebuildProject("ubuntu222c", {
        'name': "ubuntu-22-2c",
        'computeType': "BUILD_GENERAL1_SMALL",
        **common_props
    })

    CodebuildProject("ubuntu224c", {
        'name': "ubuntu-22-4c",
        'computeType': "BUILD_GENERAL1_MEDIUM",
        **common_props
    })

    CodebuildProject("ubuntu228c", {
        'name': "ubuntu-22-8c",
        'computeType': "BUILD_GENERAL1_LARGE",
        **common_props
    })

    CodebuildProject("ubuntu2236c", {
        'name': "ubuntu-22-36c",
        'computeType': "BUILD_GENERAL1_XLARGE",
        **common_props
    })
