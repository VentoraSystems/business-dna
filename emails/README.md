# Transactional emails

This folder holds React Email templates (welcome email, subscription
receipts, roadmap milestone reminders, password reset confirmations).

None are wired up yet — this is a placeholder so the folder exists per the
project's feature-based architecture. When implemented, templates here
should be rendered with `@react-email/render` and sent via the same
provider used for Clerk's transactional email, and every string in them
must come from `messages/{locale}.json` exactly like the rest of the app,
since generated documents and emails must respect the user's selected
locale.
