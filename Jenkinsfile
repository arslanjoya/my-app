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
                git branch: 'main', url: 'https://github.com/arslanjoya/my-app.git'
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
                echo "Running container locally on Jenkins server..."
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
                    credentialsId: 'dockerhub-creds1',
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

        stage('Deploy to AWS EC2') {
            steps {
                echo "Deploying container on EC2 using docker-compose..."
                withCredentials([sshUserPrivateKey(
                    credentialsId: 'ec2-ssh-key',
                    keyFileVariable: 'SSH_KEY'
                )]) {
                    sh '''
                    ssh -i $SSH_KEY -o StrictHostKeyChecking=no ubuntu@<EC2_PUBLIC_IP> << EOF
                      mkdir -p ~/notes-app && cd ~/notes-app
                      echo 'version: "3"
services:
  notes-app:
    image: arslanoffical/notes-app:latest
    ports:
      - "8080:8080"
    restart: always' > docker-compose.yml

                      docker-compose down
                      docker-compose pull
                      docker-compose up -d
                    EOF
                    '''
                }
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
