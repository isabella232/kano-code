node {
    stage('check environment') {
        sh "DEV_ENV=staging"
        sh 'export NODE_ENV="$DEV_ENV"'
        sh "source ../../userContent/make-apps-config/$DEV_ENV.env #LOAD CONFIGURATION FILE"
        sh "node -v"
        sh "npm -v"
        sh "bower -v"
        sh "gulp -v"
    }

    stage('checkout') {
        checkout scm
    }

    stage('install dependencies') {
        sh "rm -rf app/bower_components"
        sh "bower cache clean"
        sh "npm install"
    }

    stage('compress') {
        sh "gulp compress"
    }

    stage('deploy') {
        sh "echo 'Will deploy here when configured'"
    }
}