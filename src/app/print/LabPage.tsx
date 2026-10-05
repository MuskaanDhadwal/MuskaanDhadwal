// LAB — Play and AI in one place (she found them too alike as two pages, 2026-10-05): the toy shelf first
// (things to poke, from play.ts; ASCII Hands was built entirely with AI), then how she works with AI:
// certified, learning now, and the day job.
// Facts: the OpenAI Academy credential page, the two Claude Academy course pages, the app itself.
import { ToySection } from "./PlayPage";
import { TOYS } from "./play";
import { Chamfer, SpecTable } from "./ui";
import { Band } from "./TraxenCase";
import { go } from "./nav";
import { PageDrawing } from "./PageDrawings";

const SKILLS = ["Agent task scoping", "Context gathering for agents", "Draft generation and review", "Agent output verification", "Workflow improvement"];
const COURSES: { t: string; d: string; url: string }[] = [
  { t: "Introduction to Model Context Protocol", d: "Building MCP servers and clients in Python, and the three primitives that connect Claude to outside tools and data: tools, resources and prompts.", url: "https://academy.claude.com/courses/introduction-to-model-context-protocol" },
  { t: "Building with the Claude API", d: "The whole range of building on the Claude API: prompting, tool use, retrieval (RAG), agents, MCP, and patterns for production.", url: "https://academy.claude.com/courses/building-with-the-claude-api" },
];

export function LabPage() {
  return (
    <section className="sheet tx-has-bg" aria-labelledby="ai-page-title" style={{ minHeight: 0 }}>
      <PageDrawing view="lab" side="right" />
      <div className="rail" aria-hidden><span className="rail-label">Lab · experiments + AI</span><span className="rail-line" /></div>
      <div className="rs-head">
        <div>
          <p className="label mid">Lab · things to poke, and how I work with AI</p>
          <h1 id="ai-page-title" className="display ab-h1">The Lab</h1>
          <p className="ab-lede">I use AI the way I use Figma and Kotlin: as a tool to design, build and test faster. First, something to poke that I built entirely with AI. Then what I'm certified in, what I'm learning right now, and how it shows up in my day job.</p>
        </div>
        <div className="rs-me">
          <span className="ab-bubble hand">wait. what if…</span>
          <img className="kit-hero" src="/art/ld-idea-white.png" alt="Muskaan with a lightbulb idea, one finger up" />
        </div>
      </div>

      {TOYS.map((t, i) => <ToySection key={t.id} t={t} n={i + 1} />)}

      <Band no="AI.1" kicker="certified" title="Agents and Workflows">
        <div className="tx-split" style={{ alignItems: "start" }}>
          <div>
            <p>Practice directing AI agents through structured work: giving them context, defining what they should produce, setting boundaries, reviewing their drafts, then improving the workflow and reusing what works.</p>
            <ul className="ai-skills" aria-label="Skills">{SKILLS.map(s => <li key={s}>{s}</li>)}</ul>
          </div>
          <div>
            <SpecTable caption="Credential" rows={[["Issuer", "OpenAI Academy"], ["Pathway", "Apply AI at Work"], ["Issued", "September 28, 2026"], ["Valid until", "March 28, 2027"]]} />
            <div style={{ marginTop: 16 }}><Chamfer href="https://oaiacademy.credential.net/c85c77f7-e681-468e-9287-8c84d5a915aa" external>Verify the credential ↗</Chamfer></div>
          </div>
        </div>
      </Band>

      <Band no="AI.2" kicker="in progress" title="Learning now">
        <ol className="ai-courses">
          {COURSES.map(c => (
            <li key={c.t}>
              <span className="label ai-status">in progress · Claude Academy</span>
              <h3 className="display ai-course-title">{c.t}</h3>
              <p>{c.d}</p>
              <a className="dimlink label" href={c.url} target="_blank" rel="noreferrer">see the course ↗</a>
            </li>
          ))}
        </ol>
      </Band>

      <Band no="AI.3" kicker="in the day job" title="Claude Code + Cursor, every day">
        <p className="tx-measure">At Traxen I design the in-cab app and build it in Kotlin, with Claude Code and Cursor in the loop to get from the Figma file to working features faster.</p>
        <Chamfer onClick={() => go("#/case/traxen")}>See the Traxen case study →</Chamfer>
      </Band>

      <div className="ab-end">
        <h2 className="display ab-h2">Building something with AI?</h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Chamfer solid onClick={() => go("#/contact")}>Say hi →</Chamfer>
          <Chamfer onClick={() => go("#/work")}>See the real work</Chamfer>
        </div>
      </div>
    </section>
  );
}
