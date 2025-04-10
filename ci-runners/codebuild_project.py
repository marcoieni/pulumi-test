import pulumi
from pulumi import Input
from typing import Optional, Dict, TypedDict, Any
import pulumi_aws as aws

class CodebuildProjectArgs(TypedDict, total=False):
    name: Input[str]
    serviceRole: Input[str]
    computeType: Input[str]
    repository: Input[str]
    codeConnectionArn: Input[Any]

class CodebuildProject(pulumi.ComponentResource):
    def __init__(self, name: str, args: CodebuildProjectArgs, opts:Optional[pulumi.ResourceOptions] = None):
        super().__init__("components:index:CodebuildProject", name, args, opts)

        ubuntu_project = aws.codebuild.Project(f"{name}-ubuntu_project",
            name=args["name"],
            service_role=args["serviceRole"],
            artifacts={
                "type": "NO_ARTIFACTS",
            },
            cache={
                "type": "NO_CACHE",
            },
            build_timeout=60 * 6,
            environment={
                "compute_type": args["computeType"],
                "image": "aws/codebuild/standard:7.0-25.01.30",
                "type": "LINUX_CONTAINER",
                "image_pull_credentials_type": "CODEBUILD",
                "privileged_mode": True,
            },
            logs_config={
                "cloudwatch_logs": {
                    "status": "DISABLED",
                },
            },
            source={
                "type": "GITHUB",
                "location": f"https://github.com/{args["repository"]}",
                "git_clone_depth": 1,
                "git_submodules_config": {
                    "fetch_submodules": False,
                },
                "auth": {
                    "type": "CODECONNECTIONS",
                    "resource": args["codeConnectionArn"],
                },
            },
            opts = pulumi.ResourceOptions(parent=self))

        ubuntu_project_webhook = aws.codebuild.Webhook(f"{name}-ubuntu_project_webhook",
            project_name=ubuntu_project.name,
            build_type="BUILD",
            filter_groups=[{
                "filters": [{
                    "type": "EVENT",
                    "pattern": "WORKFLOW_JOB_QUEUED",
                }],
            }],
            opts = pulumi.ResourceOptions(parent=self))

        self.register_outputs()
