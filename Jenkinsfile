#!groovy
@Library('kanolib') _

pipeline {
    agent {
        label 'ubuntu_18.04'
    }
    stages {
        stage('tools') {
            steps {
                script {
                    def NODE_PATH = tool name: 'Node 8.11.2', type: 'nodejs'
                    env.PATH = "${env.PATH}:${NODE_PATH}/bin"
                    def YARN_PATH = tool name: 'yarn', type: 'com.cloudbees.jenkins.plugins.customtools.CustomTool'
                    env.PATH = "${env.PATH}:${YARN_PATH}/bin"
                }
            }
        }
        stage('check environment') {
            steps {
                prepare_env()
            }
        }
        stage('checkout') {
            steps {
                checkout scm
            }
        }
        stage('install dependencies') {
            steps {
                sshagent(['read-only-github']) {
                    install_dep()
                }
            }
        }
        stage('checkstyle') {
            steps {
                sh "yarn checkstyle-ci || exit 0"
            }
        }
        stage('test') {
            steps {
                install_chrome_dependencies()
                sh "yarn test-ci"
            }
        }
    }
    post {
        always {
            junit allowEmptyResults: true, testResults: 'test-results.xml'
            step([$class: 'CheckStylePublisher', pattern: 'eslint.xml'])
        }
        regression {
            notify_culprits currentBuild.result
        }
    }
    options {
        buildDiscarder(logRotator(numToKeepStr: '20'))
        timeout(time: 60, unit: 'MINUTES')
    }
}

def prepare_env () {
    if (env.BRANCH_NAME=="master" || env.BRANCH_NAME=="jenkins") {
        env.DEV_ENV = "staging"
    } else if (env.BRANCH_NAME=="rc") {
        env.DEV_ENV = "rc"
    } else if (env.BRANCH_NAME=="prod") {
        env.DEV_ENV = "production"
    }
    env.NODE_ENV = "${env.DEV_ENV}"
}

def install_dep () {
    sh "yarn --production=false"
}
