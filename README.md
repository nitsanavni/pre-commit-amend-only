pre commit hook to enfore writing commit messages **before** the code itself

# why?

enfore a workflow where you **start with the end in mind**

# how?

will only allow commits of the form `--allow-empty` or `--amend`

so you can:

1. start by writing the commit message to an empty commit
2. write the code
3. `git commit --amend` to add the code to the commit
