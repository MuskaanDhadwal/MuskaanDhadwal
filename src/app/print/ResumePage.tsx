// RÉSUMÉ — just her three PDFs: pick one, read it here, download it. Nothing added on top (her call).
// Extra projects live in the Garage (#/garage).
import { useState } from "react";
import { Mini } from "./Minis";
import { Chamfer } from "./ui";
import { go } from "./nav";

const RESUMES = [
  { k: "ux", label: "UX Engineer · 1 page", file: "/resume/Muskaan_Dhadwal_UX_Engineer_Resume.pdf", for: "For UX engineer, design technologist and front-end-leaning design roles." },
  { k: "pd", label: "Product Designer · 1 page", file: "/resume/Muskaan_Dhadwal_Product_Designer_Resume.pdf", for: "For product and UX design roles." },
  { k: "full", label: "Full · 2 pages", file: "/resume/Muskaan_Dhadwal_Resume_Full.pdf", for: "Everything: the Traxen internship, Orbit Lab, mentoring, certifications." },
];

function Resumes() {
  const [k, setK] = useState(RESUMES[0].k);
  const r = RESUMES.find(x => x.k === k)!;
  return (
    <section className="sheet rs-top" aria-labelledby="rs-title" style={{ minHeight: 0 }}>
      <div className="rail" aria-hidden><span className="rail-label">Résumé · 01 the paperwork</span><span className="rail-line" /></div>
      <div className="rs-head">
        <div>
          <p className="label mid">Résumé · three versions, same person</p>
          <h1 id="rs-title" className="display ab-h1">The paperwork</h1>
          <p className="ab-lede">Pick the version that fits the role. Read it here, or take a PDF with you.</p>
        </div>
        <div className="rs-me">
          <span className="ab-bubble hand">still warm from the printer.</span>
          <Mini pose="rsHand" label="A small Muskaan holding out a sheet of paper" unit="var(--ab-u)" />
        </div>
      </div>

      <div className="tx-toggle" role="group" aria-label="Résumé version">
        {RESUMES.map(x => <button key={x.k} className={`ct-chip ${k === x.k ? "on" : ""}`} aria-pressed={k === x.k} onClick={() => setK(x.k)}>{x.label}</button>)}
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
