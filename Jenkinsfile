pipeline {
    agent any
    
    environment {
        AWS_REGION = 'us-west-2'
        ECR_REPOSITORY = 'lumina-ai'
        KUBECONFIG = credentials('eks-kubeconfig')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build and Test') {
            parallel {
                stage('UI Service') {
                    steps {
                        dir('lumina-ai/ui') {
                            sh 'npm install'
                            sh 'npm run test'
                            sh 'npm run build'
                        }
                    }
                }
                
                stage('EndUser Service') {
                    steps {
                        dir('lumina-ai/ui/enduser') {
                            sh 'npm install'
                            sh 'npm run test'
                            sh 'npm run build'
                        }
                    }
                }
                
                stage('Backend Services') {
                    steps {
                        dir('lumina-ai/microservices') {
                            sh './gradlew clean build test'
                        }
                    }
                }
                
                stage('Marketing Website') {
                    steps {
                        dir('lumina-ai-website') {
                            sh 'npm install'
                            sh 'npm run build'
                        }
                    }
                }
            }
        }
        
        stage('Security Scan') {
            steps {
                sh 'trivy image --severity HIGH,CRITICAL --exit-code 1 ${ECR_REPOSITORY}/ui-service:${BUILD_NUMBER}'
                sh 'trivy image --severity HIGH,CRITICAL --exit-code 1 ${ECR_REPOSITORY}/enduser-service:${BUILD_NUMBER}'
                sh 'trivy image --severity HIGH,CRITICAL --exit-code 1 ${ECR_REPOSITORY}/deployment-service:${BUILD_NUMBER}'
                sh 'trivy image --severity HIGH,CRITICAL --exit-code 1 ${ECR_REPOSITORY}/provider-service:${BUILD_NUMBER}'
                sh 'trivy image --severity HIGH,CRITICAL --exit-code 1 ${ECR_REPOSITORY}/governance-service:${BUILD_NUMBER}'
                sh 'trivy image --severity HIGH,CRITICAL --exit-code 1 ${ECR_REPOSITORY}/marketing-website:${BUILD_NUMBER}'
            }
        }
        
        stage('Build and Push Docker Images') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-ecr-credentials']]) {
                    sh 'aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com'
                    
                    // UI Service
                    sh 'docker build -t ${ECR_REPOSITORY}/ui-service:${BUILD_NUMBER} -t ${ECR_REPOSITORY}/ui-service:latest ./lumina-ai/ui'
                    sh 'docker push ${ECR_REPOSITORY}/ui-service:${BUILD_NUMBER}'
                    sh 'docker push ${ECR_REPOSITORY}/ui-service:latest'
                    
                    // EndUser Service
                    sh 'docker build -t ${ECR_REPOSITORY}/enduser-service:${BUILD_NUMBER} -t ${ECR_REPOSITORY}/enduser-service:latest ./lumina-ai/ui/enduser'
                    sh 'docker push ${ECR_REPOSITORY}/enduser-service:${BUILD_NUMBER}'
                    sh 'docker push ${ECR_REPOSITORY}/enduser-service:latest'
                    
                    // Deployment Service
                    sh 'docker build -t ${ECR_REPOSITORY}/deployment-service:${BUILD_NUMBER} -t ${ECR_REPOSITORY}/deployment-service:latest ./lumina-ai/microservices/deployment-service'
                    sh 'docker push ${ECR_REPOSITORY}/deployment-service:${BUILD_NUMBER}'
                    sh 'docker push ${ECR_REPOSITORY}/deployment-service:latest'
                    
                    // Provider Service
                    sh 'docker build -t ${ECR_REPOSITORY}/provider-service:${BUILD_NUMBER} -t ${ECR_REPOSITORY}/provider-service:latest ./lumina-ai/microservices/provider-service'
                    sh 'docker push ${ECR_REPOSITORY}/provider-service:${BUILD_NUMBER}'
                    sh 'docker push ${ECR_REPOSITORY}/provider-service:latest'
                    
                    // Governance Service
                    sh 'docker build -t ${ECR_REPOSITORY}/governance-service:${BUILD_NUMBER} -t ${ECR_REPOSITORY}/governance-service:latest ./lumina-ai/microservices/governance-service'
                    sh 'docker push ${ECR_REPOSITORY}/governance-service:${BUILD_NUMBER}'
                    sh 'docker push ${ECR_REPOSITORY}/governance-service:latest'
                    
                    // Marketing Website
                    sh 'docker build -t ${ECR_REPOSITORY}/marketing-website:${BUILD_NUMBER} -t ${ECR_REPOSITORY}/marketing-website:latest ./lumina-ai-website'
                    sh 'docker push ${ECR_REPOSITORY}/marketing-website:${BUILD_NUMBER}'
                    sh 'docker push ${ECR_REPOSITORY}/marketing-website:latest'
                }
            }
        }
        
        stage('Update Kustomize') {
            steps {
                script {
                    def targetEnv = params.DEPLOY_ENV ?: 'dev'
                    
                    // Update image tags in kustomization.yaml
                    sh """
                    cd lumina-ai-deployment/kubernetes/overlays/${targetEnv}
                    kustomize edit set image \
                        \${UI_SERVICE_IMAGE}=${ECR_REPOSITORY}/ui-service:${BUILD_NUMBER} \
                        \${DEPLOYMENT_SERVICE_IMAGE}=${ECR_REPOSITORY}/deployment-service:${BUILD_NUMBER} \
                        \${PROVIDER_SERVICE_IMAGE}=${ECR_REPOSITORY}/provider-service:${BUILD_NUMBER} \
                        \${GOVERNANCE_SERVICE_IMAGE}=${ECR_REPOSITORY}/governance-service:${BUILD_NUMBER} \
                        \${ENDUSER_SERVICE_IMAGE}=${ECR_REPOSITORY}/enduser-service:${BUILD_NUMBER} \
                        \${MARKETING_WEBSITE_IMAGE}=${ECR_REPOSITORY}/marketing-website:${BUILD_NUMBER}
                    """
                }
            }
        }
        
        stage('Deploy to Environment') {
            steps {
                script {
                    def targetEnv = params.DEPLOY_ENV ?: 'dev'
                    
                    // Apply Kubernetes configurations
                    sh """
                    export KUBECONFIG=${KUBECONFIG}
                    kubectl apply -k lumina-ai-deployment/kubernetes/overlays/${targetEnv}
                    """
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                script {
                    def targetEnv = params.DEPLOY_ENV ?: 'dev'
                    def namespace = targetEnv == 'dev' ? 'lumina-ai-dev' : (targetEnv == 'staging' ? 'lumina-ai-staging' : 'lumina-ai')
                    
                    // Wait for deployments to be ready
                    sh """
                    export KUBECONFIG=${KUBECONFIG}
                    kubectl rollout status deployment/ui-service -n ${namespace} --timeout=300s
                    kubectl rollout status deployment/deployment-service -n ${namespace} --timeout=300s
                    kubectl rollout status deployment/provider-service -n ${namespace} --timeout=300s
                    kubectl rollout status deployment/governance-service -n ${namespace} --timeout=300s
                    kubectl rollout status deployment/enduser-service -n ${namespace} --timeout=300s
                    kubectl rollout status deployment/marketing-website -n ${namespace} --timeout=300s
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo 'Deployment successful!'
            slackSend(color: 'good', message: "Deployment to ${params.DEPLOY_ENV ?: 'dev'} successful: ${env.JOB_NAME} #${env.BUILD_NUMBER}")
        }
        failure {
            echo 'Deployment failed!'
            slackSend(color: 'danger', message: "Deployment to ${params.DEPLOY_ENV ?: 'dev'} failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}")
        }
        always {
            cleanWs()
        }
    }
}
