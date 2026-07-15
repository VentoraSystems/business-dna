# Business Blueprint — Coachline

_Educational business-building guidance only. This document describes
how to build and run a personal trainer booking marketplace as a
business. Each `##` heading corresponds to one of the 25 sections in
`features/blueprint`'s v2 canonical structure._

## Executive Summary

Coachline is a two-sided marketplace connecting clients with
certified, insured personal trainers for session-based bookings,
monetized through a commission on session value plus a gym-partner
revenue share — the library's third genuine two-sided marketplace,
differentiated from the tutoring marketplace by physical-injury
liability stakes and certification-authenticity verification, and from
the home-repair marketplace by session-based booking rather than
quote-based job pricing.

## Entrepreneur Fit

Best suited to `theBuilder` or `theConnector` archetype, with at least
three years of relevant experience. Not solo-friendly — the
operational complexity of certification verification, liability-
insurance underwriting, and geo-radius matching requires a small team
from day one.

## Business Overview

A technology platform connecting independent, certified, insured
personal trainers directly with clients, handling matching, booking,
and payment escrow without directly employing or training any trainer
itself.

## Market Intelligence

Demand comes from clients seeking a vetted, trustworthy personal
trainer. The competitive set includes informal trainer-finding methods
like social media DMs or gym bulletin boards (unvetted, no
certification assurance) and large national gym chains (less flexible,
no independent-trainer choice).

## Customer Intelligence

Primary customer type is B2C on both sides: clients seeking a
certified trainer matched to their goals, and independent certified
trainers seeking flexible, reliably matched client bookings.

## Offer Architecture

The core offer is a matched session booking: clients browse verified
trainer profiles filtered by specialization and location, book a first
session directly, and payment is held in escrow until the session is
confirmed complete.

## Revenue Architecture

Individual session commissions are collected quickly, but building
enough two-sided volume (liquidity) of verified trainers and active
clients in each new geographic zone takes real time.

## Pricing Strategy

The platform takes a 22-28% commission on each session booking;
trainers set their own rates (typically €40-€90/session), with clients
able to purchase a discounted 10-session package.

## Marketing System

Positioning: "certified trainers, matched to the person you're
becoming." Primary channel is local social media content and fitness-
influencer partnerships (demand side); gym-and-studio-partnership
listings build supply (a distinct channel this two-sided business
needs), with corporate wellness partnerships as an experimental
channel.

## Sales System

A client browses verified trainer profiles, books a first session
directly, and payment is held until the session is confirmed complete
— a roughly 5-day cycle, faster than the other marketplaces in this
library, reflecting how low-friction booking a trainer becomes once
the client trusts the verification process.

## Operations System

Core recurring processes: trainer certification and liability-
insurance verification, client-trainer matching, session booking and
payment escrow, and quality monitoring through ratings and injury-
incident review handling.

## Technology Stack

Built on TrueCoach as the personal-training client-management and
booking platform, Stripe Connect for split-payment and escrow
processing, and Certemy as an optional certification-verification and
compliance tool.

## Automation Opportunities

Matching, booking, and payment processing are substantially automated;
certification/insurance verification and injury-incident review remain
human-reviewed given real liability stakes.

## Team Structure

Not solo-friendly — requires a small team from day one to handle
trainer verification, matching operations, and support across both
sides of the marketplace.

## Financial Overview

Startup budget of roughly €35,000-€80,000 covers marketplace platform
development, trainer certification and liability-insurance
verification infrastructure, and payment processing — a High budget
tier; target monthly income ranges €9,000-€40,000 with an estimated
16-month path to break-even.

## KPIs

Tracked against browser-to-first-booking conversion, client and
trainer retention, gross margin against verification and insurance
reserve costs, and churn.

## Risk Analysis

High difficulty with moderate AI-resistance — the three biggest risks
are physical-injury liability exposure if certification and insurance
verification isn't rigorous, the classic two-sided cold-start
liquidity problem, and fraudulent or lapsed certification claims by
trainers.

## Competitive Advantages

Rigorous certification and liability-insurance verification becomes a
genuine trust moat against informal trainer-finding methods, real
network effects let the marketplace scale non-linearly once liquidity
is achieved, and the gym-partnership supply channel gives access to an
established base of already-certified trainers.

## Launch Strategy

Build or select a marketplace platform and establish trainer
certification and liability-insurance verification infrastructure,
then solve the cold-start problem in one pilot zone by manually
recruiting an initial verified trainer pool before opening client
sign-ups broadly.

## 90-Day Action Plan

Weeks 1-6: build or select the platform and set up verification
infrastructure. Weeks 7-10: manually recruit and verify the first
10-15 trainers in the pilot zone. Weeks 11-13: open client sign-ups
and complete the first matched sessions.

## Scaling Strategy

Solve the cold-start problem in one pilot zone, reach reliable
two-sided liquidity there, grow session volume and gym-partnership
listings within the pilot zone, then expand into a second zone by
reapplying the same cold-start playbook.

## Exit Opportunities

Documented certification-verification processes, platform IP, and
marketplace metrics (GMV, take rate, liquidity) make this sellable to
a larger fitness-industry or marketplace company.

## AI Recommendations

Prioritize AI tools for trainer-client matching — an implementation
accelerator — while keeping certification verification and injury-
incident dispute resolution fully human-reviewed given real liability
stakes.

## Resources

See `resources.json` for the full curated list — books, communities,
and software specific to running a personal trainer booking
marketplace as a business.

## Appendix

This blueprint is educational business-building guidance only.
