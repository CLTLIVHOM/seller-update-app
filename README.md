# Charlotte Living Homes seller report upgrade

First implementation of the Beacon-inspired report and an on-demand input check. Production source is `CLTLIVHOM/seller-update-app`; the existing domain is hosted by Vercel, verified October 15, 2026.

## Implemented

- Property cover, executive summary, Kristen’s Take, separate platform metrics, campaigns, showing feedback, selected competitors, dated activities, and next steps.
- Server-side matching of an address and exact access code. Browser receives only the matching report, without credentials or other property rows. Existing columns are supported, including whitespace and capitalization differences in headers.
- Optional rich sections from `Campaigns JSON`, `Feedback JSON`, `Competitors JSON`, and `Activities JSON` columns. No sheet schema was changed as part of this draft.
- Input check and private draft generation. Missing data stays unavailable. Stale observations and missing human inputs block readiness.
- Comparisons permitted only for matching, dated cumulative measurements from the same source and window. Rolling totals are not treated as new weekly activity.

## Verified source connections

- Live Google Sheet: https://docs.google.com/spreadsheets/d/1_AKPZOChoyqEuEpI9tnb-DHgDGOUlVq2AtkYjZlN59k/edit
- ShowingTime feedback is delivered to Kristen’s Charlotte Living Homes Outlook mailbox. The connected Outlook search found a Burning Ridge feedback email dated September 16. Searches in the connected Gmail account did not find ShowingTime messages.
- The existing Burning Ridge MLS/ListTrac link opens successfully. Its October 15 report shows 9,500 property views and 14 favorites for February 4–October 15, approximately 12K ad/social impressions, and a separate past-30-day website breakdown including Zillow (249), Realtor.com (55), and Canopy Matrix (106).
- Redfin and Homes.com were not in the visible top-10 table. Absence from that table does not establish zero activity or lack of coverage. Obtain those sites’ own statistics when needed.

Do not add ListTrac aggregate views to its website breakdown. Do not mix native portal saves with ListTrac favorites. Preserve the source and period with every observation. Never use report access tokens in client-facing links or public source.

## Run the update: operator workflow

1. Read current sheet statuses and listing links. Process Active listings only unless Kristen requests another status. Verify sale vs rental, and ask about newly added listings if the sheet appears stale.
2. Open each verified MLS report and capture the report date, reporting interval, aggregate activity, site breakdown, and displayed precision. Retrieve native platform metrics only for gaps. Record inaccessible metrics as unavailable.
3. Search the Charlotte Living Homes Outlook mailbox for ShowingTime messages matching each listing and the report interval. Separate confirmations, cancellations, requests for feedback, and received feedback. Deduplicate by message/appointment ID. A confirmation does not establish a completed showing. A feedback email does not establish complete showing totals.
4. Gather marketing only from verified source records. A future plan or intention is not completed work. Ask for the campaign account/report or links until a source is connected.
5. Review selected comparable listings from a supplied MLS search/export. Do not invent competitors or let an unreviewed automated selection drive a pricing recommendation.
6. Assemble private inputs in the report model and run `node run-update.mjs /private/path/inputs.json YYYY-MM-DD`. This produces private drafts and a short list of missing inputs. It does not fetch connected apps, write to Sheets, or publish by itself.
7. Ask Kristen in one concise batch for missing information, chiefly her Take, recommended next steps, unresolved showing counts, marketing not present in connected records, and competitor review. Offer an evidence-based draft of her Take for editing, but never carry old commentary forward as a fresh recommendation.
8. After Kristen supplies inputs, preserve the prior snapshot, save a new dated snapshot, and update the current report using an approved data path. Re-read the written data and verify the displayed property, date, figures, narrative, and private access. Avoid duplicate snapshots when rerunning the same period.

## Remaining integration work

This is a working first implementation, not a completed unattended automation. The runner has no direct email/MLS collector or publishing adapter yet. The human-readable operator workflow above can be performed through the connected tools in this chat.

Before production: establish a private sheet/database data path, durable snapshot storage, and rate limiting for the report endpoint. The original published CSV remains publicly retrievable upstream even if it is hidden from the new browser code. Moving reads to the server does not revoke that pre-existing publication. Do not place new private feedback, access codes, or sensitive seller information into an expanded published feed. Remove the old publication only after the replacement path is verified.

Confirm the Vercel project connection before publishing backend changes. This draft does not change DNS, rotate credentials, alter sharing, or publish a new version.

## Local review

Run `node --test workflow.test.mjs`, then `node server.mjs`. The server binds only to 127.0.0.1:4317. The default page is the seller login; the local preview uses `/?preview=1` with the ignored `preview.json`. The input check is `/?preview=1&view=prepare`. Private drafts and preview data are excluded from Git.

The current Google source can be overridden by `SELLER_SHEET_CSV_URL` on the server. For production, replace published CSV access with an authenticated private source before adding sensitive history.
