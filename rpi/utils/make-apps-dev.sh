#!/usr/bin/env bash

# A script to update or install Make Apps on a Kano OS box

function do_install
{
    sudo apt-get update
    sudo apt-get install make-apps
    echo "Unless you saw any errors above, Make Apps should be up to date."
}

case $1 in
    install)
        do_install
        ;;
    update)
        do_install
        ;;
    setup)
        echo "Adding `pwd` to your \$PATH..."
        echo "export PATH=\"`pwd`:\$PATH\"" >> ~/.bashrc

        echo "Setting up autoupdate cronjob..."
        cat <<EOF | sudo tee /etc/cron.d/make-apps-dev
#!/bin/bash

SHELL=/bin/bash

00 * * * * root apt-get update && apt-get install make-apps
EOF
        ;;
    *)
        echo "Unknown task $1"
esac
