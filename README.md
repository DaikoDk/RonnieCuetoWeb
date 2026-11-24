# RonnieCuetoWeb

Landing page de outsourcing contable (planillas, contabilidad y tributario) hecha con React y Vite.

## Desarrollo

```bash
npm install
npm run dev      # http://127.0.0.1:5173
npm run build    # genera dist/
```

## Formulario de contacto

Copia `.env.example` como `.env` y completa `VITE_FORM_ENDPOINT` con la URL que recibe los contactos
(Formspree, n8n, Make o tu API). Si queda vacío, los datos solo se muestran en la consola del navegador.

El formulario califica cada contacto en `src/lib/qualify.js` y envía el segmento
(`prioritario`, `calificado`, `nutrir` o `fuera_de_perfil`) junto con los datos.

## Pendientes

- Reemplazar el texto de `public/privacidad.html` y `public/terminos.html`.
- Agregar `public/og-image.png` para compartir el enlace en redes.
