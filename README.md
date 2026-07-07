# Seller Update App

Client-facing weekly seller update portal for Charlotte Living Homes.

## How It Works

The page reads a published Google Sheet CSV and matches sellers by:

- `Address`
- `Password` or `Access Code`

If multiple rows match the same property and access code, the newest matching row in the sheet is shown.

## Core Sheet Columns

These columns are currently supported:

- `Date`
- `Address`
- `Password`
- `DOM`
- `Total Showings`
- `Total Open Houses`
- `Saves - Realtor`
- `Saves - Redfin`
- `Saves - Homes`
- `Saves - Zillow`
- `Saves - MLS`
- `What Buyers Are Loving`
- `What Buyers Are Concerned About`
- `Market Context`
- `Kristen's Strategic Read`
- `What's Happening Next`
- `Link - Zillow`
- `Link - Redfin`
- `Link - Realtor`
- `Link - Homes`
- `Link - MLS`

## Optional Buyer Interest Columns

Add any of these columns to make the Buyer Interest Online section richer:

- `Views - Realtor`
- `Views - Redfin`
- `Views - Homes`
- `Views - Zillow`
- `Views - MLS`
- `Previous Saves - Realtor`
- `Previous Saves - Redfin`
- `Previous Saves - Homes`
- `Previous Saves - Zillow`
- `Previous Saves - MLS`

The previous saves columns allow the report to show week-over-week changes like `+6`.

## Weekly Workflow

1. Add a new row for the property each week.
2. Keep the same `Address` and `Password`.
3. Update the weekly numbers, notes, strategy, next steps, and links.
4. The seller portal automatically shows the latest matching row.

## Privacy Notes

This is a lightweight access-code portal, not full account authentication. Use non-guessable access codes and avoid publishing sensitive personal, financial, or contract details in the Sheet.
