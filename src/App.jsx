import { useEffect, useMemo, useState } from "react";

function diffInMonths(start, end) {
  let months = (end.getFullYear() - start.getFullYear()) * 12;
  months += end.getMonth() - start.getMonth();
  if (end.getDate() < start.getDate()) months -= 1;
  return Math.max(0, months);
}

function formatDuration(months) {
  if (months <= 0) return "0 mos";
  const years = Math.floor(months / 12);
  const rem = months % 12;
  const parts = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? "yr" : "yrs"}`);
  if (rem > 0) parts.push(`${rem} ${rem === 1 ? "mo" : "mos"}`);
  return parts.join(" ");
}

function SocialIcon({ href, label, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
      {children}
    </a>
  );
}

export default function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const experienceDuration = useMemo(() => {
    const start = new Date(2024, 5, 1);
    return formatDuration(diffInMonths(start, new Date()));
  }, []);

  useEffect(() => {
    document.body.classList.toggle("nav-open", isNavOpen);
    return () => {
      document.body.classList.remove("nav-open");
    };
  }, [isNavOpen]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = document.querySelectorAll(
      [
        ".hero",
        ".resume-section",
        ".vcook-section",
        ".blog-shell",
        ".blog-layout",
        ".overview-item",
        ".preview-item",
        ".main-block"
      ].join(",")
    );

    if (!targets.length) return undefined;

    targets.forEach((el, idx) => {
      el.classList.add("js-reveal");
      el.style.setProperty("--reveal-index", String(idx % 8));
      if (reduceMotion) el.classList.add("is-visible");
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const copyrightText = currentYear > 2025 ? `2025-${currentYear}` : `${currentYear}`;

  return (
    <>
      <div id="nav-sheet" className="nav-sheet" onClick={() => setIsNavOpen(false)}>
        <div className="nav-sheet-content" onClick={(event) => event.stopPropagation()}>
          <a href="./Intro.html">Intro</a>
          <a href="./Award.html">Award</a>
          <a href="./Projects.html">Projects</a>
          <a href="./Blogs.html">Blog</a>
          <a href="./Contact.html">Contact</a>
        </div>
      </div>

      <header className="desktop-header">
        <nav>
          <a className="logo" href="./">
            Vincent
          </a>
          <div className="nav-items desktop-nav">
            <a href="./Intro.html">Intro</a>
            <a href="./Award.html">Award</a>
            <a href="./Projects.html">Projects</a>
            <a href="./Blogs.html">Blog</a>
            <a href="./Contact.html">Contact</a>
          </div>
          <button id="nav-toggle" aria-label="Toggle Navigation" onClick={() => setIsNavOpen((v) => !v)}>
            <span />
            <span />
          </button>
        </nav>
      </header>

      <main>
        <section className="hero">
          <h1>Welcome to Vincent&apos;s World</h1>
          <p>Aspiring developer, tech enthusiast, and future innovator</p>
          <p>Discipline, Humble, Confidence</p>
          <q className="quote">&quot;I can do all things&quot;</q>
          <a href="./Intro.html" className="cta-button">
            Learn More
          </a>
          <div className="social-links">
            <SocialIcon href="https://www.linkedin.com/in/hung-yeh-chiang" label="LinkedIn">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
                <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.02-3.04-1.86-3.04-1.86 0-2.14 1.45-2.14 2.94v5.68H9.33V9h3.42v1.56h.05c.48-.9 1.64-1.86 3.38-1.86 3.62 0 4.28 2.38 4.28 5.48v6.27ZM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.1 20.45H3.54V9H7.1v11.45Z" />
              </svg>
            </SocialIcon>
            <SocialIcon href="https://instagram.com/vincent._0523" label="Instagram">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
                <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4A5.8 5.8 0 0 1 16.2 22H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 1.8A4 4 0 0 0 3.8 7.8v8.4a4 4 0 0 0 4 4h8.4a4 4 0 0 0 4-4V7.8a4 4 0 0 0-4-4H7.8Zm8.7 1.35a1.35 1.35 0 1 1 0 2.7 1.35 1.35 0 0 1 0-2.7ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8Z" />
              </svg>
            </SocialIcon>
            <SocialIcon href="https://twitter.com/Vincent_Galileo" label="Twitter">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
                <path d="M18.9 2H22l-6.77 7.74L23 22h-6.1l-4.78-6.24L6.66 22H3.56l7.24-8.28L1 2h6.24l4.32 5.72L18.9 2Zm-1.07 18.15h1.69L6.31 3.75H4.5l13.33 16.4Z" />
              </svg>
            </SocialIcon>
            <SocialIcon href="https://github.com/Galile-Vincent" label="GitHub">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.7.5.09.68-.22.68-.49 0-.24-.01-1.03-.01-1.86-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.58 2.37 1.13 2.95.87.09-.67.35-1.13.63-1.39-2.22-.26-4.56-1.15-4.56-5.1 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05A9.27 9.27 0 0 1 12 7.2c.85 0 1.7.12 2.5.35 1.9-1.33 2.74-1.05 2.74-1.05.56 1.4.2 2.45.1 2.72.64.72 1.02 1.63 1.02 2.75 0 3.96-2.34 4.84-4.58 5.09.36.32.69.95.69 1.92 0 1.39-.01 2.5-.01 2.84 0 .27.18.58.69.48A10.22 10.22 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
              </svg>
            </SocialIcon>
          </div>
        </section>

        <section className="vcook-section">
          <div className="vcook-container">
            <div className="vcook-content">
              <div className="vcook-badge">🏆 MAIC Winner</div>
              <h2 className="vcook-title">VCook - Recipe &amp; Cooking AI</h2>
              <p className="vcook-description">
                Winner of the MAIC Most Innovation Award in Taiwan and First Place in China Final. VCook is an
                AI-powered recipe and cooking app that helps you discover, create, and cook amazing meals.
              </p>
              <a
                href="https://apps.apple.com/tw/app/vcook-recipe-cooking-ai/id6742108272?l=en-GB"
                className="app-store-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 384 512" className="app-store-icon" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
                  />
                </svg>
                <div className="app-store-text">
                  <span className="app-store-small">Download on the</span>
                  <span className="app-store-large">App Store</span>
                </div>
              </a>
            </div>
          </div>
        </section>

        <div className="resume-container">
          <div className="resume-left-column">
            <section className="resume-section">
              <h2 className="resume-h2">Quick Intro</h2>
              <p className="resume-p">
                My name is HungYeh Chiang, a Computer Science Special Class student from NeiHu Senior High School. I
                began coding in 2022 inspired by tech visionaries like Elon Musk and Steve Jobs.
              </p>
              <p className="resume-p">
                I&apos;m pursuing an Information Science degree with a focus on Artificial Intelligence and algorithms,
                gaining practical experience through internships and competitions. I&apos;ll also take
                business-related courses to enhance my business management skills.
              </p>
              <p className="resume-p">
                My goal is to establish a tech company that positively impacts the world. After graduation, I&apos;ll
                grow my startup, but if that fails, I&apos;ll transition into software engineering to gain insights
                into corporate dynamics and operations.
              </p>
            </section>
          </div>

          <div className="resume-right-column">
            <section className="resume-section">
              <h2 className="resume-h2">Experience</h2>
              <ul className="resume-ul">
                <li className="resume-li">
                  <span className="resume-experience-item__company">JetFi Mobile</span> -{" "}
                  <span className="resume-experience-item__role">App Engineer</span>{" "}
                  <span className="resume-experience-item__year">2024 June~Now ({experienceDuration})</span>
                </li>
                <li className="resume-li">
                  <span className="resume-experience-item__company">
                    MAIC Most Innovation Award &amp; China Final 1st Place
                  </span>{" "}
                  - <span className="resume-experience-item__role">VCook App</span>{" "}
                  <span className="resume-experience-item__year">2025</span>
                </li>
                <li className="resume-li">
                  <span className="resume-experience-item__company">WWDC Swift Student Challenge Winner</span> -{" "}
                  <span className="resume-experience-item__role">MyGoal App</span>{" "}
                  <span className="resume-experience-item__year">2024</span>
                </li>
                <li className="resume-li">
                  <span className="resume-experience-item__company">WWDC Swift Student Challenge Winner</span> -{" "}
                  <span className="resume-experience-item__role">SwiftHub</span>{" "}
                  <span className="resume-experience-item__year">2025</span>
                </li>
                <li className="resume-li">
                  <span className="resume-experience-item__company">NHSH Robotics Club</span> -{" "}
                  <span className="resume-experience-item__role">President</span>{" "}
                  <span className="resume-experience-item__year">2022 - 2023</span>
                </li>
              </ul>
            </section>

            <section className="resume-section">
              <h2 className="resume-h2">Expertise</h2>
              <ul className="resume-ul">
                <li className="resume-li">
                  <span className="resume-experience-item__company">SwiftUI</span> -{" "}
                  <span className="resume-experience-item__year">3 years</span>
                </li>
                <li className="resume-li">
                  <span className="resume-experience-item__company">Java</span> -{" "}
                  <span className="resume-experience-item__year">3 years</span>
                </li>
                <li className="resume-li">
                  <span className="resume-experience-item__company">C</span> -{" "}
                  <span className="resume-experience-item__year">4 years</span>
                </li>
                <li className="resume-li">
                  <span className="resume-experience-item__company">Python</span> -{" "}
                  <span className="resume-experience-item__year">4 years</span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <footer>
        <p>&copy; {copyrightText} Vincent. All rights reserved.</p>
      </footer>
    </>
  );
}
