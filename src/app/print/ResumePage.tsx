// RÉSUMÉ — just her PDFs: pick a role and a length, read it here, download it. Nothing added on top (her call).
// Extra projects live in the Garage (#/garage).
// The old file names (…_UX_Engineer_Resume.pdf, …_Product_Designer_Resume.pdf, …_Resume_Full.pdf) are kept in
// public/resume/ with the new content, so links she already sent still work.
import { useState } from "react";
import { Mini } from "./Minis";
import { Chamfer } from "./ui";
import { go } from "./nav";
import { PageDrawing } from "./PageDrawings";

const ROLES = [
  { k: "UX_Engineer", label: "UX Engineer", for: "For UX engineer, design technologist and front-end-leaning design roles." },
  { k: "Product_Designer", label: "Product Designer", for: "For product and UX design roles." },
  { k: "Product_Manager", label: "Product Manager", for: "For product manager roles." },
];
const LENGTHS = [
  { k: "1Page", label: "1 page", for: "The short version." },
  { k: "2Page", label: "2 pages", for: "The full version." },
];
const fileFor = (role: string, len: string) => `/resume/Muskaan_Dhadwal_${role}_Resume_${len}.pdf`;

function Resumes() {
  const [role, setRole] = useState(ROLES[0].k);
  const [len, setLen] = useState(LENGTHS[0].k);
  const ro = ROLES.find(x => x.k === role)!, le = LENGTHS.find(x => x.k === len)!;
  const r = { file: fileFor(role, len), label: `${ro.label} · ${le.label}`, for: `${ro.for} ${le.for}` };
  return (
    <section className="sheet rs-top tx-has-bg" aria-labelledby="rs-title" style={{ minHeight: 0 }}>
      <PageDrawing view="sheets" side="right" />
      <div className="rail" aria-hidden><span className="rail-label">Résumé · 01 the paperwork</span><span className="rail-line" /></div>
      <div className="rs-head">
        <div>
          <p className="label mid">Résumé · three roles, two lengths, same person</p>
          <h1 id="rs-title" className="display ab-h1">The paperwork</h1>
          <p className="ab-lede">Pick the role and the length. Read it here, or take a PDF with you.</p>
        </div>
        <div className="rs-me">
          <span className="ab-bubble hand">still warm from the printer.</span>
          <Mini pose="rsHand" label="A small Muskaan holding out a sheet of paper" unit="var(--ab-u)" />
        </div>
      </div>

      <div className="rs-pick">
        <div className="rs-pick-row">
          <span className="label mid">role</span>
          <div className="tx-toggle" role="group" aria-label="Résumé role">
            {ROLES.map(x => <button key={x.k} className={`ct-chip ${role === x.k ? "on" : ""}`} aria-pressed={role === x.k} onClick={() => setRole(x.k)}>{x.label}</button>)}
          </div>
        </div>
        <div className="rs-pick-row">
          <span className="label mid">length</span>
          <div className="tx-toggle" role="group" aria-label="Résumé length">
            {LENGTHS.map(x => <button key={x.k} className={`ct-chip ${len === x.k ? "on" : ""}`} aria-pressed={len === x.k} onClick={() => setLen(x.k)}>{x.label}</button>)}
          </div>
        </div>
      </div>
      <div className="rs-grid">
        <div className="rs-viewer">
          <object key={r.file} data={`${r.file}#view=FitH&toolbar=0`} type="application/pdf" aria-label={`${r.label} résumé (PDF)`}>
            <div className="rs-fallback">
              <p>Your browser won't show PDFs inline. No problem:</p>
              <Chamfer solid href={r.file} external>Open the PDF ↗</Chamfer>
            </div>
          </object>
        </div>
        <aside className="rs-side">
          <p className="label mid">this version</p>
          <p className="display rs-which">{r.label}</p>
          <p>{r.for}</p>
          <div className="rs-actions">
            <a className="chamfer solid" href={r.file} download><span>Download PDF ↓</span></a>
            <Chamfer href={r.file} external>Open in a new tab ↗</Chamfer>
          </div>
          <p className="label mid" style={{ marginTop: 20 }}>Side projects and older work are in <button className="dimlink rs-inline" onClick={() => go("#/garage")}>the garage →</button></p>
        </aside>
      </div>

    </section>
  );
}

export function ResumePage() {
  return <Resumes />;
}
