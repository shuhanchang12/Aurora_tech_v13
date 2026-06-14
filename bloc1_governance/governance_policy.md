# AuroraTech Data Governance & Compliance Policy (Bloc 1)

This policy establishes the data governance standards for Project Atomic-Link, ensuring security, regulatory compliance, and operational resilience across all data assets.

---

## 🔒 1. Role-Based Access Control (RBAC) Matrix

To secure our data warehouse and model endpoints, access is strictly partitioned:

| Role | Access Level | Description |
| :--- | :--- | :--- |
| **Data Steward / Admin** | Read / Write | Configures pipelines, performs DB maintenance, manages schemas. |
| **Data Scientist** | Read-Only (Anonymized) | Builds/retrains models. Accesses only processed, non-PII tables. |
| **Executive / Business User** | Read-Only (Aggregated) | Interacts with the central ERP Web Dashboard and KPI summaries. |

---

## 🇪🇺 2. GDPR & Regulatory Compliance (Zero-PII Standards)

To satisfy European GDPR requirements, we enforce **Data Minimization** at the ingestion stage:
* **PII Exclusion**: Customer `Age` and `Gender` are immediately dropped during the ETL stage before data is persisted.
* **Pseudonymization**: The `Customer ID` is cryptographically anonymized using SHA-256 hashing.
* **Encryption**: Data is encrypted using AES-256 at rest and TLS 1.3 in transit.

---

## 📈 3. Data Quality & SLA Management

We establish high standards of data reliability (DataOps):
* **Completeness**: Financial exchange rate feeds must maintain 99.9% completeness.
* **Resiliency & Fallbacks**: If external APIs (e.g., Frankfurter API) encounter a 500 error, Airflow fallback operators automatically query a 7-day moving average.
* **Data Refresh SLA**: The data warehouse must reflect fresh logs within 4 hours of physical customs clearance.

---

## 🤖 4. Model Drift & Retraining Circuit Breakers

To protect downstream production systems from stale predictions:
* **Drift Alerting**: Monthly automated Kolmogorov-Smirnov (KS) tests assess feature distributions.
* **Circuit Breaker**: If data drift (KS statistic) exceeds the threshold of `0.05`, an automated retraining pipeline is triggered.
* **Deployment Gate**: Retrained models are only deployed if they pass the unit testing suite.
