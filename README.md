# Public mortgage rate data — staging

This PUBLIC repository contains a small, machine-readable copy of mortgage interest rates and APRs displayed publicly by MortgageWebCenter. It contains **no member data, internal spreadsheets, passwords, personal-access tokens or application details**.

The private `web-data-test` repository and Chad's original comparison spreadsheet remain separate.

## What runs automatically

`.github/workflows/update-rates.yml` checks the public rate display at **9:17 a.m., 1:17 p.m., and 5:17 p.m., America/New_York** each day (subject to GitHub scheduler delays). Manual workflow runs are also supported. When successful, it validates both products and commits only `docs/rates.json`.

The data includes the 15/15 adjustable-rate mortgage and 30-year fixed-rate mortgage **interest rates and APRs**, the source page, and the time the public page was checked. **The checked timestamp is not a lender rate-effective date.**

The browser process uses read-only repository permissions. A separate validation/publishing job has narrowly scoped repository write access. Commits use GitHub's bot `noreply` email. No privileged source-system access is required.

If retrieval or validation fails, the previous JSON remains unchanged. A consumer must check freshness; our Milestone staging widget refuses to show rate figures when the last check is older than 36 hours.

## Staging data address

Once the first successful run has committed the file, the rate JSON is available at:

`https://raw.githubusercontent.com/siteops-workbench-26/web-rates-data/main/docs/rates.json`

This is a **staging data distribution approach**, not a production hosting commitment. All files and commit history in this public repository can be read by anyone. Public data is intentional; do not add confidential content.

## Operational and launch limitations

- Source rates are public lender advertisements. The scraper does not independently establish current product eligibility, rate effective dates, or advertising compliance.
- Browser scraping may stop working if the external page changes. Scheduled jobs may run late or become disabled; monitor failures and freshness.
- `raw.githubusercontent.com` is a GitHub file delivery endpoint, not an approved commercial API with an availability commitment. Before ACU production launch, move the validated feed to a supported ACU-controlled asset endpoint or approve the hosting dependency.
- The comparison display separately reproduces Chad's existing Excel methodology; it is **not included in this public repo**. The financial illustration and disclosures still require appropriate sign-off.
- No live Milestone CMS page is modified by this repository.

For the current featured rates and formal application disclosures, visit https://acuonline.mortgagewebcenter.com/responsive/#/ApplyNow .
