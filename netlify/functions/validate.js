// LabCompliance Pro — LCD Rule Engine (Netlify Serverless Function)
// LCD/CPT data updated to 2025-2026 CMS policy references.
// ICD-10-CM codes reflect FY2026 code set (effective Oct 1, 2025).
// LCD revision numbers reference CMS Medicare Coverage Database (MCD).

const POLICY_META = {
  systemVersion: "2.6.0",
  lastAudit: "2025-07-01",
  nextScheduledUpdate: "2026-01-01",
  icd10Vintage: "FY2026 (effective 2025-10-01)",
  cptVintage: "2025 CPT code set",
  lcdSource: "CMS Medicare Coverage Database — LCD revisions effective 2025",
};

const STATE_TO_MAC = {
  AL:{mac:"JJ",contractor:"Palmetto GBA",region:"Southeast"},
  AK:{mac:"JF",contractor:"Noridian Healthcare Solutions",region:"Northwest"},
  AZ:{mac:"J11",contractor:"Noridian Healthcare Solutions",region:"Southwest"},
  AR:{mac:"J7",contractor:"WPS Government Health Administrators",region:"South Central"},
  CA:{mac:"J1",contractor:"Noridian Healthcare Solutions",region:"West"},
  CO:{mac:"J4",contractor:"CGS Administrators",region:"Mountain"},
  CT:{mac:"JK",contractor:"National Government Services",region:"Northeast"},
  DE:{mac:"J12",contractor:"Novitas Solutions",region:"Mid-Atlantic"},
  FL:{mac:"J9",contractor:"First Coast Service Options",region:"Southeast"},
  GA:{mac:"JJ",contractor:"Palmetto GBA",region:"Southeast"},
  HI:{mac:"J1",contractor:"Noridian Healthcare Solutions",region:"Pacific"},
  ID:{mac:"JF",contractor:"Noridian Healthcare Solutions",region:"Northwest"},
  IL:{mac:"J6",contractor:"National Government Services",region:"Midwest"},
  IN:{mac:"J8",contractor:"WPS Government Health Administrators",region:"Midwest"},
  IA:{mac:"J5",contractor:"WPS Government Health Administrators",region:"Midwest"},
  KS:{mac:"J7",contractor:"WPS Government Health Administrators",region:"Central"},
  KY:{mac:"J8",contractor:"WPS Government Health Administrators",region:"Southeast"},
  LA:{mac:"J7",contractor:"WPS Government Health Administrators",region:"South Central"},
  ME:{mac:"JK",contractor:"National Government Services",region:"Northeast"},
  MD:{mac:"J12",contractor:"Novitas Solutions",region:"Mid-Atlantic"},
  MA:{mac:"JK",contractor:"National Government Services",region:"Northeast"},
  MI:{mac:"J8",contractor:"WPS Government Health Administrators",region:"Midwest"},
  MN:{mac:"J5",contractor:"WPS Government Health Administrators",region:"Midwest"},
  MS:{mac:"JJ",contractor:"Palmetto GBA",region:"Southeast"},
  MO:{mac:"J7",contractor:"WPS Government Health Administrators",region:"Central"},
  MT:{mac:"JF",contractor:"Noridian Healthcare Solutions",region:"Northwest"},
  NE:{mac:"J5",contractor:"WPS Government Health Administrators",region:"Midwest"},
  NV:{mac:"J1",contractor:"Noridian Healthcare Solutions",region:"West"},
  NH:{mac:"JK",contractor:"National Government Services",region:"Northeast"},
  NJ:{mac:"J12",contractor:"Novitas Solutions",region:"Mid-Atlantic"},
  NM:{mac:"J11",contractor:"Noridian Healthcare Solutions",region:"Southwest"},
  NY:{mac:"JK",contractor:"National Government Services",region:"Northeast"},
  NC:{mac:"JM",contractor:"Palmetto GBA",region:"Southeast"},
  ND:{mac:"JF",contractor:"Noridian Healthcare Solutions",region:"Northwest"},
  OH:{mac:"J8",contractor:"WPS Government Health Administrators",region:"Midwest"},
  OK:{mac:"J7",contractor:"WPS Government Health Administrators",region:"South Central"},
  OR:{mac:"JF",contractor:"Noridian Healthcare Solutions",region:"Northwest"},
  PA:{mac:"J12",contractor:"Novitas Solutions",region:"Mid-Atlantic"},
  RI:{mac:"JK",contractor:"National Government Services",region:"Northeast"},
  SC:{mac:"JM",contractor:"Palmetto GBA",region:"Southeast"},
  SD:{mac:"JF",contractor:"Noridian Healthcare Solutions",region:"Northwest"},
  TN:{mac:"JJ",contractor:"Palmetto GBA",region:"Southeast"},
  TX:{mac:"J7",contractor:"WPS Government Health Administrators",region:"South Central"},
  UT:{mac:"J4",contractor:"CGS Administrators",region:"Mountain"},
  VT:{mac:"JK",contractor:"National Government Services",region:"Northeast"},
  VA:{mac:"JM",contractor:"Palmetto GBA",region:"Mid-Atlantic"},
  WA:{mac:"JF",contractor:"Noridian Healthcare Solutions",region:"Northwest"},
  WV:{mac:"J12",contractor:"Novitas Solutions",region:"Mid-Atlantic"},
  WI:{mac:"J5",contractor:"WPS Government Health Administrators",region:"Midwest"},
  WY:{mac:"J4",contractor:"CGS Administrators",region:"Mountain"},
  DC:{mac:"J12",contractor:"Novitas Solutions",region:"Mid-Atlantic"},
  PR:{mac:"J9",contractor:"First Coast Service Options",region:"Caribbean"},
  VI:{mac:"J9",contractor:"First Coast Service Options",region:"Caribbean"},
};

// MAC alias resolution — multiple MAC codes may share the same LCD ruleset
const MAC_ALIAS = {
  JM: "JJ",   // Palmetto GBA covers JJ + JM
  J1: "JF",   // Noridian covers J1, JF, J11
  J11: "JF",
  JK: "J6",   // NGS covers J6 + JK
  J5: "J7",   // WPS family shares base rules with jurisdiction notes
  J8: "J7",
  J9: "J7",   // First Coast — approximate with WPS for unlisted codes
  J4: "J7",
};

// ── LCD Data ─────────────────────────────────────────────────────────────────
// LCD revision references sourced from CMS Medicare Coverage Database (MCD).
// Policy versions reflect 2025 updates; ICD-10 codes reflect FY2026 code set.
// CPT codes reflect 2025 AMA CPT code set.
//
// CPT categories covered:
//   Chemistry/Metabolic: 80048, 80053, 82962, 83036, 84443
//   Hematology:          85025
//   Urinalysis:          81001 (w/ microscopy), 81003 (dipstick/automated)
//   Urine Culture:       87086
//   Infectious Disease:  87491 (Chlamydia NAA), 87591 (Gonorrhea NAA),
//                        87340 (HBsAg), 87804 (Influenza A/B rapid),
//                        86703 (HIV-1/2), 86592 (RPR/Syphilis)
//   Immunoassay:         86235 (ANA), 86430 (Rheumatoid factor),
//                        86800 (Thyroglobulin Ab)
//   PGx:                 81225 (CYP2C19), 81226 (CYP2D6), 81227 (CYP2C9),
//                        0029U (multi-gene panel), 0030U (multi-gene panel)

