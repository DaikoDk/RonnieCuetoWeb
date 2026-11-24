import { useReveal } from "../lib/hooks.js";

const debe = [
  "Subir tus comprobantes antes de la fecha de corte",
  "Avisarnos de ingresos, ceses y cambios de sueldo",
  "Aprobar la planilla antes del pago",
];
const haber = [
  "Registrar, conciliar y cerrar el mes",
  "Calcular la planilla y emitir boletas",
  "Presentar declaraciones según tu cronograma SUNAT",
  "Enviarte el reporte y explicarlo en una reunión",
  "Atender cualquier requerimiento de SUNAT o SUNAFIL",
];

function Column({ title, tag, items }) {
  return (
    <div className="t-col">
      <h3>{title} <span className="label">{tag}</span></h3>
      <ol>
        {items.map((it, i) => (
          <li key={it}><span className="mono">{i + 1}</span> {it}</li>
        ))}
      </ol>
    </div>
  );
}

export default function DebeHaber() {
  const ref = useReveal();
  return (
    <section className="section t-section band-alt reveal" id="como-trabajamos" aria-labelledby="t-title" ref={ref}>
      <div className="wrap">
        <div className="section-head">
          <p className="label">Cómo se reparte el trabajo</p>
          <h2 className="display-2" id="t-title">Tu parte cabe en una tarde al mes</h2>
          <p className="lead">Como en toda cuenta, hay dos columnas. La tuya es corta.</p>
        </div>
        <div className="t-account">
          <Column title="Lo que haces tú" tag="Debe" items={debe} />
          <Column title="Lo que hacemos nosotros" tag="Haber" items={haber} />
        </div>
        <p className="t-total"><span>Saldo del mes</span><span>Empresa al día</span></p>
      </div>
    </section>
  );
}
