"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ShaderBackground from "./components/ShaderBackground";
import SiteHeader from "./components/SiteHeader";
import ContactForm from "./components/ContactForm";

gsap.registerPlugin(ScrollTrigger);

const FLOW = [
  ["01", "Respond", "Start one secure case at the point of collapse."],
  ["02", "Sense", "Capture multimodal physiological signals in one placement."],
  ["03", "Assess", "Surface early risk indicators for faster triage decisions."],
  ["04", "Alert", "Share the same case with EMS, ambulance, and hospital."],
  ["05", "Handoff", "Continue the record—without starting over."],
];

const PLATFORM_STEPS = [
  ["Screenshot_1788416178.png", "Ready at the scene", "Connect the device and begin one secure emergency case without setup friction."],
  ["Screenshot_1788416544.png", "Signals in one view", "Follow acquisition quality and multimodal physiological signals as they are captured."],
  ["Screenshot_1788416552.png", "Risk, made legible", "Bring urgent findings forward as triage support—never as an autonomous diagnosis."],
  ["Screenshot_1788417436.png", "Alert with context", "Share the assessment, case location, and priority with the response network."],
  ["Screenshot_1788417464.png", "One continuous record", "Preserve every signal, decision, and handoff from responder to hospital."],
];

const DEVICE_STEPS = [
  {
    label: "Electrical biosignal",
    title: "ECG sensing",
    description: "Captures the heart’s electrical activity as a raw waveform for rapid physiological assessment.",
    direct: ["ECG waveform"],
    derived: ["Heart Rate", "Cardiac rhythm indication", "HRV / R–R metrics", "Signal quality"],
  },
  {
    label: "Optical biosignal",
    title: "Pulse & oxygen sensing",
    description: "Uses the optical pulse signal to surface oxygenation and peripheral perfusion information.",
    direct: ["PPG waveform", "SpO₂"],
    derived: ["Heart Rate", "Perfusion Index", "Pulse strength", "Signal quality"],
  },
  {
    label: "Digital auscultation",
    title: "Heart & lung acoustics",
    description: "Records acoustic waveforms so heart and lung sounds remain available with the emergency case.",
    direct: ["Heart / lung acoustic waveform"],
    derived: ["Respiratory Rate", "Signal quality"],
  },
  {
    label: "Thermal & placement",
    title: "Contact-aware measurement",
    description: "Measures skin temperature while tracking pressure and motion that can affect acquisition reliability.",
    direct: ["Skin temperature", "Contact pressure / motion"],
    derived: ["Signal quality"],
  },
  {
    label: "Validated feature path",
    title: "Multimodal estimation",
    description: "Derived estimates are treated as decision support and introduced only through appropriate validation.",
    direct: [],
    derived: ["BP Estimate — future / validated feature"],
  },
];

const JOURNEY_STEPS = [
  ["01", "scene", "Scene", "Case initiated"],
  ["02", "ambulance", "Ambulance", "Assessment continued"],
  ["03", "hospital", "Hospital", "Team prepared"],
] as const;

