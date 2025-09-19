pipeline {
    agent any

    environment {
        IMAGE_NAME = "notes-app"
        IMAGE_TAG  = "latest"
        DOCKERHUB_CREDENTIALS = "DockerFile_cred" // Your Jenkins credential ID
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/LondheShubham153/django-notes-app.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG .'
            }
        }

        stage('Scan Image') {
            steps {
                script {
                    sh 'trivy image $IMAGE_NAME:$IMAGE_TAG || true' // Will still report CVEs but not fail pipeline
                }
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                    # Stop and remove old container if exists
                    docker stop notes-app-container || true
                    docker rm notes-app-container || true
                    # Run new container
                    docker run -d -p 8000:8000 --name notes-app-container $IMAGE_NAME:$IMAGE_TAG
                '''
            }
        }

        stage('Push Image to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "$DOCKERHUB_CREDENTIALS",
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        set -e  # Stop if any command fails
                        echo "Logging in to Docker Hub..."
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        echo "Tagging the image..."
                        docker tag $IMAGE_NAME:$IMAGE_TAG $DOCKER_USER/$IMAGE_NAME:$IMAGE_TAG
                        echo "Pushing the image to Docker Hub..."
                        docker push $DOCKER_USER/$IMAGE_NAME:$IMAGE_TAG
                    '''
                }
            }
        }
    }

    post {
        failure {
            echo "Pipeline failed! Check the logs above for the error."
        }
        success {
            echo "Pipeline completed successfully!"
        }
    }
}
