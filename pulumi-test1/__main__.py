import pulumi
import pulumi_github as github

print("Hello, Pulumi!")

actions_variable_resource = github.ActionsVariable("actionsVariableResource",
    repository="pulumi-test",
    value="foo5",
    variable_name="bar")
