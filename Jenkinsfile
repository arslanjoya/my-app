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

        stage('Run Container Locally') {
            steps {
                echo "Running container locally on Jenkins server..."
                sh '''
                    docker stop notes-app-container || true
                    docker rm notes-app-container || true
                    docker run -d -p 9090:80 --name notes-app-container $IMAGE_NAME:$IMAGE_TAG
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
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker tag $IMAGE_NAME:$IMAGE_TAG $DOCKER_USER/$IMAGE_NAME:$IMAGE_TAG
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
                    ssh -i $SSH_KEY -o StrictHostKeyChecking=no ubuntu@34.226.194.196 << 'EOF'
cd ~/notes-app || mkdir -p ~/notes-app && cd ~/notes-app
# Stop & remove old container
docker stop notes-app_notes-app_1 || true
docker rm notes-app_notes-app_1 || true
# Remove old network
docker network rm notes-app_default || true

# Write docker-compose.yml
cat > docker-compose.yml <<EOL
version: "3"
services:
  notes-app:
    image: arslanoffical/notes-app:latest
    ports:
      - "9090:80"
    restart: always
EOL

docker-compose down || true
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
