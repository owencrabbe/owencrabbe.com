const configuredOrigin = process.env.SITE_ORIGIN ?? 'https://owencrabbe.com';
let parsedOrigin;
try { parsedOrigin = new URL(configuredOrigin); } catch { throw new Error('SITE_ORIGIN must be an absolute HTTPS origin.'); }
if (parsedOrigin.protocol !== 'https:' || parsedOrigin.username || parsedOrigin.password || parsedOrigin.search || parsedOrigin.hash || parsedOrigin.pathname !== '/' || configuredOrigin.endsWith('/')) {
  throw new Error('SITE_ORIGIN must be an HTTPS origin without a path, query, credentials, or trailing slash.');
}

const phronemePublicRevision = '18a8557c96787d5015c2280c188163dbf67cdba5';
const phronemePublicSource = `https://github.com/owencrabbe/MindForge-Skills/blob/${phronemePublicRevision}`;

export const site = {
  name: 'Owen Crabbe',
  origin: parsedOrigin.origin,
  email: 'owencrabbe@owencrabbe.com',
  github: 'https://github.com/owencrabbe',
  repo: 'https://github.com/owencrabbe/cividian-site-diligence-agent',
  demo: 'https://cividian-site-diligence-agent.vercel.app',
  source: 'https://github.com/owencrabbe/cividian-site-diligence-agent/blob/7956c302e55721489e35bcee8c9dbdb0d9471077/README.md',
  validator: 'https://github.com/owencrabbe/cividian-site-diligence-agent/blob/7956c302e55721489e35bcee8c9dbdb0d9471077/lib/diligence/schema.js#L150',
  zoning: 'https://github.com/owencrabbe/cividian-site-diligence-agent/blob/7956c302e55721489e35bcee8c9dbdb0d9471077/lib/diligence/zoning.js#L386',
  auditor: 'https://github.com/owencrabbe/cividian-site-diligence-agent/blob/7956c302e55721489e35bcee8c9dbdb0d9471077/lib/diligence/audit.js#L110',
  evaluation: 'https://github.com/owencrabbe/cividian-site-diligence-agent/blob/7956c302e55721489e35bcee8c9dbdb0d9471077/docs/hackathon/EVAL_RESULTS.md',
  mindforge: 'https://github.com/owencrabbe/MindForge-Skills',
  phroneme: 'https://www.phroneme.com/fitness',
  fitnessLab: 'https://www.phroneme.com/fitness-lab/index.html',
  mindforgeSource: `${phronemePublicSource}/README.md`,
  phronemeContract: `${phronemePublicSource}/lib/evidence.mjs`,
  phronemeCatalog: `${phronemePublicSource}/evidence/catalog.mjs`,
  phronemePlanner: `${phronemePublicSource}/lib/planner.mjs`,
  phronemeBrowser: `${phronemePublicSource}/app/main.mjs`,
  phronemeEvidenceTests: `${phronemePublicSource}/tests/evidence.test.mjs`,
  phronemePlannerTests: `${phronemePublicSource}/tests/planner.test.mjs`,
  phronemeEvaluation: `${phronemePublicSource}/evidence/EVALUATION.md`,
  phronemeSkill: `${phronemePublicSource}/skills/fitness-evidence/SKILL.md`,
};

