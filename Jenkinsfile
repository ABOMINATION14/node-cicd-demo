
pipeline {
    agent any

    environment {
        IMAGE_NAME = 'abomination14/node-cicd-demo'
        IMAGE_TAG = "build-${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout GitHub') {
            steps {
                checkout scm
            }
        }

        stage('Check Tools') {
            steps {
                bat 'git --version'
                bat 'docker --version'
                bat 'docker info'
                bat 'kubectl version --client'
                bat 'kubectl get nodes'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %IMAGE_NAME%:%IMAGE_TAG% .'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_TOKEN'
                )]) {
                    bat '''
                        @echo off
                        echo %DOCKER_TOKEN% | docker login -u %DOCKER_USER% --password-stdin
                        docker push %IMAGE_NAME%:%IMAGE_TAG%
                        docker logout
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                bat '''
                    kubectl set image -f deployment.yaml node-cicd-demo=%IMAGE_NAME%:%IMAGE_TAG% --local -o yaml > deployment-ready.yaml
                    kubectl apply -f deployment-ready.yaml
                    kubectl rollout status deployment/node-cicd-demo --timeout=180s
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                bat 'kubectl get pods'
                bat 'kubectl get svc'
            }
        }
    }

    post {
        success {
            echo 'CI/CD PIPELINE SUCCESSFUL!'
        }
        failure {
            echo 'PIPELINE FAILED - CHECK CONSOLE OUTPUT'
        }
    }
}
