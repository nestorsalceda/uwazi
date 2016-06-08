#!/bin/bash

set -e

if [ "$1" = "karma" ]; then
    exec ./node_modules/karma/bin/karma start
fi

if [ "$1" = "test_api" ]; then
    exec node api_test.js
fi

if [ "$1" = "uwazi" ]; then
    ./node_modules/webpack/bin/webpack.js
    exec node server "$@"
fi

exec "$@"
