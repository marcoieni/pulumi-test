import pulumi
import pulumi_github as github
import pulumi_pulumiservice as service

print("Hello, Pulumi!")

config = pulumi.Config()

settings = service.DeploymentSettings("deployment_settings",
    organization="ieni",
    project=pulumi.get_project(),
    stack=pulumi.get_stack(),
    source_context={
        "git": {
            "repo_url": "https://github.com/marcoieni/pulumi-test.git",
            "branch": "refs/heads/main",
            "repo_dir": "pulumi-test2"
        }
    }
)

actions_variable_resource = github.ActionsVariable("actionsVariableResource2",
    repository="pulumi-test",
    value="foo2",
    variable_name="bar2")
