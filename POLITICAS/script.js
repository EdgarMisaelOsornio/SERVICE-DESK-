let pageCount = 0;

function fechaActual(){
  const meses = [
    "enero","febrero","marzo","abril","mayo","junio",
    "julio","agosto","septiembre","octubre","noviembre","diciembre"
  ];
  const f = new Date();
  return `Ciudad de México a ${f.getDate()} de ${meses[f.getMonth()]} de ${f.getFullYear()}`;
}

function $(id){
  return document.getElementById(id);
}

/* =========================
   FORMULARIO
   ========================= */
function createFormCard(id){
  return `
    <div class="formCard" id="card-${id}">
      <div class="formHead">
        <div class="title">Formato ${id}</div>
        <div class="miniBtns">
          <button class="mini ghost" type="button" onclick="duplicatePage(${id})">Duplicar</button>
          <button class="mini danger" type="button" onclick="removePage(${id})">Eliminar</button>
        </div>
      </div>

      <label>Solicitante</label>
      <input id="in-solicitante-${id}" oninput="syncPage(${id})">

      <label>Ticket</label>
      <input id="in-ticket-${id}" oninput="syncPage(${id})">

      <label>Sistema</label>
      <select id="in-sistema-${id}" onchange="syncPage(${id})">
        <option value="E-TRANSPORTE">E-TRANSPORTE</option>
        <option value="AS400">AS400</option>
        <option value="CAD">CAD</option>
        <option value="TPAK">TPAK</option>
      </select>

      <label>Nombre</label>
      <input id="in-nombre-${id}" oninput="syncPage(${id})">

      <label>Usuario</label>
      <input id="in-usuario-${id}" oninput="syncPage(${id})">

      <label>Contraseña</label>
      <input id="in-contrasena-${id}" oninput="syncPage(${id})">
    </div>
  `;
}

/* =========================
   HOJA / DOCUMENTO
   ========================= */
function createSheet(id){
  return `
    <div class="sheet" id="sheet-${id}">
      <div class="top-title">AUTOBUSES ESTRELLA BLANCA</div>
      <div class="title-line"></div>

      <div class="meta-row">
        <div><span id="out-solicitante-${id}"></span> :</div>
        <div id="out-fecha-${id}"></div>
      </div>

      <div class="body">
        <div style="margin:12px 0">
          En relación con la solicitud del 
          <span class="bold">Ticket # <span id="out-ticket-${id}"></span></span>,
          se solicita el acceso al sistema de
          <span class="bold" id="out-sistema-${id}">E-TRANSPORTE</span>
          le proporcionamos la siguiente información:
        </div>

        <table class="table">
          <thead>
            <tr>
              <th style="width:40%">NOMBRE</th>
              <th style="width:20%">USUARIO</th>
              <th style="width:20%">CONTRASEÑA</th>
              <th style="width:20%">FIRMA</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td id="out-nombre-${id}" style="text-align:left;padding-left:8px;"></td>
              <td id="out-usuario-${id}"></td>
              <td id="out-contrasena-${id}"></td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <div>
          Al ingresar por primera vez se les desplegará una pantalla en donde deberá cambiar su contraseña por razones de seguridad.
        </div>

        <div style="margin-top:10px">
          Sin más por el momento, quedamos a sus órdenes para cualquier aclaración.
        </div>

        <div class="sign-block">
          <div>Atentamente</div><br>
          <div><b>Atención IT a Usuarios.</b></div>
          <div>Dirección de informática.</div>
        </div>

        <div class="divider"></div>

        <div class="pol-title">Políticas de Seguridad (Acceso Sistemas de Información)</div>

        <div class="pol-text">
          La información de la Empresa es uno de los activos más importantes para las operaciones diarias de la misma. Parte de la
          información es confidencial y como usuario comparte la responsabilidad de protegerla. Para contribuir a la protección de la
          información y del sistema se incorpora un conjunto de reglas de seguridad en los sistemas de información que el usuario debe seguir.
          <br><br>
          El acceso a la información contenido en los equipos informáticos se otorga o revoca de acuerdo al área de trabajo de cada persona y
          del entorno de la información que requiera. El acceso a la información en los equipos informáticos deberá ser requerido a través de un
          escrito firmado por el Gerente o Director del área. Los usuarios otorgados para el ingreso a los Sistemas de información son de uso personal,
          por lo que no debe haber razón alguna para que una persona se firme en el sistema con un usuario diferente al propio. Los usuarios deben finalizar
          su sesión cuando abandonen su estación de trabajo. El sistema desconectará en forma automática, cuando los usuarios que no utilicen su sesión durante
          un periodo de 30 minutos. Las personas que no utilicen su usuario por un periodo mayor a 30 días serán deshabilitados para ingresar al sistema, para ser
          habilitados deben solicitarlo al área de Seguridad, la cual les otorgará una contraseña nueva, previa autenticación del usuario. Las personas que no utilicen
          su usuario por un periodo mayor a 90 días serán dados de baja del sistema y para su reingreso deben solicitar el acceso como usuarios nuevos. La persona que
          haga mal uso de su usuario será sancionado con la cancelación del mismo notificando al Gerente o Director del área el motivo de la cancelación y lo que resulte.
          <br><br>
          El mal uso de los accesos que le sean otorgados para el acceso a la información personal y confidencial contenida en los sistemas de información, puede incluso
          hacerlo acreedor a un delito Federal por lo establecido en 
          <strong>La Ley Federal de Protección de Datos Personales en Posesión de los Particulares</strong>, vigente.
        </div>

        <div class="pol-title" style="margin-top:10px;">Políticas de Contraseña</div>

        <div class="pol-text">
          Todos los usuarios que ingresen por primera vez al sistema deberán cambiar su contraseña. Todos los usuarios deberán cambiar su contraseña cada 30 días.
          La longitud de la contraseña será como mínimo de 5 caracteres y como máximo de 10 caracteres. La contraseña no deberá contener dígitos adyacentes, caracteres
          repetidos consecutivamente, ni contener el carácter “@”. Al cambiar la contraseña, ésta no deberá ser igual a las últimas 32 contraseñas anteriores. Teclee
          cuidadosamente el usuario y la contraseña, si la específica incorrectamente 3 veces consecutivas el sistema inhabilitará el perfil de usuario para iniciar la sesión.
          <br><br>
          Los sistemas de información están pensados para hacer nuestro trabajo más fácil y para mejorar el rendimiento de nuestro negocio. Las Políticas de Seguridad deben ayudarle,
          si tiene alguna pregunta o sugerencia póngase en contacto con el Área de Service Desk al teléfono 5514005215 o al Área de Tecnología y Seguridad TI a los teléfonos 5514004514
        </div>

        <div class="footer-line"></div>
        <div class="footer-note">Nombre y Firma de quién autoriza.</div>
      </div>
    </div>
  `;
}

