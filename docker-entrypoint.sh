#!/bin/bash

set -e

if [ "$1" = "test" ]; then
    exec node api_test.js
fi

if [ "$1" = "uwazi" ]; then
    ./node_modules/webpack/bin/webpack.js
    exec node server "$@"
fi

exec "$@"
