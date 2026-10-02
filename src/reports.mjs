import {readFileSync} from 'node:fs';
export const methodsReport = {
  "title": "Cividian Site Diligence as an Evidence Bounded Research System",
  "slug": "cividian-evidence-bounded-methods",
  "subtitle": "Source lineage abstention and a prospective evaluation protocol",
  "description": "A systems and methods report on the public Cividian Site Diligence Agent, its software validation boundaries, and a prospective evaluation protocol.",
  "author": "Owen Crabbe",
  "published": "2026-10-02",
  "date": "2 October 2026",
  "status": "Self-published",
  "peerReview": "Not peer reviewed",
  "download": "/reports/cividian-evidence-bounded-methods.docx"
};
methodsReport.body = readFileSync(new URL('./cividian-methods-report.html',import.meta.url),'utf8');
