import { useReveal } from "../lib/hooks.js";

const steps = [
  ["Diagnóstico", "Revisamos tu régimen, libros y planilla actual. Te decimos qué está al día y qué no, antes de firmar nada."],
  ["Traspaso ordenado", "Coordinamos con tu contador anterior o tu área interna para recibir la información sin perder ningún periodo."],
  ["Primer cierre", "Cerramos el mes, presentamos tus declaraciones y te entregamos el primer reporte explicado."],
];

export default function Steps() {
  const ref = useReveal();
  return (
    <section className="section reveal" aria-labelledby="proceso-title" ref={ref}>
      <div className="wrap">
        <div className="section-head">
          <p className="label">Cómo empezamos</p>
          <h2 className="display-2" id="proceso-title">Del primer contacto al primer cierre</h2>
        </div>
        <ol className="steps">
          {steps.map(([title, text], i) => (
            <li key={title}>
              <span className="mono">Paso {i + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
