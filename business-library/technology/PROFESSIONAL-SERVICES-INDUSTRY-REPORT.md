# Professional Services — IndustryType Fit Report

`src/features/business-engine/schemas/enums.ts`'s `IndustryType` is
**frozen** at exactly 10 values: `health`, `tech`, `food`, `education`,
`fashion`, `finance`, `travel`, `sustainability`, `entertainment`,
`homeServices`. This report evaluates, honestly and per-business,
whether each of the 8 candidate "Professional Services" businesses maps
naturally onto one of these 10 — not whether a defensible-sounding
justification could be constructed after the fact.

## The 8-row fit table

| Business | Desired IndustryType | Current Closest IndustryType | Reason for the Mismatch |
|---|---|---|---|
| Accounting Firm | `professionalServices` / `finance` | `finance` | Natural fit — no mismatch. Accounting is a core financial-services function (bookkeeping, tax filing, financial statements); `finance` describes it without stretching. |
| Law Firm | `professionalServices` / `legal` | `finance` (forced) | **Mismatch.** Legal practice isn't a financial-services function — a law firm's work (contracts, litigation, compliance, disputes) has no natural relationship to money-management the way accounting or insurance do. Calling it `finance` would be picking a catch-all, not a genuine fit. |
| HR Consultancy | `professionalServices` / `humanResources` | `finance` (forced) | **Mismatch.** HR consulting (hiring processes, org design, employee relations, compliance) is a people-operations function, not a financial one. No natural `finance` relationship. |
| Recruitment Agency | `professionalServices` / `staffing` | `finance` (forced) | **Mismatch.** Recruitment is a staffing/talent-matching function. Its revenue model (placement fees) touches money the way almost every business does, but that's not the same as being a financial-services business. |
| Business Consultancy | `professionalServices` / `management` | `finance` (forced) | **Mismatch.** General management/strategy consulting spans every function (operations, growth, org design) — it's not specifically financial. Forcing `finance` here would make it a meaningless catch-all for "any B2B advisory," which is exactly the kind of stretch this report is meant to catch. |
| Financial Consultancy | `professionalServices` / `finance` | `finance` | Natural fit — no mismatch. Financial planning/advisory is definitionally a financial-services function. |
| Insurance Brokerage | `professionalServices` / `finance` | `finance` | Natural fit — no mismatch. Insurance brokerage sits squarely in financial services (risk products, premiums, carrier commissions) — the same bucket accounting and financial planning already occupy in this taxonomy. |
| Tax Consultancy | `professionalServices` / `finance` | `finance` | Natural fit — no mismatch. Tax preparation/planning is a financial-compliance function, the same category as accounting. |

## Split

**NATURAL FIT (proceed to Step 2 — author these 4):**
- Accounting Firm
- Financial Consultancy
- Insurance Brokerage
- Tax Consultancy

All four are genuinely money/financial-services businesses — advising
on, filing, managing, or insuring financial matters — which is exactly
what `finance` already means in this taxonomy. No stretch was needed to
reach that conclusion for any of the four.

**NO NATURAL FIT (deferred — awaiting a future `professionalServices`
(or similar) IndustryType taxonomy expansion sprint. Not authored in
this batch):**
- Law Firm
- HR Consultancy
- Recruitment Agency
- Business Consultancy

These four are general business/legal/people-operations services with
no genuine financial framing. None of the 10 existing `IndustryType`
values fits them naturally — `finance` would be the only plausible
catch-all, and using it for "any B2B service business" would defeat the
purpose of the taxonomy. They are recorded here, not authored, and not
registered anywhere (no folder, no `manifest.json` entry).

## Why roughly half, not a predetermined split

The four authored businesses share one real, substantive thing in
common beyond "professional service": they all handle, advise on, or
protect **money** as their core function (bookkeeping/tax/financial
planning/insurance premiums). The four deferred businesses share the
opposite: their core function is legal, organizational, or people-
matching — genuinely different domains that happen to also be sold
B2B by advisors in an office. The split follows from that distinction,
not from a target ratio decided in advance.
