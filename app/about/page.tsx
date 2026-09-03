import Image from "next/image";
import Link from "next/link";
import ShaderBackground from "../components/ShaderBackground";
import SiteHeader from "../components/SiteHeader";
import ContactForm from "../components/ContactForm";

const TEAM = [
  {
    image: "/founders/elina.png",
    name: "Haider Elina Sakina",
    role: "CEO & Co-Founder",
    school: "School of Management, Beijing Institute of Technology",
  },
  {
    image: "/founders/prima.png",
    name: "Prima Wijayakusuma",
    role: "Chief Research Officer & Co-Founder",
    school: "School of Integrated Circuits and Electronics, Beijing Institute of Technology",
  },
  {
    image: "/founders/angeline.jpg",
    name: "Angeline Mary Marchella",
    role: "Chief Technology Officer & Co-Founder",
    school: "School of Computer Science and Technology, Beijing Institute of Technology",
  },
] as const;

export const metadata = {
  title: "About Medivue — A Continuous Thread for Emergency Care",
  description: "Meet the founding team and the mission behind Medivue's connected rapid emergency assessment platform.",
};

export default function AboutPage() {
  return (
    <div className="about-page">
      <SiteHeader />
      <main>
        <section className="about-hero">
          <ShaderBackground className="about-hero__shader" />
          <div className="about-hero__wash" aria-hidden="true" />
          <div className="section-shell about-hero__inner">
            <p className="eyebrow"><span className="about-hero__dot" /> About Medivue</p>
            <h1>Built for the moments between first contact and definitive care.</h1>
            <p>
              Medivue is creating a connected rapid assessment system so critical physiological
              context can move with the patient—from the scene to the hospital.
            </p>
          </div>
          <div className="about-hero__index" aria-hidden="true">OUR STORY&nbsp;&nbsp;—&nbsp;&nbsp;OUR PURPOSE</div>
        </section>

        <section className="about-story">
          <div className="section-shell about-story__grid">
            <div>
              <p className="eyebrow">Our story</p>
              <p className="section-index">01 / 03</p>
            </div>
            <div className="about-story__copy">
              <h2>Emergency information should not disappear at every handoff.</h2>
              <p>
                The earliest minutes of an emergency can produce valuable signals, observations,
                and decisions. Yet that context is often fragmented across people, devices, and
                places—forcing each care team to reconstruct what happened before they arrived.
              </p>
              <p>
                Medivue began with a shared concern: what if the first assessment could become the
                beginning of one continuous clinical thread? The company was founded by three
                master&apos;s students at Beijing Institute of Technology, bringing together business,
                biomedical research, electronics, and software engineering to explore a more
                connected path from response to definitive care.
              </p>
            </div>
          </div>
        </section>

        <section className="about-purpose">
          <div className="section-shell">
            <div className="about-purpose__heading">
              <div><p className="eyebrow eyebrow--light">Our purpose</p><p className="section-index">02 / 03</p></div>
              <h2>A clearer view of every critical minute.</h2>
            </div>
            <div className="about-purpose__cards">
              <article>
                <span>VISION</span>
                <h3>Critical context that travels with every patient.</h3>
                <p>We envision emergency care where the right teams can see and understand the same evolving clinical picture, wherever the patient goes next.</p>
              </article>
              <article>
                <span>MISSION</span>
                <h3>Connect rapid assessment to a continuous care journey.</h3>
                <p>Our mission is to help authorized responders capture multimodal physiological signals, surface meaningful context, and hand it forward securely and clearly.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="about-team">
          <div className="section-shell">
            <div className="about-team__heading">
              <div><p className="eyebrow">The team</p><p className="section-index">03 / 03</p></div>
              <div><h2>Three disciplines.<br />One shared responsibility.</h2><p>Built in Beijing by a multidisciplinary founding team focused on the continuity, clarity, and usability of emergency information.</p></div>
            </div>
            <div className="team-grid">
              {TEAM.map((member, index) => (
                <article key={member.name}>
                  <div className="team-card__portrait">
                    <Image src={member.image} alt={`${member.name}, ${member.role}`} fill sizes="(max-width: 900px) 92vw, 31vw" quality={75} loading="eager" />
                  </div>
                  <div className="team-card__copy"><h3>{member.name}</h3><p className="team-card__role">{member.role}</p><p className="team-card__school">{member.school}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-closing">
          <div className="section-shell">
            <p className="eyebrow">The work ahead</p>
            <h2>We are building carefully, with the people who understand emergency care.</h2>
            <ContactForm />
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="section-shell footer__inner">
          <Image src="/brand_logo/logo-no-trademark-landscape.png" alt="Medivue" width={116} height={33} />
          <p>Connected rapid emergency assessment.</p>
          <div><Link href="/">Home</Link><a href="mailto:contact@medivue.com">Contact</a><span>© 2026 Medivue</span></div>
        </div>
      </footer>
    </div>
  );
}
