"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./CurrentStage.module.css";

gsap.registerPlugin(ScrollTrigger);

const tracks = [
  {
    label: "Funding", title: "Pre-seed", status: "Open to investment",
    heading: "Early stage. Shared ambition.",
    description: "Medivue is at the pre-seed stage and open to investment. We welcome conversations with investors who share our ambition to connect the first assessment with the care that follows.",
    note: "Let’s explore the next chapter together.", cta: "Discuss investment",
  },
  {
    label: "Intellectual property", title: "Patenting in progress", status: "Work underway",
    heading: "Building with the future in mind.",
    description: "Our patenting work is in progress as we develop Medivue. Protecting the ideas behind the platform is part of building a thoughtful foundation for what comes next.",
    note: "Patenting is in progress; no granted patent is claimed.", cta: "Talk to the team",
  },
];

function StageIcon({ patent = false }: { patent?: boolean }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {patent ? <><path d="M13 7h16l7 7v26H13zM29 7v8h7M19 22h11M19 28h7" /><circle cx="31" cy="35" r="7" /><path d="m28 35 2 2 4-4" /></> : <><path d="M24 40V24M24 29C11 30 8 23 8 14c11-1 17 4 16 15ZM24 24c0-10 5-15 16-15 0 11-5 16-16 15ZM15 40h18" /><path d="m15 21 9 8m8-12-8 7" /></>}
    </svg>
  );
}

export default function CurrentStage() {
  const [active, setActive] = useState(0);
  const [instant, setInstant] = useState(false);
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      section.current?.querySelectorAll<HTMLElement>("[data-stage-fade]").forEach((element) => {
        gsap.timeline({
          scrollTrigger: {
            trigger: element, start: "top 98%", end: "bottom 4%",
            scrub: 0.2, invalidateOnRefresh: true,
          },
        })
          .fromTo(element, { opacity: 0 }, { opacity: 1, duration: 0.14, ease: "none" })
          .to(element, { opacity: 1, duration: 0.72 })
          .to(element, { opacity: 0, duration: 0.14, ease: "none" });
      });
    });
    return () => media.revert();
  }, []);

  return (
    <section ref={section} className={styles.section} id="current-stage" aria-labelledby="stage-heading">
      <div className="section-shell">
        <div className={styles.heading}>
          <div data-stage-fade><p className="eyebrow">Our current stage</p><p className="section-index">03 / 04</p></div>
          <div><h2 data-stage-fade id="stage-heading">At the beginning.<br />For what comes next.</h2><p data-stage-fade>An early-stage company with a clear purpose. Here is where Medivue stands today.</p></div>
        </div>
        <div className={styles.board}>
          <div className={styles.tracks} role="group" aria-label="Explore our current stage">
            {tracks.map((track, index) => (
              <button data-stage-fade key={track.label} type="button" className={styles.track} aria-pressed={active === index} aria-controls={`stage-detail-${index}`} onClick={(event) => { setInstant(event.detail === 0); setActive(index); }}>
                <span className={styles.icon}><StageIcon patent={index === 1} /></span>
                <span className={styles.trackCopy}><span className={styles.label}>{track.label}</span><strong>{track.title}</strong><span className={styles.status}><i aria-hidden="true" />{track.status}</span></span>
                <span className={styles.arrow} aria-hidden="true">↗</span>
              </button>
            ))}
            <p data-stage-fade className={styles.hint}>Select a focus to explore <span aria-hidden="true">↗</span></p>
          </div>
          <div data-stage-fade data-instant={instant} className={styles.detailWrap} aria-live="polite">
            {tracks.map((track, index) => (
              <div key={track.label} id={`stage-detail-${index}`} className={styles.detail} data-active={active === index} aria-hidden={active !== index} inert={active !== index}>
                <div className={styles.detailTop}><span className={styles.label}>{track.label} / Current status</span><span className={styles.number} aria-hidden="true">0{index + 1}</span></div>
                <h3>{track.heading}</h3>
                <p className={styles.description}>{track.description}</p>
                <a className={`button button--dark ${styles.cta}`} href="#about-contact">{track.cta}<span aria-hidden="true">↗</span></a>
                <p className={styles.note}>{track.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
