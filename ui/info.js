const { ipcRenderer, remote } = require('electron');
const path = require('path');

//Declaracion de ID de registroMovimientos.html
const codigo = document.getElementById('codigo')
const infoGeneral = document.getElementById('infoGeneral')
const stockActual = document.getElementById('stockActual')
const cabecera = document.getElementById('cabecera')
const almacen = document.getElementById('almacen')

function infoRender(code) {
    code.map(t => {
        codigo.innerHTML = `<h1>${t.Codf}<h1>`
        infoGeneral.innerHTML = `<h3>${t.Descr}<h3>`
        stockActual.innerHTML = `<h1>${t.Stock}<h1>`
    })
}


//RENDERIZACION DE TABLA
    //Esquema de renderizacion de cabecera
function renderCabecera() {
    cabecera.innerHTML = `
        </tr>
            <th scope="col">Fecha</th>
            <th scope="col">Cantidad</th>
            <th scope="col">Categoria</th>
            <th scope="col">Stock en Almacen</th>
            <th scope="col">Stock al cambio</th>
        </tr>
    `
}
function renderMoves(info) {
    info.map(t => {
        almacen.innerHTML += `
        <tr>
            <td><a class="addBtn" href="#"> ${t.fecha} </a></td>
            <td><a class="addBtn" href="#"> ${t.Cantidad} </a></td>
            <td><a class="addBtn" href="#"> ${t.Tipo} </a></td>
            <td><a class="addBtn" href="#"> ${t.Almacen} </a></td>
            <td><a class="addBtn" href="#"> ${t.Stock_Final} </a></td>
        </tr>
        `
    })
}

renderCabecera()

ipcRenderer.on('info-product', (e, args) => {
    const productoInformado = JSON.parse(args)
    infoRender(productoInformado)
    renderMoves(productoInformado)
})