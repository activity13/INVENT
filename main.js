const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const mongoose = require('mongoose');
const Producto = require('./models/task');
const DBnoti = 
// Conexion a la base de datos
mongoose.connect('mongodb+srv://activity1:olaola123@cluster0-yzqvz.mongodb.net/electrondb', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
    .then( get => {

        console.log('Base de datos conectada!')})
    .catch( err => console.log(err));

//crea la ventana de navegador
app.on('ready', () => {
    let win = new BrowserWindow({width: 1200, height: 900, webPreferences: {nodeIntegration:true}});
    //Carga el raiz en HTML
    win.loadURL(`file://${__dirname}/routes/index.html`);

    //Abre las herramientas de desarrollo (DevTools)


//     const template = [{
//         label: app.name,
//         submenu: [
//             {role: 'new-product'}
//         ]
//     }]
//     const menu = Menu.buildFromTemplate(template);
//     Menu.setApplicationMenu(menu);
 });

app.allowRendererProcessReuse = true;

//Aqui Comienzan los procesos que dan vida a las acciones de la pagina
//Creacion de productos nuevos:
ipcMain.on('new-product', async (e, args) => {
    const newProduct = new Producto(args);
    const productoNuevo = await newProduct.save();
    console.log(productoNuevo)
    e.reply('nuevo-producto-creado', JSON.stringify(productoNuevo));//convierte el objeto de tal manera que solo se guarden los campos deseados
});
//Muestra los productos a medida que van siendo creados 
ipcMain.on('get-products', async (e, args) => {
    const showProducts = await Producto.find(); //busca todos los documentos en la coleccion productos 
    e.reply('show-products', JSON.stringify(showProducts));

});

//Elimina productos
ipcMain.on('delete-product', async (e, args) => {
    const productDeleted = await Producto.findByIdAndDelete(args);
    e.reply('producto-eliminado', JSON.stringify(productDeleted));
})

//Edita el producto segyn su id
ipcMain.on('update-product', async (e, args) => {
    console.log(args);
    const productEdited = await Producto.findByIdAndUpdate(args.idAEditar, {
        codigo: args.codigo,
        descripcion: args.descripcion,
        cantidad: args.cantidad,
        precio: args.precio },
        { new: true},
    );
    e.reply('producto-editado', JSON.stringify(productEdited));
});
//Edita la cantidad de un producto
ipcMain.on('change-qt', async (e,args) => {
    console.log(args)
})
//Busca el producto escrito en el input
ipcMain.on('search-product', async (e, arg) => {
    const searchedProduct = await Producto.find({codigo: {$regex: arg}, });
    e.reply('producto-buscado', JSON.stringify(searchedProduct));
    console.log(searchedProduct);
}) 