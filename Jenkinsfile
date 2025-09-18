pipeline {
    agent any
    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t my-app-image .'
                }
            }
        }
        stage('Stop Old Container') {
            steps {
                script {
                    // Stop & remove container if it exists
                    sh 'docker rm -f my-app-container || true'
                }
            }
        }
        stage('Run Docker Container') {
            steps {
                script {
                    sh 'docker run -d -p 8080:80 --name my-app-container my-app-image'
                }
            }
        }
    }
}
