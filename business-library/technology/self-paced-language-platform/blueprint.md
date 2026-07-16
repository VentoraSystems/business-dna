# Business Blueprint — Lingoloop

_Educational business-building guidance only. This document describes
how to build and run a self-paced language-learning SaaS platform as a
business. Each `##` heading corresponds to one of the 25 sections in
`features/blueprint`'s v2 canonical structure._

## Executive Summary

Lingoloop is an asynchronous, self-paced language-learning SaaS
platform combining short video micro-lessons, spaced-repetition
vocabulary drilling, and on-demand AI conversation practice, monetized
through a tiered monthly/annual subscription — deliberately distinct
from the live, cohort-capped, instructor-led coding bootcamp elsewhere
in `online-course-platforms`, with no fixed start dates and no
instructor-capacity bottleneck.

## Entrepreneur Fit

Best suited to `theVisionary` or `theOperator` archetype, with at least
five years of relevant experience. Not solo-friendly — the content
production and AI-infrastructure build is demanding for different
reasons than a live-instruction business: it requires engineering and
content-production capacity, not people-management of instructors.

## Business Overview

An always-on content-and-AI product, not a live service: subscribers
sign up any day, work through short video micro-lessons at their own
pace, drill vocabulary through spaced-repetition review, and practice
speaking on demand with a chat- and voice-based AI conversation tutor —
no cohort to join, no fixed schedule to keep.

## Market Intelligence

Demand comes from self-directed learners who want language-learning
flexibility without a scheduling commitment. The competitive set
includes general-purpose AI chatbots (free, but unstructured) and
live-tutor marketplaces (more accountable, but scheduling-dependent and
priced per session).

## Customer Intelligence

Primary customer type is B2C: self-directed learners who want to fit
language practice into unpredictable daily schedules, without
committing to a fixed class time or a human tutor's availability.

## Offer Architecture

The core offer is an always-available self-paced product: short video
micro-lessons, an algorithmic spaced-repetition vocabulary engine, and
unlimited-on-demand AI conversation practice, unlocked progressively
across a free tier and two paid subscription tiers.

## Revenue Architecture

Individual self-serve subscribers convert gradually through a free
tier rather than in a single upfront payment, so monthly recurring
revenue builds incrementally instead of arriving as a lump sum at
cohort enrollment — a structurally different revenue-recognition
pattern than a tuition-based bootcamp.

## Pricing Strategy

Free tier (1 language, 5 AI-conversation minutes/week, no offline
downloads), Plus at €9.99/month or €79/year (all languages, 60
AI-conversation minutes/week, offline downloads), and Unlimited at
€16.99/month or €139/year (unlimited AI conversation practice, priority
access to new languages).

## Marketing System

Positioning: "learn a language your way, every single day." Primary
channel is app-store and search-optimized discovery; short-form social
content (streak milestones, AI-conversation demos) is the secondary
channel, with in-app referral and streak-sharing loops as an
experimental channel.

## Sales System

A self-serve freemium funnel — sign up free, complete an onboarding
placement, hit natural upgrade prompts — converts subscribers to a paid
tier without any human sales interaction, a roughly 7-day cycle far
shorter than an admissions-interview-based sale.

## Operations System

Core recurring processes: micro-lesson video content production and
curriculum design, AI conversation-tutor model tuning and
spaced-repetition algorithm maintenance, app platform engineering, and
customer support — with no live instruction to schedule.

## Technology Stack

Built on the Anthropic Claude API for the AI conversation-tutor engine,
Mux for video hosting and streaming, and RevenueCat as an optional
subscription billing and entitlements layer.

## Automation Opportunities

Lesson delivery, spaced-repetition scheduling, streak reminders,
billing, and first-line AI conversation practice are all automated;
only content production and support escalations remain human-led.

## Team Structure

Not solo-friendly — running a parallel content-production and
AI-infrastructure build requires a small team of content producers and
engineers from day one, though for different reasons than a
live-instruction business needing instructors and career coaches.

## Financial Overview

Startup budget of roughly €40,000-€70,000 covers micro-lesson content
production, AI conversation-tutor engineering, and the web/mobile app
build — a Medium-High budget tier; target monthly income ranges
€10,000-€60,000 with an estimated 20-month path to break-even.

## KPIs

Tracked against monthly recurring revenue, subscription churn,
subscriber lifetime value, and free-to-paid lead conversion — MRR/churn
framing, not cohort-fill-rate/tuition framing.

## Risk Analysis

High difficulty with moderate AI-resistance — the three biggest risks
are general-purpose AI chatbots offering free informal conversation
practice, the self-paced format's historically low completion rates
without live-cohort accountability, and AI conversation-tutor usage
cost compressing margins on the unlimited tier if pricing isn't
calibrated correctly.

## Competitive Advantages

No instructor-capacity ceiling means revenue scales with subscriber
count alone, habit-formation mechanics (daily streaks, spaced-repetition
reminders) drive recurring engagement without relying on cohort peer
pressure, and on-demand AI conversation practice removes the
scheduling friction of booking a human tutor.

## Launch Strategy

Build a deep, polished micro-lesson library and AI-tutor experience for
2-3 flagship languages, then run a closed beta with 50-100 self-directed
learners to validate lesson pacing and AI-tutor usefulness before
public launch.

## 90-Day Action Plan

Weeks 1-6: build the initial micro-lesson content library and AI
conversation-tutor pipeline for the flagship languages. Weeks 7-10: run
a closed beta and track daily-active use and streak formation closely.
Weeks 11-13: complete the self-serve signup flow, free-tier limits, and
paid-tier upgrade path end-to-end.

## Scaling Strategy

Prove retention and habit formation on a small number of flagship
languages first, then expand language-catalog breadth while continuing
to invest in AI-tutor quality, growing the content and AI-engineering
team in step with catalog-release cadence.

## Exit Opportunities

Documented content library, AI-tutor pipeline architecture, and
subscriber-growth metrics make this sellable to a larger education
company, language-services provider, or another consumer-subscription
operator.

## AI Recommendations

Prioritize AI-tutor conversation quality as the product's core
differentiator — not an operational efficiency add-on — while using AI
assistance for spaced-repetition scheduling and content-production
support as implementation accelerators.

## Resources

See `resources.json` for the full curated list — books, communities,
and software specific to running a self-paced language-learning SaaS
platform.

## Appendix

This blueprint is educational business-building guidance only.
