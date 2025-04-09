import pulumi
import pulumi_github as github

print("Hello, Pulumi!")

actions_variable_resource = github.ActionsVariable("actionsVariableResource2",
    repository="pulumi-test",
    value="foo3",
    variable_name="bar2")
