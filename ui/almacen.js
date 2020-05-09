const { ipcRenderer, remote } = require('electron');
const path = require('path');
const Productos = require('../models/productos');

const getCode = document.querySelector('#getCode');
const inputSearch = document.querySelector('#inputSearch');
const cabecera = document.querySelector('#cabecera');
const almacen = document.querySelector('#almacen');

//Renderiza los prodcutos buscados 
function renderCabecera() {
    cabecera.innerHTML = `
        </tr>
            <th scope="col">Codigo</th>
            <th scope="col">Estado</th>
            <th scope="col">Descripcion</th>
            <th scope="col">Minimo Almacen</th>
            <th scope="col">Maximo Almacen</th>
            <th scope="col">Stock Market</th>
            <th scope="col">Stock Almacen</th>
            <th scope="col">Stock Total</th>
        </tr>
    `
}

function productRender(producto) {
    almacen.innerHTML = '';
    producto.map( t => {

        almacen.innerHTML += `
        <tr>
            <td><a class="addBtn" onclick="paseInfo('${t.Codf}')" href="../routes/registroMovimientos.html"> ${t.Codf} </a></td>
            <td><a href="#" id="reposicion""></a></td>
            <td><a class="addBtn" href="#"> ${t.Descr} </a></td>
            <td><a class="addBtn" href="#"> ${t.almini} </a></td>
            <td><a class="addBtn" href="#"> ${t.almaxi} </a></td>
            <td><a class="addBtn" href="#"> ${t.Market} </a></td>
            <td><a class="addBtn" href="#"> ${t.Almacen} </a></td>
            <td><a class="addBtn" href="#"> ${t.Stock} </a></td>
            <td>
            <div class="btn-group" role="group" aria-label="Button group with nested dropdown">
                <button type="button" class="btn btn-secondary" id="valorPicos" value="${t.Almacen}" onclick="Entrada('${t._id}')"><i class="material-icons">arrow_forward</i></button>
                <button type="button" class="btn btn-secondary" id="MarketValue" value="${t.Market}" onclick="Salida('${t._id}')"><i class="material-icons">arrow_back</i></button>

                <div class="btn-group" role="group">
                    <button id="btnGroupDrop1" type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >
                    <i class="material-icons">edit</i>Edicion
                    </button>
                    <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                        <button class="dropdown-item" id="valorCodf" value="${t.Codf}"href="#" onclick="editStock('${t._id}')"><i class="material-icons">account_balance</i>Total</button>
                        <button class="dropdown-item" id="valorDescr" value="${t.Descr}" onclick="editAlmacen('${t._id}')"><i class="material-icons">line_style</i>Almacen</button>
                        <button class="dropdown-item" id="valorStock" value="${t.Stock}" href="#" onclick="editMinimo('${t._id}')"><i class="material-icons">call_received</i>Minimo</button>
                        <button class="dropdown-item" href="#" onclick="editMaximo('${t._id}')" ><i class="material-icons">call_made</i>Maximo</button>
                        <button class="dropdown-item" href="#" onclick="entradaInterna('${t._id}')" ><i class="material-icons">call_missed_outgoing</i>Entrada Interna</button>

                    </div>
                </div>
            </div>
            </td>
        </tr>
        `;
    });
}

let almacenProducto = [];

//BUSCADOR

    //Envia el input al main para ser procesado
getCode.addEventListener('click', function(e, arg) {
    ipcRenderer.send('search-product-almacen', inputSearch.value);
});

    //Recive el objeto y muestra
ipcRenderer.on('producto-buscado', (e, args) => {
    const searchedProduct = JSON.parse(args);
    almacenProducto = searchedProduct;
    renderCabecera();
    productRender(almacenProducto);
});

//EDICION

let estadoEdicion = false
let idAEditar = "";
const inputEmergente = document.getElementById('emergente');

    //Actualizar Stock Total
function editStock(id) {
    estadoEdicion = true
    idAEditar = id;
    console.log(id);
    inputEmergente.innerHTML = `
        <div class="form-inline d-flex justify-content-end">
            <input autofocus class="form-control mr-sm-2" type="number" id="inputQty" placeholder="Ingrese cantidad para modificar" >
            <button class="btn btn-warning my-2 my-sm-0"  id="getQty" value="search">Editar</button>
        </div>
    `
    const getQty = document.querySelector('#getQty')
    
    getQty.addEventListener('click', e => {
        e.preventDefault()

        const inputQty = document.querySelector('#inputQty').value
        ipcRenderer.send('editar-stock-total', {idAEditar, inputQty})
    })
}
    //Actualizar Stock Almacen
function editAlmacen(id, total) {
    idAEditar = id
    inputEmergente.innerHTML = `
        <div class="form-inline d-flex justify-content-end">
            <input autofocus class="form-control mr-sm-2" type="number" id="inputQty" placeholder="Ingrese cantidad para modificar" >
            <button class="btn btn-warning my-2 my-sm-0" type="submit" id="getQty" value="search">Editar</button>
        </div>
    `
    const getQty = document.querySelector('#getQty')

    getQty.addEventListener('click', function() {
        const StockMarket = document.querySelector('#valorStock').value
        const inputQty = document.querySelector('#inputQty').value
        ipcRenderer.send('editar-almacen', {idAEditar, inputQty, StockMarket})
        console.log(inputQty)
    })
}
    //Actualiza el minimo de Almacen