function Arrow({ direction = "right" }: { direction?: "left" | "right" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
      <path
        d={direction === "right" ? "M5 12h14m-5-5 5 5-5 5" : "M19 12H5m5-5-5 5 5 5"}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function JourneyIcon({ type }: { type: "scene" | "ambulance" | "hospital" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32">
      {type === "scene" && (
        <>
          <path d="M16 28s9-8.2 9-16a9 9 0 1 0-18 0c0 7.8 9 16 9 16Z" />
          <circle cx="16" cy="12" r="3.4" />
        </>
      )}
      {type === "ambulance" && (
        <>
          <path d="M3.5 10.5h15v12h-15zM18.5 15h5l5 5v2.5h-10z" />
          <path d="M9 13v5M6.5 15.5h5M23 18.5h3" />
          <circle cx="9" cy="24" r="2.5" /><circle cx="24" cy="24" r="2.5" />
        </>
      )}
      {type === "hospital" && (
        <>
          <path d="M5 28V8h14v20M19 14h8v14M2.5 28h27" />
          <path d="M10 13h4M12 11v4M9 19h2M14 19h2M9 23h2M14 23h2M23 19h1M23 23h1" />
        </>
      )}
    </svg>
  );
}

function DeviceViewerControls() {
  return (
    <div className="device-viewer__controls">
      <button type="button" data-viewer-command="previous" aria-label="Rotate device left"><Arrow direction="left" /></button>
      <label>
        <span className="sr-only">Device rotation angle</span>
        <input className="device-viewer__scrubber" type="range" min="0" max="1000" defaultValue="500" />
      </label>
      <button type="button" data-viewer-command="next" aria-label="Rotate device right"><Arrow /></button>
      <span className="device-viewer__divider" aria-hidden="true" />
      <button type="button" data-viewer-command="zoom-out" aria-label="Zoom out">−</button>
      <button className="device-viewer__zoom" type="button" data-viewer-command="reset" aria-label="Reset device view"><span data-zoom-value>100%</span></button>
      <button type="button" data-viewer-command="zoom-in" aria-label="Zoom in">+</button>
    </div>
  );
}

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activePlatform, setActivePlatform] = useState(0);
  const [activeDevice, setActiveDevice] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
          gsap.fromTo(
            element,
            { opacity: 0, y: 14 },
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
              ease: "power2.out",
              scrollTrigger: { trigger: element, start: "top 88%", once: true },
            },
          );
        });

        gsap.to(".continuity-line__fill", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".continuity",
            start: "top 75%",
            end: "bottom 45%",
            scrub: 0.7,
          },
        });

        gsap.timeline({
          scrollTrigger: {
            trigger: ".hero",
            start: "42% top",
            end: "bottom top",
            scrub: 0.8,
          },
        })
          .to(".hero__content", { y: -72, opacity: 0.24, ease: "none" }, 0)
          .to(".hero-product", { yPercent: -13, scale: 0.91, opacity: 0.32, ease: "none" }, 0)
          .to(".hero__proof", { y: -20, opacity: 0, ease: "none" }, 0);

      });

      gsap.utils.toArray<HTMLElement>(".platform-story__step").forEach((step, index) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => self.isActive && setActivePlatform(index),
        });
      });

      gsap.utils.toArray<HTMLElement>(".device-story__step").forEach((step, index) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => self.isActive && setActiveDevice(index),
        });
      });

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const viewerCleanups: Array<() => void> = [];

      gsap.utils.toArray<HTMLElement>("[data-device-viewer]").forEach((viewer) => {
        const video = viewer.querySelector<HTMLVideoElement>("video");
        const orbit = viewer.querySelector<HTMLElement>(".device-video-orbit");
        const scrubber = viewer.querySelector<HTMLInputElement>(".device-viewer__scrubber");
        if (!video || !orbit || !scrubber) return;

        let duration = 0;
        let zoom = 1;
        let pendingRatio = 0.5;
        let seekFrame = 0;
        const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

        const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
        const applyZoom = (nextZoom: number) => {
          zoom = clamp(nextZoom, 0.82, 1.42);
          orbit.style.setProperty("--viewer-zoom", String(zoom));
          viewer.querySelector<HTMLElement>("[data-zoom-value]")!.textContent = `${Math.round(zoom * 100)}%`;
        };
        const commitSeek = () => {
          seekFrame = 0;
          if (!duration) return;
          video.currentTime = clamp(pendingRatio, 0, 1) * Math.max(0, duration - 0.04);
          scrubber.value = String(Math.round(clamp(pendingRatio, 0, 1) * 1000));
        };
        const requestSeek = (ratio: number) => {
          pendingRatio = clamp(ratio, 0, 1);
          if (!seekFrame) seekFrame = window.requestAnimationFrame(commitSeek);
        };
        const prepareVideo = () => {
          duration = Number.isFinite(video.duration) ? video.duration : 0;
          video.pause();
          requestSeek(0.5);
        };
        const handlePointerMove = (event: PointerEvent) => {
          if (!finePointer || reducedMotion || (event.target as Element).closest(".device-viewer__controls")) return;
          const bounds = viewer.getBoundingClientRect();
          requestSeek((event.clientX - bounds.left) / bounds.width);
          const pitch = clamp(((event.clientY - bounds.top) / bounds.height - 0.5) * -24, -12, 12);
          orbit.style.setProperty("--viewer-pitch", `${pitch}deg`);
        };
        const handlePointerLeave = () => orbit.style.setProperty("--viewer-pitch", "0deg");
        const handleWheel = (event: WheelEvent) => {
          if (!finePointer || !event.ctrlKey) return;
          event.preventDefault();
          applyZoom(zoom - event.deltaY * 0.0012);
        };
        const handleScrub = () => requestSeek(Number(scrubber.value) / 1000);
        const handleCommand = (event: Event) => {
          const button = (event.target as Element).closest<HTMLButtonElement>("[data-viewer-command]");
          if (!button) return;
          const currentRatio = duration ? video.currentTime / duration : 0.5;
          const command = button.dataset.viewerCommand;
          if (command === "previous") requestSeek((currentRatio - 0.06 + 1) % 1);
          if (command === "next") requestSeek((currentRatio + 0.06) % 1);
          if (command === "zoom-out") applyZoom(zoom - 0.1);
          if (command === "zoom-in") applyZoom(zoom + 0.1);
          if (command === "reset") {
            applyZoom(1);
            requestSeek(0.5);
            orbit.style.setProperty("--viewer-pitch", "0deg");
          }
        };

        video.addEventListener("loadedmetadata", prepareVideo);
        viewer.addEventListener("pointermove", handlePointerMove);
        viewer.addEventListener("pointerleave", handlePointerLeave);
        viewer.addEventListener("wheel", handleWheel, { passive: false });
        viewer.addEventListener("click", handleCommand);
        scrubber.addEventListener("input", handleScrub);
        if (video.readyState >= 1) prepareVideo();
        else video.pause();

        viewerCleanups.push(() => {
          if (seekFrame) window.cancelAnimationFrame(seekFrame);
          video.removeEventListener("loadedmetadata", prepareVideo);
          viewer.removeEventListener("pointermove", handlePointerMove);
          viewer.removeEventListener("pointerleave", handlePointerLeave);
          viewer.removeEventListener("wheel", handleWheel);
          viewer.removeEventListener("click", handleCommand);
          scrubber.removeEventListener("input", handleScrub);
        });
      });

      return () => {
        viewerCleanups.forEach((cleanup) => cleanup());
        mm.revert();
      };
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      <SiteHeader />

      <main>
        <section className="hero" id="top">
          <ShaderBackground className="hero__shader" />
          <div className="hero__wash" aria-hidden="true" />
          <div className="hero__inner">
            <div className="hero__content">
              <p className="eyebrow hero__eyebrow"><span /> Connected rapid emergency assessment</p>
              <h1>
                Every signal<br />
                <em>survives the handoff.</em>
              </h1>
              <div className="hero__lower">
                <p className="hero__copy">
                  Medivue turns the first assessment into one continuous emergency record—
                  from authorized responder, to ambulance, to hospital.
                </p>
                <div className="hero__actions">
                  <a className="button button--dark" href="#platform">Explore the system <Arrow /></a>
                  <a className="text-link" href="#device">Meet the device <Arrow /></a>
                </div>
              </div>
            </div>
            <div className="hero-product" aria-label="Medivue connected device and application">
              <div className="hero-product__glow" aria-hidden="true" />
              <div className="hero-product__layer hero-product__phone">
                <Image
                  src="/app_screenshots/Screenshot_1788416544.png"
                  alt="Medivue live assessment application showing connected physiological signals"
                  width={1080}
                  height={2220}
                  sizes="(max-width: 700px) 50vw, 250px"
                  quality={75}
                  preload
                />
              </div>
              <div className="hero-product__layer hero-product__device-wrap">
                <Image
                  className="hero-product__device"
                  src="/generated/device-phone-hero.png?v=20260903-183552"
                  alt="Medivue multimodal sensing device attached to a smartphone"
                  width={368}
                  height={677}
                  sizes="(max-width: 700px) 46vw, 230px"
                  quality={75}
                  preload
                  unoptimized
                />
              </div>
            </div>
          </div>
          <div className="hero__proof" aria-label="Medivue workflow">
            <span>Respond</span><i /><span>Sense</span><i /><span>Assess</span><i /><span>Alert</span><i /><span>Handoff</span>
          </div>
        </section>

        <section className="thesis" id="why">
          <div className="section-shell thesis__grid">
            <div data-reveal>
              <p className="eyebrow">The missing link</p>
              <p className="section-index">01 / 04</p>
            </div>
            <div data-reveal>
              <h2>Emergency care should not restart at every door.</h2>
              <p className="lead">
                Today, valuable context can disappear between the scene, the ambulance,
                and the emergency department. Medivue keeps the case moving with the patient.
              </p>
            </div>
          </div>
          <div className="continuity section-shell" data-reveal>
            <div className="continuity-line"><span className="continuity-line__fill" /></div>
            {JOURNEY_STEPS.map(([number, icon, title, text]) => (
              <article key={number}>
                <div className="continuity-icon"><JourneyIcon type={icon} /></div>
                <span className="continuity__number">{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="platform" id="platform">
          <div className="section-shell platform__header" data-reveal>
            <div>
              <p className="eyebrow eyebrow--light">The Medivue platform</p>
              <p className="section-index">02 / 04</p>
            </div>
            <h2>One calm interface for the minutes that are not.</h2>
          </div>

          <div className="platform-story section-shell">
            <div className="platform-story__sticky">
              <div className="platform-glass">
                <div className="platform-glass__visual">
                  <div className="platform-glass__status"><span /> App view</div>
                  <div className="platform-phone-stack">
                    {PLATFORM_STEPS.map(([file, title], index) => (
                      <div
                        className={`platform-phone ${activePlatform === index ? "is-active" : ""}`}
                        key={file}
                        aria-hidden={activePlatform !== index}
                      >
                        <Image
                          src={`/app_screenshots/${file}`}
                          alt={`Medivue app — ${title}`}
                          width={1080}
                          height={2220}
                          sizes="(max-width: 900px) 72vw, 290px"
                          quality={75}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="platform-glass__copy" aria-live="polite">
                  <div className="platform-focus-line" aria-hidden="true" />
                  <div
                    className="platform-glass__copy-list"
                    style={{ transform: `translate3d(0, ${-activePlatform * 152}px, 0)` }}
                  >
                    {PLATFORM_STEPS.map(([, title, description], index) => (
                      <article className={activePlatform === index ? "is-active" : ""} key={title}>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <div>
                          <h3>{title}</h3>
                          <p>{description}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="platform-glass__progress" aria-hidden="true">
                  <span style={{ transform: `scaleY(${(activePlatform + 1) / PLATFORM_STEPS.length})` }} />
                </div>
              </div>
            </div>

            <div className="platform-story__track" aria-hidden="true">
              {PLATFORM_STEPS.map(([, title]) => <div className="platform-story__step" key={title} />)}
            </div>
          </div>

          <div className="platform-mobile-rail" tabIndex={0} aria-label="Scrollable Medivue product views">
            {PLATFORM_STEPS.map(([file, title, description], index) => (
              <article key={file}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div className="platform-mobile-phone">
                  <Image src={`/app_screenshots/${file}`} alt={`Medivue app — ${title}`} width={1080} height={2220} sizes="78vw" quality={75} />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="workflow">
          <div className="section-shell">
            <div className="workflow__intro" data-reveal>
              <p className="eyebrow">A single clinical thread</p>
              <h2>Sense. Assess.<br />Alert. Handoff.</h2>
              <p>Medivue supports triage and coordination. It does not replace clinical judgment or present autonomous diagnoses.</p>
            </div>
            <div className="workflow__list">
              {FLOW.map(([number, title, description]) => (
                <article key={number} data-reveal>
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <i aria-hidden="true"><Arrow /></i>
                </article>
              ))}
            </div>
            <figure className="workflow__media" data-reveal>
              <Image src="/generated/continuous-handoff.png" alt="An ambulance team handing a continuous Medivue assessment to a hospital clinician" width={1536} height={1024} sizes="(max-width: 700px) 100vw, 1320px" quality={75} />
              <figcaption>Same patient. Same record. A better-prepared receiving team.</figcaption>
            </figure>
          </div>
        </section>

        <section className="device-stage" id="device">
          <div className="section-shell device-stage__header" data-reveal>
            <div>
              <p className="eyebrow">The Medivue device</p>
              <p className="section-index">03 / 04</p>
            </div>
            <div>
              <h2>Multiple signals.<br />One placement.</h2>
              <p className="lead">A compact, connected sensing device designed to capture multimodal physiological data at the patient’s side.</p>
            </div>
          </div>

          <div className="device-story section-shell">
            <div className="device-story__sticky">
              <div className="device-glass">
                <div className="device-glass__visual">
                  <div className="device-glass__status"><span /> Interactive 360° product view</div>
                  <div className="device-viewer" data-device-viewer>
                    <div className="device-video-orbit">
                    <video
                      src="/videos/device_video.mp4"
                      aria-label="Interactive rotating view of the Medivue sensing device"
                      muted
                      playsInline
                      preload="auto"
                    />
                    </div>
                    <DeviceViewerControls />
                  </div>
                  <p className="device-tilt-hint">Move horizontally to rotate · vertically to tilt · use controls to zoom</p>
                </div>

                <div className="device-glass__copy" aria-live="polite">
                  <div className="device-focus-line" aria-hidden="true" />
                  <div className="device-glass__copy-list" style={{ transform: `translate3d(0, ${-activeDevice * 240}px, 0)` }}>
                    {DEVICE_STEPS.map((step, index) => (
                      <article className={activeDevice === index ? "is-active" : ""} key={step.title}>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <div>
                          <small>{step.label}</small>
                          <h3>{step.title}</h3>
                          <p>{step.description}</p>
                          <div className="measure-groups">
                            {step.direct.length > 0 && (
                              <div><h4>Directly measured</h4><ul>{step.direct.map((item) => <li key={item}>{item}</li>)}</ul></div>
                            )}
                            <div><h4>Derived</h4><ul>{step.derived.map((item) => <li key={item}>{item}</li>)}</ul></div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="device-glass__progress" aria-hidden="true">
                  <span style={{ transform: `scaleY(${(activeDevice + 1) / DEVICE_STEPS.length})` }} />
                </div>
              </div>
            </div>

            <div className="device-story__track" aria-hidden="true">
              {DEVICE_STEPS.map((step) => <div className="device-story__step" key={step.title} />)}
            </div>
          </div>

          <div className="device-mobile-video device-viewer" data-device-viewer>
            <div className="device-glass__status"><span /> Interactive product view</div>
            <div className="device-video-orbit">
              <video
                src="/videos/device_video.mp4"
                aria-label="Interactive rotating view of the Medivue sensing device"
                muted
                playsInline
                preload="auto"
              />
            </div>
            <DeviceViewerControls />
          </div>

          <div className="device-mobile-rail" tabIndex={0} aria-label="Scrollable Medivue sensor capabilities">
            {DEVICE_STEPS.map((step, index) => (
              <article key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <small>{step.label}</small>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <div className="measure-groups">
                  {step.direct.length > 0 && <div><h4>Directly measured</h4><ul>{step.direct.map((item) => <li key={item}>{item}</li>)}</ul></div>}
                  <div><h4>Derived</h4><ul>{step.derived.map((item) => <li key={item}>{item}</li>)}</ul></div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="partners" id="partners">
          <div className="section-shell partners__grid">
            <div data-reveal>
              <p className="eyebrow">Built through collaboration</p>
              <p className="section-index">04 / 04</p>
            </div>
            <div data-reveal>
              <h2>Connected care takes a connected ecosystem.</h2>
              <p className="lead">We work alongside healthcare and technology partners to make emergency information more continuous, usable, and timely.</p>
              <div className="partner-logos">
                <Image src="/partners_logo/nova_logo.png?v=20260903" alt="NOVA" width={180} height={68} unoptimized />
                <Image src="/partners_logo/emchealthcare_logo.png" alt="EMC Healthcare" width={180} height={68} />
                <Image src="/partners_logo/equiralife_logo.png" alt="Equiralife" width={180} height={68} />
              </div>
            </div>
          </div>
        </section>

        <section className="closing">
          <ShaderBackground className="closing__shader" />
          <div className="closing__wash" aria-hidden="true" />
          <div className="section-shell closing__inner" data-reveal>
            <p className="eyebrow">Rapid insight. Better outcomes.</p>
            <h2>Make the first assessment count all the way through.</h2>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="section-shell footer__inner">
          <Image src="/brand_logo/logo-no-trademark-landscape.png" alt="Medivue" width={104} height={30} />
          <p>Connected rapid emergency assessment.</p>
          <div><a href="/about">About us</a><a href="mailto:contact@medivue.com">Contact</a><span>© 2026 Medivue</span></div>
        </div>
      </footer>
    </div>
  );
}
