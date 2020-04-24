const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const mongoose = require('mongoose');
const ProductosExremos = require('./models/productos') 
// Conexion a la base de datos
mongoose.connect('mongodb+srv://activity1:olaola123@cluster0-yzqvz.mongodb.net/electrondb', { 
// mongoose.connect('mongodb://localhost:27017/electrondb', { 

useNewUrlParser: true, 
useUnifiedTopology: true,
autoIndex: false
})
    .then( get => {
        console.log('Base de datos conectada!')})
    .catch( err => {
        console.log(err)
    });

//crea la ventana de navegador
let win 
app.on('ready', () => {
    win = new BrowserWindow({width: 1200, height: 900, webPreferences: {nodeIntegration:true}});
    //Carga el raiz en HTML
    win.loadURL(`file://${__dirname}/routes/index.html`);

    //Abre las herramientas de desarrollo (DevTools)


    // const template = [{
    //     label: app.name,
    //     submenu: [
    //         {role: 'new-product'}
    //     ]
    // }]
    // const menu = Menu.buildFromTemplate(template);
    // Menu.setApplicationMenu(menu);
 });

app.allowRendererProcessReuse = true;

//Aqui Comienzan los procesos que dan vida a las acciones de la pagina
//Creacion de productos nuevos:
ipcMain.on('new-product', async (e, args) => {
    const newProduct = new ProductosExremos(args);
    const productoNuevo = await newProduct.save();
    console.log(productoNuevo)
    e.reply('nuevo-producto-creado', JSON.stringify(productoNuevo));//convierte el objeto de tal manera que solo se guarden los campos deseados
});
//Muestra los productos a medida que van siendo creados 
ipcMain.on('get-products', async (e, args) => {
    const showProducts = await ProductosExremos.find().limit(20); //busca todos los documentos en la coleccion productos 
    e.reply('show-products', JSON.stringify(showProducts));

});

//Elimina productos
ipcMain.on('delete-product', async (e, args) => {
    const productDeleted = await ProductosExremos.findByIdAndDelete(args);
    e.reply('producto-eliminado', JSON.stringify(productDeleted));
})

//Edita el producto segyn su id
ipcMain.on('update-product', async (e, args) => {

    const productEdited = await ProductosExremos.findByIdAndUpdate(args.idAEditar, {
        codigo: args.codigo,
        descripcion: args.descripcion,
        cantidad: args.cantidad,
        precio: args.precio },
        { new: true},
    );
    e.reply('producto-editado', JSON.stringify(productEdited));
});

//INDEX
//Busca el producto escrito en el input
ipcMain.on('search-product', async (e, arg) => {
    const searchedProduct = await ProductosExremos.find(
        {
            "$or": [
                { Codf: { '$regex': arg, '$options': 'i' } },
                { Descr: { '$regex': arg, '$options': 'i' } }
            ]
        }
        ).limit(20);
    e.reply('producto-buscado', JSON.stringify(searchedProduct));
}) 

//ADD
//Recibe el input en add.js se almacena y se envia a index.js donde el valor será procesado y devuelto
ipcMain.on('edited-qty', async (e, arg) => {
    const cantidadFinal = arg;
    win.webContents.send('colocar-cantidad', cantidadFinal);
})
//Edita la cantidad al id obtenido
ipcMain.on('update-cantidad', async (e, args) => {
    // const cantidadFinal = args.cantidadACambiar;
    const cantidadEdited = await ProductosExremos.findByIdAndUpdate(args.idAEditar,{
        Stoc: args.cantidadACambiar,
    }, 
    {new: true});
    e.reply('cantidad-editada', JSON.stringify(cantidadEdited));
});
//Almacen
//Busca el producto escrito en el input
ipcMain.on('search-product-almacen', async (e, arg) => {
    console.log(arg)
    const searchedProduct = await ProductosExremos.find(
        {
            "$or": [
                { Codf: { '$regex': arg, '$options': 'i' } },
                { Descr: { '$regex': arg, '$options': 'i' } }
            ]
        }
        ).limit(20);
    e.reply('producto-buscado', JSON.stringify(searchedProduct));
}) 