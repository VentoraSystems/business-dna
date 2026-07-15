# Business Blueprint — StudySpark

_Educational business-building guidance only. This document describes
how to build and run a two-sided tutoring marketplace as a business.
Each `##` heading corresponds to one of the 25 sections in
`features/blueprint`'s v2 canonical structure._

## Executive Summary

StudySpark is a two-sided marketplace connecting K-12 students and
families with vetted, background-checked independent tutors, monetized
through a commission on each session booking. It's for someone with
real marketplace or platform-operations experience, ready to solve the
two-sided cold-start liquidity problem — the first genuine two-sided
marketplace business in this library, structured differently from the
one-to-one service businesses elsewhere.

## Entrepreneur Fit

Best suited to `theBuilder` or `theOperator` archetype, with at least
three years of marketplace or platform-operations experience. Not
solo-friendly — the operational complexity of vetting supply, matching
demand, and handling payments requires a small team from day one.

## Business Overview

A technology platform connecting independent, vetted tutors directly
with families, handling matching, scheduling, and payment without
directly delivering any tutoring session itself, growing through
simultaneous demand-side family acquisition and supply-side tutor
recruitment.

## Market Intelligence

Demand comes from families seeking vetted, trustworthy tutoring help.
The competitive set includes informal classifieds and social-media
tutor arrangements (unvetted, no quality assurance) and large national
tutoring chains (more expensive, less personalized matching).

## Customer Intelligence

Primary customer type is B2C on both sides: families with K-12 students
needing subject tutoring or homework help, and independent tutors
seeking flexible client bookings. The core need on the family side is
trust in tutor quality and safety; on the tutor side, it's reliable
access to matched clients.

## Offer Architecture

The core offer is a matched tutoring session booking: families submit a
request, the platform matches vetted tutor profiles, and a free trial
session precedes ongoing recurring bookings.

## Revenue Architecture

Individual session commissions are collected quickly at time of
booking, but building enough two-sided volume (liquidity) to generate
meaningful revenue takes real time in each new market.

## Pricing Strategy

The platform takes a 20-25% commission on each session booking; tutors
set their own rates (typically €25-60/hour), with families paying per
session or a discounted session pack.

## Marketing System

Positioning: "the tutor your kid actually looks forward to seeing."
Primary channel is local parent-community and school partnerships
(demand side); tutor recruitment from education networks builds supply
(a distinct channel this two-sided business requires), with a
referral-incentive program for both sides as an experimental channel.

## Sales System

A parent submits a request, the platform matches 2-3 vetted tutor
profiles within 24 hours, and a free trial session precedes ongoing
recurring bookings — a roughly 7-day cycle, contingent on real tutor
supply already existing.

## Operations System

Core recurring processes: tutor application review and background-check
vetting, family intake and matching, session scheduling and payment
processing, and quality monitoring through ratings and dispute
resolution.

## Technology Stack

Built on Sharetribe as the marketplace platform framework, Stripe
Connect for split-payment commission processing, and Checkr as an
optional background-check verification tool.

## Automation Opportunities

Matching, scheduling, and payment splitting are substantially automated
through the platform; tutor vetting decisions and dispute resolution
remain human-reviewed given that minors are involved.

## Team Structure

Not solo-friendly — requires a small team from day one to handle
tutor vetting, family support, and platform operations across both
sides of the marketplace.

## Financial Overview

Startup budget of roughly €30,000-€75,000 covers marketplace platform
development, background-check infrastructure, and payment processing —
a High budget tier, well above the one-to-one service businesses
elsewhere in this library; target monthly income ranges €15,000-€45,000
with an estimated 16-month path to break-even.

## KPIs

Tracked against request-to-match conversion, family/tutor retention,
gross margin against platform and support costs, and churn (including
monitoring for off-platform disintermediation).

## Risk Analysis

High difficulty with moderate AI-resistance — the three biggest risks
are the classic two-sided cold-start liquidity problem, tutor
quality-control and background-check liability given minors are
involved, and disintermediation risk once families and tutors connect
through the platform.

## Competitive Advantages

Real network effects let the marketplace scale non-linearly once
liquidity is achieved, commission-based revenue scales with booking
volume without direct service delivery, and rigorous vetting becomes a
genuine moat against informal, unvetted arrangements.

## Launch Strategy

Build or select a marketplace platform framework and establish tutor
vetting infrastructure, then solve the cold-start problem in one pilot
market by manually recruiting an initial tutor pool before opening
family sign-ups broadly.

## 90-Day Action Plan

Weeks 1-6: build or select the platform and set up vetting
infrastructure. Weeks 7-10: manually recruit and vet the first 15-20
tutors in the pilot market. Weeks 11-13: open family sign-ups and
complete the first matched bookings.

## Scaling Strategy

Solve the cold-start problem in one pilot market, reach reliable
two-sided liquidity there, grow session volume within that market, then
expand into a second geographic market by reapplying the same
cold-start playbook.

## Exit Opportunities

Documented tutor-vetting processes, platform IP, and marketplace
metrics (GMV, take rate, liquidity) make this sellable to a larger
education-technology or marketplace company.

## AI Recommendations

Prioritize AI tools for tutor-family matching — an implementation
accelerator — while keeping tutor vetting decisions and dispute
resolution fully human-reviewed given that minors are involved.

## Resources

See `resources.json` for the full curated list — books, communities, and
software specific to running a two-sided tutoring marketplace as a
business.

## Appendix

This blueprint is educational business-building guidance only.
