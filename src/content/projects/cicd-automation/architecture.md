---
title: Architecture
description: SaaS platform CI/CD pipeline architecture and deployment flow
---

## Pipeline Architecture

The deployment pipeline follows a multi-stage orchestration pattern triggered by Bamboo CI/CD:

### Deployment Flow

1. **CI/CD Trigger** — Orchestration script receives environment parameters (QA, Dev, Staging, Test, Production)
2. **Repository Sync** — Git pull of the Ansible repository to ensure latest playbooks
3. **Monitoring Pause** — Uptime monitoring API pauses checks during deployment windows
4. **VM Provisioning** — Python API client manages VM lifecycle: start, stop, clone, snapshot
5. **Health Checks** — Wait for SSH (Linux) and RDP (Windows) availability before proceeding
6. **Snapshot Restore** — Hyper-V snapshot restoration for clean environment state
7. **Linux Configuration** — Ansible playbooks configure Elasticsearch, Redis, RabbitMQ, HAProxy
8. **Windows Configuration** — Ansible playbooks deploy application services, rendering engines, monitoring agents
9. **Customer Provisioning** — Automated tenant creation with per-environment credentials
10. **Test Execution** — xUnit test runners with automated test data generation
11. **Result Collection** — Test results aggregated and reported back to the CI/CD platform
12. **Metrics Push** — Deployment timing data sent to Graphite via netcat for Grafana dashboards
13. **Monitoring Resume** — Uptime monitoring re-enabled

### Environment Topology

Each deployment environment runs a multi-tier architecture:

| Tier | Components | Technology |
|------|-----------|------------|
| **Load Balancer** | HAProxy + Keepalived | VRRP-based HA, SSL termination |
| **Application** | Platform services (11+ microservices) | Windows, IIS |
| **Search** | Elasticsearch cluster (3+ nodes) | Kibana for visualization |
| **Cache** | Redis instances | Multiple databases per environment |
| **Messaging** | RabbitMQ | Multi-node clusters |
| **Workflow** | Apache Camunda | BPMN process engine |
| **Logging** | ELK stack | Filebeat, Metricbeat, Winlogbeat, Heartbeat |
| **Monitoring** | Nagios NRPE | Remote health checks |
| **Storage** | Samba/CIFS | File sharing and asset storage |

### Environments

| Environment | Purpose | Instances |
|------------|---------|-----------|
| **QA (x5)** | Parallel QA testing | 5 isolated environments |
| **Development** | Development | Single instance |
| **Test** | Load-balanced testing | Dual-instance with pool assignment |
| **Staging** | Staging | Multi-tenant customer configurations |
| **Production** | Production | Cloud production |

### Ansible Architecture

The infrastructure is organized as a layered Ansible codebase:

- **Inventories** — Per-environment host definitions
- **Group Variables** — Environment-specific configuration (ports, credentials, feature flags)
- **Roles (30+)** — Reusable infrastructure components (elasticsearch, redis, haproxy, application services, etc.)
- **Playbooks** — Orchestration combining roles for each environment
- **Vault** — Encrypted secrets (SSL certificates, credentials, Kerberos keytabs)

### Execution Configuration

- **Forks**: 50 (parallel Ansible execution across hosts)
- **Transport**: SSH (Linux), WinRM over HTTPS (Windows)
- **Secrets**: Ansible Vault encrypted files
- **Inventory**: Static files with environment-specific group variables