export const phronemeProject = {
  title: 'Phroneme',
  description: 'A browser-local planning and reflection product, seven reusable Claude skills, and an open-source evidence contract with explicit limits.',
  eyebrow: 'Case study / Working product · Open-source evidence contract',
  intro: 'From reusable reasoning methods to a working activity journal—with inspectable evidence checks and a clear boundary around what the software can establish.',
  summary: 'A browser-local activity journal, seven reusable Claude skills, and a tested evidence contract. Source relationships, review dates, and uncertainty stay visible.',
  body: `
  <section id="product"><h2>From a method to a working product.</h2>
  <p>Phroneme connects a practical planning and reflection workflow with a small evidence library. The Fitness Lab lets a person choose activities and days, record completion, reflect on the week, and export or delete their journal.</p>
  <p>The open-source toolkit grew from MindForge’s original six Claude methods: deep research, first principles, steelman/red-team, decision science, Socratic inquiry, and cross-domain transfer. Version 2 preserves those methods and adds a seventh <a href="${site.phronemeSkill}">fitness-evidence skill</a>, an executable evidence contract, and the portable Fitness Lab.</p>
  <p>The full Phroneme product and reusable public toolkit are distinct artifacts. This case study links the working experience and the public implementation of its evidence and journal components.</p></section>
  <section id="contract"><h2>A narrow contract you can inspect.</h2>
  <p>The <a href="${site.phronemeCatalog}">reviewed library</a> contains three primary agency sources and five scoped paraphrases of general adult activity guidance. Source records carry attribution, a public URL, editorial review dates, status, and a declared relationship to each claim.</p>
  <p>The <a href="${site.phronemeContract}">validator</a> rejects unknown claim IDs, unrelated citations, changed quantities or populations, missing review metadata, withdrawn sources, and overdue reviews. A review deadline is an editorial maintenance rule; passing that date does not mean the original guidance became false.</p>
  <div class="callout"><span class="eyebrow">The contract</span><p>A reviewed wording match is a catalog result. It is not independent scientific verification or a personal recommendation.</p></div>
  <p>The explorer uses complete curated statements and a small explicit phrase list, with normalization for presentation differences. It does not grade arbitrary paraphrases or call a model. Unknown wording returns <code>insufficient-evidence</code>: the small library cannot assess it, rather than declaring it false.</p></section>
  <section id="workflow"><h2>Finish the loop in the browser.</h2>
  <p>The <a href="${site.phronemePlanner}">planner</a> validates dates, scheduled activities, completion records, and saved data. Progress is the count of completed versus planned check-ins. The printable journal escapes user-entered text, and JSON export preserves the plan and reflection.</p>
  <p>The <a href="${site.phronemeBrowser}">browser workflow</a> stores the journal locally, offers explicit export, and removes the saved browser copy when the user deletes the plan. The lab does not send journal content to a backend or model. A shared browser profile can still expose that local copy, and exported files remain under the user’s control.</p>
  <p>The useful engineering boundary is concrete: the software can record a plan and what the user checked off. Those records do not establish improved adherence, fitness, or health.</p></section>
  <section id="evaluation"><h2>Test the contract. Evaluate the method separately.</h2>
  <p>The public version has 54 passing software tests: <a href="${site.phronemeEvidenceTests}">48 evidence checks and development fixtures</a>, plus <a href="${site.phronemePlannerTests}">six planner tests</a>. They cover altered numbers and populations, unsupported source relationships, invalid review dates, hostile text, malformed storage, calendar boundaries, completion integrity, and export escaping.</p>
  <p>Those tests establish behavior for the declared software cases. A controlled model comparison has not been run. The <a href="${site.phronemeEvaluation}">proposed evaluation protocol</a> compares a fixed model with no method, a neutral checklist, and the fitness-evidence skill under identical source packets, with blinded human review.</p>
  <p>The next research question is whether the method improves source support and uncertainty communication on held-out tasks. That question is separate from product usability and from any health outcome.</p>
  <p>Implementation and scope are documented in <a href="${site.mindforgeSource}">the public version 2 README</a>. The reusable toolkit is MIT licensed. This is a self-published account of a working product and its open-source contract.</p></section>`,
};

