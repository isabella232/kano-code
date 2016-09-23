#!groovy
node {
    stage('check environment') {
        env.DEV_ENV = "staging"
        env.NODE_ENV = "${env.DEV_ENV}"
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