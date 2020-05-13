// const { ipcRenderer, remote } = require('electron');
// const path = require('path');

// // AQUI COMIZA EL CODIGO DE INVENT //

// //Declarando receptores y emisores
// const crearPedido = document.getElementById('crearPedido')
// const busqueda = document.getElementById('busqueda')

// const cabecera = document.querySelector('#cabecera');
// const almacen = document.querySelector('#almacen');

// //Renderiza los productos buscados 
// function renderCabecera() {
//     cabecera.innerHTML = `
//         </tr>
//             <th scope="col">Codigo</th>
//             <th scope="col">Descripcion</th>
//             <th scope="col">Cantidad</th>
//             <th scope="col">Tipo</th>
//         </tr>
//     `
// }

// function productRender(producto) {
//     almacen.innerHTML = '';
//     producto.map( t => {
//         almacen.innerHTML += `
//         <tr>
//             <td><a class="addBtn" href="#"> ${t.Codf} </a></td>
//             <td><a class="addBtn" href="#"> ${t.Descr} </a></td>
//             <td><a class="addBtn" href="#"> ${t.Market} </a></td>
//             <td><a class="addBtn" data-toggle="tooltip" data-placement="top" title="C. Minima Almacen:${t.almini}">${t.mamini}</a></td>
//             <td><a class="addBtn" data-toggle="tooltip" data-placement="top" title="C. Maxima almacen:${t.almaxi}">${t.mamaxi}</a></td>
//             <td><a class="addBtn" href="#"> ${t.Almacen} </a></td>
//             <td><a class="addBtn" href="#">${t.Stock}</a></td>
//         </tr>
//         `;
//     });
// }

// crearPedido.addEventListener('click', function() {
//     busqueda.innerHTML = `
//         <input class="form-control mr-sm-2" type="search" name="search" aria-label="Search" id="inputSearch"  placeholder="Buscar por codigo" >
//         <button class="btn btn-outline-success my-2 my-sm-0"  id="getCode" type="submit" value="search">Buscar</button>
//         <button class="btn btn-danger my-2 my-sm-0"  id="deletePedido" type="submit" value="search">Cancelar</button>
//     `
//     const getCode = document.querySelector('#getCode');
//     const inputSearch = document.querySelector('#inputSearch');
    
//     let almacenProducto = []

//     //Envia el input al main para ser procesado
//     getCode.addEventListener('click', function(e, arg) {
//         ipcRenderer.send('search-product-index', inputSearch.value);
//     });

//     //Recibe el objeto y muestra
//     ipcRenderer.on('producto-buscado', (e, args) => {
//         const searchedProduct = JSON.parse(args);
//         almacenProducto = searchedProduct;
//         renderCabecera();
//         productRender(almacenProducto);
//     });
// })








