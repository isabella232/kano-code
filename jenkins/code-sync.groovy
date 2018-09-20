node {
    stage('Pull') {
        git url: 'git@github.com:KanoComputing/kano-code', branch: 'master', credentialsId: 'd05f5e0d-be1e-41ac-94eb-082ae4d21185'
        dir('kc') {
            git url: 'git@github.com:KanoComputing/code', credentialsId: 'e98a3c81-9652-4857-a94c-ebe6d0e697b5'
        }
    }
    stage('Build') {
      sh """
        rm -rf kc/**/*
        mkdir -p kc/app
        mkdir -p kc/app/assets
        cp -r app/elements kc/app/elements
        cp -r app/lib kc/app/lib
        cp -r app/locale kc/app/locale
        cp -r app/scripts kc/app/scripts
        cp -r app/assets/vendor kc/app/assets/vendor
        cp package.json ./kc/package.json
      """
    }
    stage('Push') {
        sh "ls kc/app"
        dir('kc') {
            sshagent(['e98a3c81-9652-4857-a94c-ebe6d0e697b5']) {
                sh "git add --all"
                sh """
                    git commit -m 'Automatic commit from kano-code' \\
                    && git push origin master --force \\
                    && git tag -a 1.0.0-alpha.${env.BUILD_NUMBER} -m 'Automated release' \\
                    && git push --tags \\
                    || echo 'No changes, skipping release'
                """
            }
        }
    }
}