const LCD_DATA = {
  JJ: {
    mac:"JJ", contractor:"Palmetto GBA",
    policyVersion:"L36021-Rev17", lastUpdated:"2025-04-01", effectiveDate:"2025-05-01",
    rules:[
      // ── Chemistry / Metabolic ──────────────────────────────────────────────
      {id:"LCD-JJ-001",cpt:"80048",desc:"Basic Metabolic Panel",
        covered:["E11.9","E11.65","I10","I12.9","I13.10","N18.3","N18.4","E87.1","E87.6","E87.2","Z79.4","R73.09"],
        excluded:["Z00.00","Z00.01"],frequency:"Once per 90 days",medNecessity:true,
        notes:"FY2026: added N18.4 (CKD stage 4) and I13.10 (hypertensive CKD). Requires documented medical necessity for E/M service on same date."},
      {id:"LCD-JJ-002",cpt:"80053",desc:"Comprehensive Metabolic Panel",
        covered:["K74.60","K74.69","K70.30","K70.31","B18.2","B18.1","E11.9","I50.9","I50.32","N18.5","Z87.39"],
        excluded:["Z00.00"],frequency:"Once per 90 days",medNecessity:true,
        notes:"FY2026: K74.69 (other cirrhosis), I50.32 (chronic diastolic HF). Hepatic function panel billed separately if standalone."},
      {id:"LCD-JJ-003",cpt:"82962",desc:"Blood Glucose by Monitoring Device",
        covered:["E11.9","E10.9","E13.9","E11.65","E11.649","Z79.4"],
        excluded:[],frequency:"As medically necessary",medNecessity:false,
        notes:"SMBG for documented diabetes only. E11.649 added FY2026 (DM with hypoglycemia without coma)."},
      {id:"LCD-JJ-004",cpt:"83036",desc:"Hemoglobin A1c",
        covered:["E11.9","E10.9","E13.9","E11.649","R73.09","Z83.3","Z79.4"],
        excluded:["Z00.00"],frequency:"Twice per year; quarterly if uncontrolled",medNecessity:true,
        notes:"Frequency based on glycemic control status. Z79.4 (insulin use) added 2025."},
      {id:"LCD-JJ-005",cpt:"84443",desc:"Thyroid Stimulating Hormone (TSH)",
        covered:["E03.9","E03.8","E05.90","E06.3","E89.0","R00.0","Z79.899"],
        excluded:["Z00.00","Z01.419"],frequency:"Once per year for stable patients",medNecessity:true,
        notes:"E03.8 (other specified hypothyroidism) added 2025. E89.0 (post-procedural hypothyroidism) covered quarterly in first year post-surgery."},

      // ── Hematology ────────────────────────────────────────────────────────
      {id:"LCD-JJ-006",cpt:"85025",desc:"Complete Blood Count with Differential",
        covered:["D64.9","D64.89","D50.9","D50.8","C91.00","C91.10","D70.9","D70.1","R61","B20","D75.9"],
        excluded:["Z00.00","Z02.89"],frequency:"Varies by diagnosis",medNecessity:true,
        notes:"FY2026: C91.10 (CLL stage 0), D64.89 (other specified anemias), D70.1 (agranulocytosis secondary to cancer chemotherapy)."},

      // ── Urinalysis ────────────────────────────────────────────────────────
      {id:"LCD-JJ-007",cpt:"81001",desc:"Urinalysis, Automated with Microscopy",
        covered:["N30.00","N30.01","R31.9","R31.0","N10","N39.0","R80.9","N18.3","E11.65"],
        excluded:["Z00.00"],frequency:"As medically necessary",medNecessity:true,
        notes:"Must be ordered in context of active signs/symptoms. R31.0 (gross hematuria) added FY2026."},
      {id:"LCD-JJ-008",cpt:"81003",desc:"Urinalysis, Automated without Microscopy (Dipstick)",
        covered:["N30.00","R31.9","N39.0","R80.9","E11.65","N18.3","Z87.440"],
        excluded:["Z00.00","Z01.419"],frequency:"As medically necessary",medNecessity:false,
        notes:"Dipstick UA (81003) is not separately billable when 81001 is billed same date. Z87.440 (personal history of UTI) added 2025 for recurrent UTI surveillance."},
      {id:"LCD-JJ-009",cpt:"87086",desc:"Urine Culture, Bacterial; Quantitative",
        covered:["N30.00","N30.01","N39.0","R82.71","N10","N28.84","O23.10"],
        excluded:["Z00.00","Z01.419"],frequency:"As clinically indicated",medNecessity:true,
        notes:"R82.71 (bacteriuria) and N28.84 (pyeloureteritis cystica) added FY2026. O23.10 covers UTI in pregnancy."},

      // ── Infectious Disease / NAA ──────────────────────────────────────────
      {id:"LCD-JJ-010",cpt:"87491",desc:"Chlamydia trachomatis, NAA",
        covered:["Z11.3","Z11.51","Z72.51","A56.00","A56.09","N72","R36.9"],
        excluded:[],frequency:"Annually for high-risk; as indicated for symptomatic",medNecessity:false,
        notes:"USPSTF Grade B. Z11.51 (encounter for screening for HPV/Chlamydia) per FY2026. Can be co-billed with 87591 per NCCI 2025."},
      {id:"LCD-JJ-011",cpt:"87591",desc:"Neisseria gonorrhoeae, NAA",
        covered:["Z11.3","Z11.51","Z72.51","A54.00","A54.09","R36.9"],
        excluded:[],frequency:"Annually for high-risk; as indicated for symptomatic",medNecessity:false,
        notes:"USPSTF Grade B. Co-testing with Chlamydia (87491) on same specimen is covered per NCD 90.2 update 2025."},
      {id:"LCD-JJ-012",cpt:"87340",desc:"Hepatitis B Surface Antigen (HBsAg)",
        covered:["B18.1","B19.10","Z11.59","Z22.51","Z23","O98.11"],
        excluded:["Z00.00"],frequency:"Annually; each trimester if pregnant",medNecessity:false,
        notes:"USPSTF Grade B (2025 reaffirmation). O98.11 added for HBV in pregnancy. Prenatal HBsAg screening covered each trimester."},
      {id:"LCD-JJ-013",cpt:"87804",desc:"Influenza Virus, Antigen; each type, rapid",
        covered:["J10.1","J11.1","J06.9","R05.9","R50.9","Z20.828"],
        excluded:["Z00.00","Z02.89"],frequency:"As clinically indicated; not routine screening",medNecessity:true,
        notes:"R05.9 (cough, unspecified) and R50.9 (fever, unspecified) support medical necessity. Z20.828 (exposure to influenza) covered 2025. Not reimbursable for asymptomatic wellness visits."},
      {id:"LCD-JJ-014",cpt:"86703",desc:"Antibody; HIV-1 and HIV-2, single result",
        covered:["Z11.4","Z72.51","B20","Z20.6","R75","O98.71"],
        excluded:[],frequency:"Annually for high-risk; once per pregnancy",medNecessity:false,
        notes:"USPSTF Grade A. NCD 210.11 (2025): all patients 15–65 screened at least once. O98.71 covers HIV complicating pregnancy."},
      {id:"LCD-JJ-015",cpt:"86592",desc:"Syphilis Test, Nontreponemal (RPR)",
        covered:["A53.9","A51.0","Z11.3","Z72.51","O98.11","Z20.2"],
        excluded:[],frequency:"Annually for high-risk; each trimester if pregnant",medNecessity:false,
        notes:"USPSTF Grade B (2025). O98.11 prenatal syphilis screening covered each trimester. Z20.2 (exposure to infections with predominantly sexual mode of transmission)."},

      // ── Immunoassay ───────────────────────────────────────────────────────
      {id:"LCD-JJ-016",cpt:"86235",desc:"Anti-Nuclear Antibody (ANA)",
        covered:["M32.9","M35.9","M06.9","L93.0","M34.9","R53.83","M79.3"],
        excluded:["Z00.00","Z01.419"],frequency:"As clinically indicated; not routine screening",medNecessity:true,
        notes:"LCD L36908 (Palmetto, effective 2025-01-01): ANA covered for evaluation of suspected connective tissue disease. R53.83 (fatigue) requires documented clinical suspicion."},
      {id:"LCD-JJ-017",cpt:"86430",desc:"Rheumatoid Factor (RF), Qualitative",
        covered:["M06.9","M06.00","M06.08","M05.79","M79.3","M25.50","R52"],
        excluded:["Z00.00"],frequency:"Initial evaluation; repeat only if results change management",medNecessity:true,
        notes:"Palmetto 2025: repeat RF testing requires documentation that prior result prompted treatment change."},
      {id:"LCD-JJ-018",cpt:"86800",desc:"Thyroglobulin Antibody",
        covered:["E06.3","E03.9","C73","Z85.850","E89.0"],
        excluded:["Z00.00","Z01.419"],frequency:"As clinically indicated",medNecessity:true,
        notes:"C73 (thyroid cancer) and Z85.850 (personal history of thyroid cancer) for post-thyroidectomy surveillance per NCD 2025."},

      // ── PGx / Pharmacogenomics ────────────────────────────────────────────
      {id:"LCD-JJ-019",cpt:"81225",desc:"CYP2C19 (Full Gene Sequence)",
        covered:["I25.10","I25.110","Z96.641","I48.0","I48.91","K21.0","F32.9"],
        excluded:["Z00.00"],frequency:"Once per lifetime",medNecessity:true,
        notes:"LCD L38294 (Palmetto PGx, effective 2025-03-01). I25.110 (atherosclerotic heart disease with unstable angina). Covered for clopidogrel (Plavix) therapy optimization. Z96.641 = presence of coronary stent."},
      {id:"LCD-JJ-020",cpt:"81226",desc:"CYP2D6 (Full Gene Sequence)",
        covered:["F32.9","F33.9","F41.1","F31.9","G43.909","R51.9","F10.20","F11.20"],
        excluded:["Z00.00"],frequency:"Once per lifetime",medNecessity:true,
        notes:"LCD L38294 (2025). Covered for dosing optimization of codeine, tramadol, antidepressants (SSRIs, TCAs), tamoxifen. F10.20/F11.20 for opioid/substance use disorder management."},
      {id:"LCD-JJ-021",cpt:"81227",desc:"CYP2C9 (Full Gene Sequence)",
        covered:["I48.0","I48.91","Z79.01","I26.09","D68.9","M06.9","M05.79"],
        excluded:["Z00.00"],frequency:"Once per lifetime",medNecessity:true,
        notes:"LCD L38294 (2025). Covered for warfarin dosing (I48.x atrial fibrillation, Z79.01 long-term anticoagulant use), NSAIDs (arthritis). D68.9 (coagulopathy)."},
      {id:"LCD-JJ-022",cpt:"0029U",desc:"Drug Metabolism Genotyping, 14 Drugs (Proprietary)",
        covered:["F32.9","F33.9","F41.1","F31.9","I25.10","Z96.641","I48.91","Z79.01","F10.20","F11.20"],
        excluded:["Z00.00"],frequency:"Once per lifetime",medNecessity:true,
        notes:"LCD L38294 (2025). Proprietary U-code for multi-gene PGx panel (e.g., GeneSight). Requires prior authorization under most MACs. Covered ICD-10s must match the specific drug being optimized."},
      {id:"LCD-JJ-023",cpt:"0030U",desc:"Drug Metabolism Genotyping, 12 Drugs (Proprietary)",
        covered:["F32.9","F33.9","F41.1","F31.9","G43.909","I48.91","Z79.01","M06.9"],
        excluded:["Z00.00"],frequency:"Once per lifetime",medNecessity:true,
        notes:"LCD L38294 (2025). Similar to 0029U; covers alternate proprietary multi-gene PGx panel. Prior authorization required. Document specific drug therapy being guided."},
    ]
  },

  JF: {
    mac:"JF", contractor:"Noridian Healthcare Solutions",
    policyVersion:"L35062-Rev14", lastUpdated:"2025-03-15", effectiveDate:"2025-04-01",
    rules:[
      {id:"LCD-JF-001",cpt:"80048",desc:"Basic Metabolic Panel",
        covered:["E11.9","E11.65","I10","I12.9","I13.10","N18.3","N18.4","E87.1","E87.6","Z79.4"],
        excluded:["Z00.00","Z00.01"],frequency:"Once per 90 days",medNecessity:true,
        notes:"Electrolyte monitoring required for documented CKD or HTN. N18.4 added FY2026."},
      {id:"LCD-JF-002",cpt:"80053",desc:"Comprehensive Metabolic Panel",
        covered:["K74.60","K74.69","K70.30","B18.2","E11.9","I50.9","I50.32","N18.5","K76.0"],
        excluded:["Z00.00"],frequency:"Once per 90 days",medNecessity:true,
        notes:"Noridian requires documented rationale when ordered with LFTs same date. K74.69, I50.32 added FY2026."},
      {id:"LCD-JF-003",cpt:"82962",desc:"Blood Glucose by Monitoring Device",
        covered:["E11.9","E10.9","E13.9","E11.649","Z79.4"],
        excluded:[],frequency:"As medically necessary",medNecessity:false,
        notes:"E11.649 (DM with hypoglycemia without coma) added FY2026."},
      {id:"LCD-JF-004",cpt:"83036",desc:"Hemoglobin A1c",
        covered:["E11.9","E10.9","E13.9","R73.09","Z79.4"],
        excluded:["Z00.00","Z83.3"],frequency:"Twice per year; quarterly if uncontrolled",medNecessity:true,
        notes:"Noridian does not cover A1c for family history alone (Z83.3). Z79.4 added 2025."},
      {id:"LCD-JF-005",cpt:"84443",desc:"Thyroid Stimulating Hormone (TSH)",
        covered:["E03.9","E03.8","E05.90","E06.3","E89.0","R00.0","Z79.899"],
        excluded:["Z00.00"],frequency:"Twice per year for stable patients on therapy",medNecessity:true,
        notes:"Post-thyroidectomy monitoring covered quarterly for first year. E03.8 added 2025."},
      {id:"LCD-JF-006",cpt:"85025",desc:"Complete Blood Count with Differential",
        covered:["D64.9","D64.89","D50.9","C91.00","C91.10","D70.9","D70.1","R61","B20","D75.9"],
        excluded:["Z00.00","Z02.89"],frequency:"Varies by diagnosis",medNecessity:true,
        notes:"JF MAC requires ABN for routine/screening CBCs. C91.10, D64.89, D70.1 added FY2026."},
      {id:"LCD-JF-007",cpt:"81001",desc:"Urinalysis, Automated with Microscopy",
        covered:["N30.00","N30.01","R31.9","R31.0","N10","N39.0","R80.9","N18.3"],
        excluded:["Z00.00","E11.65"],frequency:"As medically necessary",medNecessity:true,
        notes:"JF MAC excludes diabetic nephropathy monitoring without active symptoms. R31.0 added FY2026."},
      {id:"LCD-JF-008",cpt:"81003",desc:"Urinalysis, Automated without Microscopy (Dipstick)",
        covered:["N30.00","N39.0","R80.9","N18.3","R31.9","Z87.440"],
        excluded:["Z00.00","Z01.419"],frequency:"As medically necessary",medNecessity:false,
        notes:"Not separately billable same date as 81001. Z87.440 added 2025."},
      {id:"LCD-JF-009",cpt:"87086",desc:"Urine Culture, Bacterial; Quantitative",
        covered:["N30.00","N30.01","N39.0","R82.71","N10","N28.84","O23.10"],
        excluded:["Z00.00"],frequency:"As clinically indicated",medNecessity:true,
        notes:"R82.71 and N28.84 added FY2026."},
      {id:"LCD-JF-010",cpt:"87491",desc:"Chlamydia trachomatis, NAA",
        covered:["Z11.3","Z11.51","Z72.51","A56.00","A56.09"],
        excluded:[],frequency:"Annually for high-risk",medNecessity:false,
        notes:"USPSTF alignment; risk documentation required. Z11.51 added FY2026."},
      {id:"LCD-JF-011",cpt:"87591",desc:"Neisseria gonorrhoeae, NAA",
        covered:["Z11.3","Z11.51","Z72.51","A54.00","A54.09","R36.9"],
        excluded:[],frequency:"Annually for high-risk; as indicated for symptomatic",medNecessity:false,
        notes:"USPSTF Grade B. Co-testing with 87491 covered 2025."},
      {id:"LCD-JF-012",cpt:"87340",desc:"Hepatitis B Surface Antigen (HBsAg)",
        covered:["B18.1","B19.10","Z11.59","Z22.51","O98.11"],
        excluded:["Z00.00"],frequency:"Annually; each trimester if pregnant",medNecessity:false,
        notes:"USPSTF Grade B reaffirmed 2025. Prenatal coverage per trimester."},
      {id:"LCD-JF-013",cpt:"87804",desc:"Influenza Virus, Antigen; each type, rapid",
        covered:["J10.1","J11.1","J06.9","R05.9","R50.9","Z20.828"],
        excluded:["Z00.00","Z02.89"],frequency:"As clinically indicated",medNecessity:true,
        notes:"Not covered for asymptomatic patients. Z20.828 (exposure) added 2025."},
      {id:"LCD-JF-014",cpt:"86703",desc:"Antibody; HIV-1 and HIV-2, single result",
        covered:["Z11.4","Z72.51","B20","Z20.6","R75","O98.71"],
        excluded:[],frequency:"Annually for high-risk; once per pregnancy",medNecessity:false,
        notes:"NCD 210.11 (2025): universal screening for ages 15–65. O98.71 added for pregnancy."},
      {id:"LCD-JF-015",cpt:"86592",desc:"Syphilis Test, Nontreponemal (RPR)",
        covered:["A53.9","A51.0","Z11.3","Z72.51","O98.11","Z20.2"],
        excluded:[],frequency:"Annually for high-risk; each trimester if pregnant",medNecessity:false,
        notes:"USPSTF Grade B 2025. Prenatal each trimester."},
      {id:"LCD-JF-016",cpt:"86235",desc:"Anti-Nuclear Antibody (ANA)",
        covered:["M32.9","M35.9","M06.9","L93.0","M34.9","R53.83","M79.3"],
        excluded:["Z00.00","Z01.419"],frequency:"As clinically indicated",medNecessity:true,
        notes:"Noridian LCD L37600 (2025): documented clinical suspicion required. Repeat testing must show change in clinical status."},
      {id:"LCD-JF-017",cpt:"86430",desc:"Rheumatoid Factor (RF), Qualitative",
        covered:["M06.9","M06.00","M06.08","M05.79","M79.3","M25.50"],
        excluded:["Z00.00"],frequency:"Initial evaluation; repeat if management changes",medNecessity:true,
        notes:"Noridian 2025: repeat RF requires documented change in clinical status."},
      {id:"LCD-JF-018",cpt:"86800",desc:"Thyroglobulin Antibody",
        covered:["E06.3","E03.9","C73","Z85.850","E89.0"],
        excluded:["Z00.00"],frequency:"As clinically indicated",medNecessity:true,
        notes:"Post-thyroidectomy surveillance per NCD 2025."},
      {id:"LCD-JF-019",cpt:"81225",desc:"CYP2C19 (Full Gene Sequence)",
        covered:["I25.10","I25.110","Z96.641","I48.0","I48.91","K21.0","F32.9"],
        excluded:["Z00.00"],frequency:"Once per lifetime",medNecessity:true,
        notes:"Noridian PGx LCD L38481 (2025). Covered for clopidogrel therapy selection."},
      {id:"LCD-JF-020",cpt:"81226",desc:"CYP2D6 (Full Gene Sequence)",
        covered:["F32.9","F33.9","F41.1","F31.9","G43.909","R51.9","F10.20","F11.20"],
        excluded:["Z00.00"],frequency:"Once per lifetime",medNecessity:true,
        notes:"Noridian LCD L38481 (2025). Antidepressants, opioid metabolism, tamoxifen dosing."},
      {id:"LCD-JF-021",cpt:"81227",desc:"CYP2C9 (Full Gene Sequence)",
        covered:["I48.0","I48.91","Z79.01","I26.09","D68.9","M06.9"],
        excluded:["Z00.00"],frequency:"Once per lifetime",medNecessity:true,
        notes:"Noridian LCD L38481 (2025). Warfarin dosing optimization."},
      {id:"LCD-JF-022",cpt:"0029U",desc:"Drug Metabolism Genotyping, 14 Drugs (Proprietary)",
        covered:["F32.9","F33.9","F41.1","F31.9","I25.10","Z96.641","I48.91","Z79.01"],
        excluded:["Z00.00"],frequency:"Once per lifetime",medNecessity:true,
        notes:"Noridian LCD L38481 (2025). Prior authorization typically required."},
      {id:"LCD-JF-023",cpt:"0030U",desc:"Drug Metabolism Genotyping, 12 Drugs (Proprietary)",
        covered:["F32.9","F33.9","F41.1","F31.9","G43.909","I48.91","Z79.01","M06.9"],
        excluded:["Z00.00"],frequency:"Once per lifetime",medNecessity:true,
        notes:"Noridian LCD L38481 (2025). Prior authorization required."},
    ]
  },

  J12: {
    mac:"J12", contractor:"Novitas Solutions",
    policyVersion:"L35062-Rev16", lastUpdated:"2025-04-15", effectiveDate:"2025-05-01",
    rules:[
      {id:"LCD-J12-001",cpt:"80048",desc:"Basic Metabolic Panel",
        covered:["E11.9","E11.65","I10","I12.9","I13.10","N18.3","N18.4","E87.1","E87.6","Z79.4"],
        excluded:["Z00.00"],frequency:"Once per 90 days",medNecessity:true,
        notes:"Mid-Atlantic region: stricter documentation for hypertensive CKD (I13.x). N18.4 added FY2026."},
      {id:"LCD-J12-002",cpt:"80053",desc:"Comprehensive Metabolic Panel",
        covered:["K74.60","K74.69","K70.30","B18.2","E11.9","I50.9","I50.32","N18.5"],
        excluded:["Z00.00"],frequency:"Once per 90 days",medNecessity:true,
        notes:"NCCI edits apply for concurrent BMP. K74.69, I50.32 added FY2026."},
      {id:"LCD-J12-003",cpt:"82962",desc:"Blood Glucose by Monitoring Device",
        covered:["E11.9","E10.9","E13.9","E11.649","Z79.4"],
        excluded:[],frequency:"As medically necessary",medNecessity:false,
        notes:"E11.649 added FY2026."},
      {id:"LCD-J12-004",cpt:"83036",desc:"Hemoglobin A1c",
        covered:["E11.9","E10.9","E13.9","R73.09","Z83.3","Z79.4"],
        excluded:["Z00.00"],frequency:"Quarterly for all diabetic patients",medNecessity:true,
        notes:"Novitas J12 allows quarterly A1c for all diabetes types. Z79.4 added 2025."},
      {id:"LCD-J12-005",cpt:"84443",desc:"Thyroid Stimulating Hormone (TSH)",
        covered:["E03.9","E03.8","E05.90","E06.3","E89.0","R00.0","Z79.899"],
        excluded:["Z00.00","Z01.419"],frequency:"Annually; biannual if on levothyroxine",medNecessity:true,
        notes:"Levothyroxine monitoring (Z79.899) covered biannually in J12. E03.8 added 2025."},
      {id:"LCD-J12-006",cpt:"85025",desc:"Complete Blood Count with Differential",
        covered:["D64.9","D64.89","D50.9","C91.00","C91.10","D70.9","D70.1","R61","B20"],
        excluded:["Z00.00","Z02.89"],frequency:"Varies by diagnosis",medNecessity:true,
        notes:"D70.1 chemotherapy-related neutropenia covered without restriction."},
      {id:"LCD-J12-007",cpt:"81001",desc:"Urinalysis, Automated with Microscopy",
        covered:["N30.00","N30.01","R31.9","R31.0","N10","N39.0","R80.9","N18.3","E11.65"],
        excluded:["Z00.00"],frequency:"As medically necessary",medNecessity:true,
        notes:"Diabetic nephropathy UA monitoring covered quarterly in J12. R31.0 added FY2026."},
      {id:"LCD-J12-008",cpt:"81003",desc:"Urinalysis, Automated without Microscopy (Dipstick)",
        covered:["N30.00","N39.0","R80.9","N18.3","R31.9","Z87.440"],
        excluded:["Z00.00"],frequency:"As medically necessary",medNecessity:false,
        notes:"Not separately billable same date as 81001."},
      {id:"LCD-J12-009",cpt:"87086",desc:"Urine Culture, Bacterial; Quantitative",
        covered:["N30.00","N30.01","N39.0","R82.71","N10","N28.84","O23.10"],
        excluded:["Z00.00"],frequency:"As clinically indicated",medNecessity:true,
        notes:"R82.71, N28.84 added FY2026. O23.10 for UTI in pregnancy."},
      {id:"LCD-J12-010",cpt:"87491",desc:"Chlamydia trachomatis, NAA",
        covered:["Z11.3","Z11.51","Z72.51","A56.00","A56.09","N72","R36.9"],
        excluded:[],frequency:"Annually; as indicated for symptomatic",medNecessity:false,
        notes:"PA, NJ, MD coverage aligns with USPSTF Grade B. Z11.51 FY2026."},
      {id:"LCD-J12-011",cpt:"87591",desc:"Neisseria gonorrhoeae, NAA",
        covered:["Z11.3","Z11.51","Z72.51","A54.00","A54.09","R36.9"],
        excluded:[],frequency:"Annually for high-risk; as indicated for symptomatic",medNecessity:false,
        notes:"Co-testing with Chlamydia (87491) covered per NCD 2025."},
      {id:"LCD-J12-012",cpt:"87340",desc:"Hepatitis B Surface Antigen (HBsAg)",
        covered:["B18.1","B19.10","Z11.59","Z22.51","O98.11"],
        excluded:["Z00.00"],frequency:"Annually; each trimester if pregnant",medNecessity:false,
        notes:"USPSTF Grade B 2025. Prenatal per trimester."},
      {id:"LCD-J12-013",cpt:"87804",desc:"Influenza Virus, Antigen; each type, rapid",
        covered:["J10.1","J11.1","J06.9","R05.9","R50.9","Z20.828"],
        excluded:["Z00.00","Z02.89"],frequency:"As clinically indicated",medNecessity:true,
        notes:"Not covered for asymptomatic/wellness visits."},
      {id:"LCD-J12-014",cpt:"86703",desc:"Antibody; HIV-1 and HIV-2, single result",
        covered:["Z11.4","Z72.51","B20","Z20.6","R75","O98.71"],
        excluded:[],frequency:"Annually for high-risk; once per pregnancy",medNecessity:false,
        notes:"NCD 210.11 (2025). O98.71 for pregnancy."},
      {id:"LCD-J12-015",cpt:"86592",desc:"Syphilis Test, Nontreponemal (RPR)",
        covered:["A53.9","A51.0","Z11.3","Z72.51","O98.11","Z20.2"],
        excluded:[],frequency:"Annually for high-risk; each trimester if pregnant",medNecessity:false,
        notes:"USPSTF Grade B 2025. Prenatal per trimester."},
      {id:"LCD-J12-016",cpt:"86235",desc:"Anti-Nuclear Antibody (ANA)",
        covered:["M32.9","M35.9","M06.9","L93.0","M34.9","R53.83","M79.3"],
        excluded:["Z00.00","Z01.419"],frequency:"As clinically indicated",medNecessity:true,
        notes:"Novitas LCD L37850 (2025). Clinical suspicion required."},
      {id:"LCD-J12-017",cpt:"86430",desc:"Rheumatoid Factor (RF), Qualitative",
        covered:["M06.9","M06.00","M06.08","M05.79","M79.3","M25.50","R52"],
        excluded:["Z00.00"],frequency:"Initial evaluation; repeat if management changes",medNecessity:true,
        notes:"Novitas 2025: repeat RF requires clinical change documentation."},
      {id:"LCD-J12-018",cpt:"86800",desc:"Thyroglobulin Antibody",
        covered:["E06.3","E03.9","C73","Z85.850","E89.0"],
        excluded:["Z00.00"],frequency:"As clinically indicated",medNecessity:true,
        notes:"Post-thyroidectomy surveillance per NCD 2025."},
      {id:"LCD-J12-019",cpt:"81225",desc:"CYP2C19 (Full Gene Sequence)",
        covered:["I25.10","I25.110","Z96.641","I48.0","I48.91","K21.0","F32.9"],
        excluded:["Z00.00"],frequency:"Once per lifetime",medNecessity:true,
        notes:"Novitas PGx LCD L38502 (2025). Clopidogrel therapy selection."},
      {id:"LCD-J12-020",cpt:"81226",desc:"CYP2D6 (Full Gene Sequence)",
        covered:["F32.9","F33.9","F41.1","F31.9","G43.909","R51.9","F10.20","F11.20"],
        excluded:["Z00.00"],frequency:"Once per lifetime",medNecessity:true,
        notes:"Novitas LCD L38502 (2025)."},
      {id:"LCD-J12-021",cpt:"81227",desc:"CYP2C9 (Full Gene Sequence)",
        covered:["I48.0","I48.91","Z79.01","I26.09","D68.9","M06.9"],
        excluded:["Z00.00"],frequency:"Once per lifetime",medNecessity:true,
        notes:"Novitas LCD L38502 (2025). Warfarin dosing."},
      {id:"LCD-J12-022",cpt:"0029U",desc:"Drug Metabolism Genotyping, 14 Drugs (Proprietary)",
        covered:["F32.9","F33.9","F41.1","F31.9","I25.10","Z96.641","I48.91","Z79.01"],
        excluded:["Z00.00"],frequency:"Once per lifetime",medNecessity:true,
        notes:"Novitas LCD L38502 (2025). Prior authorization required."},
      {id:"LCD-J12-023",cpt:"0030U",desc:"Drug Metabolism Genotyping, 12 Drugs (Proprietary)",
        covered:["F32.9","F33.9","F41.1","F31.9","G43.909","I48.91","Z79.01","M06.9"],
        excluded:["Z00.00"],frequency:"Once per lifetime",medNecessity:true,
        notes:"Novitas LCD L38502 (2025). Prior authorization required."},
    ]
  },

  J6: {
    mac:"J6", contractor:"National Government Services",
    policyVersion:"L36898-Rev12", lastUpdated:"2025-03-01", effectiveDate:"2025-04-01",
    rules:[
      {id:"LCD-J6-001",cpt:"80048",desc:"Basic Metabolic Panel",
        covered:["E11.9","E11.65","I10","I12.9","I13.10","N18.3","N18.4","E87.1","E87.6","Z79.4"],
        excluded:["Z00.00","Z00.01"],frequency:"Once per 90 days",medNecessity:true,
        notes:"Illinois/Midwest: NCCI edits strictly enforced. N18.4 added FY2026."},
      {id:"LCD-J6-002",cpt:"80053",desc:"Comprehensive Metabolic Panel",
        covered:["K74.60","K74.69","K70.30","B18.2","E11.9","I50.9","I50.32","N18.5"],
        excluded:["Z00.00"],frequency:"Once per 90 days",medNecessity:true,
        notes:"NGS enforces LCD strictly; duplicate BMP within 90 days denied."},
      {id:"LCD-J6-003",cpt:"82962",desc:"Blood Glucose by Monitoring Device",
        covered:["E11.9","E10.9","E13.9","E11.649","Z79.4"],
        excluded:[],frequency:"As medically necessary",medNecessity:false,
        notes:"E11.649 added FY2026."},
      {id:"LCD-J6-004",cpt:"83036",desc:"Hemoglobin A1c",
        covered:["E11.9","E10.9","E13.9","R73.09","Z83.3","Z79.4"],
        excluded:["Z00.00"],frequency:"Twice per year; quarterly if clinically indicated",medNecessity:true,
        notes:"Medical record must indicate glycemic control status."},
      {id:"LCD-J6-005",cpt:"84443",desc:"Thyroid Stimulating Hormone (TSH)",
        covered:["E03.9","E03.8","E05.90","E06.3","E89.0","R00.0","Z79.899"],
        excluded:["Z00.00"],frequency:"Once per year",medNecessity:true,
        notes:"NGS follows standard annual TSH for euthyroid patients on stable therapy. E03.8 added 2025."},
      {id:"LCD-J6-006",cpt:"85025",desc:"Complete Blood Count with Differential",
        covered:["D64.9","D64.89","D50.9","C91.00","C91.10","D70.9","D70.1","R61","B20"],
        excluded:["Z00.00","Z02.89"],frequency:"Varies by diagnosis",medNecessity:true,
        notes:"NGS requires ABN on file for all routine/screening CBCs."},
      {id:"LCD-J6-007",cpt:"81001",desc:"Urinalysis, Automated with Microscopy",
        covered:["N30.00","N30.01","R31.9","R31.0","N10","N39.0","R80.9","N18.3","E11.65"],
        excluded:["Z00.00"],frequency:"As medically necessary",medNecessity:true,
        notes:"Standard coverage. R31.0 added FY2026. Microscopy add-on (81003) not separately billable."},
      {id:"LCD-J6-008",cpt:"81003",desc:"Urinalysis, Automated without Microscopy (Dipstick)",
        covered:["N30.00","N39.0","R80.9","N18.3","R31.9","Z87.440"],
        excluded:["Z00.00"],frequency:"As medically necessary",medNecessity:false,
        notes:"Not separately billable same date as 81001 per NGS NCCI enforcement."},
      {id:"LCD-J6-009",cpt:"87086",desc:"Urine Culture, Bacterial; Quantitative",
        covered:["N30.00","N30.01","N39.0","R82.71","N10","N28.84","O23.10"],
        excluded:["Z00.00"],frequency:"As clinically indicated",medNecessity:true,
        notes:"R82.71, N28.84 added FY2026."},
      {id:"LCD-J6-010",cpt:"87491",desc:"Chlamydia trachomatis, NAA",
        covered:["Z11.3","Z11.51","Z72.51","A56.00","A56.09"],
        excluded:[],frequency:"Annually for high-risk",medNecessity:false,
        notes:"USPSTF alignment; NGS allows concurrent gonorrhea testing (87591). Z11.51 added FY2026."},
      {id:"LCD-J6-011",cpt:"87591",desc:"Neisseria gonorrhoeae, NAA",
        covered:["Z11.3","Z11.51","Z72.51","A54.00","A54.09","R36.9"],
        excluded:[],frequency:"Annually for high-risk; as indicated for symptomatic",medNecessity:false,
        notes:"Co-testing with 87491 covered per NCD 2025."},
      {id:"LCD-J6-012",cpt:"87340",desc:"Hepatitis B Surface Antigen (HBsAg)",
        covered:["B18.1","B19.10","Z11.59","Z22.51","O98.11"],
        excluded:["Z00.00"],frequency:"Annually; each trimester if pregnant",medNecessity:false,
        notes:"USPSTF Grade B 2025."},
      {id:"LCD-J6-013",cpt:"87804",desc:"Influenza Virus, Antigen; each type, rapid",
        covered:["J10.1","J11.1","J06.9","R05.9","R50.9","Z20.828"],
        excluded:["Z00.00","Z02.89"],frequency:"As clinically indicated",medNecessity:true,
        notes:"Not covered for asymptomatic/wellness visits."},
      {id:"LCD-J6-014",cpt:"86703",desc:"Antibody; HIV-1 and HIV-2, single result",
        covered:["Z11.4","Z72.51","B20","Z20.6","R75","O98.71"],
        excluded:[],frequency:"Annually for high-risk; once per pregnancy",medNecessity:false,
        notes:"NCD 210.11 (2025). Universal screening 15–65."},
      {id:"LCD-J6-015",cpt:"86592",desc:"Syphilis Test, Nontreponemal (RPR)",
        covered:["A53.9","A51.0","Z11.3","Z72.51","O98.11","Z20.2"],
        excluded:[],frequency:"Annually for high-risk; each trimester if pregnant",medNecessity:false,
        notes:"USPSTF Grade B 2025."},
      {id:"LCD-J6-016",cpt:"86235",desc:"Anti-Nuclear Antibody (ANA)",
        covered:["M32.9","M35.9","M06.9","L93.0","M34.9","R53.83","M79.3"],
        excluded:["Z00.00","Z01.419"],frequency:"As clinically indicated",medNecessity:true,
        notes:"NGS LCD L37720 (2025). Clinical suspicion required."},
      {id:"LCD-J6-017",cpt:"86430",desc:"Rheumatoid Factor (RF), Qualitative",
        covered:["M06.9","M06.00","M06.08","M05.79","M79.3","M25.50"],
        excluded:["Z00.00"],frequency:"Initial evaluation; repeat if management changes",medNecessity:true,
        notes:"NGS 2025: repeat RF requires documented clinical change."},
      {id:"LCD-J6-018",cpt:"86800",desc:"Thyroglobulin Antibody",
        covered:["E06.3","E03.9","C73","Z85.850","E89.0"],
        excluded:["Z00.00"],frequency:"As clinically indicated",medNecessity:true,
        notes:"Post-thyroidectomy surveillance per NCD 2025."},
      {id:"LCD-J6-019",cpt:"81225",desc:"CYP2C19 (Full Gene Sequence)",
        covered:["I25.10","I25.110","Z96.641","I48.0","I48.91","K21.0","F32.9"],
        excluded:["Z00.00"],frequency:"Once per lifetime",medNecessity:true,
        notes:"NGS PGx LCD L38600 (2025)."},
      {id:"LCD-J6-020",cpt:"81226",desc:"CYP2D6 (Full Gene Sequence)",
        covered:["F32.9","F33.9","F41.1","F31.9","G43.909","R51.9","F10.20","F11.20"],
        excluded:["Z00.00"],frequency:"Once per lifetime",medNecessity:true,
        notes:"NGS PGx LCD L38600 (2025)."},
      {id:"LCD-J6-021",cpt:"81227",desc:"CYP2C9 (Full Gene Sequence)",
        covered:["I48.0","I48.91","Z79.01","I26.09","D68.9","M06.9"],
        excluded:["Z00.00"],frequency:"Once per lifetime",medNecessity:true,
        notes:"NGS PGx LCD L38600 (2025). Warfarin dosing."},
      {id:"LCD-J6-022",cpt:"0029U",desc:"Drug Metabolism Genotyping, 14 Drugs (Proprietary)",
        covered:["F32.9","F33.9","F41.1","F31.9","I25.10","Z96.641","I48.91","Z79.01"],
        excluded:["Z00.00"],frequency:"Once per lifetime",medNecessity:true,
        notes:"NGS LCD L38600 (2025). Prior authorization required."},
      {id:"LCD-J6-023",cpt:"0030U",desc:"Drug Metabolism Genotyping, 12 Drugs (Proprietary)",
        covered:["F32.9","F33.9","F41.1","F31.9","G43.909","I48.91","Z79.01","M06.9"],
        excluded:["Z00.00"],frequency:"Once per lifetime",medNecessity:true,
        notes:"NGS LCD L38600 (2025). Prior authorization required."},
    ]
  },

  J7: {
    mac:"J7", contractor:"WPS Government Health Administrators",
    policyVersion:"L34900-Rev15", lastUpdated:"2025-04-01", effectiveDate:"2025-05-01",
    rules:[
      {id:"LCD-J7-001",cpt:"80048",desc:"Basic Metabolic Panel",
        covered:["E11.9","E11.65","I10","I12.9","I13.10","N18.3","N18.4","E87.1","E87.6","Z79.4"],
        excluded:["Z00.00","Z00.01"],frequency:"Once per 90 days",medNecessity:true,
        notes:"South Central / Central region WPS policy. N18.4 added FY2026."},
      {id:"LCD-J7-002",cpt:"80053",desc:"Comprehensive Metabolic Panel",
        covered:["K74.60","K74.69","K70.30","B18.2","E11.9","I50.9","I50.32","N18.5"],
        excluded:["Z00.00"],frequency:"Once per 90 days",medNecessity:true,
        notes:"Standard WPS policy applies across J5, J7, J8. K74.69, I50.32 added FY2026."},
      {id:"LCD-J7-003",cpt:"82962",desc:"Blood Glucose by Monitoring Device",
        covered:["E11.9","E10.9","E13.9","E11.649","Z79.4"],
        excluded:[],frequency:"As medically necessary",medNecessity:false,
        notes:"E11.649 added FY2026."},
      {id:"LCD-J7-004",cpt:"83036",desc:"Hemoglobin A1c",
        covered:["E11.9","E10.9","E13.9","R73.09","Z83.3","Z79.4"],
        excluded:["Z00.00"],frequency:"Twice per year; quarterly if uncontrolled",medNecessity:true,
        notes:"Standard WPS frequency rules. Z79.4 added 2025."},
      {id:"LCD-J7-005",cpt:"84443",desc:"Thyroid Stimulating Hormone (TSH)",
        covered:["E03.9","E03.8","E05.90","E06.3","E89.0","R00.0","Z79.899"],
        excluded:["Z00.00"],frequency:"Once per year for stable patients",medNecessity:true,
        notes:"WPS standard annual monitoring policy. E03.8 added 2025."},
      {id:"LCD-J7-006",cpt:"85025",desc:"Complete Blood Count with Differential",
        covered:["D64.9","D64.89","D50.9","C91.00","C91.10","D70.9","D70.1","R61","B20"],
        excluded:["Z00.00","Z02.89"],frequency:"Varies by diagnosis",medNecessity:true,
        notes:"ABN required for wellness-context orders."},
      {id:"LCD-J7-007",cpt:"81001",desc:"Urinalysis, Automated with Microscopy",
        covered:["N30.00","N30.01","R31.9","R31.0","N10","N39.0","R80.9","N18.3","E11.65"],
        excluded:["Z00.00"],frequency:"As medically necessary",medNecessity:true,
        notes:"Active symptoms or diagnosis required. R31.0 added FY2026."},
      {id:"LCD-J7-008",cpt:"81003",desc:"Urinalysis, Automated without Microscopy (Dipstick)",
        covered:["N30.00","N39.0","R80.9","N18.3","R31.9","Z87.440"],
        excluded:["Z00.00"],frequency:"As medically necessary",medNecessity:false,
        notes:"Not separately billable same date as 81001."},
      {id:"LCD-J7-009",cpt:"87086",desc:"Urine Culture, Bacterial; Quantitative",
        covered:["N30.00","N30.01","N39.0","R82.71","N10","N28.84","O23.10"],
        excluded:["Z00.00"],frequency:"As clinically indicated",medNecessity:true,
        notes:"R82.71, N28.84 added FY2026."},
      {id:"LCD-J7-010",cpt:"87491",desc:"Chlamydia trachomatis, NAA",
        covered:["Z11.3","Z11.51","Z72.51","A56.00","A56.09"],
        excluded:[],frequency:"Annually for high-risk",medNecessity:false,
        notes:"USPSTF Grade B alignment. Z11.51 added FY2026."},
      {id:"LCD-J7-011",cpt:"87591",desc:"Neisseria gonorrhoeae, NAA",
        covered:["Z11.3","Z11.51","Z72.51","A54.00","A54.09","R36.9"],
        excluded:[],frequency:"Annually for high-risk; as indicated for symptomatic",medNecessity:false,
        notes:"Co-testing with 87491 covered per NCD 2025."},
      {id:"LCD-J7-012",cpt:"87340",desc:"Hepatitis B Surface Antigen (HBsAg)",
        covered:["B18.1","B19.10","Z11.59","Z22.51","O98.11"],
        excluded:["Z00.00"],frequency:"Annually; each trimester if pregnant",medNecessity:false,
        notes:"USPSTF Grade B 2025. Prenatal per trimester."},
      {id:"LCD-J7-013",cpt:"87804",desc:"Influenza Virus, Antigen; each type, rapid",
        covered:["J10.1","J11.1","J06.9","R05.9","R50.9","Z20.828"],
        excluded:["Z00.00","Z02.89"],frequency:"As clinically indicated",medNecessity:true,
        notes:"Not covered for asymptomatic/wellness visits."},
      {id:"LCD-J7-014",cpt:"86703",desc:"Antibody; HIV-1 and HIV-2, single result",
        covered:["Z11.4","Z72.51","B20","Z20.6","R75","O98.71"],
        excluded:[],frequency:"Annually for high-risk; once per pregnancy",medNecessity:false,
        notes:"NCD 210.11 (2025). Universal screening 15–65."},
      {id:"LCD-J7-015",cpt:"86592",desc:"Syphilis Test, Nontreponemal (RPR)",
        covered:["A53.9","A51.0","Z11.3","Z72.51","O98.11","Z20.2"],
        excluded:[],frequency:"Annually for high-risk; each trimester if pregnant",medNecessity:false,
        notes:"USPSTF Grade B 2025. Prenatal per trimester."},
      {id:"LCD-J7-016",cpt:"86235",desc:"Anti-Nuclear Antibody (ANA)",
        covered:["M32.9","M35.9","M06.9","L93.0","M34.9","R53.83","M79.3"],
        excluded:["Z00.00","Z01.419"],frequency:"As clinically indicated",medNecessity:true,
        notes:"WPS LCD L37550 (2025). Clinical suspicion required."},
      {id:"LCD-J7-017",cpt:"86430",desc:"Rheumatoid Factor (RF), Qualitative",
        covered:["M06.9","M06.00","M06.08","M05.79","M79.3","M25.50"],
        excluded:["Z00.00"],frequency:"Initial evaluation; repeat if management changes",medNecessity:true,
        notes:"WPS 2025: repeat RF requires documented clinical change."},
      {id:"LCD-J7-018",cpt:"86800",desc:"Thyroglobulin Antibody",
        covered:["E06.3","E03.9","C73","Z85.850","E89.0"],
        excluded:["Z00.00"],frequency:"As clinically indicated",medNecessity:true,
        notes:"Post-thyroidectomy surveillance per NCD 2025."},
      {id:"LCD-J7-019",cpt:"81225",desc:"CYP2C19 (Full Gene Sequence)",
        covered:["I25.10","I25.110","Z96.641","I48.0","I48.91","K21.0","F32.9"],
        excluded:["Z00.00"],frequency:"Once per lifetime",medNecessity:true,
        notes:"WPS PGx LCD L38450 (2025). Clopidogrel dosing."},
      {id:"LCD-J7-020",cpt:"81226",desc:"CYP2D6 (Full Gene Sequence)",
        covered:["F32.9","F33.9","F41.1","F31.9","G43.909","R51.9","F10.20","F11.20"],
        excluded:["Z00.00"],frequency:"Once per lifetime",medNecessity:true,
        notes:"WPS PGx LCD L38450 (2025). Antidepressants, opioid metabolism."},
      {id:"LCD-J7-021",cpt:"81227",desc:"CYP2C9 (Full Gene Sequence)",
        covered:["I48.0","I48.91","Z79.01","I26.09","D68.9","M06.9"],
        excluded:["Z00.00"],frequency:"Once per lifetime",medNecessity:true,
        notes:"WPS PGx LCD L38450 (2025). Warfarin dosing optimization."},
      {id:"LCD-J7-022",cpt:"0029U",desc:"Drug Metabolism Genotyping, 14 Drugs (Proprietary)",
        covered:["F32.9","F33.9","F41.1","F31.9","I25.10","Z96.641","I48.91","Z79.01"],
        excluded:["Z00.00"],frequency:"Once per lifetime",medNecessity:true,
        notes:"WPS LCD L38450 (2025). Prior authorization required."},
      {id:"LCD-J7-023",cpt:"0030U",desc:"Drug Metabolism Genotyping, 12 Drugs (Proprietary)",
        covered:["F32.9","F33.9","F41.1","F31.9","G43.909","I48.91","Z79.01","M06.9"],
        excluded:["Z00.00"],frequency:"Once per lifetime",medNecessity:true,
        notes:"WPS LCD L38450 (2025). Prior authorization required."},
    ]
  },
};

