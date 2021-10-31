#!/bin/sh

IS_AMEND=$(ps --format=command --pid $PPID | grep -e '--amend');

if [ -n "$IS_AMEND" ]; then
  return 0;
fi

STATUS=$(git status --short)

if [ -n "$STATUS" ]; then
  echo ""
  echo "\tonly amend commits or empty commits are welcome"
  echo "\tiow - start with the end in mind"
  echo ""
  echo "\tsee:"
  echo "\thttps://git-scm.com/docs/git-commit#Documentation/git-commit.txt---fixupamendrewordltcommitgt"
  echo "\thttps://git-scm.com/docs/git-commit#Documentation/git-commit.txt---allow-empty"
  echo ""

  return 1;
fi

