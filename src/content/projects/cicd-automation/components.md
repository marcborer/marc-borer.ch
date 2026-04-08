---
title: Component Reference
description: Key components of the SaaS platform CI/CD pipeline
---

## Core Orchestration

### BambooDeploy.sh

Entry point for all deployments, invoked by the CI/CD platform. Handles:

- Parsing environment parameters (platform target, version, options)
- Git repository synchronization
- Ansible playbook invocation with proper inventory and vault credentials
- Uptime monitoring pause/resume via API
- Error handling and deployment status reporting

### MetricsFormatAndSend.sh

Post-deployment metrics collection script (Python). Responsibilities:

- Parsing deployment logs for stage durations
- Calculating per-stage timing metrics
- Sending metrics to Graphite (port 2003 via netcat)
- Executing Windows test suites via WinRM
- Pushing deployment metrics to Grafana dashboards

### Cloud Provider API Client

Python client wrapping the cloud provider REST API. Operations:

| Operation | Description |
|-----------|-------------|
| `start` | Power on a VM by UUID |
| `stop` | Graceful shutdown |
| `clone` | Create a copy of an existing VM |
| `snapshot` | Create a point-in-time snapshot |
| `status` | Query VM state (running, stopped, etc.) |
| `list` | Enumerate VMs with metadata |

Used by Ansible playbooks to manage VM lifecycle programmatically during deployments.

---

## Ansible Roles (Key Selection)

### Infrastructure Roles

| Role | Purpose |
|------|---------|
| **elasticsearch** | Elasticsearch cluster deployment and configuration (multi-node clusters) |
| **redis** | Redis instance provisioning (multiple databases per environment) |
| **rabbitmq** | RabbitMQ message queue cluster setup |
| **haproxy** | Load balancer configuration with SSL termination and backend definitions |
| **keepalived** | VRRP-based HA for HAProxy (virtual IP failover) |
| **logstash** | Log processing pipeline configuration |
| **kibana** | Kibana dashboard deployment |
| **nagios-nrpe** | Nagios remote plugin executor for health monitoring |
| **postfix** | Mail service configuration |

### Application Roles

| Role | Purpose |
|------|---------|
| **application** | Core application deployment (multi-service) |
| **cloudmanager** | Management console deployment |
| **servicesuite** | Service suite: file sharing, mail, storage, asset management, task processing, data extraction |
| **rendering** | Rendering services: image, video, document, audio processing |
| **tika** | Apache Tika for document content extraction (Solr-based) |

### Monitoring & Logging Roles

| Role | Purpose |
|------|---------|
| **filebeat** | Application log shipping to ELK |
| **metricbeat** | Performance metrics collection |
| **winlogbeat** | Windows event log shipping |
| **heartbeat** | Uptime monitoring |
| **graphite-powershell** | Windows metrics collection for Graphite |

### Platform Roles

| Role | Purpose |
|------|---------|
| **common** | Base OS configuration, NTP, DNS, SELinux policies |
| **domain-join** | Active Directory domain membership for Windows/Linux |
| **samba** | CIFS/SMB file sharing |
| **artifactory** | Maven repository for build artifacts |
| **foreman** | OS provisioning and inventory management |

---

## Snapshot Management

### Hyper-V Integration

Snapshot operations target on-premises Hyper-V hosts for rapid environment reset:

- **Save**: Capture current state before deployment
- **Restore**: Reset environment to known-good state (minutes vs. hours of manual rebuild)
- **Clone**: Create new environments from golden images

Hosts managed via dedicated physical Hyper-V servers.

### Cloud Provider Snapshots

Cloud-side snapshot management via the Python API client:

- VM-level snapshots for cloud-hosted environments
- Used for QA environment reset between test runs
- Integrated into the CI/CD deployment pipeline

---

## Test Automation

### Test Execution Flow

1. **Customer provisioning** — Automated creation of test tenants with unique credentials
2. **Test data generation** — Sample assets, metadata, and user accounts populated
3. **xUnit runners** — C#/.NET test suites executed against the deployed environment
4. **Result collection** — Test results aggregated and reported to the CI/CD platform
5. **Cleanup** — Environment state preserved or reset based on test outcome

### Test Environments

- **Test**: Dual-instance pool with stateful assignment (prevents test collision)
- **QA (x5)**: Five parallel environments enabling concurrent test runs across teams

---

## Security

### Credential Management

- **Ansible Vault** — Encrypted YAML files for passwords, API keys, certificates
- **Kerberos keytabs** — Service account authentication for AD-joined services
- **SSL certificates** — Managed via vault, deployed to HAProxy and application servers
- **WinRM HTTPS** — Encrypted remote management for Windows hosts

### Network Security

- **SELinux policies** — Custom policies for Linux services
- **Firewall rules** — Per-role iptables configuration
- **CIFS/SMB** — Authenticated file sharing with AD credentials
