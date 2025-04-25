# Lumina AI Deployment Troubleshooting Guide

## Overview

This document provides troubleshooting guidance for common issues that may arise during the deployment and operation of the Lumina AI system on AWS EKS. It covers diagnostics, common problems, and resolution steps.

## Diagnostic Tools

### Kubernetes Diagnostics

```bash
# Check pod status
kubectl get pods -n lumina-ai

# View detailed pod information
kubectl describe pod <pod-name> -n lumina-ai

# Check logs
kubectl logs <pod-name> -n lumina-ai

# Check events
kubectl get events -n lumina-ai --sort-by='.lastTimestamp'

# Check service status
kubectl get svc -n lumina-ai

# Check ingress status
kubectl get ingress -n lumina-ai
```

### Application Diagnostics

```bash
# Check application health endpoints
curl https://api.lumina-ai.com/actuator/health

# Check application metrics
curl https://api.lumina-ai.com/actuator/metrics

# Check application info
curl https://api.lumina-ai.com/actuator/info
```

## Common Issues and Resolutions

### 1. Pod Startup Failures

#### Symptoms
- Pods stuck in `Pending` or `CrashLoopBackOff` state
- Error messages in pod logs

#### Possible Causes and Solutions

**Resource Constraints**
```bash
# Check if nodes have sufficient resources
kubectl describe nodes | grep -A 5 "Allocated resources"

# Solution: Adjust resource requests/limits
kubectl edit deployment <deployment-name> -n lumina-ai
# Modify resources.requests and resources.limits
```

**Image Pull Errors**
```bash
# Check if image pull errors are occurring
kubectl describe pod <pod-name> -n lumina-ai | grep -A 5 "Events"

# Solution: Verify ECR permissions and image tags
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin <aws-account-id>.dkr.ecr.us-west-2.amazonaws.com
```

**Configuration Errors**
```bash
# Check for configuration issues in logs
kubectl logs <pod-name> -n lumina-ai

# Solution: Verify ConfigMaps and Secrets
kubectl get configmap -n lumina-ai
kubectl get secret -n lumina-ai
```

### 2. Service Connectivity Issues

#### Symptoms
- Services cannot communicate with each other
- "Connection refused" errors in logs

#### Possible Causes and Solutions

**Service Discovery Issues**
```bash
# Check if services are correctly defined
kubectl get svc -n lumina-ai

# Solution: Verify service selectors match pod labels
kubectl describe svc <service-name> -n lumina-ai
kubectl get pods -n lumina-ai --show-labels
```

**Network Policy Restrictions**
```bash
# Check if network policies are blocking traffic
kubectl get networkpolicy -n lumina-ai

# Solution: Adjust network policies
kubectl edit networkpolicy <policy-name> -n lumina-ai
```

**DNS Resolution Issues**
```bash
# Check DNS resolution from within a pod
kubectl exec -it <pod-name> -n lumina-ai -- nslookup <service-name>

# Solution: Verify CoreDNS is functioning
kubectl get pods -n kube-system | grep coredns
kubectl logs <coredns-pod-name> -n kube-system
```

### 3. Database Connection Problems

#### Symptoms
- Database connection errors in application logs
- Services failing to start due to database issues

#### Possible Causes and Solutions

**Connection String Issues**
```bash
# Check database connection string in secrets
kubectl get secret lumina-secrets -n lumina-ai -o jsonpath='{.data.db_url}' | base64 --decode

# Solution: Update the secret with correct connection string
kubectl edit secret lumina-secrets -n lumina-ai
```

**Security Group Restrictions**
```bash
# Solution: Verify AWS RDS security group allows traffic from EKS cluster
aws ec2 describe-security-groups --group-ids <security-group-id>

# Add rule to allow traffic from EKS cluster
aws ec2 authorize-security-group-ingress --group-id <security-group-id> --protocol tcp --port 5432 --source-group <eks-node-security-group-id>
```

**Database Credentials**
```bash
# Check if credentials are correct
kubectl get secret lumina-secrets -n lumina-ai -o jsonpath='{.data.db_username}' | base64 --decode
kubectl get secret lumina-secrets -n lumina-ai -o jsonpath='{.data.db_password}' | base64 --decode

# Solution: Update credentials if needed
kubectl edit secret lumina-secrets -n lumina-ai
```

### 4. Ingress and External Access Issues

#### Symptoms
- Unable to access application from outside the cluster
- 404, 502, or 503 errors when accessing endpoints

#### Possible Causes and Solutions

**Ingress Controller Issues**
```bash
# Check if ingress controller is running
kubectl get pods -n ingress-nginx

# Solution: Reinstall ingress controller if needed
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace
```

