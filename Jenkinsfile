pipeline {
    agent any

    environment {
        IMAGE_NAME = "notes-app"
        IMAGE_TAG  = "latest"
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
                    // Scan the Docker image using Trivy
                    sh 'trivy image $IMAGE_NAME:$IMAGE_TAG'
                }
            }
        }

        stage('Run Container') {
            steps {
                sh 'docker run -d -p 8000:8000 --name notes-app-container $IMAGE_NAME:$IMAGE_TAG || true'
            }
        }
    }
}
