const { ipcRenderer, remote } = require('electron');
const path = require('path');

//Declarar containers
const crearCaja = document.getElementById('btnCrearCaja')
const inputNuevaCaja = document.getElementById('inputNuevaCaja');
const infoCaja = document.getElementById('chInfo');
const cajaSelector = document.getElementById('cajas_selector')

crearCaja.addEventListener('click', function() {
    inputNuevaCaja.innerHTML = `
    <form class="form-inline">
        <input id="paseResp"   class="form-control mr-sm-2" type="search"  placeholder="Ingrese responsable de Caja" autofocus>
        <input id="paseMontoI" class="form-control mr-sm-2" type="search"  placeholder="Ingrese monto">
        <button id="pasarValores" type="submit" class="btn btn-primary mb-2"><i class="small material-icons">save</i>Crear</button>
    </form>
    `
    const pasarValores = document.querySelector('#pasarValores')
    
    pasarValores.addEventListener('click', function() {
        const responsable = document.querySelector('#paseResp').value
        const montoInit = document.querySelector('#paseMontoI').value
        
        inputNuevaCaja.innerHTML = ``
        ipcRenderer.send('pase-nueva-caja', {responsable, montoInit})
    })
})
function renderLista(lista) {
    cajaSelector.innerHTML = '';
    lista.map( t => {
        cajaSelector.innerHTML += `
        <button type="button" onclick="renderizarCaja('${t._id}')" class="list-group-item list-group-item-action">${t.Creacion.fechaInit}</button>
        `;
    });
}
function renderInfoCaja(info) {
    infoCaja.innerHTML = '';
    info.map( t => {
        infoCaja.innerHTML = `
        <h1>Hola</h1>
        `;
    });
}
let listaCajas = []
let idAMostrar = ''
ipcRenderer.send('get-list')

ipcRenderer.on('caja-creada', (e, args) => {
    const listShowed = JSON.parse(args);
    listaCajas = listShowed;
    window.location.reload()
}); 

ipcRenderer.on('show-list', (e, args) => {
    const listaMostrada = JSON.parse(args);
    listaCajas = listaMostrada;
    renderLista(listaCajas);
});

function renderizarCaja(id) {
    idAMostrar = id
    ipcRenderer.send('caja-elegida', {idAMostrar})
}
let almacenInfo = []
ipcRenderer.on('envio-info', (e, args) => {
    const infoCaja = JSON.parse(args)
    const arryInfo = Array.from(infoCaja)
    console.log(arryInfo)
    renderInfoCaja(arryInfo)
})