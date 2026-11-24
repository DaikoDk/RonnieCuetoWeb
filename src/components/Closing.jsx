import { ArrowRightIcon } from "@phosphor-icons/react";

export default function Closing() {
  return (
    <section className="closing on-dark">
      <div className="wrap">
        <h2 className="display-2">Deja de preocuparte por el cierre del mes</h2>
        <p className="lead">Cuéntanos sobre tu empresa y te proponemos cómo ponerla al día.</p>
        <a className="btn btn-primary" href="#diagnostico">
          Solicitar diagnóstico gratuito <ArrowRightIcon aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
