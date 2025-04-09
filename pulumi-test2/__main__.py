import pulumi
import pulumi_github as github
import pulumi_pulumiservice as service

print("Hello, Pulumi!")

config = pulumi.Config()

settings = service.DeploymentSettings("deployment_settings",
    organization="ieni",
    project=pulumi.get_project(),
    stack=pulumi.get_stack(),
    github={
        "preview_pull_requests": True,
        "repository": "marcoieni/pulumi-test",
        "deploy_commits": True
    },
    source_context={
        "git": {
            "branch": "refs/heads/main",
            "repo_dir": "pulumi-test2"
        }
    }
)

actions_variable_resource = github.ActionsVariable("actionsVariableResource2",
    repository="pulumi-test",
    value="foo222",
    variable_name="bar2")
