const { ipcRenderer, remote } = require('electron');
const path = require('path');
const { BrowserWindow } = require('electron').remote;
const redirectAdd = document.getElementById('addBtn');
const vamos = document.querySelector('#vamos');
const almacenRed = document.getElementById('alBtn')

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
});
// Quiero que al hacer click en el boton generado abra una nueva pestaña






// AQUI COMIZA EL CODIGO DE INVENT //
//Notifica que la base de datos esta conectada;
const DBnoti = document.querySelector('#notiDB');


//const
const getCode = document.querySelector('#getCode');
const inputSearch = document.querySelector('#inputSearch');
const cabecera = document.querySelector('#cabecera');
const almacen = document.querySelector('#almacen');

let estadoEdicion = false;
let idAEditar = "";
let cantidadACambiar = []

function editQU(id) {
    ipcRenderer.on('colocar-cantidad', function(e, arg) {
        cantidadACambiar = Number(arg);
        estadoEdicion = true;
        idAEditar = id;
        ipcRenderer.send("update-cantidad", { idAEditar, cantidadACambiar });
    })
}

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
            <td><a class="addBtn" href="#"> ${t._id} </a></td>
            <td><a class="addBtn" href="#"> ${t.codigo} </a></td>
            <td><a class="addBtn" href="#"> ${t.descripcion} </a></td>
            <td><a class="addBtn" href="#"> ${t.cantidad} </a></td>
            <td><button class="btn-success" onclick="hazTodo('${t._id}')" id="vamos"><i class="large material-icons">add_circle_outline</i></button></td>
        </tr>
        `;
    });
}
//Abre la ventana para editar la cantidad de un articulo
function addRec() {
    const modalPath = path.join('file://', __dirname, 'add.html');
    let win = new BrowserWindow({
        width: 300, height: 200, frame: false, alwaysOnTop: true, webPreferences: {nodeIntegration:true}
    })
    win.on('close', function() { win = null});
    win.loadURL(modalPath);
    win.show();
}
function hazTodo(id) {
    addRec();
    editQU(id);
}
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

//edicion de articluos 


