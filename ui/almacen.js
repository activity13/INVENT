const { ipcRenderer, remote } = require('electron');
const path = require('path');

//const
const getCode = document.querySelector('#getCode');
const inputSearch = document.querySelector('#inputSearch');
const cabecera = document.querySelector('#cabecera');
const almacen = document.querySelector('#almacen');

//Renderiza los prodcutos buscados 
function renderCabecera() {
    cabecera.innerHTML = `
        </tr>
            <th scope="col">Codigo</th>
            <th scope="col">Descripcion</th>
            <th scope="col">Stock Almacen</th>
            <th scope="col">Minimo Almacen</th>
            <th scope="col">Maximo Almacen</th>
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
            <td><a class="addBtn" href="#"> ${t.Codf} </a></td>
            <td><a class="addBtn" href="#"> ${t.Descr} </a></td>
            <td><a class="addBtn" href="#"> ${t.Almacen} </a></td>
            <td><a class="addBtn" href="#"> ${t.almini} </a></td>
            <td><a class="addBtn" href="#"> ${t.almaxi} </a></td>
            <td><a class="addBtn" href="#"> ${t.Market} </a></td>
            <td><a class="addBtn" href="#"> ${t.Stock} </a></td>
            <td>
            <div class="btn-group" role="group" aria-label="Button group with nested dropdown">
                <button type="button" class="btn btn-secondary"><i class="material-icons">arrow_forward</i></button>
                <button type="button" class="btn btn-secondary"><i class="material-icons">arrow_back</i></button>

                <div class="btn-group" role="group">
                    <button id="btnGroupDrop1" type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="material-icons">edit</i>Edicion
                    </button>
                    <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                    <a class="dropdown-item" href="#"><i class="material-icons">account_balance</i>Total</a>
                    <a class="dropdown-item" href="#"><i class="material-icons">line_style</i>Almacen</a>
                    <a class="dropdown-item" href="#"><i class="material-icons">call_received</i>Minimo</a>
                    <a class="dropdown-item" href="#"><i class="material-icons">call_made</i>Maximo</a>


                    </div>
                </div>
            </div>
            </td>
        </tr>
        `;
    });
}

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
