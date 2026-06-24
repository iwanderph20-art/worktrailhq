// LabCompliance Pro — LCD Rule Engine (Netlify Serverless Function)
// Update coverage rules here without redeploying the UI.
// LCD data is versioned per MAC. Add new MACs by adding a new key to LCD_DATA.

const POLICY_META = {
  systemVersion: "2.4.1",
  lastAudit: "2024-10-01",
  nextScheduledUpdate: "2025-01-01",
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
// To update: edit the coveredIcd10 / nonCoveredIcd10 arrays and bump policyVersion.
// To add a new MAC: add a new top-level key matching the mac code.
const LCD_DATA = {
  JJ: {
    mac:"JJ", contractor:"Palmetto GBA",
    policyVersion:"L36021-Rev12", lastUpdated:"2024-09-15", effectiveDate:"2024-10-01",
    rules:[
      {id:"LCD-JJ-001",cpt:"80048",desc:"Basic Metabolic Panel",
        covered:["E11.9","I10","N18.3","E87.1","E87.6","Z79.4","I12.9"],
        excluded:["Z00.00","Z00.01"],frequency:"Once per 90 days",medNecessity:true,
        notes:"Requires documented medical necessity for E/M service on same date"},
      {id:"LCD-JJ-002",cpt:"80053",desc:"Comprehensive Metabolic Panel",
        covered:["K74.60","K70.30","B18.2","E11.9","I50.9","N18.5"],
        excluded:["Z00.00"],frequency:"Once per 90 days",medNecessity:true,
        notes:"Hepatic function panel components billed separately if standalone"},
      {id:"LCD-JJ-003",cpt:"85025",desc:"Complete Blood Count with Differential",
        covered:["D64.9","D50.9","C91.00","D70.9","R61","B20"],
        excluded:["Z00.00","Z02.89"],frequency:"Varies by diagnosis",medNecessity:true,
        notes:"Routine screening not covered without documented symptom or diagnosis"},
      {id:"LCD-JJ-004",cpt:"82962",desc:"Blood Glucose by Monitoring Device",
        covered:["E11.9","E10.9","E13.9","E11.65","Z79.4"],
        excluded:[],frequency:"As medically necessary",medNecessity:false,
        notes:"SMBG for documented diabetes only"},
      {id:"LCD-JJ-005",cpt:"83036",desc:"Hemoglobin A1c",
        covered:["E11.9","E10.9","E13.9","R73.09","Z83.3"],
        excluded:["Z00.00"],frequency:"Twice per year; quarterly if uncontrolled",medNecessity:true,
        notes:"Frequency based on glycemic control status"},
      {id:"LCD-JJ-006",cpt:"84443",desc:"Thyroid Stimulating Hormone (TSH)",
        covered:["E03.9","E05.90","E06.3","R00.0","Z79.899"],
        excluded:["Z00.00","Z01.419"],frequency:"Once per year for stable patients",medNecessity:true,
        notes:"Initial evaluation or monitoring of known thyroid disorder"},
      {id:"LCD-JJ-007",cpt:"87491",desc:"Chlamydia trachomatis, NAA",
        covered:["Z11.3","Z72.51","A56.00","N72","R36.9"],
        excluded:[],frequency:"Annually for high-risk; as indicated for symptomatic",medNecessity:false,
        notes:"USPSTF Grade B — sexually active females ≤24"},
      {id:"LCD-JJ-008",cpt:"81001",desc:"Urinalysis, Automated with Microscopy",
        covered:["N30.00","R31.9","N10","R80.9","N18.3","E11.65"],
        excluded:["Z00.00"],frequency:"As medically necessary",medNecessity:true,
        notes:"Must be ordered in context of active signs/symptoms"},
    ]
  },
  JF: {
    mac:"JF", contractor:"Noridian Healthcare Solutions",
    policyVersion:"L35062-Rev09", lastUpdated:"2024-08-20", effectiveDate:"2024-09-01",
    rules:[
      {id:"LCD-JF-001",cpt:"80048",desc:"Basic Metabolic Panel",
        covered:["E11.9","I10","N18.3","E87.1","E87.6","Z79.4","I12.9"],
        excluded:["Z00.00","Z00.01"],frequency:"Once per 90 days",medNecessity:true,
        notes:"Electrolyte monitoring required for documented CKD or HTN"},
      {id:"LCD-JF-002",cpt:"80053",desc:"Comprehensive Metabolic Panel",
        covered:["K74.60","K70.30","B18.2","E11.9","I50.9","N18.5","K76.0"],
        excluded:["Z00.00"],frequency:"Once per 90 days",medNecessity:true,
        notes:"Noridian requires documented rationale when ordered with LFTs same date"},
      {id:"LCD-JF-003",cpt:"85025",desc:"Complete Blood Count with Differential",
        covered:["D64.9","D50.9","C91.00","D70.9","R61","B20","D75.9"],
        excluded:["Z00.00","Z02.89"],frequency:"Varies by diagnosis",medNecessity:true,
        notes:"JF MAC requires ABN for routine/screening CBCs"},
      {id:"LCD-JF-004",cpt:"83036",desc:"Hemoglobin A1c",
        covered:["E11.9","E10.9","E13.9","R73.09"],
        excluded:["Z00.00","Z83.3"],frequency:"Twice per year; quarterly if uncontrolled",medNecessity:true,
        notes:"Noridian does not cover A1c for family history alone (Z83.3)"},
      {id:"LCD-JF-005",cpt:"84443",desc:"Thyroid Stimulating Hormone (TSH)",
        covered:["E03.9","E05.90","E06.3","R00.0","Z79.899","E89.0"],
        excluded:["Z00.00"],frequency:"Twice per year for stable patients on therapy",medNecessity:true,
        notes:"Post-thyroidectomy monitoring covered quarterly for first year"},
      {id:"LCD-JF-006",cpt:"87491",desc:"Chlamydia trachomatis, NAA",
        covered:["Z11.3","Z72.51","A56.00"],
        excluded:[],frequency:"Annually for high-risk",medNecessity:false,
        notes:"USPSTF alignment; risk documentation required"},
      {id:"LCD-JF-007",cpt:"81001",desc:"Urinalysis, Automated with Microscopy",
        covered:["N30.00","R31.9","N10","R80.9","N18.3"],
        excluded:["Z00.00","E11.65"],frequency:"As medically necessary",medNecessity:true,
        notes:"JF MAC excludes diabetic nephropathy monitoring without active symptoms"},
    ]
  },
  J12: {
    mac:"J12", contractor:"Novitas Solutions",
    policyVersion:"L35062-Rev11", lastUpdated:"2024-09-01", effectiveDate:"2024-10-01",
    rules:[
      {id:"LCD-J12-001",cpt:"80048",desc:"Basic Metabolic Panel",
        covered:["E11.9","I10","N18.3","E87.1","E87.6","Z79.4","I13.10"],
        excluded:["Z00.00"],frequency:"Once per 90 days",medNecessity:true,
        notes:"Mid-Atlantic region: stricter documentation for hypertensive CKD (I13.x)"},
      {id:"LCD-J12-002",cpt:"80053",desc:"Comprehensive Metabolic Panel",
        covered:["K74.60","K70.30","B18.2","E11.9","I50.9","N18.5"],
        excluded:["Z00.00"],frequency:"Once per 90 days",medNecessity:true,
        notes:"NCCI edits apply for concurrent BMP"},
      {id:"LCD-J12-003",cpt:"85025",desc:"Complete Blood Count with Differential",
        covered:["D64.9","D50.9","C91.00","D70.9","R61","B20"],
        excluded:["Z00.00","Z02.89"],frequency:"Varies by diagnosis",medNecessity:true,
        notes:"Chemotherapy-related neutropenia (D70.1) covered without restriction"},
      {id:"LCD-J12-004",cpt:"83036",desc:"Hemoglobin A1c",
        covered:["E11.9","E10.9","E13.9","R73.09","Z83.3"],
        excluded:["Z00.00"],frequency:"Quarterly for all diabetic patients",medNecessity:true,
        notes:"Novitas J12 allows quarterly A1c for all diabetes types"},
      {id:"LCD-J12-005",cpt:"84443",desc:"Thyroid Stimulating Hormone (TSH)",
        covered:["E03.9","E05.90","E06.3","R00.0","Z79.899"],
        excluded:["Z00.00","Z01.419"],frequency:"Annually; biannual if on levothyroxine",medNecessity:true,
        notes:"Levothyroxine monitoring (Z79.899) covered biannually in J12"},
      {id:"LCD-J12-006",cpt:"87491",desc:"Chlamydia trachomatis, NAA",
        covered:["Z11.3","Z72.51","A56.00","N72","R36.9"],
        excluded:[],frequency:"Annually; as indicated for symptomatic",medNecessity:false,
        notes:"PA, NJ, MD coverage aligns with USPSTF Grade B"},
      {id:"LCD-J12-007",cpt:"81001",desc:"Urinalysis, Automated with Microscopy",
        covered:["N30.00","R31.9","N10","R80.9","N18.3","E11.65"],
        excluded:["Z00.00"],frequency:"As medically necessary",medNecessity:true,
        notes:"Diabetic nephropathy UA monitoring covered quarterly in J12"},
    ]
  },
  J6: {
    mac:"J6", contractor:"National Government Services",
    policyVersion:"L36898-Rev07", lastUpdated:"2024-07-15", effectiveDate:"2024-08-01",
    rules:[
      {id:"LCD-J6-001",cpt:"80048",desc:"Basic Metabolic Panel",
        covered:["E11.9","I10","N18.3","E87.1","E87.6","Z79.4"],
        excluded:["Z00.00","Z00.01"],frequency:"Once per 90 days",medNecessity:true,
        notes:"Illinois/Midwest: NCCI edits strictly enforced"},
      {id:"LCD-J6-002",cpt:"80053",desc:"Comprehensive Metabolic Panel",
        covered:["K74.60","K70.30","B18.2","E11.9","I50.9","N18.5"],
        excluded:["Z00.00"],frequency:"Once per 90 days",medNecessity:true,
        notes:"NGS enforces LCD strictly; duplicate BMP within 90 days denied"},
      {id:"LCD-J6-003",cpt:"85025",desc:"Complete Blood Count with Differential",
        covered:["D64.9","D50.9","C91.00","D70.9","R61","B20"],
        excluded:["Z00.00","Z02.89"],frequency:"Varies by diagnosis",medNecessity:true,
        notes:"NGS requires ABN on file for all routine/screening CBCs"},
      {id:"LCD-J6-004",cpt:"83036",desc:"Hemoglobin A1c",
        covered:["E11.9","E10.9","E13.9","R73.09","Z83.3"],
        excluded:["Z00.00"],frequency:"Twice per year; quarterly if clinically indicated",medNecessity:true,
        notes:"Medical record must indicate glycemic control status for frequency"},
      {id:"LCD-J6-005",cpt:"84443",desc:"Thyroid Stimulating Hormone (TSH)",
        covered:["E03.9","E05.90","E06.3","R00.0","Z79.899"],
        excluded:["Z00.00"],frequency:"Once per year",medNecessity:true,
        notes:"NGS follows standard annual TSH for euthyroid patients on stable therapy"},
      {id:"LCD-J6-006",cpt:"87491",desc:"Chlamydia trachomatis, NAA",
        covered:["Z11.3","Z72.51","A56.00"],
        excluded:[],frequency:"Annually for high-risk",medNecessity:false,
        notes:"USPSTF alignment; NGS allows concurrent gonorrhea testing (87591)"},
      {id:"LCD-J6-007",cpt:"81001",desc:"Urinalysis, Automated with Microscopy",
        covered:["N30.00","R31.9","N10","R80.9","N18.3","E11.65"],
        excluded:["Z00.00"],frequency:"As medically necessary",medNecessity:true,
        notes:"Standard coverage; microscopy add-on (81003) not separately billable"},
    ]
  },
  J7: {
    mac:"J7", contractor:"WPS Government Health Administrators",
    policyVersion:"L34900-Rev10", lastUpdated:"2024-09-10", effectiveDate:"2024-10-01",
    rules:[
      {id:"LCD-J7-001",cpt:"80048",desc:"Basic Metabolic Panel",
        covered:["E11.9","I10","N18.3","E87.1","E87.6","Z79.4"],
        excluded:["Z00.00","Z00.01"],frequency:"Once per 90 days",medNecessity:true,
        notes:"South Central / Central region WPS policy"},
      {id:"LCD-J7-002",cpt:"80053",desc:"Comprehensive Metabolic Panel",
        covered:["K74.60","K70.30","B18.2","E11.9","I50.9","N18.5"],
        excluded:["Z00.00"],frequency:"Once per 90 days",medNecessity:true,
        notes:"Standard WPS policy applies across J5, J7, J8"},
      {id:"LCD-J7-003",cpt:"85025",desc:"Complete Blood Count with Differential",
        covered:["D64.9","D50.9","C91.00","D70.9","R61","B20"],
        excluded:["Z00.00","Z02.89"],frequency:"Varies by diagnosis",medNecessity:true,
        notes:"ABN required for wellness-context orders"},
      {id:"LCD-J7-004",cpt:"83036",desc:"Hemoglobin A1c",
        covered:["E11.9","E10.9","E13.9","R73.09","Z83.3"],
        excluded:["Z00.00"],frequency:"Twice per year; quarterly if uncontrolled",medNecessity:true,
        notes:"Standard WPS frequency rules"},
      {id:"LCD-J7-005",cpt:"84443",desc:"Thyroid Stimulating Hormone (TSH)",
        covered:["E03.9","E05.90","E06.3","R00.0","Z79.899"],
        excluded:["Z00.00"],frequency:"Once per year for stable patients",medNecessity:true,
        notes:"WPS standard annual monitoring policy"},
      {id:"LCD-J7-006",cpt:"87491",desc:"Chlamydia trachomatis, NAA",
        covered:["Z11.3","Z72.51","A56.00"],
        excluded:[],frequency:"Annually for high-risk",medNecessity:false,
        notes:"USPSTF Grade B alignment"},
      {id:"LCD-J7-007",cpt:"81001",desc:"Urinalysis, Automated with Microscopy",
        covered:["N30.00","R31.9","N10","R80.9","N18.3","E11.65"],
        excluded:["Z00.00"],frequency:"As medically necessary",medNecessity:true,
        notes:"Active symptoms or diagnosis required"},
    ]
  },
};

// ── Validators ────────────────────────────────────────────────────────────────
function isValidCPT(code) { return /^\d{5}[A-Z]?$/.test(code.trim().toUpperCase()); }
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
    "Access-Control-Allow-Origin": "https://worktrailhq.com",
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
