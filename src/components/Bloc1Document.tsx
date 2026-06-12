import React from 'react';
import { Printer, FileText, CheckCircle, AlertTriangle, ShieldCheck, BookOpen, Users, Lock, Target, FileDown } from 'lucide-react';

export default function Bloc1Document() {
    const exportToWord = () => {
        const contentBlock = document.getElementById('document-content');
        if (!contentBlock) return;
        
        const preHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>Data Governance Plan</title></head><body>`;
        const postHtml = "</body></html>";
        const html = preHtml + contentBlock.innerHTML + postHtml;

        const blob = new Blob(['\ufeff', html], {
            type: 'application/msword'
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Data_Governance_Plan.doc';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-white text-slate-800 p-8 md:p-12 max-w-5xl mx-auto shadow-2xl print:shadow-none print:p-0 my-8 rounded-xl print:m-0 print:border-none">
            <div className="print:hidden mb-8 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-1 flex items-center gap-3">
                        <FileText className="text-indigo-600" />
                        Comprehensive Data Governance Plan
                    </h2>
                    <p className="text-slate-500 text-sm md:text-base max-w-2xl">
                        Official written deliverable (8-10 pages equivalent). Formatted for A4 export. Contains the fictional organization context, policy, stakeholders matrix, GDPR compliance, data quality controls, security protocols, and risk assessments.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={exportToWord}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-md transition-all active:scale-95 shrink-0"
                    >
                        <FileDown size={18} />
                        Export to Word
                    </button>
                    <button 
                        onClick={() => window.print()}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-md transition-all active:scale-95 shrink-0"
                    >
                        <Printer size={18} />
                        Export to PDF
                    </button>
                </div>
            </div>
            
            <div id="document-content" className="print:text-black space-y-16 leading-relaxed font-serif text-lg">
                
                {/* --- COVER PAGE --- */}
                <div className="print:h-[297mm] flex flex-col justify-center items-center text-center border-b border-slate-300 pb-16 print:border-none print:pb-0">
                    <div className="w-32 h-32 bg-indigo-900 rounded-2xl mb-8 flex items-center justify-center text-white shadow-xl rotate-3">
                        <ShieldCheck size={64} className="-rotate-3" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 uppercase tracking-tight leading-tight">Master Data<br/>Governance Policy</h1>
                    <h2 className="text-2xl md:text-3xl text-slate-600 mb-16 font-medium">Aurora Tech Computing Group</h2>
                    
                    <div className="text-left bg-slate-50 print:bg-transparent p-8 rounded-xl w-full max-w-xl border border-slate-200 print:border-black font-sans shadow-sm">
                        <h3 className="uppercase tracking-widest text-slate-400 font-bold text-xs mb-4">Document Meta Information</h3>
                        <p className="flex justify-between border-b border-slate-200 print:border-slate-400 pb-3 mb-3"><span className="font-semibold text-slate-500 print:text-black">Project Code:</span> <strong className="text-slate-900">Atomic-Link</strong></p>
                        <p className="flex justify-between border-b border-slate-200 print:border-slate-400 pb-3 mb-3"><span className="font-semibold text-slate-500 print:text-black">Prepared By:</span> <strong className="text-slate-900">Lead AI & Data Architect</strong></p>
                        <p className="flex justify-between border-b border-slate-200 print:border-slate-400 pb-3 mb-3"><span className="font-semibold text-slate-500 print:text-black">Date of Issue:</span> <strong className="text-slate-900">June 2026</strong></p>
                        <p className="flex justify-between border-b border-slate-200 print:border-slate-400 pb-3 mb-3"><span className="font-semibold text-slate-500 print:text-black">Target Audience:</span> <strong className="text-slate-900">Executive Jury & Governance Council</strong></p>
                        <p className="flex justify-between"><span className="font-semibold text-slate-500 print:text-black">Classification:</span> <strong className="text-rose-600 print:text-black uppercase tracking-wider">Strictly Confidential</strong></p>
                    </div>
                </div>

                {/* --- SECTION 1 --- */}
                <div className="print:break-before-page">
                    <h2 className="text-3xl font-bold font-sans text-slate-900 mb-6 flex items-center gap-3 border-b-2 border-indigo-100 pb-2">
                        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-md text-xl">1.0</span> Section 1: Executive Summary & Vision
                    </h2>
                    <p className="mb-4">
                        Aurora Tech Computing Group is a Paris-based multinational technology manufacturer specializing in the assembly and global distribution of high-performance Google Chromebooks. The company operates in a highly volatile maritime supply chain environment, sourcing premium semiconductor components (e.g., TSMC processors, NVIDIA GPUs, and AUO display panels) primarily from the Asia-Pacific region (Taiwan, South Korea, Japan).
                    </p>
                    <p className="mb-4">
                        Aurora Tech's flagship product, the "Chromebook Pro-X," retails at <strong>€699</strong> with a baseline Bill of Materials (BOM) cost of <strong>€450</strong>, generating an ideal profit margin of ~8% (€55.90 per unit).
                    </p>
                    <p className="mb-6 p-6 bg-slate-50 border-l-4 border-indigo-600 text-slate-700 italic">
                        <strong>Business Vision:</strong> Unify financial and supply-chain data across global subsidiaries, establishing a Single Source of Truth (SSOT) to eliminate manual errors, optimize strategic decision-making, and protect profit margins from volatile FX fluctuations and shipping delays.
                    </p>
                </div>

                {/* --- SECTION 2 --- */}
                <div className="print:break-before-page">
                    <h2 className="text-3xl font-bold font-sans text-slate-900 mb-6 flex items-center gap-3 border-b-2 border-indigo-100 pb-2">
                        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-md text-xl">2.0</span> Section 2: Scope & Objectives
                    </h2>
                    <p className="mb-4">
                        The scope of Project Atomic-Link focuses strictly on two critical data domains: Financial exchange rates (specifically EUR/USD and EUR/TWD currency pairs) and Inbound Logistics telemetry data (shipping schedules, carrier modes, and delay days). The business units directly impacted include the Finance Division and the Global Supply Chain Division.
                    </p>
                    <p className="mb-4">
                        The core objective of this project is to achieve 100% automated integration of daily financial exchange rates and shipping tracking data, feeding directly into the MLOps pipeline. This will eliminate manual overrides, reduce data reconciliation closing cycle times, and support automated strategic business responses (such as ocean-to-air freight rerouting or automated ERP hedging PO triggers).
                    </p>
                </div>

                {/* --- SECTION 3 --- */}
                <div className="print:break-before-page">
                    <h2 className="text-3xl font-bold font-sans text-slate-900 mb-6 flex items-center gap-3 border-b-2 border-indigo-100 pb-2">
                        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-md text-xl">3.0</span> Section 3: Operating Model & Roles
                    </h2>
                    <p className="mb-4">
                        Aurora Tech has established a central <strong>Data Governance Council (DGC)</strong> to break down data silos. Accountability is formalized using a strict RACI matrix managed by a central three-tier operating model:
                    </p>
                    <ul className="list-disc pl-8 mb-6 space-y-2">
                        <li><strong>Data Governance Council (DGC):</strong> Composed of the CFO, VP of Supply Chain, and Chief Data Officer. The DGC holds supreme decision-making authority, resolving cross-departmental data silos and authorizing budgets.</li>
                        <li><strong>Data Owners:</strong> Business leaders (Finance Director & VP of Supply Chain) who are accountable for defining access controls, data quality thresholds, and business glossaries for their respective domains.</li>
                        <li><strong>Data Stewards:</strong> Data Analysts and AI Engineers who are responsible for implementing data quality checks, managing metadata catalogs, and maintaining the automated ETL pipelines daily.</li>
                    </ul>
                    
                    <div className="overflow-x-auto mb-8 font-sans">
                        <table className="w-full text-left border-collapse border border-slate-300">
                            <thead>
                                <tr className="bg-slate-100 uppercase text-xs tracking-wider text-slate-600">
                                    <th className="p-3 border border-slate-300">Data Domain</th>
                                    <th className="p-3 border border-slate-300 text-center font-bold text-slate-900">Accountable (A)</th>
                                    <th className="p-3 border border-slate-300 text-center text-slate-800">Responsible (R)</th>
                                    <th className="p-3 border border-slate-300 text-center text-slate-600">Consulted (C)</th>
                                    <th className="p-3 border border-slate-300 text-center text-slate-500">Informed (I)</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                <tr>
                                    <td className="p-3 border border-slate-300 font-semibold bg-slate-50">FX Rates (API)</td>
                                    <td className="p-3 border border-slate-300 text-center font-semibold text-slate-800">Chief Financial Officer (CFO)</td>
                                    <td className="p-3 border border-slate-300 text-center">Financial Controller</td>
                                    <td className="p-3 border border-slate-300 text-center">AI Data Engineers</td>
                                    <td className="p-3 border border-slate-300 text-center">Procurement Team</td>
                                </tr>
                                <tr>
                                    <td className="p-3 border border-slate-300 font-semibold bg-slate-50">Maritime Logistics</td>
                                    <td className="p-3 border border-slate-300 text-center font-semibold text-slate-800">VP Supply Chain</td>
                                    <td className="p-3 border border-slate-300 text-center">Logistics Planner</td>
                                    <td className="p-3 border border-slate-300 text-center">MLOps Admins</td>
                                    <td className="p-3 border border-slate-300 text-center">Warehouse Managers</td>
                                </tr>
                                <tr>
                                    <td className="p-3 border border-slate-300 font-semibold bg-slate-50">AI Pipelines & Security</td>
                                    <td className="p-3 border border-slate-300 text-center font-semibold text-slate-800">Chief Data Officer (CDO)</td>
                                    <td className="p-3 border border-slate-300 text-center">Lead Cloud Architect</td>
                                    <td className="p-3 border border-slate-300 text-center">Legal / DPO</td>
                                    <td className="p-3 border border-slate-300 text-center">Executive Board</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- SECTION 4 --- */}
                <div className="print:break-before-page">
                    <h2 className="text-3xl font-bold font-sans text-slate-900 mb-6 flex items-center gap-3 border-b-2 border-indigo-100 pb-2">
                        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-md text-xl">4.0</span> Section 4: Policies & Standards
                    </h2>
                    <p className="mb-4">
                        To secure our data warehouse and prevent data leakage or poisoning, the DGC enforces three core policies:
                    </p>
                    <ul className="list-disc pl-8 mb-6 space-y-2">
                        <li><strong>Rule 1 (Data Quality Ingestion):</strong> All production systems must fetch daily exchange rates automatically from the Frankfurter API at exactly 16:00 CET. Manually inputted rates are strictly forbidden.</li>
                        <li><strong>Rule 2 (Data Security & Cryptography):</strong> Role-Based Access Control (RBAC) is enforced at the database level. Supplier pricing, component costs, and PII must be encrypted at rest using AES-256 and in transit via TLS.</li>
                        <li><strong>Rule 3 (Data Classification Standards):</strong>
                            <ul className="list-disc pl-8 mt-2 space-y-1">
                                <li><em>Tier 1 (Public):</em> Public FX ECB reference rates. No encryption required.</li>
                                <li><em>Tier 2 (Internal Business Data):</em> Anonymized logistics delays, aggregate shipping KPIs.</li>
                                <li><em>Tier 3 (Confidential):</em> Supplier pricing, component BOM costs, and employee/driver PII.</li>
                            </ul>
                        </li>
                    </ul>
                </div>

                {/* --- SECTION 5 --- */}
                <div className="print:break-before-page">
                    <h2 className="text-3xl font-bold font-sans text-slate-900 mb-6 flex items-center gap-3 border-b-2 border-indigo-100 pb-2">
                        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-md text-xl">5.0</span> Section 5: Processes & Workflows
                    </h2>
                    <h3 className="text-xl font-bold font-sans text-slate-800 mt-6 mb-3">5.1 Data Quality & Issue Handling</h3>
                    <p className="mb-4">
                        To sustain a Single Source of Truth, all incoming rates from the Frankfurter API must undergo automated validation anomaly checks. If a daily rate fluctuates by more than &plusmn;5% compared to a 7-day moving average, the rate is quarantined in a temporary staging schema, and an automated incident ticket is generated in Jira.
                    </p>
                    <p className="mb-4">
                        The Technical Data Steward is automatically alerted within 15 minutes. If the anomaly is a false positive (e.g., extreme macroeconomic volatility), the Data Owner (Group Report Controller) must electronically sign off to authorize the release into production.
                    </p>
                    
                    <h3 className="text-xl font-bold font-sans text-slate-800 mt-6 mb-3">5.2 Metadata & Master Data Management (MDM)</h3>
                    <p className="mb-4">
                        Aurora Tech establishes a centralized Business Glossary to unify definitions across all regions. "Net Margin" is uniformly defined group-wide as: <code>(Revenue - BOM Cost - Freight Inbound) / Revenue</code>.
                    </p>
                    <p className="mb-4">
                        Every data asset within the PostgreSQL pipeline must be tagged with a distinct SKU-like inventory metadata tag (e.g., FIN-FX-EUR-TWD) to map data lineage from origin API to the final dashboard.
                    </p>
                </div>

                {/* --- SECTION 6 --- */}
                <div className="print:break-before-page">
                    <h2 className="text-3xl font-bold font-sans text-slate-900 mb-6 flex items-center gap-3 border-b-2 border-indigo-100 pb-2">
                        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-md text-xl">6.0</span> Section 6: Technology & Architecture
                    </h2>
                    <h3 className="text-xl font-bold font-sans text-slate-800 mt-6 mb-3">6.1 Enterprise Data Infrastructure</h3>
                    <p className="mb-4">
                        The data platform architecture leverages an enterprise-grade PostgreSQL relational database structured in an optimized Star Schema. This structure denormalizes analytical data to reduce complex joins during AI feature extraction, ensuring rapid querying while maintaining absolute logical data isolation.
                    </p>
                    <p className="mb-4">
                        The schema centers on a central <code>fact_supplychain_transactions</code> table containing transaction keys, currency rates, components, delay days, and freight costs. This links to dimensions for suppliers, products, currencies, and dates.
                    </p>
                    
                    <h3 className="text-xl font-bold font-sans text-slate-800 mt-6 mb-3">6.2 Security, Lineage, and Web3 Guardrails</h3>
                    <p className="mb-4">
                        In preparation for the strategic scaling path introducing Web3 USDC automated settlement, a strict cryptographic hashing abstraction layer is placed between the PostgreSQL database and the corporate wallet. No proprietary vendor pricing or employee PII enters the public blockchain; only hashed unique transaction IDs are stored on-chain to maintain absolute GDPR compliance.
                    </p>
                </div>

                {/* --- SECTION 7 --- */}
                <div className="print:break-before-page">
                    <h2 className="text-3xl font-bold font-sans text-slate-900 mb-6 flex items-center gap-3 border-b-2 border-indigo-100 pb-2">
                        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-md text-xl">7.0</span> Section 7: Metrics & KPIs
                    </h2>
                    <p className="mb-6">
                        To meet the official evaluation standard (Regular Compliance Audits), success will be measured through quarterly data audits using three primary Key Performance Indicators:
                    </p>
                    <div className="overflow-x-auto mb-8 font-sans">
                        <table className="w-full text-left border-collapse border border-slate-300">
                            <thead>
                                <tr className="bg-slate-100 uppercase text-xs tracking-wider text-slate-600">
                                    <th className="p-3 border border-slate-300">KPI Category</th>
                                    <th className="p-3 border border-slate-300">Metric Name</th>
                                    <th className="p-3 border border-slate-300">Definition & Target</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                <tr>
                                    <td className="p-3 border border-slate-300 font-semibold bg-slate-50">Data Quality</td>
                                    <td className="p-3 border border-slate-300">FX Data Accuracy Rate</td>
                                    <td className="p-3 border border-slate-300">Percentage of automated financial reports utilizing the unified Frankfurter SSOT. Target: 100%.</td>
                                </tr>
                                <tr>
                                    <td className="p-3 border border-slate-300 font-semibold bg-slate-50">Operational Efficiency</td>
                                    <td className="p-3 border border-slate-300">Data Reconciliation Time</td>
                                    <td className="p-3 border border-slate-300">Average hours spent by controllers manually adjusting currency mismatches per closing cycle. Target: &lt; 2 hours (Reduction of 80%).</td>
                                </tr>
                                <tr>
                                    <td className="p-3 border border-slate-300 font-semibold bg-slate-50">Compliance & Safety</td>
                                    <td className="p-3 border border-slate-300">GDPR/PII Audit Score</td>
                                    <td className="p-3 border border-slate-300">Incidents of unencrypted supplier PII or component pricing exposed outside authorized RBAC. Target: 0 Incidents.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- SECTION 8 --- */}
                <div className="print:break-before-page">
                    <h2 className="text-3xl font-bold font-sans text-slate-900 mb-6 flex items-center gap-3 border-b-2 border-indigo-100 pb-2">
                        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-md text-xl">8.0</span> Section 8: Roadmap & Change Management
                    </h2>
                    <h3 className="text-xl font-bold font-sans text-slate-800 mt-6 mb-3">8.1 Phased Implementation Timeline</h3>
                    <ul className="list-disc pl-8 mb-6 space-y-2">
                        <li><strong>Phase 1: Foundation (Month 1):</strong> Deploy the PostgreSQL Star Schema database, connect the Frankfurter API pipeline, and freeze the global Business Glossary definitions.</li>
                        <li><strong>Phase 2: Pilot Deployment (Month 2):</strong> Launch the data governance protocol exclusively within the Inbound Logistics & Financial Controlling units (tracking Air France cargo data vs consolidation exchange rates).</li>
                        <li><strong>Phase 3: Global Rollout (Month 3):</strong> Scale the architecture to all global manufacturing hubs and activate pre-auditing for the Web3 USDC settlement module.</li>
                    </ul>
                    
                    <h3 className="text-xl font-bold font-sans text-slate-800 mt-6 mb-3">8.2 Change Management, Adoption, & Inclusive Training</h3>
                    <p className="mb-4">
                        To prevent friction from operational staff accustomed to legacy manual Excel sheets, the DGC will launch a Data Democratization Initiative. Operational users will be provided with simplified Power BI dashboards, proving that the new governed workflow reduces their daily double-entry workload.
                    </p>
                    <p className="mb-4">
                        A group-wide data awareness program will be delivered via an internal portal complying fully with W3C WCAG 2.1 Level AA. Technical documentation will feature high-contrast themes and alt-text compatibility for screen readers, while video walk-throughs of the new data ticketing process will provide synchronized captioning, ensuring complete professional inclusion for staff with visual or hearing impairments.
                    </p>
                </div></div>

                <div className="text-center italic text-slate-500 font-sans pt-12 border-t mt-12 print:mt-16 text-sm">
                    -- End of Official Written Deliverable - Aurora Tech Board Council --
                </div>
            </div>
        </div>
    );
}
