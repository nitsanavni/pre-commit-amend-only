#!/bin/sh

IS_AMEND=$(ps --format=command --pid $PPID | grep --regexp '--amend');

if [ -n "$IS_AMEND" ]; then
  return 0;
fi

STATUS=$(git status --short)

if [ -n "$STATUS" ]; then
  echo "\n\tonly amend commits or empty commits are welcome\n\n\tiow - start with the end in mind\n"
  return 1;
fi

