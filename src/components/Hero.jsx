import { ArrowRightIcon } from "@phosphor-icons/react";
import { closeRows } from "../data.js";

export default function Hero() {
  return (
    <section className="hero band-alt" id="inicio">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="label">Outsourcing contable, laboral y tributario</p>
          <h1 className="display-1">
            Tus libros cuadran.<br /> Tu planilla sale a tiempo.<br /> Tú diriges la empresa.
          </h1>
          <p className="lead">
            Llevamos tu contabilidad, calculamos tu planilla y presentamos tus declaraciones cada mes, con un contador responsable que te explica los números en lenguaje claro.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#diagnostico">
              Solicitar diagnóstico gratuito <ArrowRightIcon aria-hidden="true" />
            </a>
            <span className="hero-note">Primera reunión sin compromiso</span>
          </div>
        </div>

        <figure className="sheet" aria-label="Ejemplo del control de cierre mensual de un cliente">
          <div className="sheet-head">
            <h2>Cierre de octubre</h2>
            <span className="label">Comercial Andina S.A.C.</span>
          </div>
          <div className="table-scroll">
            <table className="ledger">
              <thead>
                <tr>
                  <th scope="col">Obligación</th>
                  <th scope="col" className="num">Docs.</th>
                  <th scope="col">Estado</th>
                </tr>
              </thead>
              <tbody>
                {closeRows.map(([name, docs, state, ok]) => (
                  <tr key={name}>
                    <td className="detail">{name}</td>
                    <td className="num">{docs}</td>
                    <td className={ok ? "ok" : "pend"}>{state}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>Total de documentos</td>
                  <td className="num"><span>445</span></td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
          <span className="stamp" aria-hidden="true">Declarado</span>
          <figcaption className="label sheet-cap">Ejemplo ilustrativo</figcaption>
        </figure>
      </div>
    </section>
  );
}
