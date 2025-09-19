pipeline {
    agent any

    environment {
        IMAGE_NAME = "notes-app"
        IMAGE_TAG  = "latest"
        DOCKERHUB_CREDENTIALS = "dockerhub-cred" // Your Jenkins credential ID
        DOCKERHUB_USERNAME = "your-dockerhub-username" // Replace with your Docker Hub username
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
                credentialsId: "DockerFile_cred",
                usernameVariable: 'DOCKER_USER',
                passwordVariable: 'DOCKER_PASS'
                )])

                {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker tag $IMAGE_NAME:$IMAGE_TAG $DOCKER_USER/$IMAGE_NAME:$IMAGE_TAG
                        docker push $DOCKER_USER/$IMAGE_NAME:$IMAGE_TAG
                    '''
                }
            }
        }
    }
}
