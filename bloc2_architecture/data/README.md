# 📊 Data Architecture Validation Samples

This directory contains sample datasets used to validate the Star Schema data warehouse design prior to full pipeline deployment.

## `fx_sample.csv` — Foreign Exchange Rate Baseline

A 10-day snapshot of EUR/USD and EUR/TWD exchange rates (June 1–12, 2026), sourced from the [Frankfurter API](https://api.frankfurter.app/) ([source code](https://github.com/lineofflight/frankfurter)).

| Column | Type | Description |
|:---|:---|:---|
| `base_currency` | VARCHAR(3) | Source currency (always EUR) |
| `target_currency` | VARCHAR(3) | Target currency (USD or TWD) |
| `exchange_rate` | DECIMAL(10,4) | The exchange rate at retrieval time |
| `retrieved_at` | TIMESTAMP | When the rate was captured (daily 16:00 CET) |

> **Schema Alignment:** Column names match `staging.fx_rates_raw` defined in [`bloc3_pipelines/sql/create_tables.sql`](../../../bloc3_pipelines/sql/create_tables.sql), ensuring seamless ingestion from this staging table into the `dwh.fact_chromebook_margin_risk` fact table via the Airflow ETL pipeline.

### Star Schema Integration Point

```
fx_sample.csv  ──►  staging.fx_rates_raw  ──►  dwh.fact_chromebook_margin_risk
                                                    ├── dim_date (date_id)
                                                    └── dim_chromebook_vendor (vendor_id)
```

This sample proves that the financial dimension of the data warehouse can correctly join FX rates with supply chain logistics data (from `Electronic_sales_Sep2023-Sep2024.csv`) on a daily `date` granularity, enabling accurate cross-currency margin risk calculations.
