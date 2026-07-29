
// --- From COMITE --- //
// ============================================================
// C-MOVIL · Etapa de Decisiones · Firmas de Autorización
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  window.activarEtapa = function (nombreEtapa) {
    const normEtapa = nombreEtapa ? nombreEtapa.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";
    document.querySelectorAll('.stage-btn').forEach(btn => {
      btn.classList.remove('stage-active');
      const btnTextNorm = btn.textContent.trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (btnTextNorm === normEtapa) {
        btn.classList.add('stage-active');
      }
    });

    const allTabs = document.querySelectorAll('.tab');
    allTabs.forEach(tab => {
      tab.hidden = true;
      tab.classList.remove('active');
    });

    let firstTab = null;
    allTabs.forEach(tab => {
      const stage = tab.getAttribute('data-stage');
      const normStage = stage ? stage.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";
      if (normStage && normStage === normEtapa) {
        tab.hidden = false;
        if (!firstTab) firstTab = tab;
      }
    });

    const todasLasSecciones = [
      'MesaControl', 'vistaOrdenPagoDiv', 'vistaOrdenPago',
      'dictamen', 'dictamenQuash', 'historial', 'tipoActa', 'generarActa', 'firmas',
      'cargaDocumentos', 'aplicacionPagos', 'registroGarantia', 'valuacion',
      'firmasMayor', 'firmasMenor', 'kitLegal', 'liberacion'
    ];
    todasLasSecciones.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.hidden = true;
        el.style.display = '';
      }
    });

    switch (normEtapa) {
      case 'KIT LEGAL':
        const kl = document.getElementById('kitLegal');
        if (kl) { kl.hidden = false; kl.style.display = 'block'; }
        if (typeof window.renderAllKitTables === 'function') window.renderAllKitTables();
        break;

      case 'LIBERACION':
        const lib = document.getElementById('liberacion');
        if (lib) { lib.hidden = false; lib.style.display = 'block'; }
        if (typeof window.mostrarDocumentosLiberacion === 'function') {
          window.mostrarDocumentosLiberacion();
        } else if (typeof window.renderSolicitud === 'function') {
          window.renderSolicitud();
        }
        break;

      case 'MESA DE CONTROL':
        const mesa = document.getElementById('MesaControl');
        if (mesa) mesa.hidden = false;
        if (typeof window.mostrarVistaGeneral === 'function') window.mostrarVistaGeneral();
        break;

      case 'ORDEN DE PAGO':
        const secOP = document.getElementById('vistaOrdenPago');
        const divOP = document.getElementById('vistaOrdenPagoDiv');
        if (secOP) { secOP.hidden = false; secOP.style.display = 'block'; }
        if (divOP) { divOP.hidden = false; divOP.style.display = 'block'; }
        if (typeof window.renderOrdenPago === 'function') window.renderOrdenPago();
        break;

      case 'DECISIONES':
        if (typeof window.mostrarDictamen === 'function') window.mostrarDictamen();
        break;

      case 'CARGA DE DOCUMENTOS':
        if (typeof window.mostrarCargaDocumentos === 'function') window.mostrarCargaDocumentos();
        break;

      case 'APLICACION DE PAGOS':
        if (typeof window.mostrarAplicacionPagos === 'function') window.mostrarAplicacionPagos();
        break;

      case 'REGISTRO DE GARANTIA Y OTROS':
        if (typeof window.mostrarRegistroGarantia === 'function') window.mostrarRegistroGarantia();
        break;
    }
  };


  /* ---------------------------------------------------------
     1. Catálogo de comité
  --------------------------------------------------------- */
  const TITULAR_PRESIDENTE = 'ING. JUAN MORENO DE LA HIGUERA';
  const TITULAR_SECRETARIA = 'LIC. MELISA CRUZ CRUZ';

  const SUPLENTES_PRESIDENTE = [
    'LIC. ELDA AZUCENA LOPEZ MATIAS',
    'LIC. ARNOLDO MONZON ALTUZAR',
    'LIC. JAIR ALEXANDER JIMENEZ LOPEZ',
    'LIC. LUIS ALBERTO ESTRADA CAMACHO'
  ];

  const SUPLENTES_SECRETARIA = [
    'LIC. ELDA AZUCENA LOPEZ MATIAS',
    'LIC. ARNOLDO MONZON ALTUZAR',
    'LIC. JAIR ALEXANDER JIMENEZ LOPEZ',
    'LIC. LUIS ALBERTO ESTRADA CAMACHO'
  ];

  function poblarNombres(selectNombre, tipo, nombreTitular, listaSuplentes) {
    selectNombre.innerHTML = '';

    if (tipo === 'titular') {
      const opt = document.createElement('option');
      opt.value = nombreTitular;
      opt.textContent = nombreTitular;
      selectNombre.appendChild(opt);
      selectNombre.disabled = false;
    } else {
      listaSuplentes.forEach((nombre, idx) => {
        const opt = document.createElement('option');
        opt.value = `${nombre}__${idx + 1}`;
        opt.textContent = `${nombre}`;
        selectNombre.appendChild(opt);
      });
      selectNombre.disabled = false;
    }
  }

  const presidenteTipo = document.getElementById('presidenteTipo');
  const presidenteNombre = document.getElementById('presidenteNombre');

  if (presidenteTipo && presidenteNombre) {
    poblarNombres(presidenteNombre, presidenteTipo.value, TITULAR_PRESIDENTE, SUPLENTES_PRESIDENTE);
    presidenteTipo.addEventListener('change', () => {
      poblarNombres(presidenteNombre, presidenteTipo.value, TITULAR_PRESIDENTE, SUPLENTES_PRESIDENTE);
    });
  }

  const secretariaTipo = document.getElementById('secretariaTipo');
  const secretariaNombre = document.getElementById('secretariaNombre');

  if (secretariaTipo && secretariaNombre) {
    poblarNombres(secretariaNombre, secretariaTipo.value, TITULAR_SECRETARIA, SUPLENTES_SECRETARIA);
    secretariaTipo.addEventListener('change', () => {
      poblarNombres(secretariaNombre, secretariaTipo.value, TITULAR_SECRETARIA, SUPLENTES_SECRETARIA);
    });
  }

  const chkFirmaEspecial = document.getElementById('requiereFirmaEspecial');
  const chkFirmaExtraordinaria = document.getElementById('requiereFirmaExtraordinaria');
  const wrapperFirmaEspecial = document.getElementById('wrapperFirmaEspecial');
  const wrapperFirmaExtraordinaria = document.getElementById('wrapperFirmaExtraordinaria');
  const wrapperFirmaVacio = document.getElementById('wrapperFirmaVacio');
  const firmaExtraordinaria = document.getElementById('firmaExtraordinaria');

  function actualizarVisibilidadFirmas() {
    const mostrarEspecial = chkFirmaEspecial ? chkFirmaEspecial.checked : false;
    const mostrarExtraordinaria = chkFirmaExtraordinaria ? chkFirmaExtraordinaria.checked : false;

    if (wrapperFirmaEspecial) wrapperFirmaEspecial.style.display = mostrarEspecial ? 'flex' : 'none';
    if (wrapperFirmaExtraordinaria) wrapperFirmaExtraordinaria.style.display = mostrarExtraordinaria ? 'flex' : 'none';

    if (wrapperFirmaVacio) {
      wrapperFirmaVacio.style.display = (mostrarEspecial || mostrarExtraordinaria) ? 'block' : 'none';
    }

    if (!mostrarExtraordinaria && firmaExtraordinaria) {
      firmaExtraordinaria.value = '';
    }
  }

  if (chkFirmaEspecial) {
    chkFirmaEspecial.addEventListener('change', () => {
      actualizarVisibilidadFirmas();
      marcarUltimaModificacion();
    });
  }

  if (chkFirmaExtraordinaria) {
    chkFirmaExtraordinaria.addEventListener('change', () => {
      actualizarVisibilidadFirmas();
      marcarUltimaModificacion();
    });
  }

  /* ---------------------------------------------------------
     2. Fechas automáticas
  --------------------------------------------------------- */
  const autorizacionSelect = document.getElementById('autorizacion');
  const fechaAprobacionInput = document.getElementById('fechaAprobacion');
  const fechaResolucionInput = document.getElementById('fechaResolucion');
  const ultimaModificacionInput = document.getElementById('ultimaModificacion');

  function formatearFecha(date) {
    const opciones = {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    };
    return date.toLocaleString('es-MX', opciones);
  }

  function marcarUltimaModificacion() {
    if (ultimaModificacionInput) {
      ultimaModificacionInput.value = formatearFecha(new Date());
    }
  }

  marcarUltimaModificacion();

  /* ---------------------------------------------------------
     2.1 Plantillas de resoluciones predefinidas
  --------------------------------------------------------- */
  const PLANTILLAS_RESOLUCION = {
    autorizado: [
      { titulo: "1. Previo a solicitud, integrar permiso a nombre del cliente", texto: "1.- Previo a la solicitud del contrato, se deberá integrar el permiso a nombre de la cliente." },
      { titulo: "2. Validar información y declinar por inconsistencias", texto: "2.- Durante el desembolso, se deberá validar la información proporcionada por el cliente y, de encontrarse alguna inconsistencia, se podrá declinar el presente crédito." },
      { titulo: "3. Puntual seguimiento al caso hasta recuperación al 100%", texto: "3.- Puntual seguimiento al caso por parte del ejecutivo, gerente y D.C. hasta la recuperación del crédito al 100%." },
      { titulo: "4. No liberar factura de unidad en garantía hasta liquidación", texto: "4.- No liberar la factura de la unidad en garantía hasta la liquidación del presente crédito al 100%." },
      { titulo: "5. Plan de pago semanal por importes vencidos en buró", texto: "5.- Se autoriza plan de pago semanal; esto debido a los importes vencidos que el cliente reporta en su buró de crédito." },
      { titulo: "6. Autorización por $0.00 descontando cuotas pendientes", texto: "6.- El presente caso se autoriza por un monto de $0.00. De este monto, se deberán descontar las cuotas pendientes por cubrir para la liquidación del crédito N.º XXXXXX y la diferencia desembolsarse a la cuenta del cliente." },
      { titulo: "7. Autorización por argumentos de Gerente (dd/mm/aa)", texto: "7.- Para la autorización del presente crédito, se toman en cuenta los argumentos expuestos por la gerente en su correo de fecha dd/mm/aa, asumiendo cualquier responsabilidad en caso de suscitarse problemas en la recuperación y localización del cliente." },
      { titulo: "8. Coincidencia SAFI en nombre de cliente (sin riesgo)", texto: "8.- Con respecto al reporte de coincidencia en SAFI emitido por el área de análisis de crédito, al revisarlo se detecta que la coincidencia radica en el nombre del cliente, mas no en su RFC y fecha de nacimiento, no detectando al momento riesgo alguno." },
      { titulo: "9. Coincidencia SAFI en nombre de cliente, obligaciones ISR/IVA", texto: "9.- Con respecto al reporte de coincidencia en SAFI emitido por el área de análisis de crédito, al revisarlo se detecta que la coincidencia radica en el nombre de la cliente, mas no se pudo corroborar por su RFC y CURP ya que el reporte no emite información alguna, no detectándose al momento de la revisión riesgo alguno. Su constancia de situación fiscal reporta algunas obligaciones tales como declaración anual de ISR, pago de IVA, declaración de proveedores de IVA y pago provisional mensual de ISR por actividades empresariales." },
      { titulo: "10. Pagaré de Distribuidor por $0.00 como garantía alterna", texto: "10.- Como mitigante de riesgo para el presente crédito, se constituirá como garantía alterna la firma de un pagaré por parte del Distribuidor XXXXXX por la cantidad de $0.00; esto previo a la formalización del contrato, puntualizándose que en caso de incumplimiento de pago del cliente, así como de problemas para la adjudicación de la unidad, Asefimex podrá ejecutar como medio de pago del presente crédito el referido pagaré suscrito por el distribuidor. Esto se realizará de manera inmediata y no implicará que se tengan que agotar los procedimientos de cobranza y adjudicación de la unidad en garantía." },
      { titulo: "11. Participación de Distribuidor y sucursal hasta recuperación", texto: "11.- Para el seguimiento puntual del presente crédito, se establece como condición la participación conjunta y activa del Distribuidor y la sucursal de Asefimex hasta la recuperación del crédito al 100%." },
      { titulo: "12. Integrar reporte fotográfico (actividad/domicilio)", texto: "12.- Previo a la solicitud del contrato, se deberá integrar el reporte fotográfico debidamente requisitado con fotos del domicilio y de la actividad económica, ya que se presenta sin fotografías." }
    ],
    observado: [
      { titulo: "1. Integrar aval del núcleo familiar (papá/mamá)", texto: "1.- Deberá integrarse a una persona del núcleo familiar (papá o mamá) como aval y que cumpla acorde a la política, para con ello poder emitir un dictamen (dd/mm/aa)." },
      { titulo: "2. Visita domiciliar y validación de información", texto: "2.- Se solicita al ejecutivo/gerente realizar la visita domiciliaria al cliente y al aval, verificar y validar la información para de ello poder emitir un dictamen." },
      { titulo: "3. Considerar plan de pago semanal", texto: "3.- Se podrá considerar la presente solicitud con plan de pago semanal, esto debido a los importes vencidos que el cliente reporta en su buró de crédito." },
      { titulo: "4. Integrar al cónyuge como aval", texto: "4.- Se solicita integrar al cónyuge como aval, y que cumpla acorde a la política." },
      { titulo: "5. Presentar evidencia documental de actividad productiva", texto: "5.- Se solicita presentar evidencia documental de su actividad productiva y con ello poder emitir un dictamen." },
      { titulo: "6. No acredita arraigo domiciliario", texto: "6.- No acredita arraigo domiciliario." },
      { titulo: "7. Integrar aval que cumpla con política de crédito", texto: "7.- Integrar un aval que cumpla acorde a la política (arraigo, buen historial crediticio y actividad productiva) y con ello poder emitir un dictamen." },
      { titulo: "8. Acreditar ingresos por actividad declarada", texto: "8.- Acreditar los ingresos por su actividad productiva declarada en el cuestionario económico y con ello poder emitir un dictamen." }
    ],
    rechazado: [
      { titulo: "1. Rechazo por mal historial crediticio en buró", texto: "1.- El presente caso se rechaza por el mal historial crediticio que reporta en su buró de crédito." },
      { titulo: "2. Rechazo por falta de capacidad de pago", texto: "2.- Se rechaza por no tener capacidad de pago." },
      { titulo: "3. Rechazo por avance de crédito vigente (política > 50%)", texto: "3.- Por el momento, la presente solicitud se rechaza debido a que, por el avance que el cliente lleva en su crédito vigente con Asefimex, no cumple con lo dispuesto en la política de crédito (más del 50%)." },
      { titulo: "4. Rechazo por perfil transaccional del cliente", texto: "4.- Por el perfil transaccional del cliente, se rechaza el presente caso." }
    ]
  };

  /* ---------------------------------------------------------
     3. Función para mostrar/ocultar botones de solventación
  --------------------------------------------------------- */
  function actualizarBotonesSolventacion(mostrar) {
    const btnDocumentos = document.getElementById('btnDocumentosCliente');
    const btnCaratula = document.getElementById('btnCaratulaComite');
    const radioMayor = document.getElementById('actaMayor');
    const radioMenor = document.getElementById('actaMenor');

    if (btnDocumentos && btnCaratula) {
      if (mostrar) {
        btnDocumentos.style.display = 'inline-flex';
        btnCaratula.style.display = 'inline-flex';
      } else {
        btnDocumentos.style.display = 'none';
        btnCaratula.style.display = 'none';
      }
    }

    if (radioMayor && radioMenor) {
      if (radioMayor.checked) {
        radioMayor.checked = false;
        radioMenor.checked = false;
      } else if (radioMenor.checked) {
        radioMayor.checked = false;
        radioMenor.checked = false;
      }
    }
  }

  const firmasMayor = document.getElementById('firmasMayor');
  const firmasMenor = document.getElementById('firmasMenor');
  const radioMayor = document.getElementById('actaMayor');
  const radioMenor = document.getElementById('actaMenor');

  function actualizarFirmasActa() {
    if (radioMayor && radioMayor.checked) {
      if (firmasMayor) firmasMayor.hidden = false;
      if (firmasMenor) firmasMenor.hidden = true;
    } else if (radioMenor && radioMenor.checked) {
      if (firmasMayor) firmasMayor.hidden = true;
      if (firmasMenor) firmasMenor.hidden = false;
    }
  }

  if (radioMayor) {
    radioMayor.addEventListener('change', actualizarFirmasActa);
  }

  if (radioMenor) {
    radioMenor.addEventListener('change', actualizarFirmasActa);
  }

  // Inicializar estado
  actualizarFirmasActa();

  /* ---------------------------------------------------------
     4. Funciones de navegación de tabs
  --------------------------------------------------------- */
  window.menuActaComite = function () {
    actualizarBotonesSolventacion(true);

    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      const tabText = tab.textContent.trim();
      if (tabText === 'Dictamen' || tabText === 'Dictamen Quash' || tabText === 'Acta de Comite') {
        tab.hidden = false;
      }
    });

    const firmas = document.getElementById('firmas');
    const dictamen = document.getElementById('dictamen');
    const dictamenQuash = document.getElementById('dictamenQuash');
    const historial = document.getElementById('historial');
    const tipoActa = document.getElementById('tipoActa');
    const generarActa = document.getElementById('generarActa');
    const cargaDocumentos = document.getElementById('cargaDocumentos');
    const tabCarga = document.getElementById('tabCargaDocumentos');
    const aplicacionPagos = document.getElementById('aplicacionPagos');
    const tabPagos = document.getElementById('tabAplicacionPagos');

    if (dictamen) dictamen.hidden = true;
    if (dictamenQuash) dictamenQuash.hidden = true;
    if (historial) historial.hidden = true;
    if (cargaDocumentos) cargaDocumentos.hidden = true;
    if (aplicacionPagos) aplicacionPagos.hidden = true;
    if (firmas) firmas.hidden = true;
    if (tipoActa) tipoActa.hidden = false;
    if (generarActa) generarActa.hidden = false;
    if (tabCarga) tabCarga.hidden = true;
    if (tabPagos) tabPagos.hidden = true;

    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    const actaTab = document.querySelector('.tab[data-tab="receptora"]');
    if (actaTab) actaTab.classList.add('active');
  };

  window.mostrarDictamen = function () {
    actualizarBotonesSolventacion(true);

    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      const tabText = tab.textContent.trim();
      if (tabText === 'Dictamen' || tabText === 'Dictamen Quash' || tabText === 'Acta de Comite') {
        tab.hidden = false;
      }
    });

    const firmas = document.getElementById('firmas');
    const firmasMayor = document.getElementById('firmasMayor');
    const firmasMenor = document.getElementById('firmasMenor');
    const dictamen = document.getElementById('dictamen');
    const dictamenQuash = document.getElementById('dictamenQuash');
    const historial = document.getElementById('historial');
    const tipoActa = document.getElementById('tipoActa');
    const generarActa = document.getElementById('generarActa');
    const cargaDocumentos = document.getElementById('cargaDocumentos');
    const tabCarga = document.getElementById('tabCargaDocumentos');
    const aplicacionPagos = document.getElementById('aplicacionPagos');
    const tabPagos = document.getElementById('tabAplicacionPagos');

    if (dictamen) dictamen.hidden = false;
    if (dictamenQuash) dictamenQuash.hidden = true;
    if (historial) historial.hidden = false;
    if (tipoActa) tipoActa.hidden = true;
    if (generarActa) generarActa.hidden = true;
    if (cargaDocumentos) cargaDocumentos.hidden = true;
    if (aplicacionPagos) aplicacionPagos.hidden = true;
    if (firmas) firmas.hidden = false;
    if (firmasMayor) firmasMayor.hidden = true;
    if (firmasMenor) firmasMenor.hidden = true;
    if (tabCarga) tabCarga.hidden = false;
    if (tabPagos) tabPagos.hidden = false;

    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    const dictamenTab = document.querySelector('.tab[data-tab="dictamen"]');
    if (dictamenTab) dictamenTab.classList.add('active');

    const dictamenHeader = document.querySelector('#dictamen .card-header h2');
    if (dictamenHeader) dictamenHeader.textContent = 'Resolución de Comité de Crédito';
  };

  window.mostrarDictamenQuash = function () {
    actualizarBotonesSolventacion(true);

    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      const tabText = tab.textContent.trim();
      if (tabText === 'Dictamen' || tabText === 'Dictamen Quash' || tabText === 'Acta de Comite') {
        tab.hidden = false;
      }
    });

    const firmas = document.getElementById('firmas');
    const firmasMayor = document.getElementById('firmasMayor');
    const firmasMenor = document.getElementById('firmasMenor');
    const dictamen = document.getElementById('dictamen');
    const dictamenQuash = document.getElementById('dictamenQuash');
    const historial = document.getElementById('historial');
    const tipoActa = document.getElementById('tipoActa');
    const generarActa = document.getElementById('generarActa');
    const cargaDocumentos = document.getElementById('cargaDocumentos');
    const tabCarga = document.getElementById('tabCargaDocumentos');
    const aplicacionPagos = document.getElementById('aplicacionPagos');
    const tabPagos = document.getElementById('tabAplicacionPagos');

    if (dictamen) dictamen.hidden = true;
    if (dictamenQuash) dictamenQuash.hidden = false;
    if (historial) historial.hidden = true;
    if (tipoActa) tipoActa.hidden = true;
    if (generarActa) generarActa.hidden = true;
    if (cargaDocumentos) cargaDocumentos.hidden = true;
    if (aplicacionPagos) aplicacionPagos.hidden = true;
    if (firmas) firmas.hidden = true;
    if (firmasMayor) firmasMayor.hidden = true;
    if (firmasMenor) firmasMenor.hidden = true;
    if (tabCarga) tabCarga.hidden = false;
    if (tabPagos) tabPagos.hidden = false;

    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    const quashTab = document.querySelector('.tab[data-tab="dictamen-quash"]');
    if (quashTab) quashTab.classList.add('active');

    actualizarDatosQuash();
  };

  function actualizarDatosQuash() {
    const quashData = {
      resultado: 'AUTORIZADO',
      score: '69%',
      observaciones: 'No aplica',
      edad: 'No aplica',
      sexo: 'Agregar pareja como co acreditado',
      estadoCivil: 'Validar criterio estado civil femenino',
      actividadEconomica: 'No aplica',
      consultaHC: 'No aplica'
    };

    const resultadoEl = document.getElementById('quashResultado');
    if (resultadoEl) {
      resultadoEl.textContent = quashData.resultado;
      resultadoEl.className = 'quash-value';
      if (quashData.resultado === 'AUTORIZADO') {
        resultadoEl.classList.add('quash-autorizado');
      } else if (quashData.resultado === 'OBSERVADO') {
        resultadoEl.classList.add('quash-observado');
      } else if (quashData.resultado === 'RECHAZADO') {
        resultadoEl.classList.add('quash-rechazado');
      }
    }

    const scoreEl = document.getElementById('quashScore');
    if (scoreEl) scoreEl.textContent = quashData.score;

    const observacionesEl = document.getElementById('quashObservaciones');
    if (observacionesEl) observacionesEl.textContent = quashData.observaciones;

    const edadEl = document.getElementById('quashEdad');
    if (edadEl) edadEl.textContent = quashData.edad;

    const sexoEl = document.getElementById('quashSexo');
    if (sexoEl) sexoEl.textContent = quashData.sexo;

    const estadoCivilEl = document.getElementById('quashEstadoCivil');
    if (estadoCivilEl) estadoCivilEl.textContent = quashData.estadoCivil;

    const actividadEl = document.getElementById('quashActividadEconomica');
    if (actividadEl) actividadEl.textContent = quashData.actividadEconomica;

    const consultaEl = document.getElementById('quashConsultaHC');
    if (consultaEl) consultaEl.textContent = quashData.consultaHC;
  }

  /* ---------------------------------------------------------
     5. Funcionalidad de resolución
  --------------------------------------------------------- */
  const wrapperResolucionPredefinida = document.getElementById('wrapperResolucionPredefinida');
  const resolucionPredefinidaSelect = document.getElementById('resolucionPredefinida');
  const resolucionComiteTextarea = document.getElementById('resolucionComite');
  const btnLimpiarResolucion = document.getElementById('btnLimpiarResolucion');

  if (btnLimpiarResolucion) {
    btnLimpiarResolucion.addEventListener('click', () => {
      if (resolucionComiteTextarea && resolucionComiteTextarea.value.trim() !== '') {
        if (confirm('¿Estás seguro de que quieres limpiar el texto de la resolución?')) {
          resolucionComiteTextarea.value = '';
          marcarUltimaModificacion();
        }
      }
    });
  }

  function actualizarDesplegablePredefinido() {
    const estado = autorizacionSelect ? autorizacionSelect.value : '';
    if (resolucionPredefinidaSelect) resolucionPredefinidaSelect.innerHTML = '';

    if (estado && PLANTILLAS_RESOLUCION[estado] && resolucionPredefinidaSelect) {
      const optDefault = document.createElement('option');
      optDefault.value = "";
      optDefault.textContent = "Ninguna (Entrada manual) / Seleccione una plantilla...";
      resolucionPredefinidaSelect.appendChild(optDefault);

      PLANTILLAS_RESOLUCION[estado].forEach((item, index) => {
        const opt = document.createElement('option');
        opt.value = index;
        opt.textContent = item.titulo;
        resolucionPredefinidaSelect.appendChild(opt);
      });

      if (wrapperResolucionPredefinida) wrapperResolucionPredefinida.style.display = 'flex';
    } else {
      if (wrapperResolucionPredefinida) wrapperResolucionPredefinida.style.display = 'none';
    }
  }

  if (autorizacionSelect) {
    autorizacionSelect.addEventListener('change', () => {
      const estado = autorizacionSelect.value;

      if (estado === 'autorizado') {
        if (fechaAprobacionInput && (!fechaAprobacionInput.value || fechaAprobacionInput.value === '—')) {
          fechaAprobacionInput.value = formatearFecha(new Date());
        }
      } else {
        if (fechaAprobacionInput) fechaAprobacionInput.value = '';
      }

      if (estado) {
        if (fechaResolucionInput) fechaResolucionInput.value = formatearFecha(new Date());
      } else {
        if (fechaResolucionInput) fechaResolucionInput.value = '';
      }

      actualizarDesplegablePredefinido();
      marcarUltimaModificacion();
    });
  }

  if (resolucionPredefinidaSelect) {
    resolucionPredefinidaSelect.addEventListener('change', () => {
      const estado = autorizacionSelect ? autorizacionSelect.value : '';
      const indexSelected = resolucionPredefinidaSelect.value;

      if (estado && indexSelected !== "" && PLANTILLAS_RESOLUCION[estado] && PLANTILLAS_RESOLUCION[estado][indexSelected]) {
        const currentText = resolucionComiteTextarea ? resolucionComiteTextarea.value.trim() : '';
        const newText = PLANTILLAS_RESOLUCION[estado][indexSelected].texto;

        if (resolucionComiteTextarea) {
          if (currentText) {
            resolucionComiteTextarea.value = currentText + '\n' + newText;
          } else {
            resolucionComiteTextarea.value = newText;
          }
        }

        resolucionPredefinidaSelect.value = "";
        marcarUltimaModificacion();
      }
    });
  }

  const camposDictamenIds = ['montoAprobado', 'plazo', 'tasa', 'nivelRiesgo', 'resolucionComite', 'periodicidad'];
  camposDictamenIds.forEach(id => {
    const campo = document.getElementById(id);
    if (campo) {
      campo.addEventListener('input', marcarUltimaModificacion);
      campo.addEventListener('change', marcarUltimaModificacion);
    }
  });

  [presidenteTipo, presidenteNombre, secretariaTipo, secretariaNombre, firmaExtraordinaria].forEach(campo => {
    if (campo) {
      campo.addEventListener('change', marcarUltimaModificacion);
    }
  });

  const btnGuardar = document.getElementById('guardarResolucion');

  if (btnGuardar) {
    btnGuardar.addEventListener('click', () => {
      marcarUltimaModificacion();

      const textoOriginal = btnGuardar.textContent;
      btnGuardar.textContent = '✓ Resolución Guardada';
      btnGuardar.classList.add('saved');

      setTimeout(() => {
        btnGuardar.textContent = textoOriginal;
        btnGuardar.classList.remove('saved');
      }, 1800);
    });
  }

  /* ---------------------------------------------------------
     6. Historial de Créditos
  --------------------------------------------------------- */
  const HC_DATOS = [
    { otorgante: 'BANCOS', tipo: 'PP', saldoActual: 0, saldoVencido: 0, pagoActual: 'V', ultimoPago: '2018-06-06', frecuencia: 'Semanal', monto: 0 },
    { otorgante: 'BANCOS', tipo: 'PP', saldoActual: 0, saldoVencido: 0, pagoActual: 'V', ultimoPago: '2018-09-28', frecuencia: 'Semanal', monto: 0 },
    { otorgante: 'ASEFIMEX', tipo: 'PP', saldoActual: 16286, saldoVencido: 0, pagoActual: 'V', ultimoPago: '2026-05-28', frecuencia: 'Pago Mínimo Revolvente', monto: 2975 }
  ];

  function formatMXN(v) {
    return '$' + v.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function renderHistorialCreditos() {
    const tbody = document.getElementById('hcTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    HC_DATOS.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.otorgante}</td>
        <td>${row.tipo}</td>
        <td>${formatMXN(row.saldoActual)}</td>
        <td>${formatMXN(row.saldoVencido)}</td>
        <td>${row.pagoActual}</td>
        <td>${row.ultimoPago}</td>
        <td>${row.frecuencia}</td>
        <td>${formatMXN(row.monto)}</td>
      `;
      tbody.appendChild(tr);
    });

    const totalSaldoActual = HC_DATOS.reduce((s, r) => s + r.saldoActual, 0);
    const totalSaldoVencido = HC_DATOS.reduce((s, r) => s + r.saldoVencido, 0);

    const totalActual = document.getElementById('hcTotalSaldoActual');
    const totalVencido = document.getElementById('hcTotalSaldoVencido');
    if (totalActual) totalActual.textContent = formatMXN(totalSaldoActual);
    if (totalVencido) totalVencido.textContent = formatMXN(totalSaldoVencido);

    const freqMap = {};
    HC_DATOS.forEach(r => {
      freqMap[r.frecuencia] = (freqMap[r.frecuencia] || 0) + r.monto;
    });
    const freqList = document.getElementById('hcFreqList');
    if (!freqList) return;
    freqList.innerHTML = '';
    Object.entries(freqMap).forEach(([frec, total]) => {
      const div = document.createElement('div');
      div.className = 'hc-freq-row';
      div.innerHTML = `<span>${frec}</span><span>${formatMXN(total)}</span>`;
      freqList.appendChild(div);
    });
  }

  renderHistorialCreditos();

  /* ---------------------------------------------------------
     7. CARGA DE DOCUMENTOS - VISTA Y FUNCIONALIDAD
     (Esta sección fue movida y unificada con la de Garantía más abajo)
  --------------------------------------------------------- */

  /* ---------------------------------------------------------
     8. APLICACIÓN DE PAGOS - VISTA Y FUNCIONALIDAD
     CON COLUMNA ESTATUS Y ALINEACIÓN CORREGIDA
  --------------------------------------------------------- */
  const PAGOS_DATA = [
    { id: 1, nombre: 'Enganche', archivo: '', comentario: '', aplicacion: '', estado: '', estatus: 'pendiente' },
    { id: 2, nombre: 'Garantía Líquida', archivo: '', comentario: '', aplicacion: '', estado: '', estatus: 'pendiente' },
    { id: 3, nombre: 'Comisión por Apertura', archivo: '', comentario: '', aplicacion: '', estado: '', estatus: 'pendiente' },
    { id: 4, nombre: 'Co Financiamiento', archivo: '', comentario: '', aplicacion: '', estado: '', estatus: 'pendiente' },
    { id: 5, nombre: 'Complemento de Enganche', archivo: '', comentario: '', aplicacion: '', estado: '', estatus: 'pendiente' },
    { id: 6, nombre: 'Enganche GPS', archivo: '', comentario: '', aplicacion: '', estado: '', estatus: 'pendiente' },
    { id: 7, nombre: 'Garantia Liquida Enganche Diferido', archivo: '', comentario: '', aplicacion: '', estado: '', estatus: 'pendiente' }
  ];

  let pagoActualId = null;
  let pagoCancelarId = null;

  function renderAplicacionPagos() {
    const tbody = document.getElementById('pagosTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    PAGOS_DATA.forEach(pago => {
      const tr = document.createElement('tr');
      const estaAplicado = pago.aplicacion && pago.aplicacion !== '' && pago.estado !== 'cancelado';
      const estaCancelado = pago.estado === 'cancelado';

      let estatusClass = '';
      if (pago.estatus === 'pendiente') estatusClass = 'estatus-pendiente';
      else if (pago.estatus === 'aplicado') estatusClass = 'estatus-aplicado';
      else if (pago.estatus === 'cancelado') estatusClass = 'estatus-cancelado';
      else if (pago.estatus === 'revision') estatusClass = 'estatus-revision';

      tr.innerHTML = `
        <td style="text-align: left;"><strong>${pago.nombre}</strong></td>
        <td style="text-align: left;">
          <span class="file-name" id="pagoFileName_${pago.id}">${pago.archivo || 'Ningún archivo seleccionado'}</span>
        </td>
        <td style="text-align: center;">
          <button class="btn-icon" onclick="verPago(${pago.id})" title="Ver documento">👁️</button>
        </td>
        <td style="text-align: center;">
          <button class="btn-icon" onclick="guardarPagoDocumento(${pago.id})" title="Guardar documento">💾</button>
        </td>
        <td style="text-align: left;">
          <input type="text" class="doc-comment" id="pagoComment_${pago.id}" placeholder="Agregar comentario..." value="${pago.comentario || ''}" onchange="guardarPagoComentario(${pago.id}, this.value)">
        </td>
        <td style="text-align: center;">
          <div class="acciones-pago">
            <button class="btn-aplicar-pago ${estaAplicado ? 'aplicado' : ''} ${estaCancelado ? 'cancelado' : ''}" onclick="abrirModalAplicarPago(${pago.id})">
              ${estaCancelado ? '⛔ Cancelado' : (estaAplicado ? '✓ Aplicado' : 'Aplicar Pago')}
            </button>
          </div>
        </td>
        <td style="text-align: center;">
          <div class="acciones-pago">
            <button class="btn-cancelar-pago ${estaCancelado ? 'cancelado' : ''}" onclick="abrirModalCancelarPago(${pago.id})">
              ${estaCancelado ? '✓ Cancelado' : 'Cancelar Pago'}
            </button>
          </div>
        </td>
        <td style="text-align: center;">
          <select class="select-estatus ${estatusClass}" id="estatus_${pago.id}" onchange="cambiarEstatus(${pago.id}, this.value)">
            <option value="pendiente" ${pago.estatus === 'pendiente' ? 'selected' : ''}>Pendiente</option>
            <option value="aplicado" ${pago.estatus === 'aplicado' ? 'selected' : ''}>Aplicado</option>
            <option value="cancelado" ${pago.estatus === 'cancelado' ? 'selected' : ''}>Cancelado</option>
            <option value="revision" ${pago.estatus === 'revision' ? 'selected' : ''}>En Revisión</option>
          </select>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.cambiarEstatus = function (id, nuevoEstatus) {
    const pago = PAGOS_DATA.find(p => p.id === id);
    if (pago) {
      pago.estatus = nuevoEstatus;
      marcarUltimaModificacion();

      const select = document.getElementById(`estatus_${id}`);
      if (select) {
        select.className = 'select-estatus';
        if (nuevoEstatus === 'pendiente') select.classList.add('estatus-pendiente');
        else if (nuevoEstatus === 'aplicado') select.classList.add('estatus-aplicado');
        else if (nuevoEstatus === 'cancelado') select.classList.add('estatus-cancelado');
        else if (nuevoEstatus === 'revision') select.classList.add('estatus-revision');
      }

      if (!window._actualizandoEstatus) {
        const estatusTexto = {
          'pendiente': 'Pendiente',
          'aplicado': 'Aplicado',
          'cancelado': 'Cancelado',
          'revision': 'En Revisión'
        };
        alert(`Estatus del documento "${pago.nombre}" actualizado a: ${estatusTexto[nuevoEstatus]}`);
      }
    }
  };

  window.verPago = function (id) {
    const pago = PAGOS_DATA.find(p => p.id === id);
    if (pago && pago.archivo) {
      alert(`Ver documento: ${pago.archivo}\n(En una implementación real, aquí se abriría la vista previa del archivo)`);
    } else {
      alert('No hay archivo subido para este documento.');
    }
  };

  window.guardarPagoDocumento = function (id) {
    const pago = PAGOS_DATA.find(p => p.id === id);
    if (pago && pago.archivo) {
      alert(`Documento "${pago.nombre}" guardado exitosamente.\nArchivo: ${pago.archivo}`);
      marcarUltimaModificacion();
    } else {
      alert('No hay archivo para guardar. Por favor sube un archivo primero.');
    }
  };

  window.guardarPagoComentario = function (id, valor) {
    const pago = PAGOS_DATA.find(p => p.id === id);
    if (pago) {
      pago.comentario = valor;
      marcarUltimaModificacion();
    }
  };

  window.guardarPagos = function () {
    let resumen = 'Resumen de Pagos:\n\n';
    PAGOS_DATA.forEach(p => {
      const estatusTexto = {
        'pendiente': 'Pendiente',
        'aplicado': 'Aplicado',
        'cancelado': 'Cancelado',
        'revision': 'En Revisión'
      };
      resumen += `${p.nombre}: ${estatusTexto[p.estatus] || p.estatus}\n`;
    });
    alert(`Pagos guardados exitosamente.\n\n${resumen}`);
  };

  /* ---------------------------------------------------------
     8.1 FORMATO DE MONEDA PARA EL CAMPO DE MONTO
  --------------------------------------------------------- */
  function formatearMoneda(valor) {
    let limpio = valor.replace(/[^0-9.]/g, '');
    if (limpio === '' || limpio === '.') return '';

    let partes = limpio.split('.');
    let entero = partes[0];
    let decimal = partes[1] || '';

    if (decimal.length > 2) {
      decimal = decimal.substring(0, 2);
    }

    let enteroFormateado = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    if (decimal) {
      return enteroFormateado + '.' + decimal;
    } else {
      return enteroFormateado;
    }
  }

  function inicializarCampoMoneda() {
    const montoInput = document.getElementById('montoAplicado');
    if (!montoInput) return;

    montoInput.addEventListener('input', function (e) {
      let valor = this.value;
      let posicion = this.selectionStart;
      let formateado = formatearMoneda(valor);

      if (formateado !== valor) {
        this.value = formateado;
        let nuevaPosicion = posicion;
        if (formateado.length > valor.length) {
          nuevaPosicion = posicion + (formateado.length - valor.length);
        } else if (formateado.length < valor.length) {
          nuevaPosicion = posicion - (valor.length - formateado.length);
        }
        this.setSelectionRange(nuevaPosicion, nuevaPosicion);
      }
    });

    montoInput.addEventListener('blur', function () {
      let valor = this.value.replace(/,/g, '');
      let numerico = parseFloat(valor);

      if (!isNaN(numerico) && numerico > 0) {
        if (!valor.includes('.')) {
          this.value = formatearMoneda(valor + '.00');
        } else {
          let partes = valor.split('.');
          if (partes[1].length === 1) {
            this.value = formatearMoneda(valor + '0');
          } else {
            this.value = formatearMoneda(valor);
          }
        }
      } else if (this.value !== '') {
        this.value = '';
      }
    });

    montoInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        this.blur();
      }
    });
  }

  /* ---------------------------------------------------------
     8.2 MODAL APLICACIÓN DE PAGOS
  --------------------------------------------------------- */
  window.abrirModalAplicarPago = function (id) {
    const pago = PAGOS_DATA.find(p => p.id === id);
    if (!pago) return;

    pagoActualId = id;

    const modal = document.getElementById('modalAplicarPago');
    const docName = document.getElementById('modalDocName');
    if (docName) {
      docName.innerHTML = `Documento: <strong>${pago.nombre}</strong>`;
    }

    const radios = document.querySelectorAll('input[name="pregunta1"]');
    radios.forEach(r => r.checked = false);

    const montoInput = document.getElementById('montoAplicado');
    if (montoInput) {
      montoInput.value = '3300';
      inicializarCampoMoneda();
    }

    const fechaInput = document.getElementById('fechaAplicacion');
    if (fechaInput) {
      const hoy = new Date().toISOString().split('T')[0];
      fechaInput.value = hoy;
    }

    const formaPago = document.getElementById('formaPago');
    if (formaPago) formaPago.value = '';

    const comentarios = document.getElementById('comentariosPago');
    if (comentarios) comentarios.value = '';

    if (modal) modal.style.display = 'flex';
  };

  window.cerrarModalAplicarPago = function () {
    const modal = document.getElementById('modalAplicarPago');
    if (modal) modal.style.display = 'none';
    pagoActualId = null;
  };

  window.confirmarAplicarPago = function () {
    if (pagoActualId === null) {
      alert('Error: No se seleccionó un pago.');
      return;
    }

    const pregunta1 = document.querySelector('input[name="pregunta1"]:checked');
    const montoInput = document.getElementById('montoAplicado');
    const fecha = document.getElementById('fechaAplicacion');
    const formaPago = document.getElementById('formaPago');

    if (!pregunta1) {
      alert('Por favor, selecciona si se realizó el pago.');
      return;
    }

    if (!montoInput || !montoInput.value) {
      alert('Por favor, ingresa un monto válido.');
      return;
    }

    const montoValor = parseFloat(montoInput.value.replace(/,/g, ''));
    if (isNaN(montoValor) || montoValor <= 0) {
      alert('Por favor, ingresa un monto válido.');
      return;
    }

    if (!fecha || !fecha.value) {
      alert('Por favor, selecciona la fecha de aplicación.');
      return;
    }

    if (!formaPago || !formaPago.value) {
      alert('Por favor, selecciona la forma de pago.');
      return;
    }

    const datosPago = {
      id: pagoActualId,
      documento: PAGOS_DATA.find(p => p.id === pagoActualId)?.nombre || '',
      pagoRealizado: pregunta1.value,
      monto: montoValor,
      fecha: fecha.value,
      formaPago: formaPago.value,
      comentarios: document.getElementById('comentariosPago')?.value || ''
    };

    const pago = PAGOS_DATA.find(p => p.id === pagoActualId);
    if (pago) {
      pago.aplicacion = `Aplicado: $${datosPago.monto.toFixed(2)} - ${datosPago.fecha}`;
      pago.estado = 'aplicado';
      window._actualizandoEstatus = true;
      pago.estatus = 'aplicado';
      window._actualizandoEstatus = false;
    }

    alert(`✅ Pago aplicado exitosamente para:\n\nDocumento: ${datosPago.documento}\nMonto: $${datosPago.monto.toFixed(2)}\nFecha: ${datosPago.fecha}\nForma de pago: ${datosPago.formaPago}\n¿Pago realizado? ${datosPago.pagoRealizado === 'si' ? 'Sí' : datosPago.pagoRealizado === 'no' ? 'No' : 'Parcial'}\n${datosPago.comentarios ? 'Comentarios: ' + datosPago.comentarios : ''}`);

    cerrarModalAplicarPago();
    renderAplicacionPagos();
    marcarUltimaModificacion();
  };

  /* ---------------------------------------------------------
     8.3 MODAL CANCELAR PAGO
  --------------------------------------------------------- */
  window.abrirModalCancelarPago = function (id) {
    const pago = PAGOS_DATA.find(p => p.id === id);
    if (!pago) return;

    pagoCancelarId = id;

    const modal = document.getElementById('modalCancelarPago');
    const docName = document.getElementById('modalCancelDocName');
    if (docName) {
      docName.innerHTML = `Documento: <strong>${pago.nombre}</strong>`;
    }

    const radios = document.querySelectorAll('input[name="cancelPregunta1"]');
    radios.forEach(r => r.checked = false);

    const motivo = document.getElementById('motivoCancelacion');
    if (motivo) motivo.value = '';

    const fecha = document.getElementById('fechaCancelacion');
    if (fecha) {
      const hoy = new Date().toISOString().split('T')[0];
      fecha.value = hoy;
    }

    const comentarios = document.getElementById('comentariosCancelacion');
    if (comentarios) comentarios.value = '';

    if (modal) modal.style.display = 'flex';
  };

  window.cerrarModalCancelarPago = function () {
    const modal = document.getElementById('modalCancelarPago');
    if (modal) modal.style.display = 'none';
    pagoCancelarId = null;
  };

  window.confirmarCancelarPago = function () {
    if (pagoCancelarId === null) {
      alert('Error: No se seleccionó un pago.');
      return;
    }

    const pregunta1 = document.querySelector('input[name="cancelPregunta1"]:checked');
    const motivo = document.getElementById('motivoCancelacion');
    const fecha = document.getElementById('fechaCancelacion');

    if (!pregunta1) {
      alert('Por favor, selecciona si se canceló el pago.');
      return;
    }

    if (!motivo || !motivo.value) {
      alert('Por favor, selecciona un motivo de cancelación.');
      return;
    }

    if (!fecha || !fecha.value) {
      alert('Por favor, selecciona la fecha de cancelación.');
      return;
    }

    const datosCancelacion = {
      id: pagoCancelarId,
      documento: PAGOS_DATA.find(p => p.id === pagoCancelarId)?.nombre || '',
      cancelado: pregunta1.value,
      motivo: motivo.value,
      fecha: fecha.value,
      comentarios: document.getElementById('comentariosCancelacion')?.value || ''
    };

    const pago = PAGOS_DATA.find(p => p.id === pagoCancelarId);
    if (pago) {
      pago.aplicacion = `Cancelado: ${datosCancelacion.motivo} - ${datosCancelacion.fecha}`;
      pago.estado = 'cancelado';
      window._actualizandoEstatus = true;
      pago.estatus = 'cancelado';
      window._actualizandoEstatus = false;
    }

    const motivosTexto = {
      'pago_duplicado': 'Pago duplicado',
      'error_monto': 'Error en el monto',
      'error_cliente': 'Error en datos del cliente',
      'cancelacion_solicitud': 'Cancelación de la solicitud',
      'rechazo_credito': 'Rechazo del crédito',
      'otros': 'Otros'
    };

    alert(`⛔ Pago cancelado exitosamente para:\n\nDocumento: ${datosCancelacion.documento}\nMotivo: ${motivosTexto[datosCancelacion.motivo] || datosCancelacion.motivo}\nFecha: ${datosCancelacion.fecha}\n${datosCancelacion.comentarios ? 'Comentarios: ' + datosCancelacion.comentarios : ''}`);

    cerrarModalCancelarPago();
    renderAplicacionPagos();
    marcarUltimaModificacion();
  };

  document.addEventListener('click', function (event) {
    const modalAplicar = document.getElementById('modalAplicarPago');
    if (modalAplicar && event.target === modalAplicar) {
      cerrarModalAplicarPago();
    }
    const modalCancelar = document.getElementById('modalCancelarPago');
    if (modalCancelar && event.target === modalCancelar) {
      cerrarModalCancelarPago();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      cerrarModalAplicarPago();
      cerrarModalCancelarPago();
    }
  });

  renderAplicacionPagos();

  // ELIMINADO: cambiarVista (reemplazado por activarEtapa)

  /* ---------------------------------------------------------
     10. FUNCIÓN PARA MOSTRAR CARGA DE DOCUMENTOS
  --------------------------------------------------------- */
  window.mostrarCargaDocumentos = function () {
    actualizarBotonesSolventacion(false);

    const firmas = document.getElementById('firmas');
    const dictamen = document.getElementById('dictamen');
    const dictamenQuash = document.getElementById('dictamenQuash');
    const historial = document.getElementById('historial');
    const tipoActa = document.getElementById('tipoActa');
    const generarActa = document.getElementById('generarActa');
    const cargaDocumentos = document.getElementById('cargaDocumentos');
    const tabCarga = document.getElementById('tabCargaDocumentos');
    const aplicacionPagos = document.getElementById('aplicacionPagos');
    const tabPagos = document.getElementById('tabAplicacionPagos');

    if (dictamen) dictamen.hidden = true;
    if (dictamenQuash) dictamenQuash.hidden = true;
    if (historial) historial.hidden = true;
    if (tipoActa) tipoActa.hidden = true;
    if (generarActa) generarActa.hidden = true;
    if (firmas) firmas.hidden = true;
    if (cargaDocumentos) cargaDocumentos.hidden = false;
    if (aplicacionPagos) aplicacionPagos.hidden = true;
    if (tabCarga) tabCarga.hidden = false;
    if (tabPagos) tabPagos.hidden = true;

    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      const tabText = tab.textContent.trim();
      if (tabText === 'Dictamen' || tabText === 'Dictamen Quash' || tabText === 'Acta de Comite') {
        tab.hidden = true;
      }
    });

    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    if (tabCarga) tabCarga.classList.add('active');

    const dictamenHeader = document.querySelector('#dictamen .card-header h2');
    if (dictamenHeader) dictamenHeader.textContent = 'Resolución de Comité de Crédito';

    document.querySelectorAll('.stage-btn').forEach(b => {
      b.classList.remove('stage-active');
      if (b.textContent.trim() === 'Carga de Documentos') {
        b.classList.add('stage-active');
      }
    });
  };

  async function obtenerUDIS() {
    const url = "https://www.banxico.org.mx/SieAPIRest/service/v1/series/SP68257/datos/oportuno";
    const bmxToken1 = "375af50120fd1b72ee7ff9c8ffd78fba11ef91f1990aa1a01796d92f6cb2c998";

    try {
      let response;
      try {
        // Intento directo (puede fallar por CORS si se abre desde file://)
        response = await fetch(url, {
          headers: { "Bmx-Token": bmxToken1, "Accept": "application/json" }
        });
      } catch (err) {
        console.warn("Fallo por CORS. Intentando con proxy...");
        // Fallback a proxy público CORS (allorigins)
        const proxyUrl = "https://api.allorigins.win/raw?url=" + encodeURIComponent(url);
        response = await fetch(proxyUrl, {
          headers: { "Bmx-Token": bmxToken1, "Accept": "application/json" }
        });
      }

      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }

      const data = await response.json();
      const valorUdi = data.bmx.series[0].datos[0].dato;
      console.log("Valor de UDI actual:", valorUdi);
      return valorUdi;

    } catch (error) {
      console.error("Error al obtener la UDI (Usando valor Mock de Maqueta):", error);
      return "8.125000"; // Valor mock en caso de fallar CORS o proxies
    }
  }

  /* ---------------------------------------------------------
     11. FUNCIÓN PARA MOSTRAR APLICACIÓN DE PAGOS
  --------------------------------------------------------- */
  window.mostrarAplicacionPagos = function () {
    actualizarBotonesSolventacion(false);

    const firmas = document.getElementById('firmas');
    const dictamen = document.getElementById('dictamen');
    const dictamenQuash = document.getElementById('dictamenQuash');
    const historial = document.getElementById('historial');
    const tipoActa = document.getElementById('tipoActa');
    const generarActa = document.getElementById('generarActa');
    const cargaDocumentos = document.getElementById('cargaDocumentos');
    const tabCarga = document.getElementById('tabCargaDocumentos');
    const aplicacionPagos = document.getElementById('aplicacionPagos');
    const tabPagos = document.getElementById('tabAplicacionPagos');

    if (dictamen) dictamen.hidden = true;
    if (dictamenQuash) dictamenQuash.hidden = true;
    if (historial) historial.hidden = true;
    if (tipoActa) tipoActa.hidden = true;
    if (generarActa) generarActa.hidden = true;
    if (firmas) firmas.hidden = true;
    if (cargaDocumentos) cargaDocumentos.hidden = true;
    if (tabCarga) tabCarga.hidden = true;
    if (aplicacionPagos) aplicacionPagos.hidden = false;
    if (tabPagos) tabPagos.hidden = false;

    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      const tabText = tab.textContent.trim();
      if (tabText === 'Dictamen' || tabText === 'Dictamen Quash' || tabText === 'Acta de Comite') {
        tab.hidden = true;
      }
    });

    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    if (tabPagos) tabPagos.classList.add('active');

    const dictamenHeader = document.querySelector('#dictamen .card-header h2');
    if (dictamenHeader) dictamenHeader.textContent = 'Resolución de Comité de Crédito';

    document.querySelectorAll('.stage-btn').forEach(b => {
      b.classList.remove('stage-active');
      if (b.textContent.trim() === 'Aplicación de Pagos') {
        b.classList.add('stage-active');
      }
    });

    renderAplicacionPagos();
  };

  /* ---------------------------------------------------------
     12. Event listeners para los tabs superiores
  --------------------------------------------------------- */
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function (e) {
      const tabText = this.textContent.trim();

      if (tabText === 'Dictamen') {
        window.mostrarDictamen();
      } else if (tabText === 'Dictamen Quash') {
        window.mostrarDictamenQuash();
      } else if (tabText === 'Acta de Comite') {
        window.menuActaComite();
      } else if (tabText === 'Carga de Documentos') {
        window.mostrarCargaDocumentos();
      } else if (tabText === 'Aplicación de Pagos') {
        window.mostrarAplicacionPagos();
      }
    });
  });

  // Inicialización comentada para no forzar la vista de dictamen al cargar
  let currentUdiValue = 0;

  function calcularMontoUdis() {
    const montoAprobadoInput = document.getElementById('montoAprobado');
    const montoUdisInput = document.getElementById('montoUdis');
    const engancheRecibirInput = document.getElementById('engancheRecibir');
    const engancheUdisInput = document.getElementById('engancheUdis');

    if (currentUdiValue > 0) {
      if (montoAprobadoInput && montoUdisInput) {
        const monto = parseFloat(montoAprobadoInput.value) || 0;
        const totalUdis = monto / currentUdiValue;
        montoUdisInput.value = totalUdis.toLocaleString('en-US', { minimumFractionDigits: 5, maximumFractionDigits: 5 });
      }

      if (engancheRecibirInput && engancheUdisInput) {
        const enganche = parseFloat(engancheRecibirInput.value) || 0;
        const totalEngancheUdis = enganche / currentUdiValue;
        engancheUdisInput.value = totalEngancheUdis.toLocaleString('en-US', { minimumFractionDigits: 5, maximumFractionDigits: 5 });
      }
    }
  }

  const inputMontoAprobado = document.getElementById('montoAprobado');
  const inputEngancheRecibir = document.getElementById('engancheRecibir');
  const inputEngancheUdis = document.getElementById('engancheUdis');
  if (inputMontoAprobado) {
    inputMontoAprobado.addEventListener('input', calcularMontoUdis);
  }
  if (inputEngancheRecibir) {
    inputEngancheRecibir.addEventListener('input', calcularMontoUdis);
  }
  if (inputEngancheUdis) {
    inputEngancheUdis.addEventListener('input', calcularMontoUdis);
  }

  obtenerUDIS().then(udi => {
    const labelUdi = document.getElementById('resultado-udi');
    const inputUdi = document.getElementById('input-udi');
    if (udi) {
      console.log("UDI Actual:", udi);
      labelUdi.textContent = 'La udi actual es: ' + udi;
      if (inputUdi) inputUdi.value = udi;
      currentUdiValue = parseFloat(udi);
      calcularMontoUdis();
    } else {
      console.log("No se pudo obtener la UDI");
      labelUdi.textContent = "No se pudo obtener la UDI";
    }
  });

});

