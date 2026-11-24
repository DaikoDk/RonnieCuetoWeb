import { useReveal } from "../lib/hooks.js";
import { faq } from "../data.js";

export default function Faq() {
  const ref = useReveal();
  return (
    <section className="section reveal" id="preguntas" aria-labelledby="faq-title" ref={ref}>
      <div className="wrap">
        <div className="section-head">
          <p className="label">Preguntas frecuentes</p>
          <h2 className="display-2" id="faq-title">Lo que suelen preguntarnos antes de empezar</h2>
        </div>
        <div className="faq">
          {faq.map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
