// Puntúa el contacto para que ventas priorice. El segmento viaja con los datos enviados.
export function qualify(d) {
  if (d.tipo === "sin_negocio") {
    return { segmento: "fuera_de_perfil", puntaje: 0 };
  }

  const pts = {
    tipo: { persona_natural: 0, por_constituir: 0, mype: 1, mediana: 3 },
    trabajadores: { "0": 0, "1_10": 1, "11_50": 2, "51_200": 3, "200_mas": 3 },
    comprobantes: { lt_100: 0, "100_500": 1, "500_2000": 2, gt_2000: 3 },
    ventas: { lt_30k: 0, "30k_150k": 1, "150k_600k": 2, gt_600k: 3, prefiero_no: 1 },
    urgencia: { inmediato: 2, trimestre: 1, explorando: 0 },
    regimen: { nrus: -1, rer: 0, rmt: 1, general: 2, no_se: 0 },
  };

  let score = 0;
  for (const key of Object.keys(pts)) score += pts[key][d[key]] ?? 0;
  if (d.servicios.includes("completo")) score += 2;
  else if (d.servicios.length >= 2) score += 1;
  if (d.servicios.includes("regularizacion") || d.atraso === "mucho") score += 1;

  let segmento = "nutrir";
  if (score >= 9) segmento = "prioritario";
  else if (score >= 5) segmento = "calificado";
  if (d.regimen === "nrus" && d.trabajadores === "0") segmento = "nutrir";

  return { segmento, puntaje: score };
}

export const resultCopy = {
  prioritario: ["Listo", "Un contador senior revisará tu caso y te llamará en las próximas 24 horas hábiles para agendar el diagnóstico."],
  calificado: ["Listo", "Te escribiremos en un día hábil para coordinar una reunión de diagnóstico de 30 minutos."],
  nutrir: ["Gracias por escribirnos", "Te enviaremos por correo una guía con los primeros pasos para ordenar tu contabilidad y te contactaremos cuando quieras avanzar."],
  fuera_de_perfil: ["Gracias por escribirnos", "Nuestro servicio está pensado para negocios. Te enviaremos por correo información sobre declaraciones de renta personal."],
};
