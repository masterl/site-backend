#!/bin/bash

readonly PROJECT_ROOT=$( cd "$( dirname "$0" )" && pwd )

function main()
{
  while true; do
    find "$PROJECT_ROOT" -type f |
      grep -v -E "^$PROJECT_ROOT/node_modules" |
      grep -v -E "^$PROJECT_ROOT/.git" |
      entr -d bash entr_script.sh "$PROJECT_ROOT" "$*"
  done
}

main "$@"
