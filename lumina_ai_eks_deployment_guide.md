# Lumina AI AWS EKS Deployment Documentation

## Overview

This document provides comprehensive instructions for deploying the Lumina AI system to AWS Elastic Kubernetes Service (EKS). The deployment configuration uses Kubernetes best practices including a base/overlays approach with Kustomize for managing environment-specific configurations.

## System Architecture

Lumina AI consists of the following microservices:

1. **UI Service** - Frontend interface for administrators
2. **Deployment Service** - Manages enterprise deployments
3. **Provider Service** - Handles AI provider integrations
4. **Governance Service** - Manages ethical AI governance
5. **EndUser Service** - Provides conversational interface with memory tracking
6. **Marketing Website** - Public-facing website

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI configured
- kubectl installed and configured
- eksctl installed
- Kustomize installed

## EKS Cluster Setup

```bash
# Create EKS cluster
eksctl create cluster \
  --name lumina-ai-cluster \
  --region us-west-2 \
  --nodegroup-name standard-nodes \
  --node-type m5.large \
  --nodes 3 \
  --nodes-min 3 \
  --nodes-max 10 \
  --managed

# Verify cluster creation
kubectl get nodes
```

## Database Setup

Lumina AI requires an AWS Aurora PostgreSQL database:

```bash
# Create Aurora PostgreSQL cluster
aws rds create-db-cluster \
  --db-cluster-identifier lumina-ai-db \
  --engine aurora-postgresql \
  --engine-version 13.6 \
  --master-username lumina_admin \
  --master-user-password <secure-password> \
  --db-subnet-group-name <your-subnet-group> \
  --vpc-security-group-ids <your-security-group>
```

## Secrets Management

Before deployment, update the secrets in the Kubernetes Secret manifest:

```bash
# Create a secure secret for database credentials
kubectl create secret generic lumina-secrets \
  --namespace lumina-ai \
  --from-literal=db_url=postgresql://lumina-db.cluster-xyz.us-west-2.rds.amazonaws.com:5432/luminadb \
  --from-literal=db_username=lumina_admin \
  --from-literal=db_password=<secure-password> \
  --from-literal=provider_api_keys='{"openai":"sk-key","anthropic":"sk-key","claude":"sk-key"}' \
  --from-literal=jwt_secret=<secure-jwt-secret>
```

## Deployment Process

### 1. Build and Push Docker Images

```bash
# Build and push UI Service
docker build -t lumina-ai/ui-service:stable ./lumina-ai/ui
docker push lumina-ai/ui-service:stable

# Build and push Deployment Service
docker build -t lumina-ai/deployment-service:stable ./lumina-ai/microservices/deployment-service
docker push lumina-ai/deployment-service:stable

# Build and push Provider Service
docker build -t lumina-ai/provider-service:stable ./lumina-ai/microservices/provider-service
docker push lumina-ai/provider-service:stable

# Build and push Governance Service
docker build -t lumina-ai/governance-service:stable ./lumina-ai/microservices/governance-service
docker push lumina-ai/governance-service:stable

# Build and push EndUser Service
docker build -t lumina-ai/enduser-service:stable ./lumina-ai/ui/enduser
docker push lumina-ai/enduser-service:stable

# Build and push Marketing Website
docker build -t lumina-ai/marketing-website:stable ./lumina-ai-website
docker push lumina-ai/marketing-website:stable
```

### 2. Deploy Using Kustomize

#### Development Environment

```bash
# Deploy to development environment
kubectl apply -k ./lumina-ai-deployment/kubernetes/overlays/dev
```

#### Staging Environment

```bash
# Deploy to staging environment
kubectl apply -k ./lumina-ai-deployment/kubernetes/overlays/staging
```

#### Production Environment

```bash
# Deploy to production environment
kubectl apply -k ./lumina-ai-deployment/kubernetes/overlays/prod
```

## Monitoring Setup

### Install Prometheus and Grafana

```bash
# Add Helm repo
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install Prometheus and Grafana
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace
```

### Configure Dashboards

Import the Lumina AI custom dashboards to Grafana:

1. Access Grafana UI
2. Navigate to Dashboards > Import
3. Upload the JSON files from `./monitoring/dashboards/`

## Backup and Disaster Recovery

### Database Backups

AWS Aurora automatically creates daily backups. Additional backup strategies:

```bash
# Install Velero for Kubernetes backups
velero install \
  --provider aws \
  --plugins velero/velero-plugin-for-aws:v1.2.0 \
  --bucket lumina-ai-backups \
  --backup-location-config region=us-west-2 \
  --snapshot-location-config region=us-west-2 \
  --secret-file ./credentials-velero

# Create scheduled backup
velero schedule create lumina-ai-daily --schedule="0 2 * * *" --include-namespaces lumina-ai
```

## Scaling Considerations

The production environment includes Horizontal Pod Autoscalers (HPAs) for all services. Monitor and adjust as needed:

```bash
# View current HPAs
kubectl get hpa -n lumina-ai

# Adjust HPA settings if needed
kubectl edit hpa enduser-service-hpa -n lumina-ai
```

## Troubleshooting

### Common Issues

1. **Pod Startup Failures**
   ```bash
   kubectl describe pod <pod-name> -n lumina-ai
   kubectl logs <pod-name> -n lumina-ai
   ```

2. **Database Connection Issues**
   - Verify security group settings
   - Check database credentials in secrets

3. **Ingress Issues**
   ```bash
   kubectl get ingress -n lumina-ai
   kubectl describe ingress lumina-ai-ingress -n lumina-ai
   ```

## Maintenance Procedures

### Rolling Updates

```bash
# Update image for a specific service
kubectl set image deployment/enduser-service enduser-service=lumina-ai/enduser-service:new-tag -n lumina-ai

# Or apply updated kustomization
kubectl apply -k ./lumina-ai-deployment/kubernetes/overlays/prod
```

### Rollback Procedure

```bash
# Rollback to previous revision
kubectl rollout undo deployment/enduser-service -n lumina-ai

# Rollback to specific revision
kubectl rollout undo deployment/enduser-service --to-revision=2 -n lumina-ai
```

## Security Considerations

1. **Network Policies**: Implement network policies to restrict traffic between services
2. **RBAC**: Use role-based access control for cluster management
3. **Secret Rotation**: Regularly rotate database credentials and API keys
4. **Image Scanning**: Implement container image scanning in CI/CD pipeline

## Performance Optimization

1. **Resource Tuning**: Monitor resource usage and adjust requests/limits
2. **Database Optimization**: Implement connection pooling and query optimization
3. **CDN**: Use CloudFront for marketing website and static assets
4. **Caching**: Implement Redis caching for frequently accessed data

## Conclusion

This deployment guide provides a comprehensive approach to deploying Lumina AI on AWS EKS. Follow these instructions to ensure a reliable, scalable, and secure deployment across development, staging, and production environments.
