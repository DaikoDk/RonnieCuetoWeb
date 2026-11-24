import { useReveal } from "../lib/hooks.js";
import { services } from "../data.js";

export default function Services() {
  const ref = useReveal();
  return (
    <section className="section reveal" id="servicios" aria-labelledby="servicios-title" ref={ref}>
      <div className="wrap">
        <div className="section-head">
          <p className="label">Servicios</p>
          <h2 className="display-2" id="servicios-title">Elige un servicio o deja todo el registro en nuestras manos</h2>
        </div>
        <div className="register" role="list">
          <div className="register-head" aria-hidden="true">
            <span className="label">Servicio</span>
            <span className="label">Qué hacemos</span>
            <span className="label">Lo que recibes</span>
          </div>
          {services.map((s) => (
            <article key={s.title} className={`register-row${s.featured ? " featured" : ""}`} role="listitem">
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <p className="docs">{s.docs}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
