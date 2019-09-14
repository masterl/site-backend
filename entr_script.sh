#!/bin/bash

readonly SCRIPT_NAME="$0"

readonly PROJECT_ROOT="$1"

shift 1

readonly TEST_TARGETS="$*"

function main()
{
  tput reset

  ensure_project_root_was_informed "$PROJECT_ROOT"

  run_tests

  echo
  print_line

  run_git_status_if_available

  echo
  date
}

function run_tests()
{
  echo "Running tests..."
  print_line

  if [ -z "$TEST_TARGETS" ]
  then
    npm test && npm run lint
  else
    NODE_ENV=test "$PROJECT_ROOT/node_modules/.bin/mocha" "$TEST_TARGETS" &&
      npm run lint
  fi
}

function run_git_status_if_available()
{
  if [ -x "$(command -v git)" ]
  then
    echo "Running GIT Status..."
    print_line
    git -C "$PROJECT_ROOT" status -sb
  fi
}

function ensure_project_root_was_informed()
{
  if [ -z "$1" ]
  then
    echo -e "\n\tERROR\n"
    echo -e "Missing project root path!\n"
    print_usage
    exit 1
  fi
}

function print_usage()
{
  echo -e "\nUsage:"
  echo "    $SCRIPT_NAME path/to/project/root"
}

function print_line()
{
  echo "=================================================="
}

main "$@"
