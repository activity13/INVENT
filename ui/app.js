const { ipcRenderer, remote } = require('electron');
const path = require('path');

const taskForm = document.querySelector('#addForm');
const tagCodigo = document.querySelector('#tagCodigo');
const tagDescripcion = document.querySelector('#tagDescripcion');
const tagCantidad = document.querySelector('#tagCantidad');
const tagPrecio = document.querySelector('#tagPrecio');
const lista = document.querySelector('#lista');
const alerta = document.querySelector('#alerta');



// crea la notificacion de al crearse un nuevo producto
function alertaCreado() {
    alerta.innerHTML = `
    <div class="alert alert-success alert-dismissible fade show" role="alert">
    <strong>¡Producto Creado!</strong> El producto fue registrado satisfactoriamente.
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
    </div>
    `;
}
// crea la notificacion  al eliminarse un  producto
function alertaEliminado() {
    alerta.innerHTML = `
    <div class="alert alert-success alert-dismissible fade show text-center" role="alert">
    <strong>¡Producto Eliminado!</strong> El producto fue eliminado satisfactoriamente.
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
    </div>
    `;
}
// crea la notificacion al editarse un producto
function alertaEditado() {
    alerta.innerHTML = `
    <div class="alert alert-success alert-dismissible fade show" role="alert">
    <strong>¡Producto Modificado!</strong> El producto fue modificado satisfactoriamente.
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
    </div>
    `;
}

let estadoEdicion = false;
let idAEditar = "";

//Funcion que manda la accion de eliminar al main  
function eliminarProducto(id) {
    ipcRenderer.send('delete-product', id);
}

//Funcion para editar productos
function editProduct(id) {
    estadoEdicion = true;
    idAEditar = id;
    const editar = listaProductos.find( editar => editar._id === id);
    tagCodigo.value = editar.codigo;
    tagDescripcion.value = editar.descripcion;
    tagCantidad.value = editar.cantidad;
    tagPrecio.value = editar.precio;
    }

//Funcion para Renderizar el producto creado
function productRender(producto) {
    lista.innerHTML = '';
    producto.map( t => {
        lista.innerHTML += `
        <tr>
            <td> ${t.codigo} </td>
            <td> ${t.descripcion} </td>
            <td> ${t.cantidad} </td>
            <td> ${t.precio} </td>
            <td>
                <button onclick="editProduct('${t._id}')" class="btn-warning">Editar</button>
                <button onclick="eliminarProducto('${t._id}')" class="btn-danger" type="submit">Eliminar</button>
            </td>
        </tr>
        `;
    });
}

let listaProductos = [];

ipcRenderer.send('get-products'); //envia los datos en app.js linea 43

taskForm.addEventListener('submit', e => {
    e.preventDefault();

    const product = {
        codigo: tagCodigo.value,
        descripcion: tagDescripcion.value,
        cantidad: tagCantidad.value,
        precio: tagPrecio.value
    }
    console.log(estadoEdicion);
    if (!estadoEdicion) {
        ipcRenderer.send("new-product", product);
      } else {
        ipcRenderer.send("update-product", { ...product, idAEditar });
      }
    
      taskForm.reset();
    });

//Renderiza los productos
ipcRenderer.on('nuevo-producto-creado', (e, args) => {
    console.log(args)
    const productSaved = JSON.parse(args)
    listaProductos.push(productSaved);
    productRender(listaProductos);
    alertaCreado();
});


ipcRenderer.on('show-products', (e, args) => {
    const productShowed = JSON.parse(args);
    listaProductos = productShowed;
    productRender(listaProductos);
}); //recibe los dotos en la linea 46

//renderiza los productos eliminados 
ipcRenderer.on('producto-eliminado', (e, args) => {
    const productDeleted = JSON.parse(args);
    const productosEliminados = listaProductos.filter(t => {
        return t._id !== productDeleted._id;
    });
    listaProductos = productosEliminados;
    productRender(listaProductos);
    alertaEliminado();
})

//Renderiza el prodcuto actualizado
ipcRenderer.on('producto-editado', (e, args) => {
    estadoEdicion = false;
    const productEdited = JSON.parse(args);
    listaProductos = listaProductos.map((t, i) => {
        if(t._id === productEdited._id) {
            t.codigo = productEdited.codigo;
            t.descripcion = productEdited.descripcion;
            t.cantidad = productEdited.cantidad;
            t.precio = productEdited.precio;
        }
        return t;
    });
    alertaEditado();
    console.log(listaProductos)
    productRender(listaProductos);
})