# Make Apps

## Make it work

In the main folder, install the dependencies:

npm is used for the gulp tasks and the service/data layer
bower is used for the web UI components (Polymer, Pure ...)

```shell
npm install
bower install
```

If it is the first time you use the project, run

```shell
gulp build
```

It will prepare everything.

Once done, you can start the development gulp task

```shell
gulp dev
```

This will watch the files and rebuild when necessary. It also start a web server listening on port 4000

## Testing workflow on Kano OS

Because of some native extensions of some dependencies, `npm install`
fails on the Pi. The easiest way to test on the Pi is to build on
your dev machine and rsync the directory to over. Like this:

    cd make-apps/
    npm install
    bower install
    npm build
    rsync -av -e 'ssh -o StrictHostKeyChecking=no' --exclude=.git --exclude=node_modules . "kano@10.0.0.231:/tmp/radek-make-apps"

The next steps are:

* Get on your Pi (direct or via VNC)
* Open the terminal
* `cd /tmp/radek-make-apps/rpi/bin` (hint: use your own name here to avoid clashes with others)
* `./make-apps`
* The app should start loading

To debug, you'll need to rebuild the app, rsync again and relaunch it on the Pi.

### Using HQ test station

If you'd like to quickly try things out, there's a test station in the office:

* IP: 10.0.0.231
* ssh user: kano
* ssh pass: kano
* vnc pass: online

You can ssh/vnc into it and try things out. There's a cron job that keeps our nightly
builds of Make Apps up-to-date on it if you just want to check that `master` works.
For testing features you're working on, see the workflow above.
