#!/bin/bash

# Validation script for Lumina AI Kubernetes deployment configuration
# This script checks for common issues and validates the configuration

echo "Starting validation of Lumina AI Kubernetes deployment configuration..."
echo "======================================================================"

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "ERROR: kubectl is not installed. Please install kubectl first."
    exit 1
fi

# Check if kustomize is installed
if ! command -v kustomize &> /dev/null; then
    echo "WARNING: kustomize is not installed. Some validation checks will be skipped."
fi

# Create a temporary directory for validation
TEMP_DIR=$(mktemp -d)
echo "Created temporary directory for validation: $TEMP_DIR"

# Function to validate YAML syntax
validate_yaml_syntax() {
    local file=$1
    echo "Validating YAML syntax for $file..."
    
    if ! yamllint -d relaxed $file &> /dev/null; then
        echo "  WARNING: YAML syntax issues found in $file"
        yamllint -d relaxed $file
        return 1
    else
        echo "  YAML syntax is valid for $file"
        return 0
    fi
}

# Function to validate Kubernetes resources
validate_k8s_resource() {
    local file=$1
    echo "Validating Kubernetes resource $file..."
    
    if ! kubectl apply --dry-run=client -f $file &> /dev/null; then
        echo "  ERROR: Invalid Kubernetes resource in $file"
        kubectl apply --dry-run=client -f $file
        return 1
    else
        echo "  Kubernetes resource is valid in $file"
        return 0
    fi
}

# Validate base configurations
echo ""
echo "Validating base configurations..."
echo "--------------------------------"
BASE_DIR="/home/ubuntu/lumina-ai-deployment/kubernetes/base"
BASE_FILES=$(find $BASE_DIR -name "*.yaml")

for file in $BASE_FILES; do
    validate_yaml_syntax $file
    validate_k8s_resource $file
done

# Validate environment-specific overlays
for env in "dev" "staging" "prod"; do
    echo ""
    echo "Validating $env environment overlays..."
    echo "--------------------------------------"
    ENV_DIR="/home/ubuntu/lumina-ai-deployment/kubernetes/overlays/$env"
    ENV_FILES=$(find $ENV_DIR -name "*.yaml")
    
    for file in $ENV_FILES; do
        validate_yaml_syntax $file
    done
    
    # Validate kustomize build
    if command -v kustomize &> /dev/null; then
        echo "Validating kustomize build for $env environment..."
        if ! kustomize build $ENV_DIR > $TEMP_DIR/kustomize-$env.yaml 2>/dev/null; then
            echo "  ERROR: Failed to build kustomize for $env environment"
        else
            echo "  Successfully built kustomize for $env environment"
            validate_k8s_resource $TEMP_DIR/kustomize-$env.yaml
        fi
    fi
done

# Validate monitoring configurations
echo ""
echo "Validating monitoring configurations..."
echo "--------------------------------------"
MONITORING_DIR="/home/ubuntu/lumina-ai-deployment/kubernetes/monitoring"
MONITORING_FILES=$(find $MONITORING_DIR -name "*.yaml" 2>/dev/null)

for file in $MONITORING_FILES; do
    validate_yaml_syntax $file
    validate_k8s_resource $file
done

# Validate security configurations
echo ""
echo "Validating security configurations..."
echo "------------------------------------"
SECURITY_DIR="/home/ubuntu/lumina-ai-deployment/kubernetes/security"
SECURITY_FILES=$(find $SECURITY_DIR -name "*.yaml" 2>/dev/null)

for file in $SECURITY_FILES; do
    validate_yaml_syntax $file
    validate_k8s_resource $file
done

# Validate CI/CD configurations
echo ""
echo "Validating CI/CD configurations..."
echo "---------------------------------"
JENKINS_FILE="/home/ubuntu/lumina-ai-deployment/ci-cd/Jenkinsfile"
if [ -f "$JENKINS_FILE" ]; then
    echo "Jenkinsfile exists, but syntax cannot be validated without Jenkins CLI"
else
    echo "ERROR: Jenkinsfile not found at $JENKINS_FILE"
fi

GITHUB_WORKFLOW="/home/ubuntu/lumina-ai-deployment/ci-cd/github-actions/deploy.yml"
if [ -f "$GITHUB_WORKFLOW" ]; then
    validate_yaml_syntax $GITHUB_WORKFLOW
else
    echo "ERROR: GitHub Actions workflow not found at $GITHUB_WORKFLOW"
fi

# Check for common issues
echo ""
echo "Checking for common issues..."
echo "----------------------------"

# Check for hardcoded secrets
echo "Checking for hardcoded secrets..."
if grep -r "apiKey\|password\|secret\|token" --include="*.yaml" --include="*.yml" /home/ubuntu/lumina-ai-deployment | grep -v "secretKeyRef\|valueFrom"; then
    echo "  WARNING: Potential hardcoded secrets found. Please review the above files."
else
    echo "  No hardcoded secrets found."
fi

# Check for missing resource limits
echo "Checking for missing resource limits..."
if ! grep -r "resources:" --include="*.yaml" --include="*.yml" /home/ubuntu/lumina-ai-deployment | grep -A5 "resources:" | grep -E "limits:|requests:"; then
    echo "  WARNING: Some deployments may be missing resource limits or requests."
else
    echo "  Resource limits and requests found."
fi

# Check for missing liveness/readiness probes
echo "Checking for missing liveness/readiness probes..."
if ! grep -r "livenessProbe\|readinessProbe" --include="*.yaml" --include="*.yml" /home/ubuntu/lumina-ai-deployment; then
    echo "  WARNING: Some deployments may be missing liveness or readiness probes."
else
    echo "  Liveness and readiness probes found."
fi

# Clean up
echo ""
echo "Cleaning up temporary files..."
rm -rf $TEMP_DIR

echo ""
echo "Validation complete!"
echo "===================="
echo "Please review any warnings or errors above before proceeding with deployment."