export const research = [
  {
    number: '01',
    title: 'Civic data curation & retrieval',
    description: 'How do deduplication and provenance checks change source retrieval and grounded answers?',
    method: 'Use a rights-audited civic-document corpus. Freeze the retriever and model, hold out jurisdictions, and compare curation interventions through coverage, retrieval errors, answer support, latency, and cost.',
    output: 'A documented corpus, frozen evaluation set, reproducible baseline, and ablation report.',
  },
  {
    number: '02',
    title: 'Evidence-bounded answers',
    description: 'Do claim-level citations and explicit unknown states improve the usefulness of an answer?',
    method: 'Compare ordinary retrieval answers with answers that expose source support, contradictions, and unknowns. Use the same frozen questions and blinded human evidence review for paired comparisons.',
    output: 'An evidence rubric, annotated comparison set, error taxonomy, and paired results.',
  },
  {
    number: '03',
    title: 'Temporal evidence & abstention',
    description: 'Can better treatment of dates prevent a system from relying on a superseded rule?',
    method: 'Separate publication, effective, and retrieval dates. Evaluate current and historical questions, including cases with conflicting or missing current evidence. Measure reliance on superseded rules and appropriate abstention.',
    output: 'A versioned temporal benchmark, source timeline, and evaluation of unsupported answers.',
  },
];

export const notes = [
  {
    slug: 'evidence-as-interface',
    number: '01',
    title: 'A useful answer keeps its evidence',
    description: 'Why provenance, unknowns, and source support belong in the interface—not just the prompt.',
    category: 'Engineering note',
    reading: '5 min read',
  },
  {
    slug: 'verification-boundaries',
    number: '02',
    title: 'What a passing check actually proves',
    description: 'A practical distinction between software checks, grounded answers, and real-world confirmation.',
    category: 'Engineering note',
    reading: '5 min read',
  },
];

const sourceLink = `<a href="${site.source}">the public project README at a pinned revision</a>`;

export const caseStudy = `
  <section id="problem"><h2>The problem is a chain of questions.</h2>
  <p>A real estate site question rarely stops at an address. It becomes a sequence: which parcel is this, what records support its identity, what assumptions drive the economics, which local rules may apply, and what still needs someone to verify?</p>
  <p>An AI-generated brief can make that sequence feel complete before the supporting work is complete. Cividian Site Diligence is organized around an investigation pipeline that keeps the supporting evidence and remaining uncertainty visible.</p>
  <p>The public repository provides the implementation and a scripted evaluation report. This case study follows those artifacts and the engineering questions they raise.</p></section>
  <section id="architecture"><h2>Keep the stages distinct.</h2>
  <p>The public workflow progresses from site identity to evidence rows, deterministic financial scenarios, official ordinance discovery, bounded model reasoning, citation validation, and an additional model audit. The output is a ten-section brief with an investigation plan.</p>
  <div class="article-flow" aria-label="Documented project pipeline"><span>Identify the site</span><span>Collect evidence</span><span>Calculate scenarios</span><span>Reason with sources</span><span>Validate citations</span><span>Audit & brief</span></div>
  <p>The separation matters. A financial calculation can be checked independently of a model’s prose. A source can be retrieved without proving that it applies to a particular parcel. A citation can support a sentence without settling a local authority’s interpretation.</p>
  <p>The documented model workflow uses Nemotron 3 Super for bounded reasoning and a separate Nano audit. Official ordinance discovery uses Tavily, with a verbatim quote filter before the downstream reasoning stage.</p>
  <h3>Three safeguards, three separate jobs</h3>
  <ul><li><strong>Validate the output contract.</strong> The <a href="${site.validator}">per-finding validator</a> checks citation identifiers, rejects unverified evidence references, and checks numeric claims against cited rows. A recognized citation or matching number does not by itself establish semantic support, units, or scope.</li>
  <li><strong>Anchor extracted text.</strong> The <a href="${site.zoning}">ordinance reader</a> checks that a quote occurs in normalized retrieved text and retains a fetched-text fingerprint. Accepted text remains unverified for parcel applicability.</li>
  <li><strong>Constrain the second reviewer.</strong> The <a href="${site.auditor}">auditor</a> can remove or flag unsupported findings, but cannot add a new claim. Malformed verdicts or unsupported spans that do not occur literally in a finding leave the output unaudited.</li></ul>
  <p>These safeguards address different failure modes. Their presence makes the mechanism inspectable; a controlled evaluation is still needed to quantify how much each stage helps.</p></section>
  <section id="boundaries"><h2>Unknown is a useful output.</h2>
  <p>Missing values stay <code>null</code>. Zoning remains unverified until confirmation with the planning office. Scanned ordinances and image-based material are outside the documented supported workflow.</p>
  <div class="callout"><span class="eyebrow">Design principle</span><p>A system should expose the boundary between a retrieved fact, a calculated scenario, a model interpretation, and a required external check.</p></div>
  <p>That boundary helps a reader take the next useful action. An incomplete ordinance search should lead to a source request or office confirmation, rather than a more confident paragraph. A scenario with a missing cost input should remain visibly incomplete, rather than acquire an invented estimate.</p>
  <p>Geographic coverage also has a boundary: the documented parcel workflow is limited to Indiana without a provider key. A useful interface should show that limitation before a person relies on a result.</p></section>
  <section id="evaluation"><h2>Evaluation needs several kinds of evidence.</h2>
  <p>A fixture can establish that a known input passes through the pipeline and produces the expected structure. It cannot establish that a live ordinance search found every applicable rule, that the source is current, or that a local authority would agree with the interpretation.</p>
  <p>The next research step is a frozen, independently reviewed set of site questions with reference sources and explicit unknown states. Results should report source coverage, supported claims, unsupported claims, geographic limits, abstention, latency, and cost separately.</p>
  <p>The <a href="${site.evaluation}">published evaluation report</a> records 16 scripted pipeline and validator cases. A controlled live benchmark is proposed here to measure source support and real-world coverage.</p></section>
  <section id="takeaways"><h2>The larger idea.</h2>
  <p>For applied AI, the unit of usefulness is often a decision someone can inspect. The answer needs a source trail, a clear account of its assumptions, and a concrete path from uncertainty to further investigation.</p>
  <p>Cividian Site Diligence is a public example of that direction: separate calculation from interpretation, make citations inspectable, and preserve what the system does not know.</p>
  <p>Architecture and limitations are drawn from ${sourceLink}. The repository is published under Apache-2.0. Interpretive commentary and proposed evaluation work are presented here as self-published engineering analysis.</p></section>`;

