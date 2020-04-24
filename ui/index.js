const { ipcRenderer, remote } = require('electron');
const path = require('path');
const { BrowserWindow } = require('electron').remote;
const redirectAdd = document.getElementById('addBtn');
const vamos = document.querySelector('#vamos');
const alerta = document.querySelector('#notifications');

//Notificaciones
function alerta0() {
    alerta.innerHTML = `
    <div class="alert alert-danger alert-dismissible fade show text-center" role="alert">
    <strong>Error0 </strong> Cantidad mínima 1
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
    </div>
    `;
}
function alerta1() {
    alerta.innerHTML = `
    <div class="alert alert-success alert-dismissible fade show text-center" role="alert">
    <strong>Stock Actualizado!</strong>
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
    </div>
    `;
}

// AQUI COMIZA EL CODIGO DE INVENT //
let almacenProducto = [];
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
            <th scope="col">Cambiar</th>
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
            <td><button class="btn-success" onclick="hazTodo('${t._id}')" id="vamos"><i class="large material-icons">add_circle_outline</i></button></td>
        </tr>
        `;
    });
}
//Cumple varias funciones una es renderizar la ventana de cambiar cantidad y la otra envia la informacion como el id
let estadoEdicion = false;
let idAEditar = "";
let cantidadACambiar = []

// recibe el id en addRec() y pasa a variable y es enviado a 
function editQU(id) {
    ipcRenderer.on('colocar-cantidad', function(e, arg) {
        console.log(arg);
        cantidadACambiar = Number(arg);
        estadoEdicion = true;
        idAEditar = id;
        if(cantidadACambiar >= 1) {
            ipcRenderer.send("update-cantidad", { idAEditar, cantidadACambiar });
            alerta1();
        } else {
            alerta0();
        }
    })
}

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
//recibe y renderiza el objeto actualizado
ipcRenderer.on('cantidad-editada', (e, args) => {
    estadoEdicion = false;
    const cantidadEdit = JSON.parse(args);
    almacenProducto = almacenProducto.map((t, i) => {
        if(t._id === cantidadEdit._id) {
            t.codigo = cantidadEdit.codigo;
            t.descripcion = cantidadEdit.descripcion;
            t.cantidad = cantidadEdit.cantidad;
            t.precio = cantidadEdit.precio;
        }
        return t;
    });
    console.log(almacenProducto)
    productRender(almacenProducto)
})