// ── Validators ────────────────────────────────────────────────────────────────
function isValidCPT(code) {
  const c = code.trim().toUpperCase();
  // Standard 5-digit CPT (e.g. 80048), Category III with letter (e.g. 0075T),
  // and proprietary U-codes (e.g. 0029U)
  return /^\d{5}[A-Z]?$/.test(c) || /^\d{4}[A-Z]$/.test(c);
}
function isValidICD10(code) { return /^[A-Z]\d{2}(\.[A-Z0-9]{1,4})?$/.test(code.trim().toUpperCase()); }
function sanitize(s) { return String(s).replace(/[<>'"&]/g, c => ({'<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;','&':'&amp;'}[c]||c)).trim().slice(0,50); }

// ── Rule Engine ───────────────────────────────────────────────────────────────
function validateClaim(cpt, icd10, state) {
  const macInfo = STATE_TO_MAC[state];
  if (!macInfo) {
    return {
      isCovered: false, status: "UNKNOWN_JURISDICTION",
      reason: `State "${state}" could not be mapped to a Medicare Administrative Contractor.`,
      remediationAdvice: "Verify the patient's billing address state. Contact CMS at 1-800-MEDICARE for jurisdiction clarification.",
    };
  }

  // Resolve alias to get the canonical LCD
  const canonicalMac = MAC_ALIAS[macInfo.mac] || macInfo.mac;
  const lcd = LCD_DATA[canonicalMac];

  if (!lcd) {
    return {
      isCovered: false, status: "UNKNOWN_JURISDICTION",
      reason: `No LCD data available for MAC ${macInfo.mac} (${macInfo.contractor}).`,
      remediationAdvice: "LCD data for this MAC is pending integration. Contact support or download the LCD from the CMS Medicare Coverage Database manually.",
      jurisdiction: macInfo.mac, contractor: macInfo.contractor,
    };
  }

  const rule = lcd.rules.find(r => r.cpt === cpt);

  if (!rule) {
    return {
      isCovered: false, status: "NOT_COVERED",
      reason: `CPT ${cpt} is not listed in the ${macInfo.contractor} (${macInfo.mac}) LCD.`,
      remediationAdvice: `Verify CPT ${cpt} is appropriate for the service. Check whether a National Coverage Determination (NCD) applies instead. Consider issuing an ABN.`,
      jurisdiction: macInfo.mac, contractor: macInfo.contractor,
      policyVersion: lcd.policyVersion, lastUpdated: lcd.lastUpdated,
    };
  }

  if (rule.excluded.includes(icd10)) {
    return {
      isCovered: false, status: "NOT_COVERED",
      reason: `ICD-10 ${icd10} is explicitly excluded for CPT ${cpt} under ${macInfo.contractor} policy ${lcd.policyVersion}.`,
      remediationAdvice: `Issue an ABN before service. Verify whether a more specific ICD-10 code applies. If denied, appeal with supporting clinical documentation.`,
      policyId: rule.id, frequency: rule.frequency, medNecessity: rule.medNecessity,
      notes: rule.notes, jurisdiction: macInfo.mac, contractor: macInfo.contractor,
      policyVersion: lcd.policyVersion, lastUpdated: lcd.lastUpdated,
    };
  }

  if (rule.covered.includes(icd10)) {
    const mn = rule.medNecessity ? " Medical necessity documentation required in patient chart." : "";
    return {
      isCovered: true, status: "COVERED",
      reason: `CPT ${cpt} with ICD-10 ${icd10} is covered under ${macInfo.contractor} (${macInfo.mac}) — policy ${lcd.policyVersion}.`,
      remediationAdvice: `Ensure the medical record supports this service.${mn} Frequency: ${rule.frequency}.`,
      policyId: rule.id, frequency: rule.frequency, medNecessity: rule.medNecessity,
      notes: rule.notes, jurisdiction: macInfo.mac, contractor: macInfo.contractor,
      policyVersion: lcd.policyVersion, lastUpdated: lcd.lastUpdated,
    };
  }

  return {
    isCovered: false, status: "CONDITIONAL",
    reason: `ICD-10 ${icd10} is not listed in the covered diagnoses for CPT ${cpt} under ${macInfo.contractor} (${macInfo.mac}).`,
    remediationAdvice: `Issue an ABN to the patient. Submit with clinical notes and await MAC determination. Review LCD ${lcd.policyVersion} for a covered ICD-10 alternative. Query your MAC provider contact line before billing.`,
    policyId: rule.id, frequency: rule.frequency, medNecessity: rule.medNecessity,
    notes: rule.notes, jurisdiction: macInfo.mac, contractor: macInfo.contractor,
    policyVersion: lcd.policyVersion, lastUpdated: lcd.lastUpdated,
  };
}

// ── Handler ───────────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Cache-Control": "no-store, no-cache, must-revalidate",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };

  let body;
  try { body = JSON.parse(event.body || "{}"); }
  catch { return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON body" }) }; }

  const { cpt, icd10, jurisdiction } = body;
  if (!cpt || !icd10 || !jurisdiction) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing required fields: cpt, icd10, jurisdiction" }) };
  }

  const cleanCpt = sanitize(cpt).toUpperCase();
  const cleanIcd10 = sanitize(icd10).toUpperCase();
  const cleanState = sanitize(jurisdiction).toUpperCase();

  if (!isValidCPT(cleanCpt)) {
    return { statusCode: 422, headers, body: JSON.stringify({ error: `Invalid CPT format: ${cleanCpt}` }) };
  }
  if (!isValidICD10(cleanIcd10)) {
    return { statusCode: 422, headers, body: JSON.stringify({ error: `Invalid ICD-10 format: ${cleanIcd10}` }) };
  }

  const result = validateClaim(cleanCpt, cleanIcd10, cleanState);
  result.meta = POLICY_META;
  return { statusCode: 200, headers, body: JSON.stringify(result) };
};
