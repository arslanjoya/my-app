pipeline {
    agent any

    environment {
        IMAGE_NAME = "notes-app"
        IMAGE_TAG  = "latest"
        DOCKERHUB_CREDENTIALS = "DockerFile_cred" // Your Jenkins global credential ID
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/LondheShubham153/django-notes-app.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG .'
            }
        }

        stage('Scan Image') {
            steps {
                echo "Scanning Docker image with Trivy..."
                script {
                    // Avoid failure due to DB lock issues
                    sh 'trivy image --skip-update $IMAGE_NAME:$IMAGE_TAG || true'
                }
            }
        }

        stage('Run Container') {
            steps {
                echo "Stopping and removing old container if exists..."
                sh '''
                    docker stop notes-app-container || true
                    docker rm notes-app-container || true
                    echo "Running new container..."
                    docker run -d -p 8000:8000 --name notes-app-container $IMAGE_NAME:$IMAGE_TAG
                '''
            }
        }

        stage('Push Image to Docker Hub') {
            steps {
                echo "Pushing image to Docker Hub..."
                withCredentials([usernamePassword(
                    credentialsId: "$DOCKERHUB_CREDENTIALS",
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        set -e  # Stop pipeline on any error
                        echo "Logging in to Docker Hub..."
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        echo "Tagging the image..."
                        docker tag $IMAGE_NAME:$IMAGE_TAG $DOCKER_USER/$IMAGE_NAME:$IMAGE_TAG
                        echo "Pushing the image..."
                        docker push $DOCKER_USER/$IMAGE_NAME:$IMAGE_TAG
                    '''
                }
            }
        }
    }

    post {
        failure {
            echo "Pipeline failed! Check above logs for details."
        }
        success {
            echo "Pipeline completed successfully!"
        }
    }
}