/* =========================
   FUNCIONES
   ========================= */
function addPage(prefill=null){
  pageCount++;
  const id = pageCount;

  $("forms").insertAdjacentHTML("beforeend", createFormCard(id));
  $("sheets").insertAdjacentHTML("beforeend", createSheet(id));

  $("in-sistema-"+id).value = prefill?.sistema ?? "E-TRANSPORTE";
  $("in-solicitante-"+id).value = prefill?.solicitante ?? "";
  $("in-ticket-"+id).value = prefill?.ticket ?? "";
  $("in-nombre-"+id).value = prefill?.nombre ?? "";
  $("in-usuario-"+id).value = prefill?.usuario ?? "";
  $("in-contrasena-"+id).value = prefill?.contrasena ?? "";

  syncPage(id);
}

function syncPage(id){
  $("out-solicitante-"+id).textContent = $("in-solicitante-"+id)?.value.trim() ?? "";
  $("out-ticket-"+id).textContent      = $("in-ticket-"+id)?.value.trim() ?? "";
  $("out-sistema-"+id).textContent     = $("in-sistema-"+id)?.value || "E-TRANSPORTE";
  $("out-nombre-"+id).textContent      = $("in-nombre-"+id)?.value.trim() ?? "";
  $("out-usuario-"+id).textContent     = $("in-usuario-"+id)?.value.trim() ?? "";
  $("out-contrasena-"+id).textContent  = $("in-contrasena-"+id)?.value.trim() ?? "";
  $("out-fecha-"+id).textContent       = fechaActual();
}

function removePage(id){
  $("card-"+id)?.remove();
  $("sheet-"+id)?.remove();
}

function duplicatePage(id){
  addPage({
    solicitante: $("in-solicitante-"+id)?.value ?? "",
    ticket: $("in-ticket-"+id)?.value ?? "",
    sistema: $("in-sistema-"+id)?.value ?? "E-TRANSPORTE",
    nombre: $("in-nombre-"+id)?.value ?? "",
    usuario: $("in-usuario-"+id)?.value ?? "",
    contrasena: $("in-contrasena-"+id)?.value ?? ""
  });
}

function clearAll(){
  document.querySelectorAll(".forms input").forEach(i => i.value = "");
  document.querySelectorAll(".forms select").forEach(s => s.value = "E-TRANSPORTE");
  for(let id=1; id<=pageCount; id++){
    if($("sheet-"+id)) syncPage(id);
  }
}

function printDoc(){
  for(let id=1; id<=pageCount; id++){
    if($("sheet-"+id)) syncPage(id);
  }
  window.print();
}

/* Inicial */
addPage();
