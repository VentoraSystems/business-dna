# Business Blueprint — Inkstract

_Educational business-building guidance only. This document describes
how to build and run an AI document-processing SaaS product as a
business. Each `##` heading corresponds to one of the 25 sections in
`features/blueprint`'s v2 canonical structure._

## Executive Summary

Inkstract is a self-serve API and dashboard product that turns
unstructured documents into clean, structured data using an OCR/LLM
extraction pipeline, priced on monthly document-processing volume with
usage overages — the library's first genuine `saas` business, distinct
from every other `technology-services` package which bills for
people's time rather than a self-serve software product billed on
usage.

## Entrepreneur Fit

Best suited to `theBuilder` or `theVisionary` archetype, with at least
four years of relevant technical experience. Not solo-friendly —
building and maintaining a production extraction pipeline with
uptime and accuracy SLAs requires a small founding engineering team
from day one.

## Business Overview

A software product, not a service: customers integrate an API or
upload documents through a dashboard, and the pipeline returns
structured, confidence-scored data without any human handling the
document on Inkstract's side for standard extractions.

## Market Intelligence

Demand comes from engineering, operations, and finance teams manually
re-keying data from invoices, contracts, and forms. The competitive
set includes legacy enterprise document-processing vendors (accurate
but slow to integrate, expensive) and raw OCR-only tools (cheap but
require the customer to build their own extraction logic on top).

## Customer Intelligence

Primary customer type is B2B: mid-market operations and finance teams
with high manual-document volume, plus developers evaluating the
product through self-serve trial before an operations buyer signs off
on the subscription.

## Offer Architecture

The core offer is an API endpoint and dashboard: upload or stream a
document, receive structured JSON output with per-field confidence
scores, with low-confidence extractions flagged for optional human
review.

## Revenue Architecture

Monthly subscription revenue compounds predictably once a customer is
converted, but the initial self-serve trial-to-paid conversion is
gradual, and enterprise contracts require a security review and pilot
period before signing.

## Pricing Strategy

Starter €149/month (1,000 documents), Growth €699/month (10,000
documents), and custom-priced Enterprise plans with dedicated SLA and
onboarding; overage billed per additional document above the plan
limit.

## Marketing System

Positioning: "turn any document into clean data, automatically — ships
in an afternoon, not a six-month integration project." Primary channel
is developer content and API documentation; Product Hunt and developer
community launches build secondary awareness, with outbound to
operations and finance teams as an experimental enterprise channel.

## Sales System

Self-serve free trial converts smaller teams directly through the
dashboard; larger accounts move through a sales-assisted pilot and
security-review process before signing an annual contract — a
dual-motion sales cycle of roughly 30 days.

## Operations System

Core recurring processes: extraction-pipeline monitoring and accuracy
tuning, self-serve conversion tracking, enterprise security-review
response, and customer support for API integration issues.

## Technology Stack

Built on Amazon Textract for OCR and document parsing, the Anthropic
Claude API for LLM-based structured extraction, and Stripe Billing for
usage-based subscription billing.

## Automation Opportunities

Document ingestion, extraction, and billing are fully automated; only
low-confidence extractions and enterprise security reviews require
human involvement.

## Team Structure

Not solo-friendly — requires a small founding engineering team from
day one to build and maintain a production-grade extraction pipeline
alongside a lean go-to-market function.

## Financial Overview

Startup budget of roughly €35,000-€70,000 covers founding-engineering
time, cloud infrastructure, and OCR/LLM API costs — a High budget tier
driven by product engineering; target monthly income ranges
€8,000-€60,000 with an estimated 20-month path to break-even.

## KPIs

Tracked against MRR growth, monthly subscription churn, net margin as
the pipeline scales, and free-trial-to-paid conversion rate.

## Risk Analysis

High difficulty with low AI-resistance — the three biggest risks are
foundation-model providers commoditizing native document extraction,
extraction-error liability on financial or legal documents, and long
enterprise security-review cycles slowing the sales pipeline.

## Competitive Advantages

A self-serve API that ships in an afternoon removes the
integration-project friction of legacy vendors, usage-based pricing
lowers the barrier to a first trial, and confidence-scored extraction
with a human-review fallback builds trust for high-stakes document use
cases.

## Launch Strategy

Build the extraction pipeline against 2-3 high-value document
templates and prove accuracy above 95% with design partners before
opening self-serve signup publicly.

## 90-Day Action Plan

Weeks 1-6: build the pipeline against 2-3 document templates and set
up cloud infrastructure. Weeks 7-10: onboard 10-15 design-partner
teams on free access and validate accuracy on their real documents.
Weeks 11-13: ship self-serve signup, API documentation, and
usage-based billing.

## Scaling Strategy

Reach a stable base of paying self-serve subscribers with reliable
accuracy first, then begin enterprise outbound backed by SOC 2 Type II
certification, and expand document-template coverage into adjacent
verticals only after core templates prove reliable.

## Exit Opportunities

Documented pipeline architecture, customer contracts, and compliance
certifications (SOC 2) make this sellable to a larger document-
processing, RPA, or vertical-SaaS company.

## AI Recommendations

Prioritize AI tools for confidence scoring and low-confidence-flagging
— a differentiation accelerator — while treating raw extraction
accuracy as an area of continuous, necessary investment given
foundation-model commoditization risk.

## Resources

See `resources.json` for the full curated list — books, communities,
and software specific to running a document-processing SaaS business.

## Appendix

This blueprint is educational business-building guidance only.
