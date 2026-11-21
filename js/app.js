"use strict";
// Demostración pública, enteramente local y con datos ficticios.
// No usa fetch(), Supabase, backend, almacenamiento ni ninguna API externa.
const ejemplos = [
  {documento:"DEMO-001",nombre:"Ana Ejemplo",programa:"Análisis y Desarrollo de Software",ficha:"FICHA-001",beneficio:"Alimentación"},
  {documento:"DEMO-002",nombre:"Carlos Muestra",programa:"Gestión Administrativa",ficha:"FICHA-002",beneficio:"Transporte"},
  {documento:"DEMO-003",nombre:"Laura Prueba",programa:"Análisis y Desarrollo de Software",ficha:"FICHA-001",beneficio:"Sin beneficio"},
  {documento:"DEMO-004",nombre:"Miguel Ficticio",programa:"Contabilidad y Finanzas",ficha:"FICHA-003",beneficio:"Sostenimiento"}
];
let aprendices = ejemplos.map(a=>({...a}));
let documentoEnEdicion = null;
let documentoPendienteEliminar = null;
const $ = id => document.getElementById(id);
const campos = ["documento","nombre","programa","ficha","beneficio"];

function estado(texto,error=false){
  $("estadoSistema").textContent=texto;
  $("estadoSistema").className=error?"error":"";
}
function crearBoton(texto,clase,accion){
  const b=document.createElement("button");
  b.type="button";
  b.textContent=texto;
  b.className=clase;
  b.addEventListener("click",accion);
  return b;
}
function mostrarAprendices(lista){
  const tbody=$("tablaAprendices");
  tbody.replaceChildren();
  if(!lista.length){
    const tr=document.createElement("tr"),td=document.createElement("td");
    td.colSpan=6;td.textContent="No se encontraron aprendices ficticios.";
    tr.appendChild(td);tbody.appendChild(tr);return;
  }
  lista.forEach(a=>{
    const tr=document.createElement("tr");
    campos.forEach(c=>{
      const td=document.createElement("td");
      td.textContent=a[c];
      tr.appendChild(td);
    });
    const td=document.createElement("td");
    const acciones=document.createElement("div");
    acciones.className="acciones";
    acciones.append(
      crearBoton("Ver detalles","btn-ver",()=>verDetalles(a.documento)),
      crearBoton("Editar","btn-editar",()=>editarAprendiz(a.documento)),
      crearBoton("Eliminar","btn-eliminar",()=>solicitarEliminar(a.documento))
    );
    td.appendChild(acciones);tr.appendChild(td);tbody.appendChild(tr);
  });
}
function estadisticas(){
  $("totalAprendices").textContent=aprendices.length;
  $("totalBeneficiados").textContent=aprendices.filter(a=>a.beneficio!=="Sin beneficio").length;
  $("totalProgramas").textContent=new Set(aprendices.map(a=>a.programa)).size;
}
function filtrar(){
  const q=$("buscarAprendiz").value.toLocaleLowerCase("es").trim();
  mostrarAprendices(aprendices.filter(a=>
    ["documento","nombre","programa","ficha"].some(c=>a[c].toLocaleLowerCase("es").includes(q))
  ));
}
function actualizar(){filtrar();estadisticas()}
$("buscarAprendiz").addEventListener("input",filtrar);
function abrirRegistro(){
  documentoEnEdicion=null;
  $("formRegistro").reset();
  $("tituloFormulario").textContent="Registrar aprendiz (demo)";
  $("btnGuardar").textContent="Guardar simulación";
  $("mensajeFormulario").textContent="";
  $("modalRegistro").classList.remove("oculto");
  $("documento").focus();
}
function cerrarRegistro(){
  $("modalRegistro").classList.add("oculto");
  $("formRegistro").reset();
  $("mensajeFormulario").textContent="";
  documentoEnEdicion=null;
}
$("btnRegistrar").addEventListener("click",abrirRegistro);
$("cerrarModal").addEventListener("click",cerrarRegistro);
$("cancelarRegistro").addEventListener("click",cerrarRegistro);

function buscar(documento){return aprendices.find(a=>a.documento===documento)}
function editarAprendiz(documento){
  const a=buscar(documento);
  if(!a){estado("Aprendiz ficticio no encontrado.",true);return}
  documentoEnEdicion=documento;
  campos.forEach(c=>$(c).value=a[c]);
  $("tituloFormulario").textContent="Editar aprendiz (demo)";
  $("btnGuardar").textContent="Guardar cambios simulados";
  $("mensajeFormulario").textContent="";
  $("modalRegistro").classList.remove("oculto");
  $("nombre").focus();
}
$("formRegistro").addEventListener("submit",e=>{
  e.preventDefault();
  const datos=Object.fromEntries(campos.map(c=>[c,$(c).value.trim()]));
  const mensaje=$("mensajeFormulario");
  if(Object.values(datos).some(v=>!v)){mensaje.textContent="Completa todos los campos.";return}
  if(aprendices.some(a=>a.documento===datos.documento && a.documento!==documentoEnEdicion)){
    mensaje.textContent="Ese documento ficticio ya existe.";return;
  }
  const editando=documentoEnEdicion!==null;
  if(editando){
    const i=aprendices.findIndex(a=>a.documento===documentoEnEdicion);
    if(i===-1){mensaje.textContent="Aprendiz no encontrado.";return}
    aprendices[i]=datos;
  }else{aprendices.push(datos)}
  $("buscarAprendiz").value="";
  actualizar();cerrarRegistro();
  estado(editando?"Edición simulada. No se modificó ninguna base de datos.":"Registro simulado. No se modificó ninguna base de datos.");
});
function verDetalles(documento){
  const a=buscar(documento);
  if(!a){estado("Aprendiz ficticio no encontrado.",true);return}
  campos.forEach(c=>{$("detalle"+c[0].toUpperCase()+c.slice(1)).textContent=a[c]});
  $("modalDetalles").classList.remove("oculto");
  $("cerrarDetalles").focus();
}
function cerrarDetalles(){$("modalDetalles").classList.add("oculto")}
$("cerrarDetalles").addEventListener("click",cerrarDetalles);
$("btnCerrarDetalles").addEventListener("click",cerrarDetalles);
function solicitarEliminar(documento){
  const a=buscar(documento);
  if(!a){estado("Aprendiz ficticio no encontrado.",true);return}
  documentoPendienteEliminar=documento;
  $("nombreEliminar").textContent=a.nombre;
  $("modalEliminar").classList.remove("oculto");
  $("cancelarEliminar").focus();
}
function cerrarEliminar(){
  documentoPendienteEliminar=null;
  $("modalEliminar").classList.add("oculto");
}
$("cancelarEliminar").addEventListener("click",cerrarEliminar);
$("confirmarEliminar").addEventListener("click",()=>{
  if(documentoPendienteEliminar===null)return;
  aprendices=aprendices.filter(a=>a.documento!==documentoPendienteEliminar);
  actualizar();cerrarEliminar();
  estado("Eliminación simulada. No se modificó ninguna base de datos.");
});
actualizar();
estado("4 registros ficticios cargados. Los cambios se reinician al actualizar la página.");
