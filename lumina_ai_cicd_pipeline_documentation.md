# Lumina AI CI/CD Pipeline Documentation

## Overview

This document outlines the Continuous Integration and Continuous Deployment (CI/CD) pipeline for the Lumina AI system. The pipeline automates building, testing, and deploying the application to AWS EKS environments.

## CI/CD Architecture

The CI/CD pipeline uses GitHub Actions for automation and integrates with AWS services for deployment:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Code Push  │────▶│   Build &   │────▶│  Automated  │────▶│  Deployment │
│  to GitHub  │     │    Test     │     │   Testing   │     │  to AWS EKS │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

## Pipeline Components

### 1. GitHub Actions Workflows

#### Main Workflow (`main.yml`)

```yaml
name: Lumina AI CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'
          
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Build UI
        run: |
          cd lumina-ai/ui
          npm install
          npm run build
          
      - name: Build Microservices
        run: |
          cd lumina-ai/microservices
          ./gradlew build
          
      - name: Run Tests
        run: |
          cd lumina-ai/ui
          npm test
          cd ../microservices
          ./gradlew test
          
      - name: Build Docker Images
        run: |
          docker build -t lumina-ai/ui-service:${{ github.sha }} ./lumina-ai/ui
          docker build -t lumina-ai/deployment-service:${{ github.sha }} ./lumina-ai/microservices/deployment-service
          docker build -t lumina-ai/provider-service:${{ github.sha }} ./lumina-ai/microservices/provider-service
          docker build -t lumina-ai/governance-service:${{ github.sha }} ./lumina-ai/microservices/governance-service
          docker build -t lumina-ai/enduser-service:${{ github.sha }} ./lumina-ai/ui/enduser
          docker build -t lumina-ai/marketing-website:${{ github.sha }} ./lumina-ai-website
          
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-west-2
          
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
        
      - name: Tag and Push Docker Images
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        run: |
          docker tag lumina-ai/ui-service:${{ github.sha }} $ECR_REGISTRY/lumina-ai/ui-service:${{ github.sha }}
          docker tag lumina-ai/deployment-service:${{ github.sha }} $ECR_REGISTRY/lumina-ai/deployment-service:${{ github.sha }}
          docker tag lumina-ai/provider-service:${{ github.sha }} $ECR_REGISTRY/lumina-ai/provider-service:${{ github.sha }}
          docker tag lumina-ai/governance-service:${{ github.sha }} $ECR_REGISTRY/lumina-ai/governance-service:${{ github.sha }}
          docker tag lumina-ai/enduser-service:${{ github.sha }} $ECR_REGISTRY/lumina-ai/enduser-service:${{ github.sha }}
          docker tag lumina-ai/marketing-website:${{ github.sha }} $ECR_REGISTRY/lumina-ai/marketing-website:${{ github.sha }}
          
          docker push $ECR_REGISTRY/lumina-ai/ui-service:${{ github.sha }}
          docker push $ECR_REGISTRY/lumina-ai/deployment-service:${{ github.sha }}
          docker push $ECR_REGISTRY/lumina-ai/provider-service:${{ github.sha }}
          docker push $ECR_REGISTRY/lumina-ai/governance-service:${{ github.sha }}
          docker push $ECR_REGISTRY/lumina-ai/enduser-service:${{ github.sha }}
          docker push $ECR_REGISTRY/lumina-ai/marketing-website:${{ github.sha }}
          
          # Tag as latest for main branch
          if [[ "${{ github.ref }}" == "refs/heads/main" ]]; then
            docker tag lumina-ai/ui-service:${{ github.sha }} $ECR_REGISTRY/lumina-ai/ui-service:stable
            docker tag lumina-ai/deployment-service:${{ github.sha }} $ECR_REGISTRY/lumina-ai/deployment-service:stable
            docker tag lumina-ai/provider-service:${{ github.sha }} $ECR_REGISTRY/lumina-ai/provider-service:stable
            docker tag lumina-ai/governance-service:${{ github.sha }} $ECR_REGISTRY/lumina-ai/governance-service:stable
            docker tag lumina-ai/enduser-service:${{ github.sha }} $ECR_REGISTRY/lumina-ai/enduser-service:stable
            docker tag lumina-ai/marketing-website:${{ github.sha }} $ECR_REGISTRY/lumina-ai/marketing-website:stable
            
            docker push $ECR_REGISTRY/lumina-ai/ui-service:stable
            docker push $ECR_REGISTRY/lumina-ai/deployment-service:stable
            docker push $ECR_REGISTRY/lumina-ai/provider-service:stable
            docker push $ECR_REGISTRY/lumina-ai/governance-service:stable
            docker push $ECR_REGISTRY/lumina-ai/enduser-service:stable
            docker push $ECR_REGISTRY/lumina-ai/marketing-website:stable
          fi
          
          # Tag as dev for develop branch
          if [[ "${{ github.ref }}" == "refs/heads/develop" ]]; then
            docker tag lumina-ai/ui-service:${{ github.sha }} $ECR_REGISTRY/lumina-ai/ui-service:dev
            docker tag lumina-ai/deployment-service:${{ github.sha }} $ECR_REGISTRY/lumina-ai/deployment-service:dev
            docker tag lumina-ai/provider-service:${{ github.sha }} $ECR_REGISTRY/lumina-ai/provider-service:dev
            docker tag lumina-ai/governance-service:${{ github.sha }} $ECR_REGISTRY/lumina-ai/governance-service:dev
            docker tag lumina-ai/enduser-service:${{ github.sha }} $ECR_REGISTRY/lumina-ai/enduser-service:dev
            docker tag lumina-ai/marketing-website:${{ github.sha }} $ECR_REGISTRY/lumina-ai/marketing-website:dev
            
            docker push $ECR_REGISTRY/lumina-ai/ui-service:dev
            docker push $ECR_REGISTRY/lumina-ai/deployment-service:dev
            docker push $ECR_REGISTRY/lumina-ai/provider-service:dev
            docker push $ECR_REGISTRY/lumina-ai/governance-service:dev
            docker push $ECR_REGISTRY/lumina-ai/enduser-service:dev
            docker push $ECR_REGISTRY/lumina-ai/marketing-website:dev
          fi
```

