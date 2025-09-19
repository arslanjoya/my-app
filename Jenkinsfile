pipeline {
    agent any

    environment {
        IMAGE_NAME = "notes-app"
        IMAGE_TAG  = "latest"
        DOCKERHUB_CREDENTIALS = "DockerFile_cred"
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Checking out repo..."
                git branch: 'main', url: 'https://github.com/LondheShubham153/django-notes-app.git'
            }
        }

        stage('Verify Workspace') {
            steps {
                echo "Listing files to make sure Dockerfile exists..."
                sh '''
                    pwd
                    ls -la
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                sh '''
                    echo "Trying to build image..."
                    docker build -t $IMAGE_NAME:$IMAGE_TAG .
                '''
            }
        }

        stage('Scan Image') {
            steps {
                echo "Scanning Docker image with Trivy..."
                sh 'trivy image --skip-update $IMAGE_NAME:$IMAGE_TAG || true'
            }
        }

        stage('Run Container') {
            steps {
                echo "Running container..."
                sh '''
                    docker stop notes-app-container || true
                    docker rm notes-app-container || true
                    docker run -d -p 8000:8000 --name notes-app-container $IMAGE_NAME:$IMAGE_TAG
                '''
            }
        }

        stage('Push Image to Docker Hub') {
            steps {
                echo "Pushing image to Docker Hub..."
                withCredentials([usernamePassword(
                    credentialsId: 'DockerFile_cred',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        set -e
                        echo "Logging in to Docker Hub..."
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        echo "Tagging image..."
                        docker tag $IMAGE_NAME:$IMAGE_TAG $DOCKER_USER/$IMAGE_NAME:$IMAGE_TAG
                        echo "Pushing image..."
                        docker push $DOCKER_USER/$IMAGE_NAME:$IMAGE_TAG
                    '''
                }
            }
        }

    post {
        failure {
            echo "❌ Pipeline failed! Check logs above."
        }
        success {
            echo "✅ Pipeline completed successfully!"
        }
    }
}
