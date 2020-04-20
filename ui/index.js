const { ipcRenderer, remote } = require('electron');
const path = require('path');
const { BrowserWindow } = require('electron').remote;
const redirectAdd = document.getElementById('addBtn');
const vamos = document.getElementById('vamos');

//redirecciona para crear productos
redirectAdd.addEventListener('click', function(e) {
    const currentWin = remote.getCurrentWindow()
    const modalPath = path.join('file://', __dirname, 'crear.html');
    let win = new BrowserWindow({
        width: 1200, height: 900, webPreferences: {nodeIntegration:true}
    })
    win.on('close', function() { win = null});
    win.loadURL(modalPath);
    win.show();
    currentWin.close();
})




// AQUI COMIZA EL CODIGO DE INVENT //
//Notifica que la base de datos esta conectada;
const DBnoti = document.querySelector('#notiDB');


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
            <th scope="col">Cantidad</th>
            <th scope="col">Accion</th>
        </tr>
    `
}

function productRender(producto) {
    almacen.innerHTML = '';
    producto.map( t => {
        almacen.innerHTML += `
        <tr>
            <td><a class="addBtn" href="#"> ${t.codigo} </a></td>
            <td><a class="addBtn" href="#"> ${t.descripcion} </a></td>
            <td><a class="addBtn" href="#"> ${t.cantidad} </a></td>
            <td><button class="btn-success" id="vamos"></button></td>
        </tr>
        `;
    });
}

// Quiero que al hacer click en el boton generado abra una nueva pestaña
// vamos.addEventListener('click', function(e) {
//     const modalPath = path.join('file://', __dirname, 'add.html');
//     let win = new BrowserWindow({
//         width: 300, height: 100, webPreferences: {nodeIntegration:true}
//     })
//     win.on('close', function() { win = null});
//     win.loadURL(modalPath);
//     win.show();
// });

let almacenProducto = [];

//Envia el input al main para ser procesado
getCode.addEventListener('click', function(e, arg) {
        ipcRenderer.send('search-product', inputSearch.value);
});

//Recive el objeto y muestra
ipcRenderer.on('producto-buscado', (e, args) => {
    const searchedProduct = JSON.parse(args);
    almacenProducto = searchedProduct;
    renderCabecera();
    productRender(almacenProducto);
});

