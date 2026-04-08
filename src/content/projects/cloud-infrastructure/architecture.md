---
title: Architecture
description: Exchange & Teams migration, hybrid identity, and SIEM — architectural decisions and system design
---

## Exchange Online & Teams Migration

*Migration of a business-critical messaging platform to a cloud-based architecture with voice integration*

### Problem

The company was running aging on-premises messaging and telephony infrastructure
approaching end of support. The fragmented setup created operational overhead and
limited scalability.

### Approach

Two-phase migration strategy — telephony first, mailboxes second (smaller blast radius, builds operational confidence before the larger migration):

- **Teams Calling** — Direct Routing with SBC high availability (chosen over Calling Plan for cost control, number portability, and leverage of existing SBC investment)
- **Exchange Online** — Bridge architecture for hybrid coexistence (enables staged migration with zero downtime while maintaining mail flow between on-premises and cloud)
- **Public folders** — Modernized and migrated using PowerShell automation pipeline
- **Security uplift** — License upgrade for advanced threat protection (ATP, Attack Simulation, Safe Attachments/Links)

### Key Challenges Solved

- **Voice interoperability** — IVR compatibility issues resolved through media bypass and early media configuration adjustments
- **Hybrid coexistence** — Bridge-based migration with proper mail flow connectors and email authentication (SPF/DKIM/DMARC)
- **Provider evaluation** — Structured evaluation of SIP trunk providers considering number portability risks

### Outcome

- **Complete migration with zero downtime** — Enterprise-wide transition to Exchange Online and Teams with uninterrupted operations
- **Unified communication platform** — Messaging, telephony, and collaboration consolidated on a single platform
- **Improved security posture** — Advanced Threat Protection, Attack Simulation, and Safe Attachments/Links enabled enterprise-wide
- **Carrier independence** — Direct Routing enables flexible provider switching without platform changes

---

## Hybrid Identity & User Lifecycle Automation

*Fully standardized employee onboarding and offboarding automation*

### What It Does

- **Self-service portal** — HR-initiated provisioning via a low-code portal
- **On-premises orchestration** — PowerShell pipeline for Active Directory account provisioning, fileshare permissions, and cloud group memberships
- **Cloud onboarding** — Automatic mailbox configuration, licensing, and phone number assignment via Azure Automation and Graph API
- **Lifecycle management** — Standardized onboarding and offboarding process across all IT systems, triggered by a single HR action

---

## Centralized Log Aggregation and Anomaly Detection

*Enterprise-wide SIEM platform with Elastic Stack*

### Problem

Security-relevant events — failed logins, account lockouts, authentication attempts,
application errors — were scattered across the entire server fleet with no way to
correlate or alert on patterns. Threats like password spray attacks were invisible
without centralized visibility.

### What It Does

- **Infrastructure** — Elasticsearch-Logstash-Kibana cluster in high availability configuration
- **Data ingestion** — Multi-source collection: application logs, performance metrics, Windows events, and uptime monitoring
- **Security dashboards** — Correlation of account lockouts with failed login patterns for real-time detection of password spray attacks, brute force attempts, and anomalous authentication behavior
- **Operational monitoring** — Performance metrics, uptime monitoring, and compliance reporting across the full server fleet

### Outcome

- **Centralized security visibility** — From scattered, uncorrelatable logs to enterprise-wide real-time threat detection
- **Automated detection** — Password spray attacks, brute force attempts, and anomalous authentication behavior detected in real time
- **Operational transparency** — Correlation of performance data, availability, and security events across the entire infrastructure
