#!/usr/bin/env bash

# A script to update or install Make Apps on a Kano OS devellopment box

function do_install
{
    sudo apt-get update
    sudo apt-get install make-apps
    kdesk -r
    echo -e "\nUnless you saw any errors above, Make Apps should be up to date."
}

case $1 in
    install)
        do_install
        ;;
    update)
        do_install
        ;;
    setup)
        echo "Installing Make Apps"
        do_install

        echo "Adding `pwd` to your \$PATH..."
        echo "export PATH=\"`pwd`:\$PATH\"" >> ~/.bashrc

        echo "Setting up autoupdate cronjob..."
        cat <<EOF | sudo tee /etc/cron.d/make-apps-dev
#!/bin/bash

SHELL=/bin/bash

00 * * * * root /usr/bin/apt-get update && /usr/bin/apt-get install make-apps
EOF

        echo -e "\n Setup done!"
        ;;
    *)
        echo "Unknown task $1"
esac
