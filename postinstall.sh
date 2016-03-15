#!/bin/bash

#If you are trying to import make-apps as a dependency, do not run postinstall

if [ "$NODE_IMPORT" != 'make-apps' ]; then
    echo "Running postinstall script..."
    bower install;
    gulp prod;
    exit 1;
fi
