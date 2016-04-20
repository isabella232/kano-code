#!/bin/bash

#If you are trying to import make-apps as a dependency, do not run postinstall
echo "Loading postinstall script..."
if [ "$NODE_IMPORT" != 'make-apps' ]; then
    echo "Running postinstall script..."
    bower install;
    gulp prod;
else
    echo "Prevented postinstall to run as the project is a dependency"
fi
