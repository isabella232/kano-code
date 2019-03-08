def uploadDocs(version) {
    docker.image('ughly/alpine-aws-cli').inside {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: 'kart', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
            // Clean previous docs
            sh "aws s3 rm s3://code-docs.kano.me/${version} --recursive --quiet"
            // Upload files
            sh "aws s3 cp ./www-docs/ s3://code-docs.kano.me/${version} --recursive --quiet"

            def redirectFile = """
<!DOCTYPE html>
<html>
   <head>
      <title>HTML Meta Tag</title>
      <meta http-equiv = "refresh" content = "0; url = /${version}/index.html" />
   </head>
</html>
            """;
            writeFile(file: 'redirect.html', text: redirectFile, encoding: "UTF-8")
            sh "aws s3 cp redirect.html s3://code-docs.kano.me/index.html --quiet"
            sh "aws s3 cp redirect.html s3://code-docs.kano.me/latest/index.html --quiet"
        }
    }
}

return this