**Ingress Resource Configuration**
```bash
# Check ingress resource configuration
kubectl describe ingress lumina-ai-ingress -n lumina-ai

# Solution: Verify backend services and paths
kubectl edit ingress lumina-ai-ingress -n lumina-ai
```

**SSL Certificate Issues**
```bash
# Check if SSL certificates are properly configured
kubectl get secret tls-secret -n lumina-ai

# Solution: Update SSL certificates
kubectl create secret tls tls-secret --cert=path/to/cert.crt --key=path/to/key.key -n lumina-ai --dry-run=client -o yaml | kubectl apply -f -
```

### 5. Performance and Scaling Issues

#### Symptoms
- Slow response times
- High CPU or memory usage
- Autoscaling not working as expected

#### Possible Causes and Solutions

**Resource Bottlenecks**
```bash
# Check resource usage
kubectl top pods -n lumina-ai
kubectl top nodes

# Solution: Adjust resource requests/limits
kubectl edit deployment <deployment-name> -n lumina-ai
```

**HPA Configuration Issues**
```bash
# Check HPA status
kubectl get hpa -n lumina-ai
kubectl describe hpa <hpa-name> -n lumina-ai

# Solution: Adjust HPA configuration
kubectl edit hpa <hpa-name> -n lumina-ai
```

**Cluster Autoscaler Issues**
```bash
# Check if cluster autoscaler is working
kubectl logs -n kube-system -l app=cluster-autoscaler

# Solution: Verify cluster autoscaler configuration
aws eks update-cluster-config --name lumina-ai-cluster --region us-west-2 \
  --auto-scaling-groups minSize=3,maxSize=10,desiredCapacity=3
```

### 6. Memory Tracking and Chat Length Monitoring Issues

#### Symptoms
- Memory tracking not functioning correctly
- Chat length warnings not appearing
- Context loss in long conversations

#### Possible Causes and Solutions

**Feature Flag Configuration**
```bash
# Check feature flag configuration
kubectl get configmap lumina-config -n lumina-ai -o jsonpath='{.data.feature_flags}'

# Solution: Update feature flags
kubectl edit configmap lumina-config -n lumina-ai
# Ensure "memoryTracking" and "chatLengthMonitoring" are set to true
```

**EndUser Service Configuration**
```bash
# Check EndUser service configuration
kubectl describe deployment enduser-service -n lumina-ai

# Solution: Verify environment variables
kubectl edit deployment enduser-service -n lumina-ai
# Check for MEMORY_TRACKING_ENABLED and CHAT_LENGTH_MONITOR_ENABLED
```

**Database Schema Issues**
```bash
# Solution: Verify database schema includes required tables
kubectl exec -it <pod-name> -n lumina-ai -- psql -h <db-host> -U <db-user> -d luminadb -c "\dt memory_*"
kubectl exec -it <pod-name> -n lumina-ai -- psql -h <db-host> -U <db-user> -d luminadb -c "\dt chat_*"
```

## Advanced Troubleshooting

### Debugging with Ephemeral Containers

```bash
# Add debug container to running pod
kubectl debug -it <pod-name> -n lumina-ai --image=busybox --target=<container-name>
```

### Network Debugging

```bash
# Test network connectivity between services
kubectl run -it --rm network-debug --image=nicolaka/netshoot -n lumina-ai -- bash

# Inside debug pod
curl <service-name>:<port>
nslookup <service-name>
tcpdump -i eth0 port <port>
```

### Log Analysis

```bash
# Install and use stern for advanced log filtering
stern <pod-prefix> -n lumina-ai --tail 100

# Search for specific error patterns
kubectl logs <pod-name> -n lumina-ai | grep -i error
```

## Contacting Support

If you cannot resolve an issue using this guide, contact the Lumina AI support team:

- Email: support@lumina-ai.com
- Support Portal: https://support.lumina-ai.com
- Emergency Hotline: +1-555-LUMINA-AI

When contacting support, please provide:
1. Detailed description of the issue
2. Relevant logs and error messages
3. Steps already taken to troubleshoot
4. Environment information (EKS version, Kubernetes version, etc.)

## Appendix: Common Error Messages and Solutions

| Error Message | Possible Cause | Solution |
|---------------|----------------|----------|
| `CrashLoopBackOff: container exited with code 137` | Out of memory | Increase memory limits in deployment |
| `ImagePullBackOff: failed to pull image` | Image not found or permissions issue | Verify image exists and ECR permissions |
| `Connection refused` | Service not running or network issue | Check service status and network policies |
| `FATAL: password authentication failed` | Incorrect database credentials | Update database secrets |
| `Error establishing a database connection` | Database connectivity issue | Check security groups and network paths |
| `503 Service Temporarily Unavailable` | Ingress or backend service issue | Check ingress configuration and backend services |
| `Context length exceeded` | Chat length monitoring issue | Verify EndUser service configuration |