// --- From GARANTIA Y OTROS --- //
// ============================================================
// C-MOVIL · Etapa de Decisiones · Firmas de Autorización
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     1. Catálogo de comité
  --------------------------------------------------------- */
  const TITULAR_PRESIDENTE = 'ING. JUAN MORENO DE LA HIGUERA';
  const TITULAR_SECRETARIA = 'LIC. MELISA CRUZ CRUZ';

  const SUPLENTES_PRESIDENTE = [
    'LIC. ELDA AZUCENA LOPEZ MATIAS',
    'LIC. ARNOLDO MONZON ALTUZAR',
    'LIC. JAIR ALEXANDER JIMENEZ LOPEZ',
    'LIC. LUIS ALBERTO ESTRADA CAMACHO'
  ];

  const SUPLENTES_SECRETARIA = [
    'LIC. ELDA AZUCENA LOPEZ MATIAS',
    'LIC. ARNOLDO MONZON ALTUZAR',
    'LIC. JAIR ALEXANDER JIMENEZ LOPEZ',
    'LIC. LUIS ALBERTO ESTRADA CAMACHO'
  ];

  function poblarNombres(selectNombre, tipo, nombreTitular, listaSuplentes) {
    selectNombre.innerHTML = '';

    if (tipo === 'titular') {
      const opt = document.createElement('option');
      opt.value = nombreTitular;
      opt.textContent = nombreTitular;
      selectNombre.appendChild(opt);
      selectNombre.disabled = false;
    } else {
      listaSuplentes.forEach((nombre, idx) => {
        const opt = document.createElement('option');
        opt.value = `${nombre}__${idx + 1}`;
        opt.textContent = `${nombre}`;
        selectNombre.appendChild(opt);
      });
      selectNombre.disabled = false;
    }
  }

  const presidenteTipo = document.getElementById('presidenteTipoMenor');
  const presidenteNombre = document.getElementById('presidenteNombreMenor');

  if (presidenteTipo && presidenteNombre) {
    poblarNombres(presidenteNombre, presidenteTipo.value, TITULAR_PRESIDENTE, SUPLENTES_PRESIDENTE);
    presidenteTipo.addEventListener('change', () => {
      poblarNombres(presidenteNombre, presidenteTipo.value, TITULAR_PRESIDENTE, SUPLENTES_PRESIDENTE);
    });
  }

  const secretariaTipo = document.getElementById('secretariaTipoMenor');
  const secretariaNombre = document.getElementById('secretariaNombreMenor');

  if (secretariaTipo && secretariaNombre) {
    poblarNombres(secretariaNombre, secretariaTipo.value, TITULAR_SECRETARIA, SUPLENTES_SECRETARIA);
    secretariaTipo.addEventListener('change', () => {
      poblarNombres(secretariaNombre, secretariaTipo.value, TITULAR_SECRETARIA, SUPLENTES_SECRETARIA);
    });
  }

  const chkFirmaEspecialMenor = document.getElementById('requiereFirmaEspecialMenor');
  const chkFirmaExtraordinariaMenor = document.getElementById('requiereFirmaExtraordinariaMenor');
  const wrapperFirmaEspecialMenor = document.getElementById('wrapperFirmaEspecialMenor');
  const wrapperFirmaExtraordinariaMenor = document.getElementById('wrapperFirmaExtraordinariaMenor');
  const wrapperFirmaVacioMenor = document.getElementById('wrapperFirmaVacioMenor');
  const firmaExtraordinariaMenor = document.getElementById('firmaExtraordinariaMenor');

  function actualizarVisibilidadFirmasMenor() {
    const mostrarEspecial = chkFirmaEspecialMenor ? chkFirmaEspecialMenor.checked : false;
    const mostrarExtraordinaria = chkFirmaExtraordinariaMenor ? chkFirmaExtraordinariaMenor.checked : false;

    if (wrapperFirmaEspecialMenor) wrapperFirmaEspecialMenor.style.display = mostrarEspecial ? 'flex' : 'none';
    if (wrapperFirmaExtraordinariaMenor) wrapperFirmaExtraordinariaMenor.style.display = mostrarExtraordinaria ? 'flex' : 'none';

    if (wrapperFirmaVacioMenor) {
      wrapperFirmaVacioMenor.style.display = (mostrarEspecial || mostrarExtraordinaria) ? 'block' : 'none';
    }

    if (!mostrarExtraordinaria && firmaExtraordinariaMenor) {
      firmaExtraordinariaMenor.value = '';
    }
  }

  if (chkFirmaEspecialMenor) {
    chkFirmaEspecialMenor.addEventListener('change', () => {
      actualizarVisibilidadFirmasMenor();
      marcarUltimaModificacion();
    });
  }

  if (chkFirmaExtraordinariaMenor) {
    chkFirmaExtraordinariaMenor.addEventListener('change', () => {
      actualizarVisibilidadFirmasMenor();
      marcarUltimaModificacion();
    });
  }

  const chkFirmaEspecialMayor = document.getElementById('requiereFirmaEspecialMayor');
  const chkFirmaExtraordinariaMayor = document.getElementById('requiereFirmaExtraordinariaMayor');
  const wrapperFirmaEspecialMayor = document.getElementById('wrapperFirmaEspecialMayor');
  const wrapperFirmaExtraordinariaMayor = document.getElementById('wrapperFirmaExtraordinariaMayor');
  const wrapperFirmaVacioMayor = document.getElementById('wrapperFirmaVacioMayor');
  const firmaExtraordinariaMayor = document.getElementById('firmaExtraordinariaMayor');

  function actualizarVisibilidadFirmasMayor() {
    const mostrarEspecial = chkFirmaEspecialMayor ? chkFirmaEspecialMayor.checked : false;
    const mostrarExtraordinaria = chkFirmaExtraordinariaMayor ? chkFirmaExtraordinariaMayor.checked : false;

    if (wrapperFirmaEspecialMayor) wrapperFirmaEspecialMayor.style.display = mostrarEspecial ? 'flex' : 'none';
    if (wrapperFirmaExtraordinariaMayor) wrapperFirmaExtraordinariaMayor.style.display = mostrarExtraordinaria ? 'flex' : 'none';

    if (wrapperFirmaVacioMayor) {
      wrapperFirmaVacioMayor.style.display = (mostrarEspecial || mostrarExtraordinaria) ? 'block' : 'none';
    }

    if (!mostrarExtraordinaria && firmaExtraordinariaMayor) {
      firmaExtraordinariaMayor.value = '';
    }
  }

  if (chkFirmaEspecialMayor) {
    chkFirmaEspecialMayor.addEventListener('change', () => {
      actualizarVisibilidadFirmasMayor();
      if (typeof marcarUltimaModificacion === 'function') marcarUltimaModificacion();
    });
  }

  if (chkFirmaExtraordinariaMayor) {
    chkFirmaExtraordinariaMayor.addEventListener('change', () => {
      actualizarVisibilidadFirmasMayor();
      if (typeof marcarUltimaModificacion === 'function') marcarUltimaModificacion();
    });
  }

  /* ---------------------------------------------------------
     2. Fechas automáticas
  --------------------------------------------------------- */
  const autorizacionSelect = document.getElementById('autorizacion');
  const fechaAprobacionInput = document.getElementById('fechaAprobacion');
  const fechaResolucionInput = document.getElementById('fechaResolucion');
  const ultimaModificacionInput = document.getElementById('ultimaModificacion');

  function formatearFecha(date) {
    const opciones = {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    };
    return date.toLocaleString('es-MX', opciones);
  }

  function marcarUltimaModificacion() {
    if (ultimaModificacionInput) {
      ultimaModificacionInput.value = formatearFecha(new Date());
    }
  }

  marcarUltimaModificacion();

  /* ---------------------------------------------------------
     2.1 Plantillas de resoluciones predefinidas
  --------------------------------------------------------- */
  const PLANTILLAS_RESOLUCION = {
    autorizado: [
      { titulo: "1. Previo a solicitud, integrar permiso a nombre del cliente", texto: "1.- Previo a la solicitud del contrato, se deberá integrar el permiso a nombre de la cliente." },
      { titulo: "2. Validar información y declinar por inconsistencias", texto: "2.- Durante el desembolso, se deberá validar la información proporcionada por el cliente y, de encontrarse alguna inconsistencia, se podrá declinar el presente crédito." },
      { titulo: "3. Puntual seguimiento al caso hasta recuperación al 100%", texto: "3.- Puntual seguimiento al caso por parte del ejecutivo, gerente y D.C. hasta la recuperación del crédito al 100%." },
      { titulo: "4. No liberar factura de unidad en garantía hasta liquidación", texto: "4.- No liberar la factura de la unidad en garantía hasta la liquidación del presente crédito al 100%." },
      { titulo: "5. Plan de pago semanal por importes vencidos en buró", texto: "5.- Se autoriza plan de pago semanal; esto debido a los importes vencidos que el cliente reporta en su buró de crédito." },
      { titulo: "6. Autorización por $0.00 descontando cuotas pendientes", texto: "6.- El presente caso se autoriza por un monto de $0.00. De este monto, se deberán descontar las cuotas pendientes por cubrir para la liquidación del crédito N.º XXXXXX y la diferencia desembolsarse a la cuenta del cliente." },
      { titulo: "7. Autorización por argumentos de Gerente (dd/mm/aa)", texto: "7.- Para la autorización del presente crédito, se toman en cuenta los argumentos expuestos por la gerente en su correo de fecha dd/mm/aa, asumiendo cualquier responsabilidad en caso de suscitarse problemas en la recuperación y localización del cliente." },
      { titulo: "8. Coincidencia SAFI en nombre de cliente (sin riesgo)", texto: "8.- Con respecto al reporte de coincidencia en SAFI emitido por el área de análisis de crédito, al revisarlo se detecta que la coincidencia radica en el nombre del cliente, mas no en su RFC y fecha de nacimiento, no detectando al momento riesgo alguno." },
      { titulo: "9. Coincidencia SAFI en nombre de cliente, obligaciones ISR/IVA", texto: "9.- Con respecto al reporte de coincidencia en SAFI emitido por el área de análisis de crédito, al revisarlo se detecta que la coincidencia radica en el nombre de la cliente, mas no se pudo corroborar por su RFC y CURP ya que el reporte no emite información alguna, no detectándose al momento de la revisión riesgo alguno. Su constancia de situación fiscal reporta algunas obligaciones tales como declaración anual de ISR, pago de IVA, declaración de proveedores de IVA y pago provisional mensual de ISR por actividades empresariales." },
      { titulo: "10. Pagaré de Distribuidor por $0.00 como garantía alterna", texto: "10.- Como mitigante de riesgo para el presente crédito, se constituirá como garantía alterna la firma de un pagaré por parte del Distribuidor XXXXXX por la cantidad de $0.00; esto previo a la formalización del contrato, puntualizándose que en caso de incumplimiento de pago del cliente, así como de problemas para la adjudicación de la unidad, Asefimex podrá ejecutar como medio de pago del presente crédito el referido pagaré suscrito por el distribuidor. Esto se realizará de manera inmediata y no implicará que se tengan que agotar los procedimientos de cobranza y adjudicación de la unidad en garantía." },
      { titulo: "11. Participación de Distribuidor y sucursal hasta recuperación", texto: "11.- Para el seguimiento puntual del presente crédito, se establece como condición la participación conjunta y activa del Distribuidor y la sucursal de Asefimex hasta la recuperación del crédito al 100%." },
      { titulo: "12. Integrar reporte fotográfico (actividad/domicilio)", texto: "12.- Previo a la solicitud del contrato, se deberá integrar el reporte fotográfico debidamente requisitado con fotos del domicilio y de la actividad económica, ya que se presenta sin fotografías." }
    ],
    observado: [
      { titulo: "1. Integrar aval del núcleo familiar (papá/mamá)", texto: "1.- Deberá integrarse a una persona del núcleo familiar (papá o mamá) como aval y que cumpla acorde a la política, para con ello poder emitir un dictamen (dd/mm/aa)." },
      { titulo: "2. Visita domiciliar y validación de información", texto: "2.- Se solicita al ejecutivo/gerente realizar la visita domiciliaria al cliente y al aval, verificar y validar la información para de ello poder emitir un dictamen." },
      { titulo: "3. Considerar plan de pago semanal", texto: "3.- Se podrá considerar la presente solicitud con plan de pago semanal, esto debido a los importes vencidos que el cliente reporta en su buró de crédito." },
      { titulo: "4. Integrar al cónyuge como aval", texto: "4.- Se solicita integrar al cónyuge como aval, y que cumpla acorde a la política." },
      { titulo: "5. Presentar evidencia documental de actividad productiva", texto: "5.- Se solicita presentar evidencia documental de su actividad productiva y con ello poder emitir un dictamen." },
      { titulo: "6. No acredita arraigo domiciliario", texto: "6.- No acredita arraigo domiciliario." },
      { titulo: "7. Integrar aval que cumpla con política de crédito", texto: "7.- Integrar un aval que cumpla acorde a la política (arraigo, buen historial crediticio y actividad productiva) y con ello poder emitir un dictamen." },
      { titulo: "8. Acreditar ingresos por actividad declarada", texto: "8.- Acreditar los ingresos por su actividad productiva declarada en el cuestionario económico y con ello poder emitir un dictamen." }
    ],
    rechazado: [
      { titulo: "1. Rechazo por mal historial crediticio en buró", texto: "1.- El presente caso se rechaza por el mal historial crediticio que reporta en su buró de crédito." },
      { titulo: "2. Rechazo por falta de capacidad de pago", texto: "2.- Se rechaza por no tener capacidad de pago." },
      { titulo: "3. Rechazo por avance de crédito vigente (política > 50%)", texto: "3.- Por el momento, la presente solicitud se rechaza debido a que, por el avance que el cliente lleva en su crédito vigente con Asefimex, no cumple con lo dispuesto en la política de crédito (más del 50%)." },
      { titulo: "4. Rechazo por perfil transaccional del cliente", texto: "4.- Por el perfil transaccional del cliente, se rechaza el presente caso." }
    ]
  };

  /* ---------------------------------------------------------
     3. Función para mostrar/ocultar botones de solventación
  --------------------------------------------------------- */
  function actualizarBotonesSolventacion(mostrar) {
    const btnDocumentos = document.getElementById('btnDocumentosCliente');
    const btnCaratula = document.getElementById('btnCaratulaComite');

    if (btnDocumentos && btnCaratula) {
      if (mostrar) {
        btnDocumentos.style.display = 'inline-flex';
        btnCaratula.style.display = 'inline-flex';
      } else {
        btnDocumentos.style.display = 'none';
        btnCaratula.style.display = 'none';
      }
    }
  }

  /* ---------------------------------------------------------
     4. Funciones de navegación de tabs
  --------------------------------------------------------- */
  window.menuActaComite = function () {
    actualizarBotonesSolventacion(true);

    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      const tabText = tab.textContent.trim();
      if (tabText === 'Dictamen' || tabText === 'Dictamen Quash' || tabText === 'Acta de Comite') {
        tab.hidden = false;
      }
    });

    const firmas = document.getElementById('firmas');
    const dictamen = document.getElementById('dictamen');
    const dictamenQuash = document.getElementById('dictamenQuash');
    const historial = document.getElementById('historial');
    const tipoActa = document.getElementById('tipoActa');
    const generarActa = document.getElementById('generarActa');
    const cargaDocumentos = document.getElementById('cargaDocumentos');
    const tabCarga = document.getElementById('tabCargaDocumentos');
    const aplicacionPagos = document.getElementById('aplicacionPagos');
    const tabPagos = document.getElementById('tabAplicacionPagos');
    const registroGarantia = document.getElementById('registroGarantia');
    const valuacion = document.getElementById('valuacion');
    const factura = document.getElementById('factura');
    const testimonioNotarial = document.getElementById('testimonioNotarial');
    const actaPosesion = document.getElementById('actaPosesion');
    const reciboSimple = document.getElementById('reciboSimple');
    const constanciaPosesion = document.getElementById('constanciaPosesion');

    if (dictamen) dictamen.hidden = true;
    if (dictamenQuash) dictamenQuash.hidden = true;
    if (historial) historial.hidden = true;
    if (cargaDocumentos) cargaDocumentos.hidden = true;
    if (aplicacionPagos) aplicacionPagos.hidden = true;
    if (registroGarantia) registroGarantia.hidden = true;
    if (valuacion) valuacion.hidden = true;
    if (factura) factura.hidden = true;
    if (testimonioNotarial) testimonioNotarial.hidden = true;
    if (actaPosesion) actaPosesion.hidden = true;
    if (reciboSimple) reciboSimple.hidden = true;
    if (constanciaPosesion) constanciaPosesion.hidden = true;
    if (firmas) { firmas.hidden = false; firmas.style.display = ''; }
    if (firmasMenor) { firmasMenor.hidden = true; firmasMenor.style.display = 'none'; }
    if (firmasMayor) { firmasMayor.hidden = true; firmasMayor.style.display = 'none'; }
    if (tipoActa) tipoActa.hidden = false;
    if (generarActa) generarActa.hidden = false;
    if (tabCarga) tabCarga.hidden = true;
    if (tabPagos) tabPagos.hidden = true;

    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    const actaTab = document.querySelector('.tab[data-tab="receptora"]');
    if (actaTab) actaTab.classList.add('active');
  };

  window.mostrarDictamen = function () {
    actualizarBotonesSolventacion(true);

    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      const tabText = tab.textContent.trim();
      if (tabText === 'Dictamen' || tabText === 'Dictamen Quash' || tabText === 'Acta de Comite') {
        tab.hidden = false;
      }
    });

    const firmas = document.getElementById('firmas');
    const dictamen = document.getElementById('dictamen');
    const dictamenQuash = document.getElementById('dictamenQuash');
    const historial = document.getElementById('historial');
    const tipoActa = document.getElementById('tipoActa');
    const generarActa = document.getElementById('generarActa');
    const cargaDocumentos = document.getElementById('cargaDocumentos');
    const tabCarga = document.getElementById('tabCargaDocumentos');
    const aplicacionPagos = document.getElementById('aplicacionPagos');
    const tabPagos = document.getElementById('tabAplicacionPagos');
    const registroGarantia = document.getElementById('registroGarantia');
    const valuacion = document.getElementById('valuacion');
    const factura = document.getElementById('factura');
    const testimonioNotarial = document.getElementById('testimonioNotarial');
    const actaPosesion = document.getElementById('actaPosesion');
    const reciboSimple = document.getElementById('reciboSimple');
    const constanciaPosesion = document.getElementById('constanciaPosesion');

    if (dictamen) dictamen.hidden = false;
    if (dictamenQuash) dictamenQuash.hidden = true;
    if (historial) historial.hidden = false;
    if (tipoActa) tipoActa.hidden = true;
    if (generarActa) generarActa.hidden = true;
    if (cargaDocumentos) cargaDocumentos.hidden = true;
    if (aplicacionPagos) aplicacionPagos.hidden = true;
    if (registroGarantia) registroGarantia.hidden = true;
    if (valuacion) valuacion.hidden = true;
    if (factura) factura.hidden = true;
    if (testimonioNotarial) testimonioNotarial.hidden = true;
    if (actaPosesion) actaPosesion.hidden = true;
    if (reciboSimple) reciboSimple.hidden = true;
    if (constanciaPosesion) constanciaPosesion.hidden = true;
    if (firmas) { firmas.hidden = false; firmas.style.display = ''; }
    if (firmasMenor) { firmasMenor.hidden = true; firmasMenor.style.display = 'none'; }
    if (firmasMayor) { firmasMayor.hidden = true; firmasMayor.style.display = 'none'; }
    if (tabCarga) tabCarga.hidden = false;
    if (tabPagos) tabPagos.hidden = false;

    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    const dictamenTab = document.querySelector('.tab[data-tab="dictamen"]');
    if (dictamenTab) dictamenTab.classList.add('active');

    const dictamenHeader = document.querySelector('#dictamen .card-header h2');
    if (dictamenHeader) dictamenHeader.textContent = 'Resolución de Comité de Crédito';
  };

  window.mostrarDictamenQuash = function () {
    actualizarBotonesSolventacion(true);

    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      const tabText = tab.textContent.trim();
      if (tabText === 'Dictamen' || tabText === 'Dictamen Quash' || tabText === 'Acta de Comite') {
        tab.hidden = false;
      }
    });

    const firmas = document.getElementById('firmas');
    const dictamen = document.getElementById('dictamen');
    const dictamenQuash = document.getElementById('dictamenQuash');
    const historial = document.getElementById('historial');
    const tipoActa = document.getElementById('tipoActa');
    const generarActa = document.getElementById('generarActa');
    const cargaDocumentos = document.getElementById('cargaDocumentos');
    const tabCarga = document.getElementById('tabCargaDocumentos');
    const aplicacionPagos = document.getElementById('aplicacionPagos');
    const tabPagos = document.getElementById('tabAplicacionPagos');
    const registroGarantia = document.getElementById('registroGarantia');
    const valuacion = document.getElementById('valuacion');
    const factura = document.getElementById('factura');
    const testimonioNotarial = document.getElementById('testimonioNotarial');
    const actaPosesion = document.getElementById('actaPosesion');
    const reciboSimple = document.getElementById('reciboSimple');
    const constanciaPosesion = document.getElementById('constanciaPosesion');
    const firmasMenor = document.getElementById('firmasMenor');
    const firmasMayor = document.getElementById('firmasMayor');

    if (dictamen) dictamen.hidden = true;
    if (dictamenQuash) dictamenQuash.hidden = false;
    if (historial) historial.hidden = true;
    if (tipoActa) tipoActa.hidden = true;
    if (generarActa) generarActa.hidden = true;
    if (cargaDocumentos) cargaDocumentos.hidden = true;
    if (aplicacionPagos) aplicacionPagos.hidden = true;
    if (registroGarantia) registroGarantia.hidden = true;
    if (valuacion) valuacion.hidden = true;
    if (factura) factura.hidden = true;
    if (testimonioNotarial) testimonioNotarial.hidden = true;
    if (actaPosesion) actaPosesion.hidden = true;
    if (reciboSimple) reciboSimple.hidden = true;
    if (constanciaPosesion) constanciaPosesion.hidden = true;
    if (firmas) { firmas.hidden = true; firmas.style.display = 'none'; }
    if (firmasMenor) { firmasMenor.hidden = true; firmasMenor.style.display = 'none'; }
    if (firmasMayor) { firmasMayor.hidden = true; firmasMayor.style.display = 'none'; }
    if (tabCarga) tabCarga.hidden = false;
    if (tabPagos) tabPagos.hidden = false;

    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    const quashTab = document.querySelector('.tab[data-tab="dictamen-quash"]');
    if (quashTab) quashTab.classList.add('active');

    actualizarDatosQuash();
  };

  function actualizarDatosQuash() {
    const quashData = {
      resultado: 'AUTORIZADO',
      score: '69%',
      observaciones: 'No aplica',
      edad: 'No aplica',
      sexo: 'Agregar pareja como co acreditado',
      estadoCivil: 'Validar criterio estado civil femenino',
      actividadEconomica: 'No aplica',
      consultaHC: 'No aplica'
    };

    const resultadoEl = document.getElementById('quashResultado');
    if (resultadoEl) {
      resultadoEl.textContent = quashData.resultado;
      resultadoEl.className = 'quash-value';
      if (quashData.resultado === 'AUTORIZADO') {
        resultadoEl.classList.add('quash-autorizado');
      } else if (quashData.resultado === 'OBSERVADO') {
        resultadoEl.classList.add('quash-observado');
      } else if (quashData.resultado === 'RECHAZADO') {
        resultadoEl.classList.add('quash-rechazado');
      }
    }

    const scoreEl = document.getElementById('quashScore');
    if (scoreEl) scoreEl.textContent = quashData.score;

    const observacionesEl = document.getElementById('quashObservaciones');
    if (observacionesEl) observacionesEl.textContent = quashData.observaciones;

    const edadEl = document.getElementById('quashEdad');
    if (edadEl) edadEl.textContent = quashData.edad;

    const sexoEl = document.getElementById('quashSexo');
    if (sexoEl) sexoEl.textContent = quashData.sexo;

    const estadoCivilEl = document.getElementById('quashEstadoCivil');
    if (estadoCivilEl) estadoCivilEl.textContent = quashData.estadoCivil;

    const actividadEl = document.getElementById('quashActividadEconomica');
    if (actividadEl) actividadEl.textContent = quashData.actividadEconomica;

    const consultaEl = document.getElementById('quashConsultaHC');
    if (consultaEl) consultaEl.textContent = quashData.consultaHC;
  }

  /* ---------------------------------------------------------
     5. Funcionalidad de resolución
  --------------------------------------------------------- */
  const wrapperResolucionPredefinida = document.getElementById('wrapperResolucionPredefinida');
  const resolucionPredefinidaSelect = document.getElementById('resolucionPredefinida');
  const resolucionComiteTextarea = document.getElementById('resolucionComite');
  const btnLimpiarResolucion = document.getElementById('btnLimpiarResolucion');

  if (btnLimpiarResolucion) {
    btnLimpiarResolucion.addEventListener('click', () => {
      if (resolucionComiteTextarea && resolucionComiteTextarea.value.trim() !== '') {
        if (confirm('¿Estás seguro de que quieres limpiar el texto de la resolución?')) {
          resolucionComiteTextarea.value = '';
          marcarUltimaModificacion();
        }
      }
    });
  }

  function actualizarDesplegablePredefinido() {
    const estado = autorizacionSelect ? autorizacionSelect.value : '';
    if (resolucionPredefinidaSelect) resolucionPredefinidaSelect.innerHTML = '';

    if (estado && PLANTILLAS_RESOLUCION[estado] && resolucionPredefinidaSelect) {
      const optDefault = document.createElement('option');
      optDefault.value = "";
      optDefault.textContent = "Ninguna (Entrada manual) / Seleccione una plantilla...";
      resolucionPredefinidaSelect.appendChild(optDefault);

      PLANTILLAS_RESOLUCION[estado].forEach((item, index) => {
        const opt = document.createElement('option');
        opt.value = index;
        opt.textContent = item.titulo;
        resolucionPredefinidaSelect.appendChild(opt);
      });

      if (wrapperResolucionPredefinida) wrapperResolucionPredefinida.style.display = 'flex';
    } else {
      if (wrapperResolucionPredefinida) wrapperResolucionPredefinida.style.display = 'none';
    }
  }

  if (autorizacionSelect) {
    autorizacionSelect.addEventListener('change', () => {
      const estado = autorizacionSelect.value;

      if (estado === 'autorizado') {
        if (fechaAprobacionInput && (!fechaAprobacionInput.value || fechaAprobacionInput.value === '—')) {
          fechaAprobacionInput.value = formatearFecha(new Date());
        }
      } else {
        if (fechaAprobacionInput) fechaAprobacionInput.value = '';
      }

      if (estado) {
        if (fechaResolucionInput) fechaResolucionInput.value = formatearFecha(new Date());
      } else {
        if (fechaResolucionInput) fechaResolucionInput.value = '';
      }

      actualizarDesplegablePredefinido();
      marcarUltimaModificacion();
    });
  }

  if (resolucionPredefinidaSelect) {
    resolucionPredefinidaSelect.addEventListener('change', () => {
      const estado = autorizacionSelect ? autorizacionSelect.value : '';
      const indexSelected = resolucionPredefinidaSelect.value;

      if (estado && indexSelected !== "" && PLANTILLAS_RESOLUCION[estado] && PLANTILLAS_RESOLUCION[estado][indexSelected]) {
        const currentText = resolucionComiteTextarea ? resolucionComiteTextarea.value.trim() : '';
        const newText = PLANTILLAS_RESOLUCION[estado][indexSelected].texto;

        if (resolucionComiteTextarea) {
          if (currentText) {
            resolucionComiteTextarea.value = currentText + '\n' + newText;
          } else {
            resolucionComiteTextarea.value = newText;
          }
        }

        resolucionPredefinidaSelect.value = "";
        marcarUltimaModificacion();
      }
    });
  }

  const camposDictamenIds = ['montoAprobado', 'plazo', 'tasa', 'nivelRiesgo', 'resolucionComite', 'periodicidad'];
  camposDictamenIds.forEach(id => {
    const campo = document.getElementById(id);
    if (campo) {
      campo.addEventListener('input', marcarUltimaModificacion);
      campo.addEventListener('change', marcarUltimaModificacion);
    }
  });

  [presidenteTipo, presidenteNombre, secretariaTipo, secretariaNombre, firmaExtraordinaria].forEach(campo => {
    if (campo) {
      campo.addEventListener('change', marcarUltimaModificacion);
    }
  });

  const btnGuardar = document.getElementById('guardarResolucion');

  if (btnGuardar) {
    btnGuardar.addEventListener('click', () => {
      marcarUltimaModificacion();

      const textoOriginal = btnGuardar.textContent;
      btnGuardar.textContent = '✓ Resolución Guardada';
      btnGuardar.classList.add('saved');

      setTimeout(() => {
        btnGuardar.textContent = textoOriginal;
        btnGuardar.classList.remove('saved');
      }, 1800);
    });
  }

  /* ---------------------------------------------------------
     6. Historial de Créditos
  --------------------------------------------------------- */
  const HC_DATOS = [
    { otorgante: 'BANCOS', tipo: 'PP', saldoActual: 0, saldoVencido: 0, pagoActual: 'V', ultimoPago: '2018-06-06', frecuencia: 'Semanal', monto: 0 },
    { otorgante: 'BANCOS', tipo: 'PP', saldoActual: 0, saldoVencido: 0, pagoActual: 'V', ultimoPago: '2018-09-28', frecuencia: 'Semanal', monto: 0 },
    { otorgante: 'ASEFIMEX', tipo: 'PP', saldoActual: 16286, saldoVencido: 0, pagoActual: 'V', ultimoPago: '2026-05-28', frecuencia: 'Pago Mínimo Revolvente', monto: 2975 }
  ];

  function formatMXN(v) {
    return '$' + v.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function renderHistorialCreditos() {
    const tbody = document.getElementById('hcTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    HC_DATOS.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.otorgante}</td>
        <td>${row.tipo}</td>
        <td>${formatMXN(row.saldoActual)}</td>
        <td>${formatMXN(row.saldoVencido)}</td>
        <td>${row.pagoActual}</td>
        <td>${row.ultimoPago}</td>
        <td>${row.frecuencia}</td>
        <td>${formatMXN(row.monto)}</td>
      `;
      tbody.appendChild(tr);
    });

    const totalSaldoActual = HC_DATOS.reduce((s, r) => s + r.saldoActual, 0);
    const totalSaldoVencido = HC_DATOS.reduce((s, r) => s + r.saldoVencido, 0);

    const totalActual = document.getElementById('hcTotalSaldoActual');
    const totalVencido = document.getElementById('hcTotalSaldoVencido');
    if (totalActual) totalActual.textContent = formatMXN(totalSaldoActual);
    if (totalVencido) totalVencido.textContent = formatMXN(totalSaldoVencido);

    const freqMap = {};
    HC_DATOS.forEach(r => {
      freqMap[r.frecuencia] = (freqMap[r.frecuencia] || 0) + r.monto;
    });
    const freqList = document.getElementById('hcFreqList');
    if (!freqList) return;
    freqList.innerHTML = '';
    Object.entries(freqMap).forEach(([frec, total]) => {
      const div = document.createElement('div');
      div.className = 'hc-freq-row';
      div.innerHTML = `<span>${frec}</span><span>${formatMXN(total)}</span>`;
      freqList.appendChild(div);
    });
  }

  renderHistorialCreditos();

  /* ---------------------------------------------------------
     7. CARGA DE DOCUMENTOS - VISTA Y FUNCIONALIDAD
  --------------------------------------------------------- */
  const DOCUMENTOS_DATA = [
    { id: 1, nombre: 'Identificacion Oficial', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 2, nombre: 'CURP', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 3, nombre: 'RFC', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 4, nombre: 'Acta de Nacimiento', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 5, nombre: 'Comprobante de Domicilio', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 6, nombre: 'Comprobante de Domicilio Alterno', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 7, nombre: 'Permiso', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 8, nombre: 'Arraigo', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 9, nombre: 'Fotos del Domicilio', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 10, nombre: 'Fotos de la Actividad', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 11, nombre: 'Comprobante de Ingresos', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 12, nombre: 'Autorización de Consulta de Buró', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 13, nombre: 'Carta de Excepción a la Norma', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 14, nombre: 'Enganche', archivo: '', comentario: '' },
    { id: 15, nombre: 'Garantia Liquida', archivo: '', comentario: '' },
    { id: 16, nombre: 'Comisión por Apertura', archivo: '', comentario: '' },
    { id: 17, nombre: 'Co Financiamiento', archivo: '', comentario: '' },
    { id: 18, nombre: 'Complemento de Enganche', archivo: '', comentario: '' },
    { id: 19, nombre: 'Garantia Liquida Enganche Diferido', archivo: '', comentario: '' },
    { id: 20, nombre: 'Factura', archivo: '', comentario: '' },
    { id: 21, nombre: 'Carta Factura', archivo: '', comentario: '' },
    { id: 22, nombre: 'Permiso', archivo: '', comentario: '' },
    { id: 23, nombre: 'Enganche GPS', archivo: '', comentario: '' }
  ];

  const DOCUMENTOS_DATA_SOLIDARIO = [
    { id: 1, nombre: 'Identificacion Oficial Aval', archivo: '', comentario: '' },
    { id: 2, nombre: 'CURP Aval', archivo: '', comentario: '' },
    { id: 3, nombre: 'RFC Aval', archivo: '', comentario: '' },
    { id: 4, nombre: 'Acta nacimiento aval', archivo: '', comentario: '' },
    { id: 5, nombre: 'Comprobante domicilio aval', archivo: '', comentario: '' },
    { id: 6, nombre: 'Comprobante de Ingresos Aval', archivo: '', comentario: '' },
    { id: 7, nombre: 'Garantia Liquida Enganche Diferido', archivo: '', comentario: '' },
    { id: 8, nombre: 'Factura Aval', archivo: '', comentario: '' },
    { id: 9, nombre: 'Carta Factura Aval', archivo: '', comentario: '' },
    { id: 10, nombre: 'Permiso Aval', archivo: '', comentario: '' },
    { id: 11, nombre: 'Enganche GPS Aval', archivo: '', comentario: '' },
    { id: 12, nombre: 'Comprobante Domicilio Alterno Aval Solidario', archivo: '', comentario: '' },
    { id: 13, nombre: 'Arraigo Domiciliar Aval Solidario', archivo: '', comentario: '' },
    { id: 14, nombre: 'Fotos del Domicilio Aval Solidario', archivo: '', comentario: '' },
    { id: 15, nombre: 'Fotos de la Actividad Aval Solidario', archivo: '', comentario: '' },
    { id: 16, nombre: 'Comprobante de Ingresos Aval Solidario', archivo: '', comentario: '' },
    { id: 17, nombre: 'Otros Aval Solidario', archivo: '', comentario: '' }
  ];

  const DOCUMENTOS_DATA_GARANTE = [
    { id: 1, nombre: 'Identificacion oficial garante', archivo: '', comentario: '' },
    { id: 2, nombre: 'CURP garante', archivo: '', comentario: '' },
    { id: 3, nombre: 'RFC garante', archivo: '', comentario: '' },
    { id: 4, nombre: 'Acta nacimiento garante', archivo: '', comentario: '' },
    { id: 5, nombre: 'Enganche Garante', archivo: '', comentario: '' },
    { id: 6, nombre: 'Garantia Liquida Garante', archivo: '', comentario: '' },
    { id: 7, nombre: 'Comisión por Apertura Garante', archivo: '', comentario: '' },
    { id: 8, nombre: 'Co Financiamiento Garante', archivo: '', comentario: '' },
    { id: 9, nombre: 'Complemento de Enganche Garante', archivo: '', comentario: '' },
    { id: 10, nombre: 'Garantia Liquida Enganche Diferido Garante', archivo: '', comentario: '' },
    { id: 11, nombre: 'Factura Garante', archivo: '', comentario: '' },
    { id: 12, nombre: 'Carta Factura Garante', archivo: '', comentario: '' },
    { id: 13, nombre: 'Permiso Garante', archivo: '', comentario: '' },
    { id: 14, nombre: 'Enganche GPS Garante', archivo: '', comentario: '' },
    { id: 15, nombre: 'Comprobante Domicilio Alterno Garante', archivo: '', comentario: '' },
    { id: 16, nombre: 'Arraigo Domiciliar Garante', archivo: '', comentario: '' },
    { id: 17, nombre: 'Fotos del Domicilio Garante', archivo: '', comentario: '' },
    { id: 18, nombre: 'Fotos de la Actividad Garante', archivo: '', comentario: '' },
    { id: 19, nombre: 'Comprobante de Ingresos Garante', archivo: '', comentario: '' },
    { id: 20, nombre: 'Otros Garante', archivo: '', comentario: '' }
  ];

  const DOCUMENTOS_ADICIONALES = [
    { id: 1, nombre: 'Check list mesa de control' },
    { id: 2, nombre: 'Caratura del comite de credito' },
    { id: 3, nombre: 'Carta de excepcion a la norma' },
    { id: 4, nombre: 'Solicitud de credito para personas fisicas/personas morales' },
    { id: 5, nombre: 'Comprobante de ingresos' },
    { id: 6, nombre: 'Comprobante de arraigo domiciliar' },
    { id: 7, nombre: 'Evidencia de la actividad (garantia o comprobante de experiencia)' },
    { id: 8, nombre: 'Comprobante de pago de deudas' },
    { id: 9, nombre: 'Factura de garantia natural' },
    { id: 10, nombre: 'Copia de deposito de enganche' },
    { id: 11, nombre: 'Comision por apertura de credito' },
    { id: 12, nombre: 'Estado de cuenta bancario' },
    { id: 13, nombre: 'Contrato de GPS' },
    { id: 14, nombre: 'Carta de aceptacion de endoso' },
    { id: 15, nombre: 'Garantia liquida' },
    { id: 16, nombre: 'Cofinanciamiento' },
    { id: 17, nombre: 'Enganche diferido' },
    { id: 18, nombre: 'Complemento de enganche' },
    { id: 19, nombre: 'Enganche gps' },
    { id: 20, nombre: 'Carta factura' },
    { id: 21, nombre: 'Aceptacion de endoso' },
    { id: 22, nombre: 'Factura de garantia adicional 1' },
    { id: 23, nombre: 'Factura de garantia adicional 2' },
    { id: 24, nombre: 'Pagare de distribuidor' },
    { id: 25, nombre: 'Cotizacion de seguro' },
    { id: 26, nombre: 'Poliza de seguro' },
    { id: 27, nombre: 'Comprobnante de pago de seguro' },
    { id: 28, nombre: 'Solicitud de instalacion de gps' },
    { id: 29, nombre: 'Validacion de factura de SAT' },
    { id: 30, nombre: 'Estado de cuenta cliente' },
    { id: 31, nombre: 'Domicilio Alterno' },
    { id: 32, nombre: 'Arraigo Domiciliar' },
    { id: 33, nombre: 'Fotos del Domicilio' },
    { id: 34, nombre: 'Fotos de la Actividad' },
    { id: 35, nombre: 'Comprobante de Ingresos' },
    { id: 36, nombre: 'Otros' }
    // { id: 37, nombre: '' },
  ]

  function renderCargaDocumentos() {
    const tbody = document.getElementById('docTableBodyCliente');
    const tbody2 = document.getElementById('docTableBodyAvalSolidario');
    const tbody3 = document.getElementById('docTableBodyAvalGarante');
    const tbody4 = document.getElementById('docTableBodyAdicionales');
    if (!tbody) return;
    tbody.innerHTML = '';
    tbody2.innerHTML = '';
    tbody3.innerHTML = '';
    tbody4.innerHTML = '';

    DOCUMENTOS_DATA.forEach(doc => {
      const tr = document.createElement('tr');
      const fileId = `file_${doc.id}`;

      tr.innerHTML = `
        <td style="text-align: left;"><strong>${doc.nombre}</strong></td>
        <td style="text-align: left;">
          <span class="file-name" id="fileName_${doc.id}">${doc.archivo || 'Ningún archivo seleccionado'}</span>
        </td>
        <td style="text-align: center;">
          <button class="btn-icon" onclick="verDocumento(${doc.id})" title="Ver documento">👁️</button>
        </td>
        <td style="text-align: center;">
          <label class="file-label" for="${fileId}">
            📎 Subir
            <input type="file" id="${fileId}" onchange="subirDocumento(${doc.id}, this)">
          </label>
        </td>
        <td style="text-align: left;">
          <input type="text" class="doc-comment" id="comment_${doc.id}" placeholder="Agregar comentario..." value="${doc.comentario || ''}" onchange="guardarComentario(${doc.id}, this.value)">
        </td>
      `;
      tbody.appendChild(tr);
    });

    DOCUMENTOS_DATA_SOLIDARIO.forEach(doc => {
      const tr = document.createElement('tr');
      const fileId = `file_${doc.id}`;

      tr.innerHTML = `
        <td style="text-align: left;"><strong>${doc.nombre}</strong></td>
        <td style="text-align: left;">
          <span class="file-name" id="fileName_${doc.id}">${doc.archivo || 'Ningún archivo seleccionado'}</span>
        </td>
        <td style="text-align: center;">
          <button class="btn-icon" onclick="verDocumento(${doc.id})" title="Ver documento">👁️</button>
        </td>
        <td style="text-align: center;">
          <label class="file-label" for="${fileId}">
            📎 Subir
            <input type="file" id="${fileId}" onchange="subirDocumento(${doc.id}, this)">
          </label>
        </td>
        <td style="text-align: left;">
          <input type="text" class="doc-comment" id="comment_${doc.id}" placeholder="Agregar comentario..." value="${doc.comentario || ''}" onchange="guardarComentario(${doc.id}, this.value)">
        </td>
      `;
      tbody2.appendChild(tr);
    });

    DOCUMENTOS_DATA_GARANTE.forEach(doc => {
      const tr = document.createElement('tr');
      const fileId = `file_${doc.id}`;

      tr.innerHTML = `
        <td style="text-align: left;"><strong>${doc.nombre}</strong></td>
        <td style="text-align: left;">
          <span class="file-name" id="fileName_${doc.id}">${doc.archivo || 'Ningún archivo seleccionado'}</span>
        </td>
        <td style="text-align: center;">
          <button class="btn-icon" onclick="verDocumento(${doc.id})" title="Ver documento">👁️</button>
        </td>
        <td style="text-align: center;">
          <label class="file-label" for="${fileId}">
            📎 Subir
            <input type="file" id="${fileId}" onchange="subirDocumento(${doc.id}, this)">
          </label>
        </td>
        <td style="text-align: left;">
          <input type="text" class="doc-comment" id="comment_${doc.id}" placeholder="Agregar comentario..." value="${doc.comentario || ''}" onchange="guardarComentario(${doc.id}, this.value)">
        </td>
      `;
      tbody3.appendChild(tr);
    });

    DOCUMENTOS_ADICIONALES.forEach(doc => {
      const tr = document.createElement('tr');
      const fileId = `file_${doc.id}`;

      tr.innerHTML = `
        <td style="text-align: left;"><strong>${doc.nombre}</strong></td>
        <td style="text-align: left;">
          <span class="file-name" id="fileName_${doc.id}">${doc.archivo || 'Ningún archivo seleccionado'}</span>
        </td>
        <td style="text-align: center;">
          <button class="btn-icon" onclick="verDocumento(${doc.id})" title="Ver documento">👁️</button>
        </td>
        <td style="text-align: center;">
          <label class="file-label" for="${fileId}">
            📎 Subir
            <input type="file" id="${fileId}" onchange="subirDocumento(${doc.id}, this)">
          </label>
        </td>
        <td style="text-align: left;">
          <input type="text" class="doc-comment" id="comment_${doc.id}" placeholder="Agregar comentario..." value="${doc.comentario || ''}" onchange="guardarComentario(${doc.id}, this.value)">
        </td>
      `;
      tbody4.appendChild(tr);
    });
  }

  window.subirDocumento = function (id, input) {
    const file = input.files[0];
    if (file) {
      const doc = DOCUMENTOS_DATA.find(d => d.id === id);
      if (doc) {
        doc.archivo = file.name;
        const fileNameSpan = document.getElementById(`fileName_${id}`);
        if (fileNameSpan) {
          fileNameSpan.textContent = file.name;
        }
        const label = input.closest('.file-label');
        if (label) {
          label.classList.add('selected');
          label.innerHTML = `✅ ${file.name.substring(0, 15)}${file.name.length > 15 ? '...' : ''}`;
          const newInput = document.createElement('input');
          newInput.type = 'file';
          newInput.id = input.id;
          newInput.onchange = function () { window.subirDocumento(id, this); };
          label.appendChild(newInput);
        }
        marcarUltimaModificacion();
      }
    }
  };

  window.verDocumento = function (id) {
    const doc = DOCUMENTOS_DATA.find(d => d.id === id);
    if (doc && doc.archivo) {
      alert(`Ver documento: ${doc.archivo}\n(En una implementación real, aquí se abriría la vista previa del archivo)`);
    } else {
      alert('No hay archivo subido para este documento.');
    }
  };

  window.guardarComentario = function (id, valor) {
    const doc = DOCUMENTOS_DATA.find(d => d.id === id);
    if (doc) {
      doc.comentario = valor;
      marcarUltimaModificacion();
    }
  };

  window.guardarDocumentos = function () {
    alert('Documentos guardados exitosamente');
  };

  renderCargaDocumentos();

  /* ---------------------------------------------------------
     8. APLICACIÓN DE PAGOS - VISTA Y FUNCIONALIDAD
     CON COLUMNA ESTATUS Y ALINEACIÓN CORREGIDA
  --------------------------------------------------------- */
  const PAGOS_DATA = [
    { id: 1, nombre: 'Enganche', archivo: '', comentario: '', aplicacion: '', estado: '', estatus: 'pendiente' },
    { id: 2, nombre: 'Garantía Líquida', archivo: '', comentario: '', aplicacion: '', estado: '', estatus: 'pendiente' },
    { id: 3, nombre: 'Comisión por Apertura', archivo: '', comentario: '', aplicacion: '', estado: '', estatus: 'pendiente' },
    { id: 4, nombre: 'Co Financiamiento', archivo: '', comentario: '', aplicacion: '', estado: '', estatus: 'pendiente' },
    { id: 5, nombre: 'Complemento de Enganche', archivo: '', comentario: '', aplicacion: '', estado: '', estatus: 'pendiente' },
    { id: 6, nombre: 'Enganche GPS', archivo: '', comentario: '', aplicacion: '', estado: '', estatus: 'pendiente' },
    { id: 7, nombre: 'Garantia Liquida Enganche Diferido', archivo: '', comentario: '', aplicacion: '', estado: '', estatus: 'pendiente' }
  ];

  let pagoActualId = null;
  let pagoCancelarId = null;

  function renderAplicacionPagos() {
    const tbody = document.getElementById('pagosTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    PAGOS_DATA.forEach(pago => {
      const tr = document.createElement('tr');
      const estaAplicado = pago.aplicacion && pago.aplicacion !== '' && pago.estado !== 'cancelado';
      const estaCancelado = pago.estado === 'cancelado';

      let estatusClass = '';
      if (pago.estatus === 'pendiente') estatusClass = 'estatus-pendiente';
      else if (pago.estatus === 'aplicado') estatusClass = 'estatus-aplicado';
      else if (pago.estatus === 'cancelado') estatusClass = 'estatus-cancelado';
      else if (pago.estatus === 'revision') estatusClass = 'estatus-revision';

      tr.innerHTML = `
        <td style="text-align: left;"><strong>${pago.nombre}</strong></td>
        <td style="text-align: left;">
          <span class="file-name" id="pagoFileName_${pago.id}">${pago.archivo || 'Ningún archivo seleccionado'}</span>
        </td>
        <td style="text-align: center;">
          <button class="btn-icon" onclick="verPago(${pago.id})" title="Ver documento">👁️</button>
        </td>
        <td style="text-align: center;">
          <button class="btn-icon" onclick="guardarPagoDocumento(${pago.id})" title="Guardar documento">💾</button>
        </td>
        <td style="text-align: left;">
          <input type="text" class="doc-comment" id="pagoComment_${pago.id}" placeholder="Agregar comentario..." value="${pago.comentario || ''}" onchange="guardarPagoComentario(${pago.id}, this.value)">
        </td>
        <td style="text-align: center;">
          <div class="acciones-pago">
            <button class="btn-aplicar-pago ${estaAplicado ? 'aplicado' : ''} ${estaCancelado ? 'cancelado' : ''}" onclick="abrirModalAplicarPago(${pago.id})">
              ${estaCancelado ? '⛔ Cancelado' : (estaAplicado ? '✓ Aplicado' : 'Aplicar Pago')}
            </button>
          </div>
        </td>
        <td style="text-align: center;">
          <div class="acciones-pago">
            <button class="btn-cancelar-pago ${estaCancelado ? 'cancelado' : ''}" onclick="abrirModalCancelarPago(${pago.id})">
              ${estaCancelado ? '✓ Cancelado' : 'Cancelar Pago'}
            </button>
          </div>
        </td>
        <td style="text-align: center;">
          <select class="select-estatus ${estatusClass}" id="estatus_${pago.id}" onchange="cambiarEstatus(${pago.id}, this.value)">
            <option value="pendiente" ${pago.estatus === 'pendiente' ? 'selected' : ''}>Pendiente</option>
            <option value="aplicado" ${pago.estatus === 'aplicado' ? 'selected' : ''}>Aplicado</option>
            <option value="cancelado" ${pago.estatus === 'cancelado' ? 'selected' : ''}>Cancelado</option>
            <option value="revision" ${pago.estatus === 'revision' ? 'selected' : ''}>En Revisión</option>
          </select>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.cambiarEstatus = function (id, nuevoEstatus) {
    const pago = PAGOS_DATA.find(p => p.id === id);
    if (pago) {
      pago.estatus = nuevoEstatus;
      marcarUltimaModificacion();

      const select = document.getElementById(`estatus_${id}`);
      if (select) {
        select.className = 'select-estatus';
        if (nuevoEstatus === 'pendiente') select.classList.add('estatus-pendiente');
        else if (nuevoEstatus === 'aplicado') select.classList.add('estatus-aplicado');
        else if (nuevoEstatus === 'cancelado') select.classList.add('estatus-cancelado');
        else if (nuevoEstatus === 'revision') select.classList.add('estatus-revision');
      }

      if (!window._actualizandoEstatus) {
        const estatusTexto = {
          'pendiente': 'Pendiente',
          'aplicado': 'Aplicado',
          'cancelado': 'Cancelado',
          'revision': 'En Revisión'
        };
        alert(`Estatus del documento "${pago.nombre}" actualizado a: ${estatusTexto[nuevoEstatus]}`);
      }
    }
  };

  window.verPago = function (id) {
    const pago = PAGOS_DATA.find(p => p.id === id);
    if (pago && pago.archivo) {
      alert(`Ver documento: ${pago.archivo}\n(En una implementación real, aquí se abriría la vista previa del archivo)`);
    } else {
      alert('No hay archivo subido para este documento.');
    }
  };

  window.guardarPagoDocumento = function (id) {
    const pago = PAGOS_DATA.find(p => p.id === id);
    if (pago && pago.archivo) {
      alert(`Documento "${pago.nombre}" guardado exitosamente.\nArchivo: ${pago.archivo}`);
      marcarUltimaModificacion();
    } else {
      alert('No hay archivo para guardar. Por favor sube un archivo primero.');
    }
  };

  window.guardarPagoComentario = function (id, valor) {
    const pago = PAGOS_DATA.find(p => p.id === id);
    if (pago) {
      pago.comentario = valor;
      marcarUltimaModificacion();
    }
  };

  window.guardarPagos = function () {
    let resumen = 'Resumen de Pagos:\n\n';
    PAGOS_DATA.forEach(p => {
      const estatusTexto = {
        'pendiente': 'Pendiente',
        'aplicado': 'Aplicado',
        'cancelado': 'Cancelado',
        'revision': 'En Revisión'
      };
      resumen += `${p.nombre}: ${estatusTexto[p.estatus] || p.estatus}\n`;
    });
    alert(`Pagos guardados exitosamente.\n\n${resumen}`);
  };

  /* ---------------------------------------------------------
     8.1 FORMATO DE MONEDA PARA EL CAMPO DE MONTO
  --------------------------------------------------------- */
  function formatearMoneda(valor) {
    let limpio = valor.replace(/[^0-9.]/g, '');
    if (limpio === '' || limpio === '.') return '';

    let partes = limpio.split('.');
    let entero = partes[0];
    let decimal = partes[1] || '';

    if (decimal.length > 2) {
      decimal = decimal.substring(0, 2);
    }

    let enteroFormateado = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    if (decimal) {
      return enteroFormateado + '.' + decimal;
    } else {
      return enteroFormateado;
    }
  }

  function inicializarCampoMoneda() {
    const montoInput = document.getElementById('montoAplicado');
    if (!montoInput) return;

    montoInput.addEventListener('input', function (e) {
      let valor = this.value;
      let posicion = this.selectionStart;
      let formateado = formatearMoneda(valor);

      if (formateado !== valor) {
        this.value = formateado;
        let nuevaPosicion = posicion;
        if (formateado.length > valor.length) {
          nuevaPosicion = posicion + (formateado.length - valor.length);
        } else if (formateado.length < valor.length) {
          nuevaPosicion = posicion - (valor.length - formateado.length);
        }
        this.setSelectionRange(nuevaPosicion, nuevaPosicion);
      }
    });

    montoInput.addEventListener('blur', function () {
      let valor = this.value.replace(/,/g, '');
      let numerico = parseFloat(valor);

      if (!isNaN(numerico) && numerico > 0) {
        if (!valor.includes('.')) {
          this.value = formatearMoneda(valor + '.00');
        } else {
          let partes = valor.split('.');
          if (partes[1].length === 1) {
            this.value = formatearMoneda(valor + '0');
          } else {
            this.value = formatearMoneda(valor);
          }
        }
      } else if (this.value !== '') {
        this.value = '';
      }
    });

    montoInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        this.blur();
      }
    });
  }

  /* ---------------------------------------------------------
     8.2 MODAL APLICACIÓN DE PAGOS
  --------------------------------------------------------- */
  window.abrirModalAplicarPago = function (id) {
    const pago = PAGOS_DATA.find(p => p.id === id);
    if (!pago) return;

    pagoActualId = id;

    const modal = document.getElementById('modalAplicarPago');
    const docName = document.getElementById('modalDocName');
    if (docName) {
      docName.innerHTML = `Documento: <strong>${pago.nombre}</strong>`;
    }

    const radios = document.querySelectorAll('input[name="pregunta1"]');
    radios.forEach(r => r.checked = false);

    const montoInput = document.getElementById('montoAplicado');
    if (montoInput) {
      montoInput.value = '3,300';
      inicializarCampoMoneda();
    }

    const fechaInput = document.getElementById('fechaAplicacion');
    if (fechaInput) {
      const hoy = new Date().toISOString().split('T')[0];
      fechaInput.value = hoy;
    }

    const fechaInputOp = document.getElementById('fechaOperacion');
    if (fechaInputOp) {
      const hoy = new Date().toISOString().split('T')[0];
      fechaInputOp.value = hoy;
    }

    const formaPago = document.getElementById('formaPago');
    if (formaPago) formaPago.value = '';

    const comentarios = document.getElementById('comentariosPago');
    if (comentarios) comentarios.value = '';

    if (modal) modal.style.display = 'flex';
  };

  window.cerrarModalAplicarPago = function () {
    const modal = document.getElementById('modalAplicarPago');
    if (modal) modal.style.display = 'none';
    pagoActualId = null;
  };

  window.confirmarAplicarPago = function () {
    if (pagoActualId === null) {
      alert('Error: No se seleccionó un pago.');
      return;
    }

    const pregunta1 = document.querySelector('input[name="pregunta1"]:checked');
    const montoInput = document.getElementById('montoAplicado');
    const fecha = document.getElementById('fechaAplicacion');
    const formaPago = document.getElementById('formaPago');

    if (!pregunta1) {
      alert('Por favor, selecciona si se realizó el pago.');
      return;
    }

    if (!montoInput || !montoInput.value) {
      alert('Por favor, ingresa un monto válido.');
      return;
    }

    const montoValor = parseFloat(montoInput.value.replace(/,/g, ''));
    if (isNaN(montoValor) || montoValor <= 0) {
      alert('Por favor, ingresa un monto válido.');
      return;
    }

    if (!fecha || !fecha.value) {
      alert('Por favor, selecciona la fecha de aplicación.');
      return;
    }

    if (!formaPago || !formaPago.value) {
      alert('Por favor, selecciona la forma de pago.');
      return;
    }

    const datosPago = {
      id: pagoActualId,
      documento: PAGOS_DATA.find(p => p.id === pagoActualId)?.nombre || '',
      pagoRealizado: pregunta1.value,
      monto: montoValor,
      fecha: fecha.value,
      formaPago: formaPago.value,
      comentarios: document.getElementById('comentariosPago')?.value || ''
    };

    const pago = PAGOS_DATA.find(p => p.id === pagoActualId);
    if (pago) {
      pago.aplicacion = `Aplicado: $${datosPago.monto.toFixed(2)} - ${datosPago.fecha}`;
      pago.estado = 'aplicado';
      window._actualizandoEstatus = true;
      pago.estatus = 'aplicado';
      window._actualizandoEstatus = false;
    }

    alert(`✅ Pago aplicado exitosamente para:\n\nDocumento: ${datosPago.documento}\nMonto: $${datosPago.monto.toFixed(2)}\nFecha: ${datosPago.fecha}\nForma de pago: ${datosPago.formaPago}\n¿Pago realizado? ${datosPago.pagoRealizado === 'si' ? 'Sí' : datosPago.pagoRealizado === 'no' ? 'No' : 'Parcial'}\n${datosPago.comentarios ? 'Comentarios: ' + datosPago.comentarios : ''}`);

    cerrarModalAplicarPago();
    renderAplicacionPagos();
    marcarUltimaModificacion();
  };

  /* ---------------------------------------------------------
     8.3 MODAL CANCELAR PAGO
  --------------------------------------------------------- */
  window.abrirModalCancelarPago = function (id) {
    const pago = PAGOS_DATA.find(p => p.id === id);
    if (!pago) return;

    pagoCancelarId = id;

    const modal = document.getElementById('modalCancelarPago');
    const docName = document.getElementById('modalCancelDocName');
    if (docName) {
      docName.innerHTML = `Documento: <strong>${pago.nombre}</strong>`;
    }

    const radios = document.querySelectorAll('input[name="cancelPregunta1"]');
    radios.forEach(r => r.checked = false);

    const motivo = document.getElementById('motivoCancelacion');
    if (motivo) motivo.value = '';

    const fecha = document.getElementById('fechaCancelacion');
    if (fecha) {
      const hoy = new Date().toISOString().split('T')[0];
      fecha.value = hoy;
    }

    const comentarios = document.getElementById('comentariosCancelacion');
    if (comentarios) comentarios.value = '';

    if (modal) modal.style.display = 'flex';
  };

  window.cerrarModalCancelarPago = function () {
    const modal = document.getElementById('modalCancelarPago');
    if (modal) modal.style.display = 'none';
    pagoCancelarId = null;
  };

  window.confirmarCancelarPago = function () {
    if (pagoCancelarId === null) {
      alert('Error: No se seleccionó un pago.');
      return;
    }

    const pregunta1 = document.querySelector('input[name="cancelPregunta1"]:checked');
    const motivo = document.getElementById('motivoCancelacion');
    const fecha = document.getElementById('fechaCancelacion');

    if (!pregunta1) {
      alert('Por favor, selecciona si se canceló el pago.');
      return;
    }

    if (!motivo || !motivo.value) {
      alert('Por favor, selecciona un motivo de cancelación.');
      return;
    }

    if (!fecha || !fecha.value) {
      alert('Por favor, selecciona la fecha de cancelación.');
      return;
    }

    const datosCancelacion = {
      id: pagoCancelarId,
      documento: PAGOS_DATA.find(p => p.id === pagoCancelarId)?.nombre || '',
      cancelado: pregunta1.value,
      motivo: motivo.value,
      fecha: fecha.value,
      comentarios: document.getElementById('comentariosCancelacion')?.value || ''
    };

    const pago = PAGOS_DATA.find(p => p.id === pagoCancelarId);
    if (pago) {
      pago.aplicacion = `Cancelado: ${datosCancelacion.motivo} - ${datosCancelacion.fecha}`;
      pago.estado = 'cancelado';
      window._actualizandoEstatus = true;
      pago.estatus = 'cancelado';
      window._actualizandoEstatus = false;
    }

    const motivosTexto = {
      'pago_duplicado': 'Pago duplicado',
      'error_monto': 'Error en el monto',
      'error_cliente': 'Error en datos del cliente',
      'cancelacion_solicitud': 'Cancelación de la solicitud',
      'rechazo_credito': 'Rechazo del crédito',
      'otros': 'Otros'
    };

    alert(`⛔ Pago cancelado exitosamente para:\n\nDocumento: ${datosCancelacion.documento}\nMotivo: ${motivosTexto[datosCancelacion.motivo] || datosCancelacion.motivo}\nFecha: ${datosCancelacion.fecha}\n${datosCancelacion.comentarios ? 'Comentarios: ' + datosCancelacion.comentarios : ''}`);

    cerrarModalCancelarPago();
    renderAplicacionPagos();
    marcarUltimaModificacion();
  };

  document.addEventListener('click', function (event) {
    const modalAplicar = document.getElementById('modalAplicarPago');
    if (modalAplicar && event.target === modalAplicar) {
      cerrarModalAplicarPago();
    }
    const modalCancelar = document.getElementById('modalCancelarPago');
    if (modalCancelar && event.target === modalCancelar) {
      cerrarModalCancelarPago();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      cerrarModalAplicarPago();
      cerrarModalCancelarPago();
    }
  });

  renderAplicacionPagos();

  // ELIMINADO: activarEtapa (función obsoleta de la segunda maqueta)

  /* ---------------------------------------------------------
     10. FUNCIÓN PARA MOSTRAR CARGA DE DOCUMENTOS
  --------------------------------------------------------- */
  window.mostrarCargaDocumentos = function () {
    actualizarBotonesSolventacion(false);

    const firmas = document.getElementById('firmas');
    const dictamen = document.getElementById('dictamen');
    const dictamenQuash = document.getElementById('dictamenQuash');
    const historial = document.getElementById('historial');
    const tipoActa = document.getElementById('tipoActa');
    const generarActa = document.getElementById('generarActa');
    const cargaDocumentos = document.getElementById('cargaDocumentos');
    const tabCarga = document.getElementById('tabCargaDocumentos');
    const aplicacionPagos = document.getElementById('aplicacionPagos');
    const tabPagos = document.getElementById('tabAplicacionPagos');
    const registroGarantia = document.getElementById('registroGarantia');
    const valuacion = document.getElementById('valuacion');
    const factura = document.getElementById('factura');
    const testimonioNotarial = document.getElementById('testimonioNotarial');
    const actaPosesion = document.getElementById('actaPosesion');
    const reciboSimple = document.getElementById('reciboSimple');
    const constanciaPosesion = document.getElementById('constanciaPosesion');

    if (dictamen) dictamen.hidden = true;
    if (dictamenQuash) dictamenQuash.hidden = true;
    if (historial) historial.hidden = true;
    if (tipoActa) tipoActa.hidden = true;
    if (generarActa) generarActa.hidden = true;
    if (firmas) firmas.hidden = true;
    if (cargaDocumentos) cargaDocumentos.hidden = false;
    if (aplicacionPagos) aplicacionPagos.hidden = true;
    if (registroGarantia) registroGarantia.hidden = true;
    if (valuacion) valuacion.hidden = true;
    if (factura) factura.hidden = true;
    if (testimonioNotarial) testimonioNotarial.hidden = true;
    if (actaPosesion) actaPosesion.hidden = true;
    if (reciboSimple) reciboSimple.hidden = true;
    if (constanciaPosesion) constanciaPosesion.hidden = true;
    if (tabCarga) tabCarga.hidden = false;
    if (tabPagos) tabPagos.hidden = true;

    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      const tabText = tab.textContent.trim();
      if (tabText === 'Dictamen' || tabText === 'Dictamen Quash' || tabText === 'Acta de Comite') {
        tab.hidden = true;
      }
    });

    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    if (tabCarga) tabCarga.classList.add('active');

    const dictamenHeader = document.querySelector('#dictamen .card-header h2');
    if (dictamenHeader) dictamenHeader.textContent = 'Resolución de Comité de Crédito';

    document.querySelectorAll('.stage-btn').forEach(b => {
      b.classList.remove('stage-active');
      if (b.textContent.trim() === 'Carga de Documentos') {
        b.classList.add('stage-active');
      }
    });
  };

  /* ---------------------------------------------------------
     11. FUNCIÓN PARA MOSTRAR APLICACIÓN DE PAGOS
  --------------------------------------------------------- */
  window.mostrarAplicacionPagos = function () {
    actualizarBotonesSolventacion(false);

    const firmas = document.getElementById('firmas');
    const dictamen = document.getElementById('dictamen');
    const dictamenQuash = document.getElementById('dictamenQuash');
    const historial = document.getElementById('historial');
    const tipoActa = document.getElementById('tipoActa');
    const generarActa = document.getElementById('generarActa');
    const cargaDocumentos = document.getElementById('cargaDocumentos');
    const tabCarga = document.getElementById('tabCargaDocumentos');
    const aplicacionPagos = document.getElementById('aplicacionPagos');
    const tabPagos = document.getElementById('tabAplicacionPagos');
    const registroGarantia = document.getElementById('registroGarantia');
    const valuacion = document.getElementById('valuacion');
    const factura = document.getElementById('factura');
    const testimonioNotarial = document.getElementById('testimonioNotarial');
    const actaPosesion = document.getElementById('actaPosesion');
    const reciboSimple = document.getElementById('reciboSimple');
    const constanciaPosesion = document.getElementById('constanciaPosesion');

    if (dictamen) dictamen.hidden = true;
    if (dictamenQuash) dictamenQuash.hidden = true;
    if (historial) historial.hidden = true;
    if (tipoActa) tipoActa.hidden = true;
    if (generarActa) generarActa.hidden = true;
    if (firmas) firmas.hidden = true;
    if (cargaDocumentos) cargaDocumentos.hidden = true;
    if (tabCarga) tabCarga.hidden = true;
    if (aplicacionPagos) aplicacionPagos.hidden = false;
    if (registroGarantia) registroGarantia.hidden = true;
    if (valuacion) valuacion.hidden = true;
    if (factura) factura.hidden = true;
    if (testimonioNotarial) testimonioNotarial.hidden = true;
    if (actaPosesion) actaPosesion.hidden = true;
    if (reciboSimple) reciboSimple.hidden = true;
    if (constanciaPosesion) constanciaPosesion.hidden = true;
    if (tabPagos) tabPagos.hidden = false;

    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      const tabText = tab.textContent.trim();
      if (tabText === 'Dictamen' || tabText === 'Dictamen Quash' || tabText === 'Acta de Comite') {
        tab.hidden = true;
      }
    });

    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    if (tabPagos) tabPagos.classList.add('active');

    const dictamenHeader = document.querySelector('#dictamen .card-header h2');
    if (dictamenHeader) dictamenHeader.textContent = 'Resolución de Comité de Crédito';

    document.querySelectorAll('.stage-btn').forEach(b => {
      b.classList.remove('stage-active');
      if (b.textContent.trim() === 'Aplicación de Pagos') {
        b.classList.add('stage-active');
      }
    });

    renderAplicacionPagos();
  };

  /* ---------------------------------------------------------
     12. FUNCIÓN PARA MOSTRAR REGISTRO DE GARANTÍA Y OTROS (NUEVA)
  --------------------------------------------------------- */
  window.mostrarRegistroGarantia = function () {
    actualizarBotonesSolventacion(false);

    // Ocultar tabs superiores
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      const tabText = tab.textContent.trim();
      if (tabText === 'Dictamen' || tabText === 'Dictamen Quash' || tabText === 'Acta de Comite') {
        tab.hidden = true;
      }
    });
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

    // Ocultar todas las secciones excepto registroGarantia
    const firmas = document.getElementById('firmas');
    const dictamen = document.getElementById('dictamen');
    const dictamenQuash = document.getElementById('dictamenQuash');
    const historial = document.getElementById('historial');
    const tipoActa = document.getElementById('tipoActa');
    const generarActa = document.getElementById('generarActa');
    const cargaDocumentos = document.getElementById('cargaDocumentos');
    const aplicacionPagos = document.getElementById('aplicacionPagos');
    const registroGarantia = document.getElementById('registroGarantia');
    const valuacion = document.getElementById('valuacion');
    const factura = document.getElementById('factura');
    const testimonioNotarial = document.getElementById('testimonioNotarial');
    const actaPosesion = document.getElementById('actaPosesion');
    const reciboSimple = document.getElementById('reciboSimple');
    const constanciaPosesion = document.getElementById('constanciaPosesion');
    const tipoDocumento = document.getElementById('tipoDocumento');

    if (firmas) firmas.hidden = true;
    if (dictamen) dictamen.hidden = true;
    if (dictamenQuash) dictamenQuash.hidden = true;
    if (historial) historial.hidden = true;
    if (tipoActa) tipoActa.hidden = true;
    if (generarActa) generarActa.hidden = true;
    if (cargaDocumentos) cargaDocumentos.hidden = true;
    if (aplicacionPagos) aplicacionPagos.hidden = true;
    if (registroGarantia) registroGarantia.hidden = false;
    if (valuacion) valuacion.hidden = false;
    if (factura && tipoDocumento) {
      factura.hidden = (tipoDocumento.value !== 'FACTURA');
    }
    if (testimonioNotarial && tipoDocumento) {
      testimonioNotarial.hidden = (tipoDocumento.value !== 'TESTIMONIO NOTARIAL');
    }
    if (actaPosesion && tipoDocumento) {
      actaPosesion.hidden = (tipoDocumento.value !== 'ACTA DE POSESIÓN');
    }
    if (reciboSimple && tipoDocumento) {
      reciboSimple.hidden = (tipoDocumento.value !== 'RECIBO SIMPLE');
    }
    if (constanciaPosesion && tipoDocumento) {
      constanciaPosesion.hidden = (tipoDocumento.value !== 'CONSTANCIA DE POSESIÓN');
    }

    // Asegurar que el botón del sidebar esté activo
    document.querySelectorAll('.stage-btn').forEach(b => {
      b.classList.remove('stage-active');
      if (b.textContent.trim() === 'Registro de Garantía y Otros') {
        b.classList.add('stage-active');
      }
    });
  };

  /* ---------------------------------------------------------
     13. LÓGICA PARA REGISTRO DE GARANTÍA Y OTROS
  --------------------------------------------------------- */
  // Catálogos de clasificación según tipo de garantía
  const CLASIFICACIONES = {
    MOBILIARIA: [
      'MAQUINARIA Y EQUIPO',
      'VEHÍCULOS TERRESTRES DE MOTOR',
      'PRODUCTOS MANUFACTURADOS DISTINTOS A MAQUINARIA',
      'TITULOS DE DEUDA EMITIDOS POR EL GOBIERNO FEDERAL',
      'TITULOS DE DEUDA EMITIDOS POR ENTIDADES DISTINTAS AL GF',
      'ACCIONES REPRESENTATIVAS DE CAPITAL',
      'DERECHOS, INCLUYENDO DERECHOS DE COBRO',
      'BIENES DE CONSUMO',
      'FIDEICOMISO',
      'OTROS'
    ],
    INMOBILIARIA: [
      'CASA HABITACION UNIFAMILIAR',
      'CONDOMINIO MULTIFAMILIAR',
      'UNIDAD INDUSTRIAL',
      'TERRENO EN ZONA RURAL',
      'TERRENO EN ZONA URBANA'
    ],
    GUBERNAMENTAL: [
      'GARANTIA FEGA',
      'GARANTIA FONAGA'
    ]
  };

  function inicializarRegistroGarantia() {
    const tipoGarantia = document.getElementById('tipoGarantia');
    const clasificacionGarantia = document.getElementById('clasificacionGarantia');
    const tipoDocumento = document.getElementById('tipoDocumento');
    const facturaCard = document.getElementById('factura');
    const testimonioNotarialCard = document.getElementById('testimonioNotarial');
    const actaPosesionCard = document.getElementById('actaPosesion');
    const reciboSimpleCard = document.getElementById('reciboSimple');
    const constanciaPosesionCard = document.getElementById('constanciaPosesion');

    if (!tipoGarantia || !clasificacionGarantia || !tipoDocumento) return;
    if (tipoGarantia.dataset.initialized === 'true') return;
    tipoGarantia.dataset.initialized = 'true';

    // 1. Actualizar Clasificación Garantía según Tipo Garantía
    function actualizarClasificacion() {
      const tipo = tipoGarantia.value;
      clasificacionGarantia.innerHTML = '';
      clasificacionGarantia.disabled = true;

      if (tipo && CLASIFICACIONES[tipo]) {
        const opciones = CLASIFICACIONES[tipo];
        const optDefault = document.createElement('option');
        optDefault.value = '';
        optDefault.textContent = 'SELECCIONAR';
        clasificacionGarantia.appendChild(optDefault);

        opciones.forEach(item => {
          const opt = document.createElement('option');
          opt.value = item;
          opt.textContent = item;
          clasificacionGarantia.appendChild(opt);
        });
        clasificacionGarantia.disabled = false;
      } else {
        const optDefault = document.createElement('option');
        optDefault.value = '';
        optDefault.textContent = 'SELECCIONAR';
        clasificacionGarantia.appendChild(optDefault);
        clasificacionGarantia.disabled = true;
      }
    }

    tipoGarantia.addEventListener('change', actualizarClasificacion);
    // Inicializar
    actualizarClasificacion();

    function mostrarDescripciones() {
      const descripcionFactura = document.getElementById('descripcionFactura');
      const descripcionTestimonio = document.getElementById('descripcionTestimonio');
      const descripcionActa = document.getElementById('descripcionActaPosesion');
      const descripcionRecibo = document.getElementById('descripcionReciboSimple');
      const descripcionConstancia = document.getElementById('descripcionConstanciaPosesion');

      if (tipoDocumento.value === 'FACTURA') {
        descripcionFactura.hidden = false;
        descripcionTestimonio.hidden = true;
        descripcionActa.hidden = true;
        descripcionRecibo.hidden = true;
        descripcionConstancia.hidden = true;
      } else if (tipoDocumento.value === 'TESTIMONIO NOTARIAL') {
        descripcionFactura.hidden = true;
        descripcionTestimonio.hidden = false;
        descripcionActa.hidden = true;
        descripcionRecibo.hidden = true;
        descripcionConstancia.hidden = true;
      } else if (tipoDocumento.value === 'ACTA DE POSESIÓN') {
        descripcionFactura.hidden = true;
        descripcionTestimonio.hidden = true;
        descripcionActa.hidden = false;
        descripcionRecibo.hidden = true;
        descripcionConstancia.hidden = true;
      } else if (tipoDocumento.value === 'RECIBO SIMPLE') {
        descripcionFactura.hidden = true;
        descripcionTestimonio.hidden = true;
        descripcionActa.hidden = true;
        descripcionRecibo.hidden = false;
        descripcionConstancia.hidden = true;
      } else if (tipoDocumento.value === 'CONSTANCIA DE POSESIÓN') {
        descripcionFactura.hidden = true;
        descripcionTestimonio.hidden = true;
        descripcionActa.hidden = true;
        descripcionRecibo.hidden = true;
        descripcionConstancia.hidden = false;
      }
    }

    tipoDocumento.addEventListener('change', mostrarDescripciones);
    mostrarDescripciones();

    function toggleGarantiaAsegurada() {
      const selectGarantia = document.getElementById('garantiaAsegurada');
      const divSI = document.getElementById('divGarantiaAseguradaSI');
      if (!selectGarantia || !divSI) return;

      if (selectGarantia.value === 'SI') {
        divSI.hidden = false;
      } else {
        divSI.hidden = true;
      }
    }

    const garantiaAseguradaSelect = document.getElementById('garantiaAsegurada');
    if (garantiaAseguradaSelect) {
      garantiaAseguradaSelect.addEventListener('change', toggleGarantiaAsegurada);
      toggleGarantiaAsegurada();
    }

    function toggleGarantiaAseguradaActaPosesion() {
      const selectGarantia = document.getElementById('actaGarantiaAseguradaActaPosesion');
      const divSI = document.getElementById('divGarantiaAseguradaSIActaPosesion');
      if (!selectGarantia || !divSI) return;

      if (selectGarantia.value === 'SI') {
        divSI.hidden = false;
      } else {
        divSI.hidden = true;
      }
    }

    const garantiaAseguradaActaPosesionSelect = document.getElementById('actaGarantiaAseguradaActaPosesion');
    if (garantiaAseguradaActaPosesionSelect) {
      garantiaAseguradaActaPosesionSelect.addEventListener('change', toggleGarantiaAseguradaActaPosesion);
      toggleGarantiaAseguradaActaPosesion();
    }

    function toggleGarantiaAseguradaConstanciaPosesion() {
      const selectGarantia = document.getElementById('constanciaGarantiaAseguradaConstanciaPosesion');
      const divSI = document.getElementById('divGarantiaAseguradaSIConstanciaPosesion');
      if (!selectGarantia || !divSI) return;

      if (selectGarantia.value === 'SI') {
        divSI.hidden = false;
      } else {
        divSI.hidden = true;
      }
    }

    const garantiaAseguradaConstanciaPosesionSelect = document.getElementById('constanciaGarantiaAseguradaConstanciaPosesion');
    if (garantiaAseguradaConstanciaPosesionSelect) {
      garantiaAseguradaConstanciaPosesionSelect.addEventListener('change', toggleGarantiaAseguradaConstanciaPosesion);
      toggleGarantiaAseguradaConstanciaPosesion();
    }

    // 2. Mostrar/ocultar tarjeta Factura y Testimonio Notarial según Tipo de Documento
    function actualizarSeccionDocumento() {
      const tipo = tipoDocumento.value;
      if (facturaCard) {
        facturaCard.hidden = (tipo !== 'FACTURA');
      }
      if (testimonioNotarialCard) {
        testimonioNotarialCard.hidden = (tipo !== 'TESTIMONIO NOTARIAL');
      }
      if (actaPosesionCard) {
        actaPosesionCard.hidden = (tipo !== 'ACTA DE POSESIÓN');
      }
      if (reciboSimpleCard) {
        reciboSimpleCard.hidden = (tipo !== 'RECIBO SIMPLE');
      }
      if (constanciaPosesionCard) {
        constanciaPosesionCard.hidden = (tipo !== 'CONSTANCIA DE POSESIÓN');
      }
    }

    tipoDocumento.addEventListener('change', actualizarSeccionDocumento);
    // Inicializar
    actualizarSeccionDocumento();
  }

  // Inicializar al cargar la página
  inicializarRegistroGarantia();

  /* ---------------------------------------------------------
     14. Event listeners para los tabs superiores
  --------------------------------------------------------- */
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function (e) {
      const tabText = this.textContent.trim();

      if (tabText === 'Dictamen') {
        window.mostrarDictamen();
      } else if (tabText === 'Dictamen Quash') {
        window.mostrarDictamenQuash();
      } else if (tabText === 'Acta de Comite') {
        window.menuActaComite();
      } else if (tabText === 'Carga de Documentos') {
        window.mostrarCargaDocumentos();
      } else if (tabText === 'Aplicación de Pagos') {
        window.mostrarAplicacionPagos();
      }
    });
  });

  // ... (Código anterior de la sección 14) ...
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function (e) {
      // ...
    });
  });

  /* =========================================================================
       15. AUTO-COMPLETADO DE OBSERVACIONES EN TIEMPO REAL (SIN SALTOS DE LÍNEA)
    ========================================================================= */
  const observacionesFacturaTextArea = document.getElementById("observacionesFactura");
  const observacionesActaPosesionTextArea = document.getElementById("actaObservaciones");
  const observacionesConstanciaPosesionTextArea = document.getElementById("constanciaObservaciones");
  const observacionesTestimonioNotarialTextArea = document.getElementById("testimonioObservaciones");
  const observacionesReciboSimpleTextArea = document.getElementById("reciboObservaciones");

  const camposFacturaObservacionesIds = [
    "descripcionbien",
    "marca",
    "modelo",
    "color",
    "Nserie",
    "Nmotor",
    "folio",
    "nombrede",
    "expedidopor"
  ];

  const camposActaPosesionObservacionesIds = [
    "tipoDocumento",
    "actaEntidadFederativa",
    "actaNombreEntidadFederativa",
    "actaMunicipioClave",
    "actaMunicipioNombre",
    "actaColonia",
    "actaCalle",
    "actaCodigoPostal",
    "actaNumExterior",
    "actaNumInterior",
    "actaLote",
    "actaManzana",
    "actaM2Construccion",
    "actaM2Terreno",
    "actaAutoridad",
    "actaCargoAutoridad",
    "actaGarantiaAseguradaActaPosesion",
    "aseguradorPolizaActaPosesion",
    "numeroPolizaActaPosesion",
    "fechaVencimientoPolizaActaPosesion",
    "actafolioRegistro",
    "actafechaRegistro"
  ];

  const camposConstanciaPosesionObservacionesIds = [
    "tipoDocumento",
    "constanciaEstado",
    "constanciaEstadoNombre",
    "constanciaMunicipioClave",
    "constanciaMunicipioNombre",
    "constanciaCalle",
    "constanciaNumExterior",
    "constanciaNumInterior",
    "constanciaColonia",
    "constanciaLote",
    "constanciaManzana",
    "constanciaCodigoPostal",
    "constanciaM2Construccion",
    "constanciaM2Terreno",
    "constanciaAutoridad",
    "constanciaCargoAutoridad",
    "constanciaGarantiaAseguradaConstanciaPosesion",
    "aseguradorPolizaConstanciaPosesion",
    "numeroPolizaConstanciaPosesion",
    "fechaVencimientoPolizaConstanciaPosesion",
    "constanciafolioRegistro",
    "constanciafechaRegistro"
  ];

  const camposTestimonioNotarialObservacionesIds = [
    "tipoDocumento",
    "entidadfederativa",
    "nombreEntidadFederativa",
    "claveMunicipio",
    "nombreMunicipio",
    "calle",
    "numeroExterior",
    "numeroInterior",
    "colonia",
    "lote",
    "manzana",
    "manzana",
    "codigoPostal",
    "mcConstruccion",
    "mcTerreno",
    "garantiaAsegurada",
    "aseguradorPoliza",
    "numeroPoliza",
    "fechaVencimientoPoliza",
    "folioRegistro",
    "numeroNotario",
    "fechaRegistro"
  ];

  const camposReciboSimpleObservacionesIds = [
    "tipoDocumento",
    "reciboFechaCompra",
    "reciboReferencia",
    "valorRecibo",
    "serieReciboSimple"
  ];

  function setupObservaciones(camposIds, textArea) {
    if (!textArea) return;

    function actualizar() {
      let partes = [];
      camposIds.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
          let valor = elemento.value.trim();

          if (id === "tipoDocumento" && elemento.selectedIndex > 0) {
            valor = elemento.options[elemento.selectedIndex].text;
          }

          if (valor !== "") {
            const label = elemento.closest('.field')?.querySelector('label')?.textContent || id;
            const texto = id === "descripcionbien" ? `${valor}` : id === "actaNombreEntidadFederativa" ? `${valor}` : id === "constanciaEstadoNombre" ? `${valor}` : id === "nombreEntidadFederativa" ? `${valor}` : id === "actaMunicipioNombre" ? `${valor}` : id === "constanciaMunicipioNombre" ? `${valor}` : id === "nombreMunicipio" ? `${valor}` : `${label} ${valor}`;
            partes.push(texto);
          }
        }
      });
      const texto = partes.join(", ");
      textArea.value = texto ? `${texto}.` : "";
    }

    camposIds.forEach(id => {
      const elemento = document.getElementById(id);
      if (elemento) {
        elemento.addEventListener("input", actualizar);
        if (elemento.tagName === "SELECT") {
          elemento.addEventListener("change", actualizar);
        }
      }
    });
  }

  setupObservaciones(camposFacturaObservacionesIds, observacionesFacturaTextArea);
  setupObservaciones(camposActaPosesionObservacionesIds, observacionesActaPosesionTextArea);
  setupObservaciones(camposConstanciaPosesionObservacionesIds, observacionesConstanciaPosesionTextArea);
  setupObservaciones(camposTestimonioNotarialObservacionesIds, observacionesTestimonioNotarialTextArea);
  setupObservaciones(camposReciboSimpleObservacionesIds, observacionesReciboSimpleTextArea);
  /* ========================================================================= */

  window.activarEtapa('MESA DE CONTROL');

});

