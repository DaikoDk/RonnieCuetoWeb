import { useEffect, useState } from "react";

const links = [
  ["#servicios", "Servicios"],
  ["#como-trabajamos", "Cómo trabajamos"],
  ["#preguntas", "Preguntas"],
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="topbar">
      <nav className={`nav wrap${open ? " is-open" : ""}`} aria-label="Principal">
        <a className="brand" href="#inicio" aria-current="page">
          <b>Ronnie Contable</b>
          <span>Estudio contable</span>
        </a>
        <ul className="nav-links" id="nav-links">
          {links.map(([href, label]) => (
            <li key={href}><a href={href} onClick={close}>{label}</a></li>
          ))}
          <li><a className="btn btn-primary btn-sm" href="#diagnostico" onClick={close}>Solicitar diagnóstico</a></li>
        </ul>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="nav-links"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span />
        </button>
      </nav>
    </header>
  );
}
