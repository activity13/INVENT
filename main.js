const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const mongoose = require('mongoose');
const ProductosExremos = require('./models/productos') 
const movimintosExtremos = require('./models/task')
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
        err.send('error-db', Error)
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


//BUSCADORES
    //Busca el producto escrito en el input en INDEX
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
    //Busca el producto escrito en el input en ALMACEN
ipcMain.on('search-product-almacen', async (e, arg) => {
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


//Recepciones 
    //INDEX
    //Recibe el input en add.js se almacena y se envia a index.js donde el valor será procesado y devuelto
ipcMain.on('edited-qty', async (e, arg) => {
    const cantidadFinal = arg;
    win.webContents.send('colocar-cantidad', cantidadFinal);
})
    //ALMACEN
    //Recibe el valor para restar cambiar el stock minimo
//ACCIONES 
    //CREAR
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
        //CREAR
        //Elimina productos en CREAR
    ipcMain.on('delete-product', async (e, args) => {
        const productDeleted = await ProductosExremos.findByIdAndDelete(args);
        e.reply('producto-eliminado', JSON.stringify(productDeleted));
    })
        //CREAR
        //Edita el producto segyn su id en CREAR
    ipcMain.on('update-product', async (e, args) => {
    
        const productEdited = await ProductosExremos.findByIdAndUpdate(args.idAEditar, {
            Codf: args.Codf,
            Descr: args.Descr,
            Pcns: args.Pcns,
            Pvns: args.Pvns,
            Stock: args.Stock 
        },
            { new: true},
        );
        e.reply('producto-editado', JSON.stringify(productEdited));
    });
    //INDEX
    //Edita la Stock Total al id obtenido
ipcMain.on('update-cantidad', async (e, args) => {
    const cantidadEdited = await ProductosExremos.findByIdAndUpdate(args.idAEditar, {
        Stock: args.cantidadACambiar,
    }, 
    {new: true});
    e.reply('cantidad-editada', JSON.stringify(cantidadEdited));
});
    //ALMACEN
    //Edita el sotck total del id
ipcMain.on('editar-stock-total', async (e, arg) => {
    const stockEditado = await ProductosExremos.findByIdAndUpdate(arg.idAEditar, {
        Stock: arg.inputQty,
    }, {new: true})
    e.reply('stock-editado', JSON.stringify(stockEditado));
})

    //edita el stock de Almacen y de paso el de Market restando total y almacen
ipcMain.on('editar-almacen', async (e, arg) => {
    const sotckAlmacen = await ProductosExremos.findByIdAndUpdate(arg.idAEditar, {
        Almacen: arg.inputQty,
        Market: arg.StockMarket - arg.inputQty
    }, {new: true})
    console.log(sotckAlmacen)
    e.reply('stock-editado', JSON.stringify(sotckAlmacen));
})
ipcMain.on('editar-almini', async (e, arg) =>  {
    const minimoAlmacen = await ProductosExremos.findByIdAndUpdate(arg.idAEditar, {
        almini: arg.inputQty
    }, {new: true})
    console.log(minimoAlmacen)
    e.reply('stock-editado', JSON.stringify(minimoAlmacen));
})
ipcMain.on('editar-almaxi', async (e, arg) =>  {
    const minimoAlmacen = await ProductosExremos.findByIdAndUpdate(arg.idAEditar, {
        almaxi: arg.inputQty
    }, {new: true})
    console.log(minimoAlmacen)
    e.reply('stock-editado', JSON.stringify(minimoAlmacen));
})
ipcMain.on('salida', async (e, arg) =>  {
    const salidaAlmacen = await ProductosExremos.findByIdAndUpdate(arg.idAEditar, {
        Almacen: arg.valorPicos - arg.inputQty,
        Market: Number(arg.inputQty) + Number(arg.MarketValue)
    }, {new: true})
     //Se define un objeto llamado nuevoRegistro => se define el almacen de dicho objeto entradaRegistro => se guarda con registroHecho
     const nuevoRegistro = {
        Codf: arg.valorCodf,
        Descr: arg.valorDescr,
        Tipo: 'Salida a Market',
        Stock: Number(arg.valorStock) - Number(arg.inputQty),
        Almacen: Number(arg.valorPicos) - Number(arg.inputQty),
        Market: Number(arg.MarketValue) + Number(arg.inputQty),
        Cantidad: '+' + arg.inputQty,
        fecha: new Date
    }
    const entradaRegistro = new movimintosExtremos(nuevoRegistro)
    const registroHecho = await entradaRegistro.save()
    console.log(registroHecho)
    console.log('movimiento almacenado!')
    e.reply('stock-editado', JSON.stringify(salidaAlmacen));
})
ipcMain.on('entrada', async (e, arg) =>  {
    const entradaAlmacen = await ProductosExremos.findByIdAndUpdate(arg.idAEditar, {
        Almacen: Number(arg.valorPicos) + Number(arg.inputQty),
        Stock: Number(arg.inputQty) + Number(arg.valorStock)
    }, {new: true})
    //Se define un objeto llamado nuevoRegistro => se define el almacen de dicho objeto entradaRegistro => se guarda con registroHecho
    const nuevoRegistro = {
        Codf: arg.valorCodf,
        Descr: arg.valorDescr,
        Tipo: 'Entrada por Despacho',
        Stock: arg.valorStock,
        Almacen: Number(arg.valorPicos) + Number(arg.inputQty),
        Market: Number(arg.valorMarket),
        Cantidad: '+' + arg.inputQty,
        fecha: new Date
    }
    const entradaRegistro = new movimintosExtremos(nuevoRegistro)
    const registroHecho = await entradaRegistro.save()
    console.log(registroHecho)
    console.log('movimiento almacenado!')
    e.reply('stock-editado', JSON.stringify(entradaAlmacen));
})
ipcMain.on('entrada-interna', async (e, arg) =>  {
    const entradaAlmacen = await ProductosExremos.findByIdAndUpdate(arg.idAEditar, {
        Almacen: Number(arg.valorPicos) + Number(arg.inputQty),
        Market: Number(arg.MarketValue) - Number(arg.inputQty),
    }, {new: true})
    e.reply('stock-editado', JSON.stringify(entradaAlmacen));
})
//REGISTRO_D_E_MOVIMIENTOS
    //recibo de info
    ipcMain.on('pase-de-info', async (e, args) => {
        const infoProducts = await movimintosExtremos.find({Codf: args.paseCodigo})
        e.reply('info-product', JSON.stringify(infoProducts))
        console.log(infoProducts)
    })