// --- From MESA --- //
// ============================================================
// C-MOVIL · Módulo Mesa de Control
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     0. DATOS DE PROSPECTOS (Vista General)
  --------------------------------------------------------- */
  window.PROSPECTOS_DATA = [
    { folio: '10177', nombre: 'ANA GLORIA PIÑA AGUILAR', producto: 'C-MOVIL', director: 'JUAN PEREZ', sucursal: 'OAXACA', ejecutivo: 'MARIA LOPEZ', modalidad: 'SUCURSAL', analista: 'PEDRO GOMEZ' },
    { folio: '10178', nombre: 'CARLOS RUIZ MARTINEZ', producto: 'C-AUTO', director: 'JUAN PEREZ', sucursal: 'OAXACA', ejecutivo: 'MARIA LOPEZ', modalidad: 'SUCURSAL', analista: 'PEDRO GOMEZ' },
    { folio: '10179', nombre: 'LAURA SANCHEZ VILLA', producto: 'C-MOVIL', director: 'JUAN PEREZ', sucursal: 'PUEBLA', ejecutivo: 'LUIS FERNANDEZ', modalidad: 'SUCURSAL', analista: 'PEDRO GOMEZ' },
    { folio: '10180', nombre: 'MIGUEL ANGEL FLORES', producto: 'C-MOVIL', director: 'JUAN PEREZ', sucursal: 'PUEBLA', ejecutivo: 'LUIS FERNANDEZ', modalidad: 'SUCURSAL', analista: 'ANA HERNANDEZ' },
    { folio: '10181', nombre: 'SOFIA RAMIREZ CRUZ', producto: 'C-MOVIL', director: 'JUAN PEREZ', sucursal: 'VERACRUZ', ejecutivo: 'JOSE DIAZ', modalidad: 'SUCURSAL', analista: 'ANA HERNANDEZ' },
    { folio: '10182', nombre: 'ROBERTO HERRERA LARA', producto: 'C-AUTO', director: 'ALBERTO GOMEZ', sucursal: 'CDMX SUR', ejecutivo: 'DISTRIBUIDOR 1', modalidad: 'DISTRIBUIDOR', analista: 'ANA HERNANDEZ' },
    { folio: '10183', nombre: 'CARMEN LUNA PEREZ', producto: 'C-MOVIL', director: 'ALBERTO GOMEZ', sucursal: 'CDMX SUR', ejecutivo: 'DISTRIBUIDOR 1', modalidad: 'DISTRIBUIDOR', analista: 'CARLOS SLIM' },
    { folio: '10184', nombre: 'JORGE ORTEGA SALINAS', producto: 'C-MOVIL', director: 'ALBERTO GOMEZ', sucursal: 'CDMX NORTE', ejecutivo: 'DISTRIBUIDOR 2', modalidad: 'DISTRIBUIDOR', analista: 'CARLOS SLIM' },
    { folio: '10185', nombre: 'PATRICIA REYES VACA', producto: 'C-MOVIL', director: 'ALBERTO GOMEZ', sucursal: 'CDMX NORTE', ejecutivo: 'DISTRIBUIDOR 2', modalidad: 'DISTRIBUIDOR', analista: 'CARLOS SLIM' },
    { folio: '10186', nombre: 'EDUARDO VARGAS PINO', producto: 'C-MOVIL', director: 'ALBERTO GOMEZ', sucursal: 'TOLUCA', ejecutivo: 'DISTRIBUIDOR 3', modalidad: 'DISTRIBUIDOR', analista: 'CARLOS SLIM' }
  ];

  window.renderVistaGeneral = function () {
    const tbody = document.getElementById('vistaGeneralTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    PROSPECTOS_DATA.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${p.folio}</strong></td>
        <td>${p.nombre}</td>
        <td>${p.producto}</td>
        <td>${p.director}</td>
        <td>${p.sucursal}</td>
        <td>${p.ejecutivo}</td>
        <td>${p.modalidad}</td>
        <td>${p.analista}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.renderVistaGeneral();

  /* ---------------------------------------------------------
     1. DATOS DE PAGOS (para vista parcial en Registro de Clientes)
  --------------------------------------------------------- */
  const PAGOS_DATA = [
    { id: 1, nombre: 'Enganche', archivo: './ENGANCHE_ANA_GLORIA.pdf', estatus: 'aplicado' },
    { id: 2, nombre: 'Garantía Líquida', archivo: '', estatus: 'pendiente' },
    { id: 3, nombre: 'Comisión por Apertura', archivo: './COMISION_ANA_GLORIA.pdf', estatus: 'aplicado' },
    { id: 4, nombre: 'Co Financiamiento', archivo: '', estatus: 'pendiente' },
    { id: 5, nombre: 'Complemento de Enganche', archivo: '', estatus: 'pendiente' },
    { id: 6, nombre: 'Enganche GPS', archivo: '', estatus: 'pendiente' },
    { id: 7, nombre: 'Garantía Líquida Enganche Diferido', archivo: '', estatus: 'pendiente' }
  ];

  /* ---------------------------------------------------------
     2. RENDER: Aplicación de Pagos (Vista Parcial — solo 4 columnas)
  --------------------------------------------------------- */
  function renderPagosParcial() {
    const tbody = document.getElementById('pagosParcialTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    PAGOS_DATA.forEach(pago => {
      const tr = document.createElement('tr');

      const estatusMap = {
        pendiente: { label: 'Pendiente', cls: 'estatus-pill estatus-pendiente' },
        aplicado: { label: 'Aplicado', cls: 'estatus-pill estatus-aplicado' },
        cancelado: { label: 'Cancelado', cls: 'estatus-pill estatus-cancelado' },
        revision: { label: 'En Revisión', cls: 'estatus-pill estatus-revision' }
      };
      const est = estatusMap[pago.estatus] || { label: pago.estatus, cls: 'estatus-pill' };

      tr.innerHTML = `
        <td style="text-align:left;"><strong>${pago.nombre}</strong></td>
        <td style="text-align:left; color: var(--text-dim); font-size:12.5px;">
          ${pago.archivo ? pago.archivo : '<em>Sin archivo</em>'}
        </td>
        <td style="text-align:center;">
          <button class="btn-icon" title="Ver documento" onclick="alert('Ver: ${pago.nombre}')">👁️</button>
        </td>
        <td style="text-align:center;">
          <span class="${est.cls}">${est.label}</span>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  renderPagosParcial();

  /* ---------------------------------------------------------
     3. DATOS DE DOCUMENTOS — Mesa de Control
  --------------------------------------------------------- */

  // Documentos Cliente y Aval(es) — en el orden requerido
  const MC_DOCS_CLIENTE = [
    { id: 'c01', nombre: 'Identificacion Oficial', archivo: './INES_ANA_GLORIA.pdf', verificado: false, comentario: '', opcional: false },
    { id: 'c02', nombre: 'CURP', archivo: './CURP_PIAA770429MMSXGN05.pdf', verificado: false, comentario: '', opcional: false },
    { id: 'c03', nombre: 'RFC', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'c04', nombre: 'Acta de Nacimiento', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'c05', nombre: 'Comprobante de Domicilio', archivo: './COMP DE DOM CTA.pdf', verificado: false, comentario: '', opcional: false },
    { id: 'c06', nombre: 'Comprobante de Domicilio Alterno', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'c07', nombre: 'Permiso', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'c08', nombre: 'Arraigo', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'c09', nombre: 'Fotos del Domicilio', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'c10', nombre: 'Fotos de la Actividad', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'c11', nombre: 'Comprobante de Ingresos', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'c12', nombre: 'Autorización de Consulta de Buró', archivo: './AUTH_BURO_ANA_GLORIA.pdf', verificado: false, comentario: '', opcional: false },
    { id: 'c13', nombre: 'Carta de Excepción a la Norma', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'c14', nombre: 'Enganche', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'c15', nombre: 'Garantia Liquida', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'c16', nombre: 'Comisión por Apertura', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'c17', nombre: 'Co Financiamiento', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'c18', nombre: 'Complemento de Enganche', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'c19', nombre: 'Garantia Liquida Enganche Diferido', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'c20', nombre: 'Factura', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'c21', nombre: 'Carta Factura', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'c22', nombre: 'Permiso', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'c23', nombre: 'Enganche GPS', archivo: '', verificado: false, comentario: '', opcional: false }
  ];

  const MC_DOCS_SOLIDARIO = [
    { id: 's01', nombre: 'Identificacion Oficial Aval', archivo: './INES_ANA_GLORIA.pdf', verificado: false, comentario: '', opcional: false },
    { id: 's02', nombre: 'CURP Aval', archivo: './CURP_PIAA770429MMSXGN05.pdf', verificado: false, comentario: '', opcional: false },
    { id: 's03', nombre: 'RFC Aval', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 's04', nombre: 'Acta nacimiento aval', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 's05', nombre: 'Comprobante domicilio aval', archivo: './COMP DE DOM CTA.pdf', verificado: false, comentario: '', opcional: false },
    { id: 's06', nombre: 'Comprobante de Ingresos Aval', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 's07', nombre: 'Garantia Liquida Enganche Diferido', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 's08', nombre: 'Factura Aval', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 's09', nombre: 'Carta Factura Aval', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 's10', nombre: 'Permiso Aval', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 's11', nombre: 'Enganche GPS Aval', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 's12', nombre: 'Comprobante Domicilio Alterno Aval Solidario', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 's13', nombre: 'Arraigo Domiciliar Aval Solidario', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 's14', nombre: 'Fotos del Domicilio Aval Solidario', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 's15', nombre: 'Fotos de la Actividad Aval Solidario', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 's16', nombre: 'Comprobante de Ingresos Aval Solidario', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 's17', nombre: 'Otros Aval Solidario', archivo: '', verificado: false, comentario: '', opcional: false }
  ];

  const MC_DOCS_GARANTE = [
    { id: 'a01', nombre: 'Identificacion oficial garante', archivo: './INES_ANA_GLORIA.pdf', verificado: false, comentario: '', opcional: false },
    { id: 'a02', nombre: 'CURP garante', archivo: './CURP_PIAA770429MMSXGN05.pdf', verificado: false, comentario: '', opcional: false },
    { id: 'a03', nombre: 'RFC garante', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'a04', nombre: 'Acta nacimiento garante', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'a05', nombre: 'Enganche Garante', archivo: './COMP DE DOM CTA.pdf', verificado: false, comentario: '', opcional: false },
    { id: 'a06', nombre: 'Garantia Liquida Garante', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'a07', nombre: 'Comisión por Apertura Garante', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'a08', nombre: 'Co Financiamiento Garante', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'a09', nombre: 'Complemento de Enganche Garante', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'a10', nombre: 'Garantia Liquida Enganche Diferido Garante', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'a11', nombre: 'Factura Garante', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'a12', nombre: 'Carta Factura Garante', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'a13', nombre: 'Permiso Garante', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'a14', nombre: 'Enganche GPS Garante', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'a15', nombre: 'Comprobante Domicilio Alterno Garante', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'a16', nombre: 'Arraigo Domiciliar Garante', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'a17', nombre: 'Fotos del Domicilio Garante', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'a18', nombre: 'Fotos de la Actividad Garante', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'a19', nombre: 'Comprobante de Ingresos Garante', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'a20', nombre: 'Otros Garante', archivo: '', verificado: false, comentario: '', opcional: false }
  ];

  // Documentos de Garantías — en el orden requerido
  // (Este array lo mantuve sin modificaciones porque sus atributos base difieren
  // de DOCUMENTOS_ADICIONALES, que contiene 36 elementos de tipo distinto).
  const MC_DOCS_GARANTIAS = [
    { id: 'g01', nombre: 'Factura', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'g02', nombre: 'Carta Factura', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'g03', nombre: 'Carta de Aceptación de Endoso', archivo: '', verificado: false, comentario: '', opcional: false },
    { id: 'g04', nombre: 'Garantía Adicional 1', archivo: '', verificado: false, comentario: '', opcional: true },
    { id: 'g05', nombre: 'Garantía Adicional 2', archivo: '', verificado: false, comentario: '', opcional: true },
    { id: 'g06', nombre: 'Pagaré de Distribuidor', archivo: '', verificado: false, comentario: '', opcional: true },
    { id: 'g07', nombre: 'Cotización del Seguro', archivo: '', verificado: false, comentario: '', opcional: true },
    { id: 'g08', nombre: 'Póliza del Seguro', archivo: '', verificado: false, comentario: '', opcional: true },
    { id: 'g09', nombre: 'Comprobante de Pago del Seguro', archivo: '', verificado: false, comentario: '', opcional: true },
    { id: 'g10', nombre: 'Solicitud de Instalación del GPS', archivo: '', verificado: false, comentario: '', opcional: true },
    { id: 'g11', nombre: 'Validación de Factura SAT', archivo: '', verificado: false, comentario: '', opcional: true },
    { id: 'g12', nombre: 'Estado de Cuenta', archivo: '', verificado: false, comentario: '', opcional: true },
    { id: 'g13', nombre: 'Otros', archivo: '', verificado: false, comentario: '', opcional: true }
  ];

  /* ---------------------------------------------------------
     4. RENDER: Tabla de documentos Mesa de Control
  --------------------------------------------------------- */
  function renderMCDocumentos(datos, tbodyId) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    tbody.innerHTML = '';

    datos.forEach(doc => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="text-align:left;">
          <strong>${doc.nombre}</strong>
          ${doc.opcional ? '<span class="opcional-badge">Opcional</span>' : ''}
        </td>
        <td style="text-align:left; color: var(--text-dim); font-size: 12.5px;">
          ${doc.archivo ? doc.archivo : '<em style="color:var(--text-faint)">—</em>'}
        </td>
        <td style="text-align:center;">
          <button class="btn-icon" title="Ver documento"
            onclick="alert('Ver: ${doc.nombre}')">👁️</button>
        </td>
        <td style="text-align:center;">
          <label class="mc-verificar-wrap" title="Verificar">
            <input type="checkbox" class="mc-verificar-check" ${doc.verificado ? 'checked' : ''}
              onchange="toggleVerificado('${doc.id}', this.checked)">
            <span class="mc-verificar-dot ${doc.verificado ? 'mc-verificar-ok' : ''}"></span>
          </label>
        </td>
        <td style="text-align:left;">
          <input type="text" class="doc-comment" placeholder="Comentario..."
            value="${doc.comentario}"
            onchange="guardarComentarioMC('${doc.id}', this.value)">
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderTodosDocumentosMC() {
    renderMCDocumentos(MC_DOCS_CLIENTE, 'mcDocClienteBody');
    renderMCDocumentos(MC_DOCS_SOLIDARIO, 'mcDocSolidarioBody');
    renderMCDocumentos(MC_DOCS_GARANTE, 'mcDocGaranteBody');
    renderMCDocumentos(MC_DOCS_GARANTIAS, 'mcDocGarantiasBody');
  }

  /* ---------------------------------------------------------
     5. TOGGLE Verificado
  --------------------------------------------------------- */
  window.toggleVerificado = function (id, checked) {
    const todos = [...MC_DOCS_CLIENTE, ...MC_DOCS_SOLIDARIO, ...MC_DOCS_GARANTE, ...MC_DOCS_GARANTIAS];
    const doc = todos.find(d => d.id === id);
    if (doc) doc.verificado = checked;
  };

  /* ---------------------------------------------------------
     6. Guardar comentario MC
  --------------------------------------------------------- */
  window.guardarComentarioMC = function (id, valor) {
    const todos = [...MC_DOCS_CLIENTE, ...MC_DOCS_SOLIDARIO, ...MC_DOCS_GARANTE, ...MC_DOCS_GARANTIAS];
    const doc = todos.find(d => d.id === id);
    if (doc) doc.comentario = valor;
  };

  /* ---------------------------------------------------------
     7. Mostrar/ocultar grupos de documentos
  --------------------------------------------------------- */
  window.mostrarGrupoDocumentos = function (grupo) {
    const grupoCliente = document.getElementById('grupoDocCliente');
    const grupoGarantias = document.getElementById('grupoDocGarantias');
    const btnCliente = document.getElementById('btnGrupoCliente');
    const btnGarantias = document.getElementById('btnGrupoGarantias');

    if (grupo === 'cliente') {
      if (grupoCliente) grupoCliente.style.display = 'block';
      if (grupoGarantias) grupoGarantias.style.display = 'none';
      if (btnCliente) btnCliente.classList.add('mc-grupo-active');
      if (btnGarantias) btnGarantias.classList.remove('mc-grupo-active');
    } else {
      if (grupoCliente) grupoCliente.style.display = 'none';
      if (grupoGarantias) grupoGarantias.style.display = 'block';
      if (btnGarantias) btnGarantias.classList.add('mc-grupo-active');
      if (btnCliente) btnCliente.classList.remove('mc-grupo-active');
    }
  };

  /* ---------------------------------------------------------
     8. TABS PRINCIPALES — Registro de Clientes / Mesa de Control
  --------------------------------------------------------- */
  window.mostrarVistaGeneral = function () {
    const vistaVG = document.getElementById('vistaGeneral');
    const vistaRC = document.getElementById('vistaRegistroClientes');
    const vistaMC = document.getElementById('vistaMesaControl');

    const tabVG = document.getElementById('tabInformacionGeneral');
    const tabRC = document.getElementById('tabRegistroClientes');
    const tabMC = document.getElementById('tabMesaControl');

    if (vistaVG) vistaVG.style.display = 'flex';
    if (vistaRC) vistaRC.style.display = 'none';
    if (vistaMC) vistaMC.style.display = 'none';

    if (tabVG) tabVG.classList.add('active');
    if (tabRC) tabRC.classList.remove('active');
    if (tabMC) tabMC.classList.remove('active');
  };

  window.mostrarRegistroClientes = function () {
    const vistaVG = document.getElementById('vistaGeneral');
    const vistaRC = document.getElementById('vistaRegistroClientes');
    const vistaMC = document.getElementById('vistaMesaControl');

    const tabVG = document.getElementById('tabInformacionGeneral');
    const tabRC = document.getElementById('tabRegistroClientes');
    const tabMC = document.getElementById('tabMesaControl');

    if (vistaVG) vistaVG.style.display = 'none';
    if (vistaRC) vistaRC.style.display = 'block';
    if (vistaMC) vistaMC.style.display = 'none';

    if (tabVG) tabVG.classList.remove('active');
    if (tabRC) tabRC.classList.add('active');
    if (tabMC) tabMC.classList.remove('active');
  };

  window.mostrarMesaControlTab = function () {
    const vistaVG = document.getElementById('vistaGeneral');
    const vistaRC = document.getElementById('vistaRegistroClientes');
    const vistaMC = document.getElementById('vistaMesaControl');

    const tabVG = document.getElementById('tabInformacionGeneral');
    const tabRC = document.getElementById('tabRegistroClientes');
    const tabMC = document.getElementById('tabMesaControl');

    if (vistaVG) vistaVG.style.display = 'none';
    if (vistaRC) vistaRC.style.display = 'none';
    if (vistaMC) vistaMC.style.display = 'block';

    if (tabVG) tabVG.classList.remove('active');
    if (tabRC) tabRC.classList.remove('active');
    if (tabMC) tabMC.classList.add('active');

    renderTodosDocumentosMC();
  };

  /* ---------------------------------------------------------
     9. SEGUNDO AVAL — toggle mostrar/ocultar
  --------------------------------------------------------- */
  window.toggleAval2 = function () {
    const wrapper = document.getElementById('aval2Wrapper');
    if (!wrapper) return;
    const isHidden = wrapper.style.display === 'none' || wrapper.style.display === '';
    wrapper.style.display = isHidden ? 'block' : 'none';

    const btnAgregar = document.getElementById('wrapperAgregarAval2');
    if (btnAgregar) {
      btnAgregar.style.display = isHidden ? 'none' : 'block';
    }
  };

  /* ---------------------------------------------------------
     10. HISTORIAL BURÓ — toggle mostrar/ocultar
  --------------------------------------------------------- */
  window.toggleHistorialBuro = function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    const isHidden = el.style.display === 'none' || el.style.display === '';
    el.style.display = isHidden ? 'block' : 'none';

    // Cambiar texto del botón
    const buroPanel = el.closest('.buro-panel');
    if (buroPanel) {
      const btn = buroPanel.querySelector('.btn-historial');
      if (btn) btn.textContent = isHidden ? '📋 Ocultar Historial' : '📋 Ver Historial';
    }
  };

  /* ---------------------------------------------------------
     11. AUTORIZAR CRÉDITO
  --------------------------------------------------------- */
  window.autorizarCredito = function () {
    const comentarios = document.getElementById('comentariosAutorizacion');
    const btn = document.getElementById('btnAutorizarCredito');
    const registro = document.getElementById('registroAutorizacion');
    const textoUsuario = document.getElementById('textoUsuarioAutorizo');
    const textoFecha = document.getElementById('textoFechaAutorizo');

    const comentarioValor = comentarios ? comentarios.value.trim() : '';

    if (!comentarioValor) {
      alert('Por favor ingrese comentarios de autorización antes de autorizar.');
      return;
    }

    const ahora = new Date();
    const fechaStr = ahora.toLocaleString('es-MX', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    const USUARIO_ACTUAL = 'JOSE LUIS SOLORZANO GUTIERREZ';

    if (textoUsuario) textoUsuario.textContent = `Autorizado por: ${USUARIO_ACTUAL}`;
    if (textoFecha) textoFecha.textContent = `Fecha y hora: ${fechaStr}`;
    if (registro) registro.style.display = 'flex';

    if (btn) {
      btn.textContent = '✅ Crédito Autorizado';
      btn.classList.add('btn-autorizar-done');
      btn.disabled = true;
    }
    if (comentarios) comentarios.readOnly = true;
  };

  window.consultarListasNegras = async function () {
    const statusListasNegras = document.getElementById('statusListasNegras');
    const statusOFAC = document.getElementById('statusOFAC');
    const statusPersonasBloqueadas = document.getElementById('statusPersonasBloqueadas');
    const statusDrem = document.getElementById('statusDrem');

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    statusListasNegras.innerHTML = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Consultando...';
    statusOFAC.innerHTML = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Consultando...';
    statusPersonasBloqueadas.innerHTML = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Consultando...';
    statusDrem.innerHTML = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Consultando...';

    await sleep(2000);
    statusListasNegras.textContent = '✔️ Sin coincidencia';

    await sleep(2000);
    statusOFAC.textContent = '✔️ Sin coincidencia';

    await sleep(2000);
    statusPersonasBloqueadas.textContent = '❌ Con coincidencia';

    await sleep(2000);
    statusDrem.textContent = '✔️ Sin coincidencia';

    document.getElementById('botonVerConsultaPLD').disabled = false;
  };

  window.consultarListasNegrasAval1 = async function () {
    const statusListasNegras = document.getElementById('statusListasNegrasAval1');
    const statusOFAC = document.getElementById('statusOFACAval1');
    const statusPersonasBloqueadas = document.getElementById('statusPersonasBloqueadasAval1');
    const statusDrem = document.getElementById('statusDremAval1');

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    statusListasNegras.innerHTML = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Consultando...';
    statusOFAC.innerHTML = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Consultando...';
    statusPersonasBloqueadas.innerHTML = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Consultando...';
    statusDrem.innerHTML = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Consultando...';

    await sleep(2000);
    statusListasNegras.textContent = '✔️ Sin coincidencia';

    await sleep(2000);
    statusOFAC.textContent = '✔️ Sin coincidencia';

    await sleep(2000);
    statusPersonasBloqueadas.textContent = '❌ Con coincidencia';

    await sleep(2000);
    statusDrem.textContent = '✔️ Sin coincidencia';

    document.getElementById('botonVerConsultaPLDAval1').disabled = false;
  };

  window.consultarListasNegrasAval2 = async function () {
    const statusListasNegras = document.getElementById('statusListasNegrasAval2');
    const statusOFAC = document.getElementById('statusOFACAval2');
    const statusPersonasBloqueadas = document.getElementById('statusPersonasBloqueadasAval2');
    const statusDrem = document.getElementById('statusDremAval2');

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    statusListasNegras.innerHTML = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Consultando...';
    statusOFAC.innerHTML = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Consultando...';
    statusPersonasBloqueadas.innerHTML = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Consultando...';
    statusDrem.innerHTML = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Consultando...';

    await sleep(2000);
    statusListasNegras.textContent = '✔️ Sin coincidencia';

    await sleep(2000);
    statusOFAC.textContent = '✔️ Sin coincidencia';

    await sleep(2000);
    statusPersonasBloqueadas.textContent = '❌ Con coincidencia';

    await sleep(2000);
    statusDrem.textContent = '✔️ Sin coincidencia';

    document.getElementById('botonVerConsultaPLDAval2').disabled = false;
  };



  /* ---------------------------------------------------------
     12. CLASIFICACIONES — Garantías Adicionales (Registro de Clientes)
  --------------------------------------------------------- */
  const CLASIFICACIONES_RC = {
    MOBILIARIA: [
      'MAQUINARIA Y EQUIPO',
      'VEHÍCULOS TERRESTRES DE MOTOR',
      'PRODUCTOS MANUFACTURADOS DISTINTOS A MAQUINARIA',
      'TITULOS DE DEUDA EMITIDOS POR EL GOBIERNO FEDERAL',
      'TITULOS DE DEUDA EMITIDOS POR ENTIDADES DISTINTAS AL GF',
      'ACCIONES REPRESENTATIVAS DE CAPITAL',
      'DERECHOS, INCLUYENDO DERECHOS DE COBRO',
      'BIENES DE CONSUMO',
      'FIDEICOMISO',
      'OTROS'
    ],
    INMOBILIARIA: [
      'CASA HABITACION UNIFAMILIAR',
      'CONDOMINIO MULTIFAMILIAR',
      'UNIDAD INDUSTRIAL',
      'TERRENO EN ZONA RURAL',
      'TERRENO EN ZONA URBANA'
    ],
    GUBERNAMENTAL: [
      'GARANTIA FEGA',
      'GARANTIA FONAGA'
    ]
  };

  window.actualizarRCClasificacion = function () {
    const tipoGarantia = document.getElementById('rcTipoGarantia');
    const clasificacion = document.getElementById('rcClasificacionGarantia');
    if (!tipoGarantia || !clasificacion) return;

    const tipo = tipoGarantia.value;
    clasificacion.innerHTML = '';
    clasificacion.disabled = true;

    if (tipo && CLASIFICACIONES_RC[tipo]) {
      const optDef = document.createElement('option');
      optDef.value = '';
      optDef.textContent = 'SELECCIONAR';
      clasificacion.appendChild(optDef);

      CLASIFICACIONES_RC[tipo].forEach(item => {
        const opt = document.createElement('option');
        opt.value = item;
        opt.textContent = item;
        clasificacion.appendChild(opt);
      });
      clasificacion.disabled = false;
    } else {
      const optDef = document.createElement('option');
      optDef.value = '';
      optDef.textContent = 'SELECCIONAR';
      clasificacion.appendChild(optDef);
    }
  };

  /* ---------------------------------------------------------
     13. INICIALIZACIÓN
  --------------------------------------------------------- */
  // Mostrar Vista General por defecto
  mostrarVistaGeneral();

});

// ============================================================
// Funciones globales de Modal Autorizacion
// ============================================================
window.abrirModalAutorizacion = function () {
  const modal = document.getElementById('modalAutorizacion');
  if (modal) {
    modal.removeAttribute('hidden');
    modal.style.display = 'flex';
  }
};

window.cerrarModalAutorizacion = function () {
  const modal = document.getElementById('modalAutorizacion');
  if (modal) {
    modal.setAttribute('hidden', 'true');
    modal.style.display = 'none';
  }
};

window.seccionMesaControl = function () {
  const mesaControl = document.getElementById('MesaControl');
  const ordenPago = document.getElementById('vistaOrdenPago');
  const tabInformacionGeneral = document.getElementById('tabInformacionGeneral');
  const tabRegistroClientes = document.getElementById('tabRegistroClientes');
  const tabMesaControl = document.getElementById('tabMesaControl');
  const tabOrdenPago = document.getElementById('tabOrdenPago');
  const verSolicitudTop = document.getElementById('verSolicitudTop');
  const folioTopInfo = document.getElementById('folioTopInfo');

  mesaControl.removeAttribute('hidden');
  tabInformacionGeneral.removeAttribute('hidden');
  tabRegistroClientes.removeAttribute('hidden');
  tabMesaControl.removeAttribute('hidden');
  verSolicitudTop.removeAttribute('hidden');
  folioTopInfo.removeAttribute('hidden');

  ordenPago.setAttribute('hidden', 'true');
  tabOrdenPago.setAttribute('hidden', 'true');
}

window.seccionOrdenPago = function () {
  const mesaControl = document.getElementById('MesaControl');
  const ordenPago = document.getElementById('vistaOrdenPago');
  const tabInformacionGeneral = document.getElementById('tabInformacionGeneral');
  const tabRegistroClientes = document.getElementById('tabRegistroClientes');
  const tabMesaControl = document.getElementById('tabMesaControl');
  const tabOrdenPago = document.getElementById('tabOrdenPago');
  const verSolicitudTop = document.getElementById('verSolicitudTop');
  const folioTopInfo = document.getElementById('folioTopInfo');

  mesaControl.setAttribute('hidden', 'true');
  tabInformacionGeneral.setAttribute('hidden', true);
  tabRegistroClientes.setAttribute('hidden', true);
  tabMesaControl.setAttribute('hidden', true);
  verSolicitudTop.setAttribute('hidden', 'true');
  folioTopInfo.setAttribute('hidden', 'true');

  ordenPago.removeAttribute('hidden');
  tabOrdenPago.removeAttribute('hidden');
}

// ============================================================
// TABLA DE ORDEN DE PAGO
// ============================================================

{/*
<th>NO. CREDITO</th>
<th>NOMBRE ACREDITADO</th>
<th>FECHA DESEMBOLSO</th>
<th>FECHA LIBERACION</th>
<th>MONTO LIBERADO</th>
<th>ACCESORIOS</th>
<th>TOTAL A PAGAR</th>
<th>PRODUCTO</th>
<th>DISTRIBUIDOR</th>
<th>CUENTA CLABE</th>
<th>INSTITUCION BANCARIA</th>
<th>ESTATUS TESORERIA</th>
<th>POLIZA</th>
<th>COMENTARIO</th>
*/}

window.ORDEN_PAGO = [
  { credito: '10051', nombre: 'Alejandro Mendoza Ortiz', fecha: '2026-07-01', liberacion: '02-07-2026', monto: '$15,200.00', accesorios: '$500.00', totalFinal: '$15,700.00', producto: 'Crédito Personal', distribuidor: 'TechDist SA de CV', cuentaClabe: '012345678901234567', institucionBancaria: 'BBVA', estatus: 'Aprobado', poliza: 'POL-1001', comentario: 'Pago programado', fecha_pago: '2026-07-02' },
  { credito: '10052', nombre: 'Sofía Castillo Rivas', fecha: '2026-07-03', liberacion: '02-07-2026', monto: '$8,450.00', accesorios: '$250.00', totalFinal: '$8,700.00', producto: 'Crédito Nómina', distribuidor: 'Global Ventas', cuentaClabe: '123456789012345678', institucionBancaria: 'Santander', estatus: 'Pendiente', poliza: 'POL-1002', comentario: 'En espera de firma', fecha_pago: '' },
  { credito: '10053', nombre: 'Fernando Ruiz Gómez', fecha: '2026-07-05', liberacion: '02-07-2026', monto: '$22,100.00', accesorios: '$1,100.00', totalFinal: '$23,200.00', producto: 'Crédito Automotriz', distribuidor: 'Comercializadora MX', cuentaClabe: '987654321098765432', institucionBancaria: 'Banamex', estatus: 'Pagado', poliza: 'POL-1003', comentario: 'Liquidado', fecha_pago: '2026-07-05' },
  { credito: '10054', nombre: 'Camila Vega Blancas', fecha: '2026-07-08', liberacion: '02-07-2026', monto: '$10,500.00', accesorios: '$0.00', totalFinal: '$10,500.00', producto: 'Crédito Personal', distribuidor: 'Mega Red Nacional', cuentaClabe: '456789012345678901', institucionBancaria: 'Banorte', estatus: 'Rechazado', poliza: '-', comentario: 'Falta documentación', fecha_pago: '' },
  { credito: '10055', nombre: 'Roberto Pineda Sánchez', fecha: '2026-07-10', liberacion: '02-07-2026', monto: '$5,300.00', accesorios: '$100.00', totalFinal: '$5,400.00', producto: 'Microcrédito', distribuidor: 'Distribuidora del Valle', cuentaClabe: '345678901234567890', institucionBancaria: 'HSBC', estatus: 'Aprobado', poliza: 'POL-1005', comentario: 'Todo en orden', fecha_pago: '2026-07-10' },
  { credito: '10056', nombre: 'Diana Miranda Castro', fecha: '2026-07-12', liberacion: '02-07-2026', monto: '$45,000.00', accesorios: '$2,500.00', totalFinal: '$47,500.00', producto: 'Crédito Hipotecario', distribuidor: 'TechDist SA de CV', cuentaClabe: '234567890123456789', institucionBancaria: 'Scotiabank', estatus: 'Pagado', poliza: 'POL-1006', comentario: 'Sin incidencias', fecha_pago: '2026-07-12' },
  { credito: '10057', nombre: 'Héctor Salgado López', fecha: '2026-07-15', liberacion: '02-07-2026', monto: '$18,900.00', accesorios: '$800.00', totalFinal: '$19,700.00', producto: 'Crédito PyME', distribuidor: 'Global Ventas', cuentaClabe: '567890123456789012', institucionBancaria: 'Inbursa', estatus: 'Pendiente', poliza: 'POL-1007', comentario: 'Revisión final', fecha_pago: '' },
  { credito: '10058', nombre: 'Gabriela Ortiz Luna', fecha: '2026-07-18', liberacion: '02-07-2026', monto: '$12,750.00', accesorios: '$450.00', totalFinal: '$13,200.00', producto: 'Crédito Personal', distribuidor: 'Comercializadora MX', cuentaClabe: '678901234567890123', institucionBancaria: 'BBVA', estatus: 'Aprobado', poliza: 'POL-1008', comentario: 'Listo para pago', fecha_pago: '2026-07-18' },
  { credito: '10059', nombre: 'Javier Cárdenas Reyes', fecha: '2026-07-20', liberacion: '02-07-2026', monto: '$33,400.00', accesorios: '$1,800.00', totalFinal: '$35,200.00', producto: 'Crédito Automotriz', distribuidor: 'Mega Red Nacional', cuentaClabe: '789012345678901234', institucionBancaria: 'Santander', estatus: 'Pagado', poliza: 'POL-1009', comentario: 'Completado', fecha_pago: '2026-07-20' },
  { credito: '10060', nombre: 'Lorena Montes Cota', fecha: '2026-07-23', liberacion: '02-07-2026', monto: '$7,250.00', accesorios: '$150.00', totalFinal: '$7,400.00', producto: 'Crédito Nómina', distribuidor: 'Distribuidora del Valle', cuentaClabe: '890123456789012345', institucionBancaria: 'Banamex', estatus: 'En revisión', poliza: '-', comentario: 'Firma pendiente', fecha_pago: '' },
];

window.renderOrdenPago = function () {
  const tbody = document.getElementById('vistaOrdenPagoTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  ORDEN_PAGO.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><strong>${p.credito}</strong></td>
        <td>${p.nombre}</td>
        <td>${p.fecha}</td>
        <td>${p.liberacion}</td>
        <td>${p.monto}</td>
        <td>${p.accesorios}</td>
        <td>${p.totalFinal}</td>
        <td>${p.producto}</td>
        <td>${p.distribuidor}</td>
        <td>${p.cuentaClabe}</td>
        <td>${p.institucionBancaria}</td>
        <td><select><option selected disabled>SELECCIONAR</option><option>PENDIENTE</option><option>PAGADO</option><option>RECHAZADO</option></select></td>
        <td><input type="checkbox" class="switch-unico" 
          onchange="if(this.checked) { setTimeout(() => alert('Generando movimientos contables, y PDF...'), 300); }">
        </td>
        <td>${p.poliza} <button title="Documento PDF" onclick="setTimeout(() => alert('Mostrando PDF Poliza ${p.poliza}...'), 300)"><i class="fa fa-file-pdf"></i></button>
        </td>
        <td>${p.comentario}</td>
        <td>${p.fecha_pago}</td>
      `;
    tbody.appendChild(tr);
  });
}

window.renderOrdenPago();

/* ---------------------------------------------------------
   X. LÓGICA DE ORDENAMIENTO (FILTROS EN TABLAS)
--------------------------------------------------------- */
let sortColGeneral = '';
let sortAscGeneral = true;

window.sortVistaGeneral = function (key) {
  if (sortColGeneral === key) {
    sortAscGeneral = !sortAscGeneral;
  } else {
    sortColGeneral = key;
    sortAscGeneral = true;
  }

  // Remover sufijo VG si existe para mapear con las propiedades del objeto (folio, nombre, etc.)
  const dataKey = key.replace(/VG$/, '');

  PROSPECTOS_DATA.sort((a, b) => {
    let valA = a[dataKey];
    let valB = b[dataKey];

    if (dataKey === 'folio') {
      valA = parseInt(valA) || 0;
      valB = parseInt(valB) || 0;
    } else {
      valA = valA ? valA.toString().toLowerCase() : '';
      valB = valB ? valB.toString().toLowerCase() : '';
    }

    if (valA < valB) return sortAscGeneral ? -1 : 1;
    if (valA > valB) return sortAscGeneral ? 1 : -1;
    return 0;
  });

  renderVistaGeneral();
  updateHeadersIcons('vistaGeneralThead', key, sortAscGeneral);
};

let sortColOrden = '';
let sortAscOrden = true;

window.sortOrdenPago = function (key) {
  if (sortColOrden === key) {
    sortAscOrden = !sortAscOrden;
  } else {
    sortColOrden = key;
    sortAscOrden = true;
  }

  ORDEN_PAGO.sort((a, b) => {
    let valA = a[key];
    let valB = b[key];

    if (key === 'credito') {
      valA = parseInt(valA) || 0;
      valB = parseInt(valB) || 0;
    } else if (key === 'monto' || key === 'accesorios' || key === 'totalFinal') {
      valA = valA ? parseFloat(valA.replace(/[\$,]/g, '')) : 0;
      valB = valB ? parseFloat(valB.replace(/[\$,]/g, '')) : 0;
    } else if (key === 'fecha') {
      valA = valA ? new Date(valA).getTime() : 0;
      valB = valB ? new Date(valB).getTime() : 0;
    } else if (key === 'liberacion') {
      const partsA = valA ? valA.split('-') : [];
      const partsB = valB ? valB.split('-') : [];
      valA = partsA.length === 3 ? new Date(`${partsA[2]}-${partsA[1]}-${partsA[0]}`).getTime() : 0;
      valB = partsB.length === 3 ? new Date(`${partsB[2]}-${partsB[1]}-${partsB[0]}`).getTime() : 0;
    } else {
      valA = valA ? valA.toString().toLowerCase() : '';
      valB = valB ? valB.toString().toLowerCase() : '';
    }

    if (valA < valB) return sortAscOrden ? -1 : 1;
    if (valA > valB) return sortAscOrden ? 1 : -1;
    return 0;
  });

  renderOrdenPago();
  updateHeadersIcons('vistaOrdenPagoThead', key, sortAscOrden);
};

function updateHeadersIcons(theadId, activeKey, isAsc) {
  const thead = document.getElementById(theadId);
  if (!thead) return;

  const ths = thead.querySelectorAll('th');
  ths.forEach(th => {
    const iconSpan = th.querySelector('.sort-icon');
    if (iconSpan) {
      if (th.getAttribute('data-key') === activeKey) {
        iconSpan.innerHTML = isAsc ? ' &uarr;' : ' &darr;';
      } else {
        iconSpan.innerHTML = '';
      }
    }
  });
}

// =========================================================================
// OVERRIDES DE FUNCIONES DE VISTA (Se ejecutan al cargar para sobreescribir las viejas)
// Estas versiones limpias evitan modificar globalmente .hidden en los tabs,
// dejando esa responsabilidad exclusivamente a activarEtapa().
// =========================================================================
window.addEventListener('load', () => {
  window.actualizarFirmasActa = function () {
    const radioMayor = document.getElementById('actaMayor');
    const radioMenor = document.getElementById('actaMenor');
    const firmasMayor = document.getElementById('firmasMayor');
    const firmasMenor = document.getElementById('firmasMenor');

    if (radioMayor && radioMayor.checked) {
      if (firmasMayor) { firmasMayor.hidden = false; firmasMayor.style.display = 'block'; }
      if (firmasMenor) { firmasMenor.hidden = true; firmasMenor.style.display = 'none'; }
    } else if (radioMenor && radioMenor.checked) {
      if (firmasMayor) { firmasMayor.hidden = true; firmasMayor.style.display = 'none'; }
      if (firmasMenor) { firmasMenor.hidden = false; firmasMenor.style.display = 'block'; }
    }
  };

  const radioMayor = document.getElementById('actaMayor');
  const radioMenor = document.getElementById('actaMenor');
  if (radioMayor) radioMayor.addEventListener('change', window.actualizarFirmasActa);
  if (radioMenor) radioMenor.addEventListener('change', window.actualizarFirmasActa);
  window.menuActaComite = function () {
    if (typeof actualizarBotonesSolventacion === 'function') actualizarBotonesSolventacion(true);
    const dic = document.getElementById('dictamen');
    const dq = document.getElementById('dictamenQuash');
    const hist = document.getElementById('historial');
    const ta = document.getElementById('tipoActa');
    const ga = document.getElementById('generarActa');
    const fir = document.getElementById('firmas');

    if (dic) { dic.hidden = true; dic.style.display = 'none'; }
    if (dq) { dq.hidden = true; dq.style.display = 'none'; }
    if (hist) { hist.hidden = true; hist.style.display = 'none'; }
    if (fir) { fir.hidden = true; fir.style.display = 'none'; }
    if (ta) { ta.hidden = false; ta.style.display = 'block'; }
    if (ga) { ga.hidden = false; ga.style.display = 'block'; }

    if (typeof window.actualizarFirmasActa === 'function') window.actualizarFirmasActa();

    document.querySelectorAll('.tab[data-stage="DECISIONES"]').forEach(t => t.classList.remove('active'));
    const t = document.querySelector('.tab[data-tab="receptora"]');
    if (t) t.classList.add('active');
  };

  window.mostrarDictamen = function () {
    if (typeof actualizarBotonesSolventacion === 'function') actualizarBotonesSolventacion(true);
    const dic = document.getElementById('dictamen');
    const dq = document.getElementById('dictamenQuash');
    const hist = document.getElementById('historial');
    const ta = document.getElementById('tipoActa');
    const ga = document.getElementById('generarActa');
    const fir = document.getElementById('firmas');
    const firmasMayor = document.getElementById('firmasMayor');
    const firmasMenor = document.getElementById('firmasMenor');

    if (dic) { dic.hidden = false; dic.style.display = 'block'; }
    if (dq) { dq.hidden = true; dq.style.display = 'none'; }
    if (hist) { hist.hidden = false; hist.style.display = 'block'; }
    if (ta) { ta.hidden = true; ta.style.display = 'none'; }
    if (ga) { ga.hidden = true; ga.style.display = 'none'; }
    if (fir) { fir.hidden = false; fir.style.display = 'block'; }
    if (firmasMayor) { firmasMayor.hidden = true; firmasMayor.style.display = 'none'; }
    if (firmasMenor) { firmasMenor.hidden = true; firmasMenor.style.display = 'none'; }

    document.querySelectorAll('.tab[data-stage="DECISIONES"]').forEach(t => t.classList.remove('active'));
    const t = document.querySelector('.tab[data-tab="dictamen"]');
    if (t) t.classList.add('active');
  };

  window.mostrarDictamenQuash = function () {
    if (typeof actualizarBotonesSolventacion === 'function') actualizarBotonesSolventacion(true);
    const dic = document.getElementById('dictamen');
    const dq = document.getElementById('dictamenQuash');
    const hist = document.getElementById('historial');
    const ta = document.getElementById('tipoActa');
    const ga = document.getElementById('generarActa');
    const fir = document.getElementById('firmas');
    const firmasMayor = document.getElementById('firmasMayor');
    const firmasMenor = document.getElementById('firmasMenor');

    if (dic) { dic.hidden = true; dic.style.display = 'none'; }
    if (dq) { dq.hidden = false; dq.style.display = 'block'; }
    if (hist) { hist.hidden = true; hist.style.display = 'none'; }
    if (ta) { ta.hidden = true; ta.style.display = 'none'; }
    if (ga) { ga.hidden = true; ga.style.display = 'none'; }
    if (fir) { fir.hidden = true; fir.style.display = 'none'; }
    if (firmasMayor) { firmasMayor.hidden = true; firmasMayor.style.display = 'none'; }
    if (firmasMenor) { firmasMenor.hidden = true; firmasMenor.style.display = 'none'; }

    document.querySelectorAll('.tab[data-stage="DECISIONES"]').forEach(t => t.classList.remove('active'));
    const t = document.querySelector('.tab[data-tab="dictamen-quash"]');
    if (t) t.classList.add('active');
  };

  window.mostrarCargaDocumentos = function () {
    if (typeof actualizarBotonesSolventacion === 'function') actualizarBotonesSolventacion(false);
    document.querySelectorAll('.tab[data-stage="CARGA DE DOCUMENTOS"]').forEach(t => t.classList.remove('active'));
    const t = document.getElementById('tabCargaDocumentos');
    if (t) t.classList.add('active');

    const cd = document.getElementById('cargaDocumentos');
    if (cd) { cd.hidden = false; cd.style.display = 'block'; }
  };

  window.mostrarAplicacionPagos = function () {
    if (typeof actualizarBotonesSolventacion === 'function') actualizarBotonesSolventacion(false);
    document.querySelectorAll('.tab[data-stage="APLICACIÓN DE PAGOS"]').forEach(t => t.classList.remove('active'));
    const t = document.getElementById('tabAplicacionPagos');
    if (t) t.classList.add('active');

    const ap = document.getElementById('aplicacionPagos');
    if (ap) { ap.hidden = false; ap.style.display = 'block'; }
    if (typeof window.renderAplicacionPagos === 'function') window.renderAplicacionPagos();
  };

  window.mostrarRegistroGarantia = function () {
    if (typeof actualizarBotonesSolventacion === 'function') actualizarBotonesSolventacion(false);
    document.querySelectorAll('.tab[data-stage="REGISTRO DE GARANTÍA Y OTROS"]').forEach(t => t.classList.remove('active'));
    const t = document.getElementById('tabGarantia');
    if (t) t.classList.add('active');

    const rg = document.getElementById('registroGarantia');
    const va = document.getElementById('valuacion');
    if (rg) { rg.hidden = false; rg.style.display = 'block'; }
    if (va) { va.hidden = false; va.style.display = 'block'; }
  };
});

// --- KITLEGAL AND LIBERACION STAGES --- 
(function () {
  // ============================================================
  // C-MOVIL · Módulo Mesa de Control
  // ============================================================

  document.addEventListener('DOMContentLoaded', () => {

    /* ---------------------------------------------------------
       0. DATOS DE PROSPECTOS (Vista General)
    --------------------------------------------------------- */
    window.KITLEGAL_PROSPECTOS_DATA = [
      { folio: '10177', nombre: 'ANA GLORIA PIÑA AGUILAR', producto: 'C-MOVIL', director: 'JUAN PEREZ', sucursal: 'OAXACA', ejecutivo: 'MARIA LOPEZ', modalidad: 'SUCURSAL', analista: 'PEDRO GOMEZ' },
      { folio: '10178', nombre: 'CARLOS RUIZ MARTINEZ', producto: 'C-AUTO', director: 'JUAN PEREZ', sucursal: 'OAXACA', ejecutivo: 'MARIA LOPEZ', modalidad: 'SUCURSAL', analista: 'PEDRO GOMEZ' },
      { folio: '10179', nombre: 'LAURA SANCHEZ VILLA', producto: 'C-MOVIL', director: 'JUAN PEREZ', sucursal: 'PUEBLA', ejecutivo: 'LUIS FERNANDEZ', modalidad: 'SUCURSAL', analista: 'PEDRO GOMEZ' },
      { folio: '10180', nombre: 'MIGUEL ANGEL FLORES', producto: 'C-MOVIL', director: 'JUAN PEREZ', sucursal: 'PUEBLA', ejecutivo: 'LUIS FERNANDEZ', modalidad: 'SUCURSAL', analista: 'ANA HERNANDEZ' },
      { folio: '10181', nombre: 'SOFIA RAMIREZ CRUZ', producto: 'C-MOVIL', director: 'JUAN PEREZ', sucursal: 'VERACRUZ', ejecutivo: 'JOSE DIAZ', modalidad: 'SUCURSAL', analista: 'ANA HERNANDEZ' },
      { folio: '10182', nombre: 'ROBERTO HERRERA LARA', producto: 'C-AUTO', director: 'ALBERTO GOMEZ', sucursal: 'CDMX SUR', ejecutivo: 'DISTRIBUIDOR 1', modalidad: 'DISTRIBUIDOR', analista: 'ANA HERNANDEZ' },
      { folio: '10183', nombre: 'CARMEN LUNA PEREZ', producto: 'C-MOVIL', director: 'ALBERTO GOMEZ', sucursal: 'CDMX SUR', ejecutivo: 'DISTRIBUIDOR 1', modalidad: 'DISTRIBUIDOR', analista: 'CARLOS SLIM' },
      { folio: '10184', nombre: 'JORGE ORTEGA SALINAS', producto: 'C-MOVIL', director: 'ALBERTO GOMEZ', sucursal: 'CDMX NORTE', ejecutivo: 'DISTRIBUIDOR 2', modalidad: 'DISTRIBUIDOR', analista: 'CARLOS SLIM' },
      { folio: '10185', nombre: 'PATRICIA REYES VACA', producto: 'C-MOVIL', director: 'ALBERTO GOMEZ', sucursal: 'CDMX NORTE', ejecutivo: 'DISTRIBUIDOR 2', modalidad: 'DISTRIBUIDOR', analista: 'CARLOS SLIM' },
      { folio: '10186', nombre: 'EDUARDO VARGAS PINO', producto: 'C-MOVIL', director: 'ALBERTO GOMEZ', sucursal: 'TOLUCA', ejecutivo: 'DISTRIBUIDOR 3', modalidad: 'DISTRIBUIDOR', analista: 'CARLOS SLIM' }
    ];

    window.renderKitLegalVistaGeneral = function () {
      const tbody = document.getElementById('kitLegalVistaGeneralTableBody');
      if (!tbody) return;
      tbody.innerHTML = '';

      KITLEGAL_PROSPECTOS_DATA.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td><strong>${p.folio}</strong></td>
        <td>${p.nombre}</td>
        <td>${p.producto}</td>
        <td>${p.director}</td>
        <td>${p.sucursal}</td>
        <td>${p.ejecutivo}</td>
        <td>${p.modalidad}</td>
        <td>${p.analista}</td>
      `;
        tbody.appendChild(tr);
      });
    }

    window.renderKitLegalVistaGeneral();

    /* ---------------------------------------------------------
       1. DATOS DE PAGOS (para vista parcial en Registro de Clientes)
    --------------------------------------------------------- */
    const PAGOS_DATA = [
      { id: 1, nombre: 'Enganche', archivo: './ENGANCHE_ANA_GLORIA.pdf', estatus: 'aplicado' },
      { id: 2, nombre: 'Garantía Líquida', archivo: '', estatus: 'pendiente' },
      { id: 3, nombre: 'Comisión por Apertura', archivo: './COMISION_ANA_GLORIA.pdf', estatus: 'aplicado' },
      { id: 4, nombre: 'Co Financiamiento', archivo: '', estatus: 'pendiente' },
      { id: 5, nombre: 'Complemento de Enganche', archivo: '', estatus: 'pendiente' },
      { id: 6, nombre: 'Enganche GPS', archivo: '', estatus: 'pendiente' },
      { id: 7, nombre: 'Garantía Líquida Enganche Diferido', archivo: '', estatus: 'pendiente' }
    ];

    /* ---------------------------------------------------------
       2. RENDER: Aplicación de Pagos (Vista Parcial — solo 4 columnas)
    --------------------------------------------------------- */
    function renderKitLegalPagosParcial() {
      const tbody = document.getElementById('pagosParcialTableBody');
      if (!tbody) return;
      tbody.innerHTML = '';

      PAGOS_DATA.forEach(pago => {
        const tr = document.createElement('tr');

        const estatusMap = {
          pendiente: { label: 'Pendiente', cls: 'estatus-pill estatus-pendiente' },
          aplicado: { label: 'Aplicado', cls: 'estatus-pill estatus-aplicado' },
          cancelado: { label: 'Cancelado', cls: 'estatus-pill estatus-cancelado' },
          revision: { label: 'En Revisión', cls: 'estatus-pill estatus-revision' }
        };
        const est = estatusMap[pago.estatus] || { label: pago.estatus, cls: 'estatus-pill' };

        tr.innerHTML = `
        <td style="text-align:left;"><strong>${pago.nombre}</strong></td>
        <td style="text-align:left; color: var(--text-dim); font-size:12.5px;">
          ${pago.archivo ? pago.archivo : '<em>Sin archivo</em>'}
        </td>
        <td style="text-align:center;">
          <button class="btn-icon" title="Ver documento" onclick="alert('Ver: ${pago.nombre}')">👁️</button>
        </td>
        <td style="text-align:center;">
          <span class="${est.cls}">${est.label}</span>
        </td>
      `;
        tbody.appendChild(tr);
      });
    }

    renderKitLegalPagosParcial();

    /* ---------------------------------------------------------
       3. DATOS DE DOCUMENTOS — Mesa de Control
    --------------------------------------------------------- */

    // Documentos Cliente y Aval(es) — en el orden requerido
    const MC_DOCS_CLIENTE = [
      { id: 'c01', nombre: 'Identificacion Oficial', archivo: './INES_ANA_GLORIA.pdf', verificado: false, comentario: '', opcional: false },
      { id: 'c02', nombre: 'CURP', archivo: './CURP_PIAA770429MMSXGN05.pdf', verificado: false, comentario: '', opcional: false },
      { id: 'c03', nombre: 'RFC', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'c04', nombre: 'Acta de Nacimiento', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'c05', nombre: 'Comprobante de Domicilio', archivo: './COMP DE DOM CTA.pdf', verificado: false, comentario: '', opcional: false },
      { id: 'c06', nombre: 'Comprobante de Domicilio Alterno', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'c07', nombre: 'Permiso', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'c08', nombre: 'Arraigo', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'c09', nombre: 'Fotos del Domicilio', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'c10', nombre: 'Fotos de la Actividad', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'c11', nombre: 'Comprobante de Ingresos', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'c12', nombre: 'Autorización de Consulta de Buró', archivo: './AUTH_BURO_ANA_GLORIA.pdf', verificado: false, comentario: '', opcional: false },
      { id: 'c13', nombre: 'Carta de Excepción a la Norma', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'c14', nombre: 'Enganche', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'c15', nombre: 'Garantia Liquida', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'c16', nombre: 'Comisión por Apertura', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'c17', nombre: 'Co Financiamiento', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'c18', nombre: 'Complemento de Enganche', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'c19', nombre: 'Garantia Liquida Enganche Diferido', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'c20', nombre: 'Factura', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'c21', nombre: 'Carta Factura', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'c22', nombre: 'Permiso', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'c23', nombre: 'Enganche GPS', archivo: '', verificado: false, comentario: '', opcional: false }
    ];

    const MC_DOCS_SOLIDARIO = [
      { id: 's01', nombre: 'Identificacion Oficial Aval', archivo: './INES_ANA_GLORIA.pdf', verificado: false, comentario: '', opcional: false },
      { id: 's02', nombre: 'CURP Aval', archivo: './CURP_PIAA770429MMSXGN05.pdf', verificado: false, comentario: '', opcional: false },
      { id: 's03', nombre: 'RFC Aval', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 's04', nombre: 'Acta nacimiento aval', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 's05', nombre: 'Comprobante domicilio aval', archivo: './COMP DE DOM CTA.pdf', verificado: false, comentario: '', opcional: false },
      { id: 's06', nombre: 'Comprobante de Ingresos Aval', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 's07', nombre: 'Garantia Liquida Enganche Diferido', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 's08', nombre: 'Factura Aval', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 's09', nombre: 'Carta Factura Aval', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 's10', nombre: 'Permiso Aval', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 's11', nombre: 'Enganche GPS Aval', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 's12', nombre: 'Comprobante Domicilio Alterno Aval Solidario', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 's13', nombre: 'Arraigo Domiciliar Aval Solidario', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 's14', nombre: 'Fotos del Domicilio Aval Solidario', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 's15', nombre: 'Fotos de la Actividad Aval Solidario', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 's16', nombre: 'Comprobante de Ingresos Aval Solidario', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 's17', nombre: 'Otros Aval Solidario', archivo: '', verificado: false, comentario: '', opcional: false }
    ];

    const MC_DOCS_GARANTE = [
      { id: 'a01', nombre: 'Identificacion oficial garante', archivo: './INES_ANA_GLORIA.pdf', verificado: false, comentario: '', opcional: false },
      { id: 'a02', nombre: 'CURP garante', archivo: './CURP_PIAA770429MMSXGN05.pdf', verificado: false, comentario: '', opcional: false },
      { id: 'a03', nombre: 'RFC garante', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'a04', nombre: 'Acta nacimiento garante', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'a05', nombre: 'Enganche Garante', archivo: './COMP DE DOM CTA.pdf', verificado: false, comentario: '', opcional: false },
      { id: 'a06', nombre: 'Garantia Liquida Garante', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'a07', nombre: 'Comisión por Apertura Garante', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'a08', nombre: 'Co Financiamiento Garante', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'a09', nombre: 'Complemento de Enganche Garante', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'a10', nombre: 'Garantia Liquida Enganche Diferido Garante', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'a11', nombre: 'Factura Garante', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'a12', nombre: 'Carta Factura Garante', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'a13', nombre: 'Permiso Garante', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'a14', nombre: 'Enganche GPS Garante', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'a15', nombre: 'Comprobante Domicilio Alterno Garante', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'a16', nombre: 'Arraigo Domiciliar Garante', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'a17', nombre: 'Fotos del Domicilio Garante', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'a18', nombre: 'Fotos de la Actividad Garante', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'a19', nombre: 'Comprobante de Ingresos Garante', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'a20', nombre: 'Otros Garante', archivo: '', verificado: false, comentario: '', opcional: false }
    ];

    // Documentos de Garantías — en el orden requerido
    // (Este array lo mantuve sin modificaciones porque sus atributos base difieren
    // de DOCUMENTOS_ADICIONALES, que contiene 36 elementos de tipo distinto).
    const MC_DOCS_GARANTIAS = [
      { id: 'g01', nombre: 'Factura', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'g02', nombre: 'Carta Factura', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'g03', nombre: 'Carta de Aceptación de Endoso', archivo: '', verificado: false, comentario: '', opcional: false },
      { id: 'g04', nombre: 'Garantía Adicional 1', archivo: '', verificado: false, comentario: '', opcional: true },
      { id: 'g05', nombre: 'Garantía Adicional 2', archivo: '', verificado: false, comentario: '', opcional: true },
      { id: 'g06', nombre: 'Pagaré de Distribuidor', archivo: '', verificado: false, comentario: '', opcional: true },
      { id: 'g07', nombre: 'Cotización del Seguro', archivo: '', verificado: false, comentario: '', opcional: true },
      { id: 'g08', nombre: 'Póliza del Seguro', archivo: '', verificado: false, comentario: '', opcional: true },
      { id: 'g09', nombre: 'Comprobante de Pago del Seguro', archivo: '', verificado: false, comentario: '', opcional: true },
      { id: 'g10', nombre: 'Solicitud de Instalación del GPS', archivo: '', verificado: false, comentario: '', opcional: true },
      { id: 'g11', nombre: 'Validación de Factura SAT', archivo: '', verificado: false, comentario: '', opcional: true },
      { id: 'g12', nombre: 'Estado de Cuenta', archivo: '', verificado: false, comentario: '', opcional: true },
      { id: 'g13', nombre: 'Otros', archivo: '', verificado: false, comentario: '', opcional: true }
    ];

    /* ---------------------------------------------------------
       4. RENDER: Tabla de documentos Mesa de Control
    --------------------------------------------------------- */
    function renderKitLegalMCDocumentos(datos, tbodyId) {
      const tbody = document.getElementById(tbodyId);
      if (!tbody) return;
      tbody.innerHTML = '';

      datos.forEach(doc => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td style="text-align:left;">
          <strong>${doc.nombre}</strong>
          ${doc.opcional ? '<span class="opcional-badge">Opcional</span>' : ''}
        </td>
        <td style="text-align:left; color: var(--text-dim); font-size: 12.5px;">
          ${doc.archivo ? doc.archivo : '<em style="color:var(--text-faint)">—</em>'}
        </td>
        <td style="text-align:center;">
          <button class="btn-icon" title="Ver documento"
            onclick="alert('Ver: ${doc.nombre}')">👁️</button>
        </td>
        <td style="text-align:center;">
          <label class="mc-verificar-wrap" title="Verificar">
            <input type="checkbox" class="mc-verificar-check" ${doc.verificado ? 'checked' : ''}
              onchange="toggleKitLegalVerificado('${doc.id}', this.checked)">
            <span class="mc-verificar-dot ${doc.verificado ? 'mc-verificar-ok' : ''}"></span>
          </label>
        </td>
        <td style="text-align:left;">
          <input type="text" class="doc-comment" placeholder="Comentario..."
            value="${doc.comentario}"
            onchange="guardarKitLegalComentarioMC('${doc.id}', this.value)">
        </td>
      `;
        tbody.appendChild(tr);
      });
    }

    function renderKitLegalTodosDocumentosMC() {
      renderKitLegalMCDocumentos(MC_DOCS_CLIENTE, 'mcDocClienteBody');
      renderKitLegalMCDocumentos(MC_DOCS_SOLIDARIO, 'mcDocSolidarioBody');
      renderKitLegalMCDocumentos(MC_DOCS_GARANTE, 'mcDocGaranteBody');
      renderKitLegalMCDocumentos(MC_DOCS_GARANTIAS, 'mcDocGarantiasBody');
    }

    /* ---------------------------------------------------------
       5. TOGGLE Verificado
    --------------------------------------------------------- */
    window.toggleKitLegalVerificado = function (id, checked) {
      const todos = [...MC_DOCS_CLIENTE, ...MC_DOCS_SOLIDARIO, ...MC_DOCS_GARANTE, ...MC_DOCS_GARANTIAS];
      const doc = todos.find(d => d.id === id);
      if (doc) doc.verificado = checked;
    };

    /* ---------------------------------------------------------
       6. Guardar comentario MC
    --------------------------------------------------------- */
    window.guardarKitLegalComentarioMC = function (id, valor) {
      const todos = [...MC_DOCS_CLIENTE, ...MC_DOCS_SOLIDARIO, ...MC_DOCS_GARANTE, ...MC_DOCS_GARANTIAS];
      const doc = todos.find(d => d.id === id);
      if (doc) doc.comentario = valor;
    };

    /* ---------------------------------------------------------
       7. Mostrar/ocultar grupos de documentos
    --------------------------------------------------------- */
    window.mostrarKitLegalGrupoDocumentos = function (grupo) {
      const grupoCliente = document.getElementById('grupoDocCliente');
      const grupoGarantias = document.getElementById('grupoDocGarantias');
      const btnCliente = document.getElementById('btnGrupoCliente');
      const btnGarantias = document.getElementById('btnGrupoGarantias');

      if (grupo === 'cliente') {
        if (grupoCliente) grupoCliente.style.display = 'block';
        if (grupoGarantias) grupoGarantias.style.display = 'none';
        if (btnCliente) btnCliente.classList.add('mc-grupo-active');
        if (btnGarantias) btnGarantias.classList.remove('mc-grupo-active');
      } else {
        if (grupoCliente) grupoCliente.style.display = 'none';
        if (grupoGarantias) grupoGarantias.style.display = 'block';
        if (btnGarantias) btnGarantias.classList.add('mc-grupo-active');
        if (btnCliente) btnCliente.classList.remove('mc-grupo-active');
      }
    };

    /* ---------------------------------------------------------
       8. TABS PRINCIPALES — Registro de Clientes / Mesa de Control
    --------------------------------------------------------- */
    window.mostrarKitLegalVistaGeneral = function () {
      const vistaVG = document.getElementById('kitLegalVistaGeneral');
      const vistaRC = document.getElementById('kitLegalVistaRegistroClientes');
      const vistaMC = document.getElementById('kitLegalVistaMesaControl');

      const tabVG = document.getElementById('tabKitLegalVistaGeneral');
      const tabRC = document.getElementById('tabKitLegalRegistroClientes');
      const tabMC = document.getElementById('tabKitLegalMesaControl');

      if (vistaVG) vistaVG.style.display = 'block';
      if (vistaRC) vistaRC.style.display = 'none';
      if (vistaMC) vistaMC.style.display = 'none';

      if (tabVG) tabVG.classList.add('active');
      if (tabRC) tabRC.classList.remove('active');
      if (tabMC) tabMC.classList.remove('active');
    };

    window.mostrarKitLegalRegistroClientes = function () {
      const vistaVG = document.getElementById('kitLegalVistaGeneral');
      const vistaRC = document.getElementById('kitLegalVistaRegistroClientes');
      const vistaMC = document.getElementById('kitLegalVistaMesaControl');

      const tabVG = document.getElementById('tabKitLegalVistaGeneral');
      const tabRC = document.getElementById('tabKitLegalRegistroClientes');
      const tabMC = document.getElementById('tabKitLegalMesaControl');

      if (vistaVG) vistaVG.style.display = 'none';
      if (vistaRC) vistaRC.style.display = 'block';
      if (vistaMC) vistaMC.style.display = 'none';

      if (tabVG) tabVG.classList.remove('active');
      if (tabRC) tabRC.classList.add('active');
      if (tabMC) tabMC.classList.remove('active');
    };

    window.mostrarKitLegalMesaControlTab = function () {
      const vistaVG = document.getElementById('kitLegalVistaGeneral');
      const vistaRC = document.getElementById('kitLegalVistaRegistroClientes');
      const vistaMC = document.getElementById('kitLegalVistaMesaControl');

      const tabVG = document.getElementById('tabKitLegalVistaGeneral');
      const tabRC = document.getElementById('tabKitLegalRegistroClientes');
      const tabMC = document.getElementById('tabKitLegalMesaControl');

      if (vistaVG) vistaVG.style.display = 'none';
      if (vistaRC) vistaRC.style.display = 'none';
      if (vistaMC) vistaMC.style.display = 'block';

      if (tabVG) tabVG.classList.remove('active');
      if (tabRC) tabRC.classList.remove('active');
      if (tabMC) tabMC.classList.add('active');

      renderKitLegalTodosDocumentosMC();
    };

    /* ---------------------------------------------------------
       9. SEGUNDO AVAL — toggle mostrar/ocultar
    --------------------------------------------------------- */
    window.toggleKitLegalAval2 = function () {
      const wrapper = document.getElementById('aval2Wrapper');
      if (!wrapper) return;
      const isHidden = wrapper.style.display === 'none' || wrapper.style.display === '';
      wrapper.style.display = isHidden ? 'block' : 'none';

      const btnAgregar = document.getElementById('wrapperAgregarAval2');
      if (btnAgregar) {
        btnAgregar.style.display = isHidden ? 'none' : 'block';
      }
    };

    /* ---------------------------------------------------------
       10. HISTORIAL BURÓ — toggle mostrar/ocultar
    --------------------------------------------------------- */
    window.toggleKitLegalHistorialBuro = function (id) {
      const el = document.getElementById(id);
      if (!el) return;
      const isHidden = el.style.display === 'none' || el.style.display === '';
      el.style.display = isHidden ? 'block' : 'none';

      // Cambiar texto del botón
      const buroPanel = el.closest('.buro-panel');
      if (buroPanel) {
        const btn = buroPanel.querySelector('.btn-historial');
        if (btn) btn.textContent = isHidden ? '📋 Ocultar Historial' : '📋 Ver Historial';
      }
    };

    /* ---------------------------------------------------------
       11. AUTORIZAR CRÉDITO
    --------------------------------------------------------- */
    window.autorizarKitLegalCredito = function () {
      const comentarios = document.getElementById('comentariosAutorizacion');
      const btn = document.getElementById('btnAutorizarCredito');
      const registro = document.getElementById('registroAutorizacion');
      const textoUsuario = document.getElementById('textoUsuarioAutorizo');
      const textoFecha = document.getElementById('textoFechaAutorizo');

      const comentarioValor = comentarios ? comentarios.value.trim() : '';

      if (!comentarioValor) {
        alert('Por favor ingrese comentarios de autorización antes de autorizar.');
        return;
      }

      const ahora = new Date();
      const fechaStr = ahora.toLocaleString('es-MX', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });

      const USUARIO_ACTUAL = 'JOSE LUIS SOLORZANO GUTIERREZ';

      if (textoUsuario) textoUsuario.textContent = `Autorizado por: ${USUARIO_ACTUAL}`;
      if (textoFecha) textoFecha.textContent = `Fecha y hora: ${fechaStr}`;
      if (registro) registro.style.display = 'flex';

      if (btn) {
        btn.textContent = '✅ Crédito Autorizado';
        btn.classList.add('btn-autorizar-done');
        btn.disabled = true;
      }
      if (comentarios) comentarios.readOnly = true;
    };

    window.consultarKitLegalListasNegras = async function () {
      const statusListasNegras = document.getElementById('statusListasNegras');
      const statusOFAC = document.getElementById('statusOFAC');
      const statusPersonasBloqueadas = document.getElementById('statusPersonasBloqueadas');
      const statusDrem = document.getElementById('statusDrem');

      const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

      statusListasNegras.innerHTML = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Consultando...';
      statusOFAC.innerHTML = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Consultando...';
      statusPersonasBloqueadas.innerHTML = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Consultando...';
      statusDrem.innerHTML = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Consultando...';

      await sleep(2000);
      statusListasNegras.textContent = '✔️ Sin coincidencia';

      await sleep(2000);
      statusOFAC.textContent = '✔️ Sin coincidencia';

      await sleep(2000);
      statusPersonasBloqueadas.textContent = '❌ Con coincidencia';

      await sleep(2000);
      statusDrem.textContent = '✔️ Sin coincidencia';

      document.getElementById('botonVerConsultaPLD').disabled = false;
    };

    window.consultarKitLegalListasNegrasAval1 = async function () {
      const statusListasNegras = document.getElementById('statusListasNegrasAval1');
      const statusOFAC = document.getElementById('statusOFACAval1');
      const statusPersonasBloqueadas = document.getElementById('statusPersonasBloqueadasAval1');
      const statusDrem = document.getElementById('statusDremAval1');

      const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

      statusListasNegras.innerHTML = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Consultando...';
      statusOFAC.innerHTML = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Consultando...';
      statusPersonasBloqueadas.innerHTML = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Consultando...';
      statusDrem.innerHTML = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Consultando...';

      await sleep(2000);
      statusListasNegras.textContent = '✔️ Sin coincidencia';

      await sleep(2000);
      statusOFAC.textContent = '✔️ Sin coincidencia';

      await sleep(2000);
      statusPersonasBloqueadas.textContent = '❌ Con coincidencia';

      await sleep(2000);
      statusDrem.textContent = '✔️ Sin coincidencia';

      document.getElementById('botonVerConsultaPLDAval1').disabled = false;
    };

    window.consultarKitLegalListasNegrasAval2 = async function () {
      const statusListasNegras = document.getElementById('statusListasNegrasAval2');
      const statusOFAC = document.getElementById('statusOFACAval2');
      const statusPersonasBloqueadas = document.getElementById('statusPersonasBloqueadasAval2');
      const statusDrem = document.getElementById('statusDremAval2');

      const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

      statusListasNegras.innerHTML = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Consultando...';
      statusOFAC.innerHTML = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Consultando...';
      statusPersonasBloqueadas.innerHTML = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Consultando...';
      statusDrem.innerHTML = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Consultando...';

      await sleep(2000);
      statusListasNegras.textContent = '✔️ Sin coincidencia';

      await sleep(2000);
      statusOFAC.textContent = '✔️ Sin coincidencia';

      await sleep(2000);
      statusPersonasBloqueadas.textContent = '❌ Con coincidencia';

      await sleep(2000);
      statusDrem.textContent = '✔️ Sin coincidencia';

      document.getElementById('botonVerConsultaPLDAval2').disabled = false;
    };



    /* ---------------------------------------------------------
       12. CLASIFICACIONES — Garantías Adicionales (Registro de Clientes)
    --------------------------------------------------------- */
    const CLASIFICACIONES_RC = {
      MOBILIARIA: [
        'MAQUINARIA Y EQUIPO',
        'VEHÍCULOS TERRESTRES DE MOTOR',
        'PRODUCTOS MANUFACTURADOS DISTINTOS A MAQUINARIA',
        'TITULOS DE DEUDA EMITIDOS POR EL GOBIERNO FEDERAL',
        'TITULOS DE DEUDA EMITIDOS POR ENTIDADES DISTINTAS AL GF',
        'ACCIONES REPRESENTATIVAS DE CAPITAL',
        'DERECHOS, INCLUYENDO DERECHOS DE COBRO',
        'BIENES DE CONSUMO',
        'FIDEICOMISO',
        'OTROS'
      ],
      INMOBILIARIA: [
        'CASA HABITACION UNIFAMILIAR',
        'CONDOMINIO MULTIFAMILIAR',
        'UNIDAD INDUSTRIAL',
        'TERRENO EN ZONA RURAL',
        'TERRENO EN ZONA URBANA'
      ],
      GUBERNAMENTAL: [
        'GARANTIA FEGA',
        'GARANTIA FONAGA'
      ]
    };

    window.actualizarKitLegalRCClasificacion = function () {
      const tipoGarantia = document.getElementById('rcTipoGarantia');
      const clasificacion = document.getElementById('rcClasificacionGarantia');
      if (!tipoGarantia || !clasificacion) return;

      const tipo = tipoGarantia.value;
      clasificacion.innerHTML = '';
      clasificacion.disabled = true;

      if (tipo && CLASIFICACIONES_RC[tipo]) {
        const optDef = document.createElement('option');
        optDef.value = '';
        optDef.textContent = 'SELECCIONAR';
        clasificacion.appendChild(optDef);

        CLASIFICACIONES_RC[tipo].forEach(item => {
          const opt = document.createElement('option');
          opt.value = item;
          opt.textContent = item;
          clasificacion.appendChild(opt);
        });
        clasificacion.disabled = false;
      } else {
        const optDef = document.createElement('option');
        optDef.value = '';
        optDef.textContent = 'SELECCIONAR';
        clasificacion.appendChild(optDef);
      }
    };

    /* ---------------------------------------------------------
       13. INICIALIZACIÓN
    --------------------------------------------------------- */
    // Mostrar Vista General por defecto
    mostrarKitLegalVistaGeneral();

  });

  // ============================================================
  // Funciones globales de Modal Autorizacion
  // ============================================================
  window.abrirKitLegalModalAutorizacion = function () {
    const modal = document.getElementById('modalAutorizacion');
    if (modal) {
      modal.removeAttribute('hidden');
      modal.style.display = 'flex';
    }
  };

  window.cerrarKitLegalModalAutorizacion = function () {
    const modal = document.getElementById('modalAutorizacion');
    if (modal) {
      modal.setAttribute('hidden', 'true');
      modal.style.display = 'none';
    }
  };

  window.seccionKitLegalMesaControl = function () {
    const mesaControl = document.getElementById('MesaControl');
    const ordenPago = document.getElementById('vistaOrdenPago');
    const tabInformacionGeneral = document.getElementById('tabKitLegalVistaGeneral');
    const tabRegistroClientes = document.getElementById('tabKitLegalRegistroClientes');
    const tabMesaControl = document.getElementById('tabKitLegalMesaControl');
    const tabOrdenPago = document.getElementById('tabOrdenPago');

    mesaControl.removeAttribute('hidden');
    tabInformacionGeneral.removeAttribute('hidden');
    tabRegistroClientes.removeAttribute('hidden');
    tabMesaControl.removeAttribute('hidden');

    ordenPago.setAttribute('hidden', 'true');
    tabOrdenPago.setAttribute('hidden', 'true');
  }

  window.seccionLiberacionOrdenPago = function () {
    const mesaControl = document.getElementById('MesaControl');
    const ordenPago = document.getElementById('vistaOrdenPago');
    const tabInformacionGeneral = document.getElementById('tabKitLegalVistaGeneral');
    const tabRegistroClientes = document.getElementById('tabKitLegalRegistroClientes');
    const tabMesaControl = document.getElementById('tabKitLegalMesaControl');
    const tabOrdenPago = document.getElementById('tabOrdenPago');

    mesaControl.setAttribute('hidden', 'true');
    tabInformacionGeneral.setAttribute('hidden', true);
    tabRegistroClientes.setAttribute('hidden', true);
    tabMesaControl.setAttribute('hidden', true);

    ordenPago.removeAttribute('hidden');
    tabOrdenPago.removeAttribute('hidden');
  }

  // ============================================================
  // TABLA DE ORDEN DE PAGO
  // ============================================================

  {/*
<th>NO. CREDITO</th>
<th>NOMBRE ACREDITADO</th>
<th>FECHA DESEMBOLSO</th>
<th>FECHA LIBERACION</th>
<th>MONTO</th>
<th>DISTRIBUIDOR</th>
<th>DIRECTOR COMERCIAL</th>
<th>SUCURSAL</th>
<th>ESTATUS</th>
<th>ANALISTA M.C.</th>
<th>CREADOR</th>
*/}

  window.LIBERACION_DATA = [
    { credito: '10051', nombre: 'Alejandro Mendoza Ortiz', fecha: '2026-07-01', liberacion: '02-07-2026', monto: '$15,200.00', distribuidor: 'TechDist SA de CV', cuenta: '1651898', banco: 'BBVA', estatus: 'Aprobado', producto: 'C-MOVIL' },
    { credito: '10052', nombre: 'Sofía Castillo Rivas', fecha: '2026-07-03', liberacion: '02-07-2026', monto: '$8,450.00', distribuidor: 'Global Ventas', cuenta: '1651898', banco: 'Banorte', estatus: 'Pendiente', producto: 'C-MOVIL' },
    { credito: '10053', nombre: 'Fernando Ruiz Gómez', fecha: '2026-07-05', liberacion: '02-07-2026', monto: '$22,100.00', distribuidor: 'Comercializadora MX', cuenta: '1651898', banco: 'BBVA', estatus: 'Pagado', producto: 'C-MOVIL' },
    { credito: '10054', nombre: 'Camila Vega Blancas', fecha: '2026-07-08', liberacion: '02-07-2026', monto: '$10,500.00', distribuidor: 'Mega Red Nacional', cuenta: '1651898', banco: 'BBVA', estatus: 'Rechazado', producto: 'C-MOVIL' },
    { credito: '10055', nombre: 'Roberto Pineda Sánchez', fecha: '2026-07-10', liberacion: '02-07-2026', monto: '$5,300.00', distribuidor: 'Distribuidora del Valle', cuenta: '1651898', banco: 'Scotiabank', estatus: 'Aprobado', producto: 'C-MOVIL' },
    { credito: '10056', nombre: 'Diana Miranda Castro', fecha: '2026-07-12', liberacion: '02-07-2026', monto: '$45,000.00', distribuidor: 'TechDist SA de CV', cuenta: '1651898', banco: 'BanCoppel', estatus: 'Pagado', producto: 'C-MOVIL' },
    { credito: '10057', nombre: 'Héctor Salgado López', fecha: '2026-07-15', liberacion: '02-07-2026', monto: '$18,900.00', distribuidor: 'Global Ventas', cuenta: '1651898', banco: 'BanCoppel', estatus: 'Pendiente', producto: 'C-MOVIL' },
    { credito: '10058', nombre: 'Gabriela Ortiz Luna', fecha: '2026-07-18', liberacion: '02-07-2026', monto: '$12,750.00', distribuidor: 'Comercializadora MX', cuenta: '1651898', banco: 'Banorte', estatus: 'Aprobado', producto: 'C-MOVIL' },
    { credito: '10059', nombre: 'Javier Cárdenas Reyes', fecha: '2026-07-20', liberacion: '02-07-2026', monto: '$33,400.00', distribuidor: 'Mega Red Nacional', cuenta: '1651898', banco: 'Banorte', estatus: 'Pagado', producto: 'C-MOVIL' },
    { credito: '10060', nombre: 'Lorena Montes Cota', fecha: '2026-07-23', liberacion: '02-07-2026', monto: '$7,250.00', distribuidor: 'Distribuidora del Valle', cuenta: '1651898', banco: 'Scotiabank', estatus: 'En revisión', producto: 'C-MOVIL' },
  ];

  window.renderLiberacionOrdenPago = function () {
    const tbody = document.getElementById('liberacionTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    LIBERACION_DATA.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${p.credito}</strong></td>
        <td>${p.nombre}</td>
        <td>${p.fecha}</td>
        <td>${p.liberacion}</td>
        <td>${p.monto}</td>
        <td>${p.distribuidor}</td>
        <td>${p.cuenta}</td>
        <td>${p.banco}</td>
        <td>${p.estatus}</td>
        <td>${p.producto}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.renderLiberacionOrdenPago();

  /* ---------------------------------------------------------
     X. LÓGICA DE ORDENAMIENTO (FILTROS EN TABLAS)
  --------------------------------------------------------- */
  let sortColGeneral = '';
  let sortAscGeneral = true;

  window.sortKitLegalVistaGeneral = function (key) {
    if (sortColGeneral === key) {
      sortAscGeneral = !sortAscGeneral;
    } else {
      sortColGeneral = key;
      sortAscGeneral = true;
    }

    // Remover sufijo VG si existe para mapear con las propiedades del objeto (folio, nombre, etc.)
    const dataKey = key.replace(/VG$/, '');

    KITLEGAL_PROSPECTOS_DATA.sort((a, b) => {
      let valA = a[dataKey];
      let valB = b[dataKey];

      if (dataKey === 'folio') {
        valA = parseInt(valA) || 0;
        valB = parseInt(valB) || 0;
      } else {
        valA = valA ? valA.toString().toLowerCase() : '';
        valB = valB ? valB.toString().toLowerCase() : '';
      }

      if (valA < valB) return sortAscGeneral ? -1 : 1;
      if (valA > valB) return sortAscGeneral ? 1 : -1;
      return 0;
    });

    renderKitLegalVistaGeneral();
    updateHeadersIcons('kitLegalVistaGeneralThead', key, sortAscGeneral);
  };

  let sortColOrden = '';
  let sortAscOrden = true;

  window.sortLiberacionOrdenPago = function (key) {
    if (sortColOrden === key) {
      sortAscOrden = !sortAscOrden;
    } else {
      sortColOrden = key;
      sortAscOrden = true;
    }

    LIBERACION_DATA.sort((a, b) => {
      let valA = a[key];
      let valB = b[key];

      if (key === 'credito') {
        valA = parseInt(valA) || 0;
        valB = parseInt(valB) || 0;
      } else if (key === 'monto') {
        valA = valA ? parseFloat(valA.replace(/[\$,]/g, '')) : 0;
        valB = valB ? parseFloat(valB.replace(/[\$,]/g, '')) : 0;
      } else if (key === 'fecha') {
        valA = valA ? new Date(valA).getTime() : 0;
        valB = valB ? new Date(valB).getTime() : 0;
      } else if (key === 'liberacion') {
        const partsA = valA ? valA.split('-') : [];
        const partsB = valB ? valB.split('-') : [];
        valA = partsA.length === 3 ? new Date(`${partsA[2]}-${partsA[1]}-${partsA[0]}`).getTime() : 0;
        valB = partsB.length === 3 ? new Date(`${partsB[2]}-${partsB[1]}-${partsB[0]}`).getTime() : 0;
      } else {
        valA = valA ? valA.toString().toLowerCase() : '';
        valB = valB ? valB.toString().toLowerCase() : '';
      }

      if (valA < valB) return sortAscOrden ? -1 : 1;
      if (valA > valB) return sortAscOrden ? 1 : -1;
      return 0;
    });

    renderLiberacionOrdenPago();
    updateHeadersIcons('liberacionThead', key, sortAscOrden);
  };

  function updateHeadersIcons(theadId, activeKey, isAsc) {
    const thead = document.getElementById(theadId);
    if (!thead) return;

    const ths = thead.querySelectorAll('th');
    ths.forEach(th => {
      const iconSpan = th.querySelector('.sort-icon');
      if (iconSpan) {
        if (th.getAttribute('data-key') === activeKey) {
          iconSpan.innerHTML = isAsc ? ' &uarr;' : ' &darr;';
        } else {
          iconSpan.innerHTML = '';
        }
      }
    });
  }

  // ============================================================
  // LOGICA KIT LEGAL Y LIBERACIONES
  // ============================================================
  var KIT_DOCUMENTOS = ['Contrato', 'Pagare', 'Tabla de amortización', 'Caratula de comite', 'Presentación', 'Solicitud de crédito'];
  var COMPLEMENTARIOS = ['Aclaración firmas por inconsistencias', 'Acta de supervisión de la inversión', 'Reporte fotográfico', 'Autorización entrega de vehículo y resguardo de llave', 'Carta consentimiento', 'Endoso jurídico (cuando aplique)', 'Carta aceptación de endoso (cuando aplique)', 'Formato de sustitución garantia', 'Constancia de recepción de garantía', 'Otros'];
  var DOCUMENTOS_ACREDITADO = ['Identificacion Oficial', 'CURP', 'RFC', 'Acta de Nacimiento', 'Comprobante de Domicilio', 'Comprobante de Domicilio Alterno', 'Permiso', 'Arraigo'];
  var DOCUMENTOS_AVAL = ['Identificacion Oficial Aval (inhabilitar / mandar a llamar)', 'CURP Aval (inhabilitar / mandar a llamar)', 'RFC Aval (inhabilitar / mandar a llamar)', 'Acta nacimiento aval (inhabilitar / mandar a llamar)', 'Comprobante domicilio aval (inhabilitar / mandar a llamar)', 'Arraigo Domiciliar Aval (inhabilitar / mandar a llamar)', 'Otros Aval'];
  var VIDEO_DESEMBOLSO = ['VIDEO'];
  var DOCUMENTOS_GARANTIA = ['Factura', 'Carta Factura', 'Garantía Adicional 1', 'Garantía Adicional 2', 'Póliza del Seguro', 'Comprobante de Pago del Seguro', 'Pagaré de Distribuidor (cuando aplique)', 'Evidencia de instalación del GPS', 'Otros'];

  var kitEstado = {};

  function inicializarKitEstado() {
    var todos = KIT_DOCUMENTOS.concat(COMPLEMENTARIOS, DOCUMENTOS_ACREDITADO, DOCUMENTOS_AVAL, VIDEO_DESEMBOLSO, DOCUMENTOS_GARANTIA);
    todos.forEach(function (nom) {
      if (!kitEstado[nom]) {
        kitEstado[nom] = { archivo: null, validado: false, comentario: '', historial: [] };
      }
    });
  }
  inicializarKitEstado();

  function renderKitTabla(tbodyId, listaDocs) {
    var tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    tbody.innerHTML = '';
    listaDocs.forEach(function (nom) {
      var estado = kitEstado[nom] || { archivo: null, validado: false, comentario: '', historial: [] };
      var tr = document.createElement('tr');
      var fileId = 'kitFile_' + nom.replace(/\s/g, '_');
      tr.innerHTML = `
            <td style="text-align: left;"><strong>${nom}</strong></td>
            <td>
                <label class="file-label-kit" for="${fileId}">
                    ${estado.archivo ? '✅' : '📎'} ${estado.archivo || 'Subir'}
                    <input type="file" id="${fileId}" onchange="subirArchivoKit('${nom}', this)">
                </label>
            </td>
            <td>
                <button class="btn-icon-kit" onclick="verArchivoKit('${nom}')" title="Ver" ${estado.archivo ? '' : 'disabled'}>👁️</button>
            </td>
            <td>
                <label class="switch-validar">
                    <input type="checkbox" ${estado.validado ? 'checked' : ''} onchange="toggleValidarKit('${nom}', this.checked)">
                    <span class="slider"></span>
                </label>
            </td>
            <td>
                <input type="text" class="comentario-kit" placeholder="Comentario..." value="${estado.comentario || ''}" onchange="guardarComentarioKit('${nom}', this.value)">
            </td>
            <td>
                <button class="btn-historico" onclick="verHistoricoKit('${nom}')">🔄</button>
            </td>
        `;
      tbody.appendChild(tr);
    });
  }

  window.renderAllKitTables = function () {
    renderKitTabla('kitCargaBody', KIT_DOCUMENTOS);
    renderKitTabla('complementariosBody', COMPLEMENTARIOS);
    renderKitTabla('acreditadoBody', DOCUMENTOS_ACREDITADO);
    renderKitTabla('acreditadoBody1', DOCUMENTOS_AVAL); // Modificado a DOCUMENTOS_AVAL
    renderKitTabla('videoBody', VIDEO_DESEMBOLSO);
    renderKitTabla('garantiaBody', DOCUMENTOS_GARANTIA);
  };

  window.subirArchivoKit = function (nombre, input) {
    var file = input.files[0];
    if (file) {
      if (!kitEstado[nombre]) kitEstado[nombre] = { archivo: null, validado: false, comentario: '', historial: [] };
      kitEstado[nombre].archivo = file.name;
      kitEstado[nombre].historial.push(new Date().toLocaleString() + ' - Archivo subido: ' + file.name);
      window.renderAllKitTables();
    }
  };

  window.verArchivoKit = function (nombre) {
    var estado = kitEstado[nombre];
    if (estado && estado.archivo) alert('Visualizando archivo: ' + estado.archivo + '\\n(Simulación)');
    else alert('No hay archivo subido.');
  };

  window.toggleValidarKit = function (nombre, checked) {
    if (!kitEstado[nombre]) kitEstado[nombre] = { archivo: null, validado: false, comentario: '', historial: [] };
    kitEstado[nombre].validado = checked;
    kitEstado[nombre].historial.push(new Date().toLocaleString() + ' - Documento ' + (checked ? 'validado' : 'desvalidado'));
  };

  window.guardarComentarioKit = function (nombre, valor) {
    if (!kitEstado[nombre]) kitEstado[nombre] = { archivo: null, validado: false, comentario: '', historial: [] };
    kitEstado[nombre].comentario = valor;
    kitEstado[nombre].historial.push(new Date().toLocaleString() + ' - Comentario actualizado: ' + valor);
  };

  window.verHistoricoKit = function (nombre) {
    var estado = kitEstado[nombre];
    if (!estado || estado.historial.length === 0) alert('No hay historial para "' + nombre + '".');
    else alert('Historial de "' + nombre + '":\\n\\n' + estado.historial.join('\\n'));
  };

  window.mostrarListaKit = function () {
    var lista = document.getElementById('kitListaContainer');
    var carga = document.getElementById('kitCargaContainer');
    if (lista) lista.style.display = 'block';
    if (carga) carga.style.display = 'none';
    var btns = document.querySelectorAll('.liberaciones-izquierda .btn-kit');
    btns.forEach(btn => { btn.style.background = 'var(--bg-panel-2)'; btn.style.borderColor = 'var(--border)'; });
    var btnGen = document.querySelector('.liberaciones-izquierda .btn-kit:first-child');
    if (btnGen) { btnGen.style.background = 'var(--bg-card-header)'; btnGen.style.borderColor = 'var(--accent)'; }
  };

  window.mostrarCargaKit = function () {
    var lista = document.getElementById('kitListaContainer');
    var carga = document.getElementById('kitCargaContainer');
    if (lista) lista.style.display = 'none';
    if (carga) carga.style.display = 'block';
    var btns = document.querySelectorAll('.liberaciones-izquierda .btn-kit');
    btns.forEach(btn => { btn.style.background = 'var(--bg-panel-2)'; btn.style.borderColor = 'var(--border)'; });
    var btnCarga = document.querySelector('.liberaciones-izquierda .btn-kit:last-child');
    if (btnCarga) { btnCarga.style.background = 'var(--bg-card-header)'; btnCarga.style.borderColor = 'var(--accent)'; }
    window.renderAllKitTables();
  };

  /* SOLICITUD DE LIBERACIÓN */
  var SOLICITUD_DOCUMENTOS = ['Pagare', 'Tabla de amortización', 'Contrato', 'Caratula de comite', 'Presentación', 'Aclaración firmas por inconsistencias', 'Resguardo de llaves', 'Acta de supervisión', 'Reporte fotográfico', 'Aceptación de endoso', 'Fotos del Domicilio', 'Fotos de la Actividad', 'Comprobante de Ingresos', 'Carta de Excepción a la Norma', 'Autorización de Consulta de Buró', 'Identificacion Oficial Aval', 'CURP Aval', 'RFC Aval', 'Acta nacimiento aval', 'Comprobante domicilio aval', 'Arraigo Domiciliar Aval', 'Estado de cuenta', 'Cotización de seguro'];

  var solicitudEstado = {};

  function inicializarSolicitud() {
    SOLICITUD_DOCUMENTOS.forEach(function (nom) {
      solicitudEstado[nom] = { estado: 'solicitado', validado: false, observaciones: [], foto: null, comentario: '' };
    });
  }
  inicializarSolicitud();

  function actualizarConteos() {
    var conteos = { solicitado: 0, liberado: 0, observado: 0, porrevisar: 0 };
    SOLICITUD_DOCUMENTOS.forEach(nom => {
      var est = solicitudEstado[nom].estado;
      if (conteos[est] !== undefined) conteos[est]++;
    });
    var el1 = document.getElementById('countSolicitado');
    var el2 = document.getElementById('countLiberado');
    var el3 = document.getElementById('countObservado');
    var el4 = document.getElementById('countPorRevisar');
    if (el1) el1.textContent = conteos.solicitado;
    if (el2) el2.textContent = conteos.liberado;
    if (el3) el3.textContent = conteos.observado;
    if (el4) el4.textContent = conteos.porrevisar;
  }

  window.renderSolicitud = function () {
    var tbody = document.getElementById('solicitudBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    SOLICITUD_DOCUMENTOS.forEach(function (nom) {
      var estado = solicitudEstado[nom];
      var tr = document.createElement('tr');
      var fileId = 'solFoto_' + nom.replace(/\s/g, '_');
      var opcionesObs = ['Datos Incongruentes Formato', 'Documento Ilegible o Dañado', 'Documento sin vigencia', 'Documento no valido', 'Documento desactualizado', 'Firmas incongruentes Formato', 'Video', 'Otro', 'Documento no cargado', 'Documento sin cotejos'];
      var obsOptionsHtml = '';
      opcionesObs.forEach(function (obs) {
        var selected = estado.observaciones.includes(obs) ? 'selected' : '';
        obsOptionsHtml += `<option value="${obs}" ${selected}>${obs}</option>`;
      });
      tr.innerHTML = `
            <td style="text-align: left;"><strong>${nom}</strong></td>
            <td><button class="btn-icon-sol" onclick="verSolicitudDocumento('${nom}')" title="Ver documento">👁️</button></td>
            <td>
                <label class="switch-validar">
                    <input type="checkbox" ${estado.validado ? 'checked' : ''} onchange="toggleValidarSolicitud('${nom}', this.checked)">
                    <span class="slider"></span>
                </label>
            </td>
            <td>
                <select class="select-estado-sol" onchange="cambiarEstadoSolicitud('${nom}', this.value)">
                    <option value="solicitado" ${estado.estado === 'solicitado' ? 'selected' : ''}>Solicitado</option>
                    <option value="liberado" ${estado.estado === 'liberado' ? 'selected' : ''}>Liberado</option>
                    <option value="observado" ${estado.estado === 'observado' ? 'selected' : ''}>Observado</option>
                    <option value="porrevisar" ${estado.estado === 'porrevisar' ? 'selected' : ''}>Por revisar</option>
                </select>
            </td>
            <td><select class="select-observaciones" multiple size="1" onchange="cambiarObservacionesSolicitud('${nom}', this)">${obsOptionsHtml}</select></td>
            <td>
                <label class="file-label-sol" for="${fileId}">
                    ${estado.foto ? '✅' : '📎'} ${estado.foto || 'Subir'}
                    <input type="file" id="${fileId}" accept="image/*" onchange="subirFotoSolicitud('${nom}', this)">
                </label>
            </td>
            <td><input type="text" class="comentario-sol" placeholder="Comentario..." value="${estado.comentario || ''}" onchange="guardarComentarioSolicitud('${nom}', this.value)"></td>
        `;
      tbody.appendChild(tr);
    });
    actualizarConteos();
  };

  window.toggleValidarSolicitud = function (nombre, checked) { solicitudEstado[nombre].validado = checked; window.renderSolicitud(); };
  window.cambiarEstadoSolicitud = function (nombre, nuevoEstado) { solicitudEstado[nombre].estado = nuevoEstado; window.renderSolicitud(); };
  window.cambiarObservacionesSolicitud = function (nombre, select) {
    var seleccionadas = [];
    for (var i = 0; i < select.options.length; i++) if (select.options[i].selected) seleccionadas.push(select.options[i].value);
    solicitudEstado[nombre].observaciones = seleccionadas;
    window.renderSolicitud();
  };
  window.subirFotoSolicitud = function (nombre, input) { var file = input.files[0]; if (file) { solicitudEstado[nombre].foto = file.name; window.renderSolicitud(); } };
  window.guardarComentarioSolicitud = function (nombre, valor) { solicitudEstado[nombre].comentario = valor; };
  window.verSolicitudDocumento = function (nombre) {
    var doc = solicitudEstado[nombre];
    alert('Visualizando documento: ' + nombre + '\\nEstado: ' + doc.estado + '\\nValidado: ' + (doc.validado ? 'Sí' : 'No') + '\\nObservaciones: ' + (doc.observaciones.join(', ') || 'Ninguna') + '\\nFoto: ' + (doc.foto || 'Sin foto') + '\\nComentario: ' + (doc.comentario || 'Sin comentario'));
  };

  window.mostrarDocumentosLiberacion = function () {
    var docsContainer = document.getElementById('solicitudDocumentosContainer');
    var generalContainer = document.getElementById('solicitudesGeneralesContainer');
    var tabDocs = document.getElementById('tabDocumentos');
    var tabLibs = document.getElementById('tabLiberaciones');

    if (docsContainer) docsContainer.style.display = 'block';
    if (generalContainer) generalContainer.style.display = 'none';

    if (tabDocs) tabDocs.classList.add('active');
    if (tabLibs) tabLibs.classList.remove('active');

    if (typeof window.renderSolicitud === 'function') window.renderSolicitud();
  };

  window.mostrarSolicitudesLiberacion = function () {
    var docsContainer = document.getElementById('solicitudDocumentosContainer');
    var generalContainer = document.getElementById('solicitudesGeneralesContainer');
    var tabDocs = document.getElementById('tabDocumentos');
    var tabLibs = document.getElementById('tabLiberaciones');

    if (docsContainer) docsContainer.style.display = 'none';
    if (generalContainer) generalContainer.style.display = 'block';

    if (tabDocs) tabDocs.classList.remove('active');
    if (tabLibs) tabLibs.classList.add('active');

    if (typeof window.renderSolicitudesGenerales === 'function') window.renderSolicitudesGenerales();
  };

  window.toggleSolicitudesGenerales = function () {
    var generalContainer = document.getElementById('solicitudesGeneralesContainer');
    if (generalContainer && (generalContainer.style.display === 'none' || generalContainer.style.display === '')) {
      window.mostrarSolicitudesLiberacion();
    } else {
      window.mostrarDocumentosLiberacion();
    }
  };

  var SOLICITUDES_GENERALES = [
    { credito: '10001', cliente: 'Juan Pérez', fechaDesembolso: '2025-01-15', fechaSolicitud: '2025-01-10', monto: 150000, plazo: 12, producto: 'Crédito Auto', sucursal: 'Sucursal Norte', ejecutivo: 'Carlos García', distribuidor: 'Distribuidor A', estatus: 'Liberado' },
    { credito: '10002', cliente: 'María Gómez', fechaDesembolso: '2025-01-20', fechaSolicitud: '2025-01-18', monto: 200000, plazo: 18, producto: 'Crédito Hipotecario', sucursal: 'Sucursal Sur', ejecutivo: 'Laura Martínez', distribuidor: 'Distribuidor B', estatus: 'En proceso' },
    { credito: '10003', cliente: 'Pedro Fernández', fechaDesembolso: '2025-02-01', fechaSolicitud: '2025-01-28', monto: 80000, plazo: 9, producto: 'Crédito Personal', sucursal: 'Sucursal Este', ejecutivo: 'Roberto López', distribuidor: 'Distribuidor C', estatus: 'Observado' },
    { credito: '10004', cliente: 'Ana Torres', fechaDesembolso: '2025-02-10', fechaSolicitud: '2025-02-05', monto: 300000, plazo: 24, producto: 'Crédito Empresarial', sucursal: 'Sucursal Oeste', ejecutivo: 'Marta Reyes', distribuidor: 'Distribuidor D', estatus: 'Liberado' },
    { credito: '10005', cliente: 'Luis Ramírez', fechaDesembolso: '2025-02-20', fechaSolicitud: '2025-02-15', monto: 120000, plazo: 15, producto: 'Crédito Auto', sucursal: 'Sucursal Norte', ejecutivo: 'Carlos García', distribuidor: 'Distribuidor A', estatus: 'Pendiente' }
  ];

  window.renderSolicitudesGenerales = function () {
    var tbody = document.getElementById('solicitudesGeneralesBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    SOLICITUDES_GENERALES.forEach(function (solicitud) {
      var tr = document.createElement('tr');
      tr.innerHTML = `
            <td><button class="btn-icon" onclick="alert('Ver detalle de la solicitud con No. Crédito: ${solicitud.credito}')">👁️</button></td>
            <td>${solicitud.credito}</td>
            <td>${solicitud.cliente}</td>
            <td>${solicitud.fechaDesembolso}</td>
            <td>${solicitud.fechaSolicitud}</td>
            <td>$${solicitud.monto.toLocaleString('es-MX')}</td>
            <td>${solicitud.plazo}</td>
            <td>${solicitud.producto}</td>
            <td>${solicitud.sucursal}</td>
            <td>${solicitud.ejecutivo}</td>
            <td>${solicitud.distribuidor}</td>
            <td><span style="font-weight:600; color: ${solicitud.estatus === 'Liberado' ? 'var(--green)' : solicitud.estatus === 'Observado' ? 'var(--orange)' : 'var(--accent)'};">${solicitud.estatus}</span></td>
        `;
      tbody.appendChild(tr);
    });
  };

  window.descargarZipCompleto = function () { alert('Descargando ZIP completo (simulación)'); };
  window.verDocumentoKit = function (nombre) { alert('Visualizando documento: "' + nombre + '" (simulación)'); };
  window.descargarDocumentoKit = function (nombre) { alert('Descargando documento: "' + nombre + '" (simulación)'); };

})();
