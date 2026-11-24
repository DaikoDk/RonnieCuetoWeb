export default function Footer() {
  return (
    <footer className="footer on-dark">
      <div className="wrap">
        <p>© {new Date().getFullYear()} Ronnie Contable</p>
        <ul>
          <li><a href="/privacidad.html">Política de privacidad</a></li>
          <li><a href="/terminos.html">Términos de uso</a></li>
        </ul>
      </div>
    </footer>
  );
}
