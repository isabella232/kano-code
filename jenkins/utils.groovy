def uploadDocs() {
    docker.image('ughly/alpine-aws-cli').inside {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: 'kart', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
            // Clean previous docs
            sh "aws s3 rm s3://code-docs.kano.me/${version} --recursive --quiet"
            // Upload files
            sh "aws s3 cp ./www-docs/ s3://code-docs.kano.me/${version} --recursive --quiet"
            sh "aws s3 cp ./www-docs/ s3://code-docs.kano.me/latest --recursive --quiet"
        }
    }
}

return this