export const articleBodies = {
  'evidence-as-interface': `
  <p class="article-lead">An answer is easier to trust when a reader can see how it was built. That requires more than a list of links at the bottom.</p>
  <section id="source-trail"><h2>Start with the source trail.</h2>
  <p>When a system retrieves documents and then produces prose, it crosses several boundaries. A document can be relevant without being authoritative. It can be authoritative without being current. It can be current without applying to the specific situation in front of the reader.</p>
  <p>A source trail should preserve the document’s identity, the retrieved material, its date context, and which claim it supports. The interface should let a person inspect these relationships without reverse-engineering the model’s reasoning.</p>
  <p>In the public Cividian Site Diligence workflow, evidence rows precede reasoning, ordinance discovery includes a verbatim quote filter, and citation validation is a separate stage. That architecture is a useful starting point for treating evidence as an object the product carries through the workflow.</p></section>
  <section id="claim-types"><h2>Different claims need different labels.</h2>
  <p>Consider four statements in a site investigation:</p>
  <ul><li><strong>Retrieved fact:</strong> a record identifies a parcel or quotes a rule.</li><li><strong>Calculated scenario:</strong> an output follows from explicit financial inputs and formulas.</li><li><strong>Interpretation:</strong> the system reasons about what a source could mean in context.</li><li><strong>Open question:</strong> the available evidence does not settle the answer.</li></ul>
  <p>These statements have different failure modes. A retrieved fact can be linked to the wrong site. A calculation can use a wrong assumption. An interpretation can exceed its source. An open question can disappear into smooth, plausible prose.</p>
  <div class="callout"><span class="eyebrow">Interface rule</span><p>Keep the evidence status close to the claim it qualifies.</p></div>
  <p>A generic confidence number is less useful than a specific boundary: “missing input,” “source date unknown,” “interpretation requires confirmation,” or “contradicting sources.” These labels tell the reader what to investigate next.</p></section>
  <section id="unknowns"><h2>Unknowns should survive the pipeline.</h2>
  <p>If an input is unavailable, preserving <code>null</code> keeps the absence visible to downstream code and the reader. Replacing it with a plausible value makes an incomplete calculation look finished.</p>
  <p>The same principle applies to prose. A system should be able to say that no supporting source was retrieved, that a source cannot be read, or that a local office must confirm an interpretation. An abstention can be the correct result of an otherwise successful workflow.</p></section>
  <section id="measure"><h2>Measure the interface as well as the answer.</h2>
  <p>A useful evaluation would ask reviewers to identify which claims are supported, which assumptions affect a calculation, and which questions remain unresolved. Compare ordinary answer text with an interface that exposes evidence status, using the same questions and source set.</p>
  <p>This is a proposed experiment, not a reported result. The hypothesis is that an inspectable evidence interface helps readers notice unsupported claims and choose better next actions. It could also add friction, and the evaluation should measure that cost.</p>
  <p>The architectural example comes from ${sourceLink}. This note is self-published engineering commentary, not a peer-reviewed paper.</p></section>`,
  'verification-boundaries': `
  <p class="article-lead">A test passing is evidence about a particular check. The useful question is what that check actually established.</p>
  <section id="layers"><h2>There are several layers of correctness.</h2>
  <p>In an applied AI workflow, software correctness, source coverage, claim support, and real-world applicability are related but distinct. A system can pass its software checks while producing an incomplete investigation.</p>
  <div class="comparison"><div><span class="eyebrow">Software check</span><h3>Did the mechanism behave as expected?</h3><p>Known inputs, calculation invariants, output structure, failure handling, and citation formatting.</p></div><div><span class="eyebrow">Evidence check</span><h3>Does the result have the support it needs?</h3><p>Source identity, currentness, coverage, claim support, contradictions, and unresolved questions.</p></div></div>
  <p>A third layer is external confirmation. In a site investigation, a planning office’s interpretation may be required even when the source retrieval and software behavior are sound. That confirmation belongs to a different evidence process.</p></section>
  <section id="fixtures"><h2>Fixtures make behavior reproducible.</h2>
  <p>A fixture is a controlled input and expected result. It is especially useful when the live environment changes: documents move, search results vary, APIs fail, and models can produce different outputs.</p>
  <p>Fixtures can test a deterministic calculation, verify that missing values stay missing, or ensure that a citation validator rejects an unsupported reference. They reduce uncertainty about the mechanism. They do not reproduce all uncertainty in the world.</p>
  <p>The public Cividian Site Diligence documentation distinguishes fixture behavior from live quality. Its architecture also separates deterministic financial scenarios from reasoning and audit stages. The distinction should remain visible whenever results are reported.</p></section>
  <section id="live-eval"><h2>A live evaluation needs a reference.</h2>
  <p>A convincing live output is an example, not an accuracy estimate. A useful evaluation needs a defined question set, independently reviewed reference material, a consistent grading rubric, and a record of the system configuration.</p>
  <p>For a civic-document workflow, the test set should include missing evidence, conflicting rules, superseded documents, and material the pipeline cannot read. Easy, well-documented cases tell only part of the story.</p>
  <p>Report source coverage and unsupported claims separately. Report abstention separately from incorrect answers. Keep jurisdiction, document date, latency, and cost attached to the result so another person can understand its scope.</p></section>
  <section id="receipts"><h2>Keep the receipt attached to the claim.</h2>
  <p>A reproducible result should identify the source revision, inputs, environment, configuration, and evaluation method. Without that record, “it worked” is difficult to inspect or repeat.</p>
  <div class="callout"><span class="eyebrow">Reporting principle</span><p>State the check that ran, the result it produced, and the boundary of the conclusion.</p></div>
  <p>That habit makes progress easier to assess. It also makes failure more useful: a broken stage, missing document, or unsupported claim becomes a concrete engineering question.</p>
  <p>The project example comes from ${sourceLink}. The evaluation practices described here are proposals and engineering principles; this note does not report a completed benchmark or an independently validated outcome.</p></section>`,
};
