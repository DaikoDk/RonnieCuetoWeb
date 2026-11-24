import { useEffect, useRef } from "react";
import { reduceMotion } from "../lib/hooks.js";

const lines = ["Tú decides con números claros.", "Nosotros cuidamos que cada fecha se cumpla."];

// Each word lights up on its own as it crosses a trigger line at 60% of the viewport.
export default function Tagline() {
  const root = useRef(null);

  useEffect(() => {
    const words = root.current.querySelectorAll(".word");
    if (reduceMotion()) {
      words.forEach((w) => w.classList.add("is-lit"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-lit");
          io.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -40% 0px", threshold: 1 }
    );
    words.forEach((w) => io.observe(w));
    return () => io.disconnect();
  }, []);

  let n = 0;
  return (
    <section className="tagline on-dark" aria-label="Nuestra promesa">
      <div className="wrap">
        <p className="tagline-text" ref={root}>
          {lines.map((line, li) => (
            <span key={line}>
              {line.split(" ").map((word) => (
                <span key={`${li}-${n}`} className="word" style={{ transitionDelay: `${(n++ % 6) * 60}ms` }}>
                  {word}{" "}
                </span>
              ))}
              {li < lines.length - 1 && <br />}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
