
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
                bat 'kubectl version --client'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %IMAGE_NAME%:%IMAGE_TAG% .'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_TOKEN'
                    )
                ]) {
                    bat '''
                        @echo off
                        powershell -NoProfile -Command "$env:DOCKER_TOKEN | docker login --username $env:DOCKER_USER --password-stdin; exit $LASTEXITCODE"
                        if errorlevel 1 exit /b 1

                        docker push %IMAGE_NAME%:%IMAGE_TAG%
                        if errorlevel 1 exit /b 1

                        docker logout
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([
                    file(
                        credentialsId: 'kubeconfig-desktop',
                        variable: 'KUBECONFIG'
                    )
                ]) {
                    bat '''
                        @echo off
                        kubectl apply -f deployment.yaml
                        if errorlevel 1 exit /b 1

                        kubectl set image deployment/node-cicd-demo node-cicd-demo=%IMAGE_NAME%:%IMAGE_TAG%
                        if errorlevel 1 exit /b 1

                        kubectl rollout status deployment/node-cicd-demo --timeout=180s
                        if errorlevel 1 exit /b 1
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                withCredentials([
                    file(
                        credentialsId: 'kubeconfig-desktop',
                        variable: 'KUBECONFIG'
                    )
                ]) {
                    bat 'kubectl get deployment node-cicd-demo'
                    bat 'kubectl get pods'
                    bat 'kubectl get service node-cicd-service'
                }
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
