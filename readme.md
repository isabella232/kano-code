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
