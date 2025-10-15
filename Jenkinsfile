pipeline {
    agent any

    environment {
        AWS_ACCOUNT_ID = '476114143297' 
        AWS_REGION = 'ap-southeast-1'     
        BACKEND_ECR_REPO_URL = '476114143297.dkr.ecr.ap-southeast-1.amazonaws.com/reels-chat/backend' 
        FRONTEND_ECR_REPO_URL = '476114143297.dkr.ecr.ap-southeast-1.amazonaws.com/reels-chat/frontend'
    }

    stages {
        stage('1. Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('2. Build & Push Backend') {
            steps {
                script {
                    def repoUrl = "476114143297.dkr.ecr.ap-southeast-1.amazonaws.com/reels-chat/backend"
                    
                    withAWS(credentials: 'aws-credentials-for-cicd', region: 'ap-southeast-1') {
                        def dockerImage = docker.build("${repoUrl}:${env.BUILD_NUMBER}", './backend')
                        docker.withRegistry("https://${repoUrl}", 'ecr:ap-southeast-1:aws-credentials-for-cicd') {
                            dockerImage.push()
                            dockerImage.push("latest")
                        }
                    }
                }
            }
        }

        stage('3. Build & Push Frontend') {
            steps {
                script {
                    def repoUrl = "476114143297.dkr.ecr.ap-southeast-1.amazonaws.com/reels-chat/frontend"
                    withAWS(credentials: 'aws-credentials-for-cicd', region: 'ap-southeast-1') {
                        def dockerImage = docker.build("${repoUrl}:${env.BUILD_NUMBER}", './frontend')
                        docker.withRegistry("https://${repoUrl}", 'ecr:ap-southeast-1:aws-credentials-for-cicd') {
                            dockerImage.push()
                            dockerImage.push("latest")
                        }
                    }
                }
            }
        }

        stage('4. Deploy to Kubernetes') {
            steps {
                script {
                    // Cần có kubeconfig được cấu hình trong Jenkins
                    def backendRepoUrl = "476114143297.dkr.ecr.ap-southeast-1.amazonaws.com/reels-chat/backend" 
                    def frontendRepoUrl = "476114143297.dkr.ecr.ap-southeast-1.amazonaws.com/reels-chat/frontend" 
                    
                    // Sử dụng kubectl để cập nhật image và rollout
                    sh "kubectl apply -f kubernetes/"
                    sh "kubectl set image deployment/backend-deployment -n reels-chat backend=${backendRepoUrl}:${env.BUILD_NUMBER}"
                    sh "kubectl set image deployment/frontend-deployment -n reels-chat frontend=${frontendRepoUrl}:${env.BUILD_NUMBER}"
                    sh "kubectl rollout status deployment/backend-deployment -n reels-chat"
                    sh "kubectl rollout status deployment/frontend-deployment -n reels-chat"
                }
            }
        }
    }
}
