const forms = ["PLE", "PDT 621", "PLAME", "T Registro", "AFPnet", "Renta anual", "Libros electrónicos"];

export default function FormsStrip() {
  return (
    <div className="forms-strip on-dark" aria-label="Formularios y libros que gestionamos">
      <div className="wrap">
        <span className="label">Nos encargamos de</span>
        <ul>
          {forms.map((f) => <li key={f}>{f}</li>)}
        </ul>
      </div>
    </div>
  );
}
