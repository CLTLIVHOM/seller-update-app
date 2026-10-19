# Seller report application

The current report reads listing values from its existing source. Optional supplemental sections are loaded server-side from `SELLER_REPORT_SECTIONS_JSON`, keyed by property ID. Supplements cannot overwrite current counts, status, or narrative. Metric metadata is applied only when reporting dates match; retained sections show their review date.

Run `node --test workflow.test.mjs registry.test.mjs api/report.test.mjs` before deployment. Keep preview data, private drafts, and credentials out of source control and public assets. Supplemental configuration must be updated and redeployed when its reviewed content changes. Automatic collection and durable remote history are not implemented by this adapter.
