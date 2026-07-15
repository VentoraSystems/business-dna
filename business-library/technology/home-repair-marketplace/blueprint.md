# Business Blueprint — Tradeline Home Services Marketplace

_Educational business-building guidance only. This document describes
how to build and run a home-repair marketplace as a business. Each
`##` heading corresponds to one of the 25 sections in
`features/blueprint`'s v2 canonical structure._

## Executive Summary

Tradeline is a two-sided marketplace connecting homeowners with
vetted, licensed, and insured independent handymen and tradespeople
for small-to-medium home repair jobs, monetized through a commission
on completed job value plus an optional job-guarantee fee — the second
genuine two-sided marketplace in this library, differentiated from the
tutoring marketplace by quote-based job pricing and licensing/insurance
vetting rather than session booking and background-check-only vetting.

## Entrepreneur Fit

Best suited to `theOperator` or `theConnector` archetype, with at
least four years of relevant marketplace or field-services operations
experience. Not solo-friendly — the operational complexity of
contractor licensing verification, geo-radius dispatch, and payment
escrow requires a small team from day one.

## Business Overview

A technology platform connecting independent, licensed, and insured
contractors directly with homeowners, handling job dispatch, quoting,
escrow, and dispute resolution without directly performing any repair
work itself.

## Market Intelligence

Demand comes from homeowners seeking vetted, trustworthy repair help.
The competitive set includes informal classifieds and word-of-mouth
handyman arrangements (unvetted, no quality assurance) and large
national home-service franchises (more expensive, less responsive
dispatch).

## Customer Intelligence

Primary customer type is B2C on both sides: homeowners needing repair
jobs completed, and independent, licensed tradespeople seeking flexible
client bookings. The core need on the homeowner side is trust in
contractor licensing and insurance; on the contractor side, it's
reliable access to matched jobs.

## Offer Architecture

The core offer is a matched job booking: homeowners post a job with
photos, the platform dispatches to vetted contractors within the
service radius, and a fixed quote precedes booking with payment held
in escrow.

## Revenue Architecture

Individual job commissions are collected quickly once escrow releases,
but building enough two-sided volume (liquidity) to generate meaningful
revenue takes real time in each new geographic zone.

## Pricing Strategy

The platform takes an 18-22% commission on completed job value;
contractors set their own quotes (typical jobs €80-€600), with an
optional 5% job-guarantee fee for redo-or-refund protection.

## Marketing System

Positioning: "the handyman who actually shows up, booked in under an
hour." Primary channel is local homeowner digital ads and neighborhood
apps (demand side); contractor recruitment from trade licensing boards
builds supply (a distinct channel this two-sided business requires),
with home-warranty and property-manager partnerships as an experimental
channel.

## Sales System

A homeowner posts a job, the platform dispatches it to 3 vetted
contractors who each send a fixed quote within 2 hours, and the
homeowner books with payment in escrow — a roughly 2-day cycle,
contingent on real contractor supply already existing.

## Operations System

Core recurring processes: contractor license and insurance
verification, homeowner job intake and dispatch, quote collection and
escrow management, and quality monitoring through ratings and
job-guarantee claims handling.

## Technology Stack

Built on Jobber as the job-dispatch and scheduling platform, Stripe
Connect for split-payment and escrow processing, and Checkr as an
optional background-verification tool.

## Automation Opportunities

Job dispatch, quote collection, and escrow release are substantially
automated; contractor license/insurance verification and job-guarantee
dispute resolution remain human-reviewed given real liability stakes.

## Team Structure

Not solo-friendly — requires a small team from day one to handle
contractor verification, dispatch operations, and support across both
sides of the marketplace.

## Financial Overview

Startup budget of roughly €40,000-€90,000 covers marketplace platform
development, contractor verification infrastructure, and payment
escrow — a High budget tier, the largest of this library's two
marketplace businesses; target monthly income ranges €20,000-€55,000
with an estimated 18-month path to break-even.

## KPIs

Tracked against job-posting-to-booking conversion, homeowner/contractor
retention, gross margin against dispatch and support costs, and churn
including monitoring for off-platform disintermediation.

## Risk Analysis

High difficulty with moderate AI-resistance — the three biggest risks
are the classic two-sided cold-start liquidity problem, contractor
liability exposure from property damage or injury, and disintermediation
risk once homeowners and contractors connect through the platform.

## Competitive Advantages

Rigorous licensing and insurance vetting becomes a genuine moat against
informal classifieds, real network effects let the marketplace scale
non-linearly once liquidity is achieved, and the optional job-guarantee
fee creates a differentiated premium revenue stream.

## Launch Strategy

Build or select a job-dispatch platform framework and establish
contractor verification infrastructure, then solve the cold-start
problem in one pilot zip code by manually recruiting an initial
contractor pool before opening homeowner sign-ups broadly.

## 90-Day Action Plan

Weeks 1-6: build or select the platform and set up verification
infrastructure. Weeks 7-10: manually recruit and verify the first
10-15 contractors in the pilot zip code. Weeks 11-13: open homeowner
sign-ups and complete the first matched jobs.

## Scaling Strategy

Solve the cold-start problem in one pilot zip code, reach reliable
two-sided liquidity there, grow job volume within the pilot metro area,
then expand into a second metro by reapplying the same cold-start
playbook.

## Exit Opportunities

Documented contractor-verification processes, platform IP, and
marketplace metrics (GMV, take rate, liquidity) make this sellable to a
larger home-services or marketplace company.

## AI Recommendations

Prioritize AI tools for contractor-job matching — an implementation
accelerator — while keeping contractor verification and dispute
resolution fully human-reviewed given real liability stakes.

## Resources

See `resources.json` for the full curated list — books, communities,
and software specific to running a home-repair marketplace as a
business.

## Appendix

This blueprint is educational business-building guidance only.
