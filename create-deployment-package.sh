#!/bin/bash

# This script creates a complete deployment package for Lumina AI on AWS EKS
# It packages all necessary configuration files and scripts into a single archive

set -e

# Create a temporary directory for packaging
TEMP_DIR=$(mktemp -d)
PACKAGE_DIR="$TEMP_DIR/lumina-ai-eks-deployment"
mkdir -p $PACKAGE_DIR

echo "Creating Lumina AI EKS deployment package..."
echo "==========================================="

# Copy Kubernetes configurations
echo "Copying Kubernetes configurations..."
cp -r /home/ubuntu/lumina-ai-deployment/kubernetes $PACKAGE_DIR/

# Copy CI/CD configurations
echo "Copying CI/CD configurations..."
mkdir -p $PACKAGE_DIR/ci-cd
cp -r /home/ubuntu/lumina-ai-deployment/ci-cd/* $PACKAGE_DIR/ci-cd/

# Copy deployment scripts
echo "Copying deployment scripts..."
cp /home/ubuntu/lumina-ai-deployment/deploy.sh $PACKAGE_DIR/
cp /home/ubuntu/lumina-ai-deployment/validate-deployment.sh $PACKAGE_DIR/

# Create documentation directory
mkdir -p $PACKAGE_DIR/docs

# Copy EKS deployment guide
echo "Copying documentation..."
cp /home/ubuntu/lumina_ai_eks_deployment_guide.md $PACKAGE_DIR/docs/
cp /home/ubuntu/lumina_ai_cicd_pipeline_documentation.md $PACKAGE_DIR/docs/ 2>/dev/null || echo "CI/CD documentation not found, skipping..."
cp /home/ubuntu/lumina_ai_troubleshooting_guide.md $PACKAGE_DIR/docs/ 2>/dev/null || echo "Troubleshooting guide not found, skipping..."

# Create README file
echo "Creating README file..."
cat > $PACKAGE_DIR/README.md << EOF
# Lumina AI AWS EKS Deployment Package

This package contains all the necessary configurations and scripts to deploy Lumina AI to AWS EKS.

## Contents

- \`kubernetes/\` - Kubernetes configuration files
  - \`base/\` - Base Kubernetes configurations
  - \`overlays/\` - Environment-specific overlays (dev, staging, prod)
  - \`monitoring/\` - Prometheus and Grafana configurations
  - \`security/\` - Security-related configurations

- \`ci-cd/\` - CI/CD pipeline configurations
  - \`Jenkinsfile\` - Jenkins pipeline configuration
  - \`github-actions/\` - GitHub Actions workflow configurations

- \`deploy.sh\` - Main deployment script
- \`validate-deployment.sh\` - Validation script for Kubernetes configurations

- \`docs/\` - Documentation
  - \`lumina_ai_eks_deployment_guide.md\` - Comprehensive deployment guide
  - \`lumina_ai_cicd_pipeline_documentation.md\` - CI/CD pipeline documentation
  - \`lumina_ai_troubleshooting_guide.md\` - Troubleshooting guide

## Quick Start

1. Configure AWS CLI with appropriate credentials
2. Run the validation script:
   \`\`\`
   ./validate-deployment.sh
   \`\`\`
3. Deploy to your desired environment:
   \`\`\`
   ./deploy.sh --environment dev|staging|prod
   \`\`\`

## Advanced Usage

See \`./deploy.sh --help\` for additional deployment options.

For detailed instructions, refer to the documentation in the \`docs/\` directory.
EOF

# Create deployment checklist
echo "Creating deployment checklist..."
cat > $PACKAGE_DIR/DEPLOYMENT_CHECKLIST.md << EOF
# Lumina AI Deployment Checklist

Use this checklist to ensure a successful deployment of Lumina AI to AWS EKS.

## Pre-Deployment

- [ ] AWS account with appropriate permissions is available
- [ ] AWS CLI is installed and configured
- [ ] kubectl is installed and configured
- [ ] EKS cluster is created and running
- [ ] ECR repositories are created for all services
- [ ] Database (AWS Aurora PostgreSQL) is provisioned
- [ ] Secrets are configured in AWS Secrets Manager or as Kubernetes Secrets

## Validation

- [ ] Run \`./validate-deployment.sh\` to validate Kubernetes configurations
- [ ] Verify all validation checks pass without errors
- [ ] Address any warnings identified during validation

## Deployment

- [ ] Select the appropriate environment (dev, staging, prod)
- [ ] Run \`./deploy.sh\` with appropriate parameters
- [ ] Verify all deployments are successful
- [ ] Check that all pods are running and healthy
- [ ] Verify ingress configuration and DNS settings

## Post-Deployment

- [ ] Test application functionality
- [ ] Verify monitoring is working (Prometheus and Grafana)
- [ ] Check that alerts are properly configured
- [ ] Verify backup CronJob is running
- [ ] Document any issues or observations for future deployments
EOF

# Create version file
echo "Creating version file..."
cat > $PACKAGE_DIR/VERSION << EOF
Lumina AI EKS Deployment Package
Version: 1.0.0
Created: $(date +"%Y-%m-%d")
EOF

# Create the final package
echo "Creating deployment package archive..."
cd $TEMP_DIR
tar -czf /home/ubuntu/lumina-ai-eks-deployment-package.tar.gz lumina-ai-eks-deployment

# Clean up
echo "Cleaning up temporary files..."
rm -rf $TEMP_DIR

echo ""
echo "Deployment package created: /home/ubuntu/lumina-ai-eks-deployment-package.tar.gz"
echo "=============================================================================="
