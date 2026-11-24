import { useRef, useState } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowsClockwiseIcon,
  BookOpenTextIcon,
  BuildingsIcon,
  ChartLineUpIcon,
  CheckSquareOffsetIcon,
  FactoryIcon,
  PlantIcon,
  ReceiptIcon,
  StorefrontIcon,
  UsersThreeIcon,
  CheckIcon,
} from "@phosphor-icons/react";
import { qualify, resultCopy } from "../lib/qualify.js";
import { reduceMotion } from "../lib/hooks.js";

const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || "";

const STEPS = [
  { name: "Tu negocio", time: "menos de un minuto" },
  { name: "Lo que necesitas", time: "casi listo" },
  { name: "Tus datos de contacto", time: "último paso" },
];

const OPTIONS = {
  tipo: [
    ["persona_natural", "Tengo un negocio propio", "Persona natural con RUC", StorefrontIcon],
    ["mype", "Pequeña empresa", "Una S.A.C., E.I.R.L. o similar", BuildingsIcon],
    ["mediana", "Mediana o grande", "Con varias áreas o sedes", FactoryIcon],
    ["por_constituir", "Recién estoy empezando", "Aún sin empresa constituida", PlantIcon],
  ],
  trabajadores: [["0", "Ninguna"], ["1_10", "1 a 10"], ["11_50", "11 a 50"], ["51_200", "51 a 200"], ["200_mas", "Más de 200"]],
  comprobantes: [["lt_100", "Menos de 100"], ["100_500", "100 a 500"], ["500_2000", "500 a 2 000"], ["gt_2000", "Más de 2 000"]],
  ventas: [["lt_30k", "Hasta S/ 30 mil"], ["30k_150k", "S/ 30 a 150 mil"], ["150k_600k", "S/ 150 a 600 mil"], ["gt_600k", "Más de S/ 600 mil"], ["prefiero_no", "Prefiero no decirlo"]],
  regimen: [["no_se", "No estoy seguro"], ["nrus", "Nuevo RUS"], ["rer", "Especial (RER)"], ["rmt", "MYPE Tributario"], ["general", "General"]],
  servicios: [
    ["planilla", "Planillas", "Sueldos, boletas, CTS", UsersThreeIcon],
    ["contable", "Contabilidad", "Libros y cierre mensual", BookOpenTextIcon],
    ["tributario", "Impuestos", "Declaraciones a SUNAT", ReceiptIcon],
    ["regularizacion", "Ponerme al día", "Meses atrasados", ArrowsClockwiseIcon],
    ["reportes", "Reportes", "Entender mis números", ChartLineUpIcon],
    ["completo", "Todo lo anterior", "Outsourcing completo", CheckSquareOffsetIcon],
  ],
  situacion: [["externo", "Un contador externo"], ["interno", "Alguien en mi equipo"], ["yo", "Lo hago yo"], ["nadie", "Nadie todavía"]],
  atraso: [["no", "No, todo al día"], ["poco", "Unos meses"], ["mucho", "Más de 6 meses"], ["no_se", "No lo sé"]],
  urgencia: [["inmediato", "Lo antes posible"], ["trimestre", "En los próximos meses"], ["explorando", "Solo estoy averiguando"]],
};

const MESSAGES = {
  tipo: "Elige la opción que más se parece a tu caso.",
  regimen: 'Elige una opción. Si no lo sabes, marca "No estoy seguro".',
  trabajadores: "Elige un rango, aunque sea aproximado.",
  comprobantes: "Elige un rango, aunque sea aproximado.",
  ventas: 'Elige un rango o marca "Prefiero no decirlo".',
  servicios: "Marca al menos una opción para saber por dónde empezar.",
  situacion: "Elige una opción para seguir.",
  atraso: 'Elige una opción. "No lo sé" también vale.',
  urgencia: "Elige una opción para seguir.",
  nombre: "¿Cómo te llamamos? Escribe tu nombre.",
  email: "Revisa el correo, parece incompleto. Ejemplo: ana@tuempresa.pe",
  telefono: "Revisa el número: 9 dígitos que empiezan con 9.",
  ruc: "El RUC tiene 11 dígitos y empieza con 10, 15, 17 o 20.",
  consentimiento: "Marca la casilla para que podamos escribirte.",
};

const STEP_FIELDS = [
  ["tipo", "trabajadores", "comprobantes", "ventas", "regimen"],
  ["servicios", "situacion", "atraso", "urgencia"],
  ["nombre", "email", "telefono", "ruc", "consentimiento"],
];