function editMinimo(id) {
    idAEditar = id
    inputEmergente.innerHTML = `
        <div class="form-inline d-flex justify-content-end">
            <input autofocus class="form-control mr-sm-2" type="number" id="inputQty" placeholder="Ingrese nuevo minimo" >
            <button class="btn btn-warning my-2 my-sm-0" type="submit" id="getQty" value="search">Editar</button>
        </div>
    `
    const getQty = document.querySelector('#getQty')
    getQty.addEventListener('click', function() {
        const inputQty = document.querySelector('#inputQty').value
        ipcRenderer.send('editar-almini', {idAEditar, inputQty})
    })
}
    //Actualiza el Maximo de Almacen
function editMaximo(id) {
    idAEditar = id
    inputEmergente.innerHTML = `
        <div class="form-inline d-flex justify-content-end">
            <input autofocus class="form-control mr-sm-2" type="number" id="inputQty" placeholder="Ingrese nuevo maximo" >
            <button class="btn btn-warning my-2 my-sm-0" type="submit" id="getQty" value="search">Editar</button>
        </div>
    `
    const getQty = document.querySelector('#getQty')
    getQty.addEventListener('click', function() {
        const inputQty = document.querySelector('#inputQty').value
        ipcRenderer.send('editar-almaxi', {idAEditar, inputQty})
    })
  }
    //Salida al Market
function Salida(id) {
    idAEditar = id
    inputEmergente.innerHTML = `
        <div class="form-inline d-flex justify-content-end">
            <input autofocus class="form-control mr-sm-2" type="number" id="inputQty" placeholder="Cantidad a Sacar" >
            <button class="btn btn-warning my-2 my-sm-0" type="submit" id="getQty" value="search">Dar Salida</button>
        </div>
    `
    const getQty = document.querySelector('#getQty')
    getQty.addEventListener('click', function() {
        const valorCodf = document.querySelector('#valorCodf').value
        const valorDescr = document.querySelector('#valorDescr').value
        const valorPicos = document.querySelector('#valorPicos').value
        const MarketValue = document.querySelector('#MarketValue').value
        const inputQty = document.querySelector('#inputQty').value
        const valorStock = document.querySelector('#valorStock').value
        ipcRenderer.send('salida', {idAEditar, inputQty, valorCodf, valorDescr, valorPicos, valorStock, MarketValue})
    })
}
    //Entrada por despacho
function Entrada(id) {
    idAEditar = id
    inputEmergente.innerHTML = `
        <div class="form-inline d-flex justify-content-end">
            <input autofocus class="form-control mr-sm-2" type="number" id="inputQty" placeholder="Cantidad a Ingresar" >
            <button class="btn btn-warning my-2 my-sm-0" type="submit" id="getQty" value="search">Dar Entrada</button>
        </div>
    `
    const getQty = document.querySelector('#getQty')
    getQty.addEventListener('click', function() {
        const valorCodf = document.querySelector('#valorCodf').value
        const valorDescr = document.querySelector('#valorDescr').value
        const valorPicos = document.querySelector('#valorPicos').value
        const valorMarket = document.querySelector('#MarketValue').value
        const valorStock = document.querySelector('#valorStock').value
        const inputQty = document.querySelector('#inputQty').value

        ipcRenderer.send('entrada', { idAEditar, inputQty, valorCodf, valorDescr, valorPicos, valorStock, valorMarket})
    })
}
    //Entrada Interna
    function entradaInterna(id) {
        idAEditar = id
        inputEmergente.innerHTML = `
            <div class="form-inline d-flex justify-content-end">
                <input autofocus class="form-control mr-sm-2" type="number" id="inputQty" placeholder="Cantidad a Ingresar" >
                <button class="btn btn-warning my-2 my-sm-0" type="submit" id="getQty" value="search">Dar Entrada</button>
            </div>
        `
        const getQty = document.querySelector('#getQty')
        getQty.addEventListener('click', function() {
            const valorCodf = document.querySelector('#valorCodf').value
            const valorDescr = document.querySelector('#valorDescr').value
            const valorPicos = document.querySelector('#valorPicos').value
            const valorMarket = document.querySelector('#MarketValue').value
            const valorStock = document.querySelector('#valorStock').value
            const inputQty = document.querySelector('#inputQty').value
    
            ipcRenderer.send('entrada-interna', { idAEditar, inputQty, valorCodf, valorDescr, valorPicos, valorStock, valorMarket})
        })
    }

function paseInfo(codigo) {
    const paseCodigo = codigo
    const valorStock = document.querySelector('#valorStock').value
    ipcRenderer.send('pase-de-info', { paseCodigo, valorStock, })
}

ipcRenderer.send('buscar-pedido')

//RECIBEN Y ACTUALIZAN
ipcRenderer.on('stock-editado', (e, args) => {
    const StockEditado = JSON.parse(args)
    almacenProducto = almacenProducto.map((t, i) => {
        if(t._id === StockEditado._id) {
            t.Codf = StockEditado.Codf
            t.Descr = StockEditado.Descr
            t.almini = StockEditado.almini
            t.almaxi = StockEditado.almaxi
            t.Market = StockEditado.Market
            t.Almacen = StockEditado.Almacen
            t.Stock = StockEditado.Stock
        }
        inputEmergente.innerHTML = ``
        return t
    })
    productRender(almacenProducto)
    console.log(almacenProducto)
})