#### Deployment Workflow (`deploy.yml`)

```yaml
name: Deploy to EKS

on:
  workflow_run:
    workflows: ["Lumina AI CI/CD Pipeline"]
    branches: [main, develop]
    types:
      - completed

jobs:
  deploy-dev:
    if: ${{ github.event.workflow_run.conclusion == 'success' && github.ref == 'refs/heads/develop' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-west-2
          
      - name: Update kubeconfig
        run: aws eks update-kubeconfig --name lumina-ai-cluster --region us-west-2
        
      - name: Deploy to Dev
        run: |
          kubectl apply -k ./lumina-ai-deployment/kubernetes/overlays/dev
          
  deploy-staging:
    if: ${{ github.event.workflow_run.conclusion == 'success' && github.ref == 'refs/heads/main' }}
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-west-2
          
      - name: Update kubeconfig
        run: aws eks update-kubeconfig --name lumina-ai-cluster --region us-west-2
        
      - name: Deploy to Staging
        run: |
          kubectl apply -k ./lumina-ai-deployment/kubernetes/overlays/staging
          
  deploy-prod:
    if: ${{ github.event.workflow_run.conclusion == 'success' && github.ref == 'refs/heads/main' }}
    runs-on: ubuntu-latest
    environment: production
    needs: deploy-staging
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-west-2
          
      - name: Update kubeconfig
        run: aws eks update-kubeconfig --name lumina-ai-cluster --region us-west-2
        
      - name: Deploy to Production
        run: |
          kubectl apply -k ./lumina-ai-deployment/kubernetes/overlays/prod
```

## Deployment Strategy

### Environment Promotion Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Develop    │────▶│   Staging   │────▶│ Production  │
│ Environment │     │ Environment │     │ Environment │
└─────────────┘     └─────────────┘     └─────────────┘
```

1. **Development Environment**:
   - Automatically deployed when code is pushed to the `develop` branch
   - Used for development and testing new features
   - Reduced resource allocation and replicas

2. **Staging Environment**:
   - Automatically deployed when code is merged to the `main` branch
   - Used for pre-production validation
   - Configuration mirrors production but with moderate resources

3. **Production Environment**:
   - Deployed after successful staging deployment with manual approval
   - Full resource allocation with autoscaling
   - Enhanced monitoring and alerting

## Rollback Procedures

### Automated Rollback

The CI/CD pipeline includes automated health checks after deployment. If health checks fail, the system automatically rolls back to the previous stable version:

```yaml
- name: Verify Deployment
  run: |
    # Wait for deployment to complete
    kubectl rollout status deployment/ui-service -n lumina-ai
    kubectl rollout status deployment/enduser-service -n lumina-ai
    
    # Check health endpoints
    HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" https://api.lumina-ai.com/actuator/health)
    
    if [[ "$HEALTH_CHECK" != "200" ]]; then
      echo "Health check failed. Rolling back deployment."
      kubectl rollout undo deployment/ui-service -n lumina-ai
      kubectl rollout undo deployment/enduser-service -n lumina-ai
      exit 1
    fi
```

### Manual Rollback

For manual rollbacks, use the following procedure:

```bash
# Identify the previous revision
kubectl rollout history deployment/enduser-service -n lumina-ai

# Roll back to the previous revision
kubectl rollout undo deployment/enduser-service -n lumina-ai

# Or roll back to a specific revision
kubectl rollout undo deployment/enduser-service -n lumina-ai --to-revision=2
```

## Security Considerations

### Secrets Management

The CI/CD pipeline uses GitHub Secrets for storing sensitive information:

- AWS credentials
- Database credentials
- API keys

These secrets are securely injected into the pipeline at runtime and never exposed in logs.

### Image Scanning

All Docker images are scanned for vulnerabilities before deployment:

```yaml
- name: Scan Docker Images
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: ${{ steps.login-ecr.outputs.registry }}/lumina-ai/enduser-service:${{ github.sha }}
    format: 'table'
    exit-code: '1'
    ignore-unfixed: true
    vuln-type: 'os,library'
    severity: 'CRITICAL,HIGH'
```

## Monitoring and Alerting

### Deployment Notifications

The CI/CD pipeline sends notifications for deployment events:

```yaml
- name: Send Deployment Notification
  uses: slackapi/slack-github-action@v1.23.0
  with:
    channel-id: 'C01234ABCDEF'
    slack-message: "Deployment to ${{ github.job }} environment completed successfully!"
  env:
    SLACK_BOT_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }}
```

### Performance Monitoring

After deployment, the system collects performance metrics to ensure the new version meets performance requirements:

```yaml
- name: Collect Performance Metrics
  run: |
    # Wait for services to stabilize
    sleep 60
    
    # Collect metrics
    kubectl exec -it $(kubectl get pods -n monitoring -l app=prometheus -o jsonpath="{.items[0].metadata.name}") -n monitoring -- curl -s http://localhost:9090/api/v1/query?query=sum(rate(http_server_requests_seconds_count[5m]))
```

## Conclusion

This CI/CD pipeline documentation provides a comprehensive approach to automating the build, test, and deployment processes for Lumina AI. By following these practices, the team can ensure reliable, consistent, and secure deployments across all environments.