const INITIAL = {
  tipo: "", trabajadores: "", comprobantes: "", ventas: "", regimen: "",
  servicios: [], situacion: "", atraso: "", urgencia: "",
  nombre: "", empresa: "", email: "", telefono: "", cargo: "", ruc: "", comentario: "",
  consentimiento: false,
};

const RULES = {
  servicios: (v) => v.length > 0,
  nombre: (v) => v.trim().length >= 3,
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
  telefono: (v) => /^(\+?51)?\s?9[0-9\s]{8,10}$/.test(v.trim()),
  ruc: (v) => v.trim() === "" || /^(10|15|17|20)[0-9]{9}$/.test(v.trim()),
  consentimiento: (v) => v === true,
};

const isValid = (name, v) => (RULES[name] ? RULES[name](v) : Boolean(v));

function Choice({ kind, type, name, value, checked, onChange, children }) {
  return (
    <label className={kind}>
      <input className="sr" type={type} name={name} value={value} checked={checked} onChange={onChange} />
      {children}
    </label>
  );
}

function Err({ errors, name }) {
  return errors[name] ? <p className="field-error" id={`err-${name}`}>{errors[name]}</p> : null;
}

export default function LeadForm() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | done
  const [failed, setFailed] = useState(false);
  const [result, setResult] = useState(null);
  const cardRef = useRef(null);
  const moreRef = useRef(null);

  const set = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => (e[name] ? { ...e, [name]: "" } : e));
  };
  const pick = (name) => (e) => set(name, e.target.value);
  const toggleService = (value) => (e) =>
    set("servicios", e.target.checked ? [...values.servicios, value] : values.servicios.filter((s) => s !== value));

  function validate(index) {
    const next = {};
    for (const name of STEP_FIELDS[index]) {
      if (!isValid(name, values[name])) next[name] = MESSAGES[name];
    }
    setErrors((e) => ({ ...e, ...next }));
    const first = Object.keys(next)[0];
    if (first) {
      if (first === "ruc" && moreRef.current) moreRef.current.open = true;
      requestAnimationFrame(() => {
        const el = cardRef.current.querySelector(`[name="${first}"]`);
        el?.focus({ preventScroll: false });
      });
    }
    return !first;
  }

  function goTo(index) {
    setStep(index);
    setFailed(false);
    requestAnimationFrame(() => {
      const card = cardRef.current;
      if (card && card.getBoundingClientRect().top < 0) {
        card.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" });
      }
    });
  }

  const next = () => validate(step) && goTo(step + 1);

  function onKeyDown(e) {
    if (e.key !== "Enter" || e.target.tagName === "TEXTAREA" || step === STEPS.length - 1) return;
    e.preventDefault();
    next();
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate(step)) return;
    const payload = { ...values, ...qualify(values), origen: location.href, fecha: new Date().toISOString() };
    setStatus("sending");
    setFailed(false);
    try {
      if (ENDPOINT) {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } else {
        console.info("Lead (sin VITE_FORM_ENDPOINT configurado):", payload);
        await new Promise((r) => setTimeout(r, 600));
      }
      const [title, text] = resultCopy[payload.segmento];
      const first = values.nombre.trim().split(/\s+/)[0];
      setResult({ title: first ? `${title}, ${first}` : title, text });
      setStatus("done");
    } catch {
      setStatus("idle");
      setFailed(true);
    }
  }

  const last = step === STEPS.length - 1;
  const text = (name, props = {}) => ({
    id: name,
    name,
    value: values[name],
    onChange: (e) => set(name, e.target.value),
    className: "input",
    "aria-invalid": errors[name] ? "true" : undefined,
    "aria-describedby": errors[name] ? `err-${name}` : undefined,
    ...props,
  });

  const chips = (name) => (
    <div className="chips" role="radiogroup" aria-labelledby={`${name}-label`}>
      {OPTIONS[name].map(([value, label]) => (
        <Choice key={value} kind="chip" type="radio" name={name} value={value} checked={values[name] === value} onChange={pick(name)}>
          {label}
        </Choice>
      ))}
    </div>
  );

  return (
    <section className="section form-section band-alt" id="diagnostico" aria-labelledby="form-title">
      <div className="wrap form-grid">
        <div className="form-intro">
          <p className="label">Diagnóstico gratuito</p>
          <h2 className="display-2" id="form-title">Conversemos sobre tu negocio</h2>
          <p className="lead">
            Son tres pasos cortos, casi todo con un clic. Con tus respuestas llegamos a la primera reunión con ideas concretas para tu caso.
          </p>
          <ul>
            {["Toma menos de dos minutos", "Te respondemos en un día hábil", "Tus datos solo se usan para contactarte"].map((t) => (
              <li key={t}><CheckIcon aria-hidden="true" /> {t}</li>
            ))}
          </ul>
        </div>

        <div className="sheet form-card" ref={cardRef}>
          {status === "done" ? (
            <div className="form-result" tabIndex={-1} ref={(el) => el?.focus()}>
              <span className="result-stamp" aria-hidden="true">Recibido</span>
              <h3>{result.title}</h3>
              <p className="muted">{result.text}</p>
            </div>
          ) : status === "sending" ? (
            <div className="form-loading" aria-busy="true" aria-label="Enviando">
              <span className="skeleton sk-title" /><span className="skeleton" /><span className="skeleton sk-short" />
            </div>
          ) : (
            <>
              <div className="form-top">
                <h3>Cuéntanos de tu negocio</h3>
                <div className="form-progress" aria-hidden="true">
                  {STEPS.map((s, i) => <span key={s.name} className={`dot${i <= step ? " is-active" : ""}`} />)}
                </div>
              </div>
              <p className="step-label" aria-live="polite">
                Paso {step + 1} de {STEPS.length} · {STEPS[step].name} · {STEPS[step].time}
              </p>

              <form noValidate onSubmit={onSubmit} onKeyDown={onKeyDown}>
                {step === 0 && (
                  <fieldset className="step-panel">
                    <legend>Empecemos por lo básico</legend>

                    <div className="field">
                      <p className="q" id="tipo-label">¿Cómo describirías tu negocio?</p>
                      <div className="cards" role="radiogroup" aria-labelledby="tipo-label">
                        {OPTIONS.tipo.map(([value, title, sub, Icon]) => (
                          <Choice key={value} kind="card-opt" type="radio" name="tipo" value={value} checked={values.tipo === value} onChange={pick("tipo")}>
                            <Icon aria-hidden="true" />
                            <span><b>{title}</b><small>{sub}</small></span>
                          </Choice>
                        ))}
                      </div>
                      <Err errors={errors} name="tipo" />
                      <p className="hint">
                        ¿Solo necesitas tu declaración de renta personal?{" "}
                        <button type="button" className="link-btn" onClick={() => set("tipo", "sin_negocio")}>
                          {values.tipo === "sin_negocio" ? "Opción elegida ✓" : "Elige esta opción"}
                        </button>
                      </p>
                    </div>

                    <div className="field">
                      <p className="q" id="trabajadores-label">¿Cuántas personas tienes en planilla?</p>
                      {chips("trabajadores")}
                      <Err errors={errors} name="trabajadores" />
                    </div>

                    <div className="field">
                      <p className="q" id="comprobantes-label">¿Cuántas facturas y boletas mueves al mes?</p>
                      <p className="hint">Suma las que emites y las que recibes. Un cálculo aproximado basta.</p>
                      {chips("comprobantes")}
                      <Err errors={errors} name="comprobantes" />
                    </div>

                    <div className="field">
                      <p className="q" id="ventas-label">¿Cuánto vendes al mes, más o menos?</p>
                      {chips("ventas")}
                      <Err errors={errors} name="ventas" />
                    </div>

                    <div className="field">
                      <p className="q" id="regimen-label">¿En qué régimen tributario estás?</p>
                      <p className="hint">Aparece en tu ficha RUC. Si no lo sabes, no pasa nada: lo revisamos juntos.</p>
                      {chips("regimen")}
                      <Err errors={errors} name="regimen" />
                    </div>
                  </fieldset>
                )}

                {step === 1 && (
                  <fieldset className="step-panel">
                    <legend>¿En qué te podemos ayudar?</legend>

                    <div className="field">
                      <p className="q" id="servicios-label">Marca todo lo que te interese</p>
                      <div className="cards" role="group" aria-labelledby="servicios-label">
                        {OPTIONS.servicios.map(([value, title, sub, Icon]) => (
                          <Choice key={value} kind="card-opt" type="checkbox" name="servicios" value={value} checked={values.servicios.includes(value)} onChange={toggleService(value)}>
                            <Icon aria-hidden="true" />
                            <span><b>{title}</b><small>{sub}</small></span>
                          </Choice>
                        ))}
                      </div>
                      <Err errors={errors} name="servicios" />
                    </div>

                    <div className="field">
                      <p className="q" id="situacion-label">¿Quién lleva tus cuentas hoy?</p>
                      {chips("situacion")}
                      <Err errors={errors} name="situacion" />
                    </div>

                    <div className="field">
                      <p className="q" id="atraso-label">¿Tienes declaraciones o libros pendientes?</p>
                      <p className="hint">Es más común de lo que crees. Nos ayuda a planificar.</p>
                      {chips("atraso")}
                      <Err errors={errors} name="atraso" />
                    </div>

                    <div className="field">
                      <p className="q" id="urgencia-label">¿Cuándo te gustaría empezar?</p>
                      {chips("urgencia")}
                      <Err errors={errors} name="urgencia" />
                    </div>
                  </fieldset>
                )}

                {step === 2 && (
                  <fieldset className="step-panel">
                    <legend>Último paso: ¿cómo te contactamos?</legend>

                    <div className="field-row">
                      <div className="field">
                        <label className="q" htmlFor="nombre">Tu nombre</label>
                        <input {...text("nombre", { type: "text", autoComplete: "name", placeholder: "Ana Quispe" })} />
                        <Err errors={errors} name="nombre" />
                      </div>
                      <div className="field">
                        <label className="q" htmlFor="empresa">Nombre de tu negocio <span className="opt">opcional</span></label>
                        <input {...text("empresa", { type: "text", autoComplete: "organization" })} />
                      </div>
                    </div>

                    <div className="field-row">
                      <div className="field">
                        <label className="q" htmlFor="email">Correo</label>
                        <input {...text("email", { type: "email", autoComplete: "email", placeholder: "ana@tuempresa.pe" })} />
                        <Err errors={errors} name="email" />
                      </div>
                      <div className="field">
                        <label className="q" htmlFor="telefono">Celular o WhatsApp</label>
                        <input {...text("telefono", { type: "tel", autoComplete: "tel", inputMode: "tel", placeholder: "987 654 321" })} />
                        <Err errors={errors} name="telefono" />
                      </div>
                    </div>

                    <details className="more" ref={moreRef}>
                      <summary>Agregar más detalles <span className="opt">opcional</span></summary>
                      <div className="more-body">
                        <div className="field-row">
                          <div className="field">
                            <label className="q" htmlFor="cargo">Tu cargo</label>
                            <input {...text("cargo", { type: "text", autoComplete: "organization-title", placeholder: "Gerente general" })} />
                          </div>
                          <div className="field">
                            <label className="q" htmlFor="ruc">RUC</label>
                            <input {...text("ruc", { type: "text", inputMode: "numeric", maxLength: 11, className: "input mono" })} />
                            <Err errors={errors} name="ruc" />
                          </div>
                        </div>
                        <div className="field">
                          <label className="q" htmlFor="comentario">¿Algo que debamos saber?</label>
                          <textarea {...text("comentario", { rows: 3, maxLength: 600, placeholder: "Por ejemplo: tenemos una auditoría en marzo" })} />
                        </div>
                      </div>
                    </details>

                    <label className="consent">
                      <input
                        type="checkbox"
                        name="consentimiento"
                        checked={values.consentimiento}
                        onChange={(e) => set("consentimiento", e.target.checked)}
                        aria-invalid={errors.consentimiento ? "true" : undefined}
                      />
                      <span>Acepto la <a href="/privacidad.html">política de privacidad</a> y que me contacten sobre este servicio.</span>
                    </label>
                    <Err errors={errors} name="consentimiento" />
                  </fieldset>
                )}

                {failed && (
                  <p className="form-error" role="alert">
                    No pudimos enviar tu solicitud. Revisa tu conexión e inténtalo de nuevo.
                  </p>
                )}

                <div className="form-nav">
                  {step > 0 && (
                    <button type="button" className="btn btn-ghost" onClick={() => goTo(step - 1)}>
                      <ArrowLeftIcon aria-hidden="true" /> Atrás
                    </button>
                  )}
                  {last ? (
                    <button type="submit" className="btn btn-primary">Quiero mi diagnóstico</button>
                  ) : (
                    <button type="button" className="btn btn-primary" onClick={next}>
                      Continuar <ArrowRightIcon aria-hidden="true" />
                    </button>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
