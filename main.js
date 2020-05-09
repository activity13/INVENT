const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const mongoose = require('mongoose');
const ProductosExremos = require('./models/productos') 
const movimintosExtremos = require('./models/task')
const cajaSchema = require('./models/caja_chica')
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
        const errordb = true
        err.send('error-db', errordb)
    });

//crea la ventana de navegador
let win 
app.on('ready', () => {
    win = new BrowserWindow({width: 1200, height: 900, webPreferences: {nodeIntegration:true}});
    //Carga el raiz en HTML
    win.loadURL(`file://${__dirname}/routes/index.html`);
 });

app.allowRendererProcessReuse = true;

//Aqui Comienzan los procesos que dan vida a las acciones de la pagina
//BUSCADORES
    //Busca el producto escrito en el input en INDEX
ipcMain.on('search-product-index', async (e, arg) => {
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

    //ALMACEN
    //Edita el stock total del id Esta es una opcion solo para desarrollo
ipcMain.on('editar-stock-total', async (e, arg) => {
    if(arg.inputQty >= 1) {
        const stockEditado = await ProductosExremos.findByIdAndUpdate(arg.idAEditar, {
            Stock: arg.inputQty,
        }, {new: true})
        console.log('Stock total editado correctamente!')
        e.reply('stock-editado', JSON.stringify(stockEditado));
    } else {
        const stockEditado = await ProductosExremos.findByIdAndUpdate(arg.idAEditar, {
            Stock: arg.inputQty,
            Almacen: 0,
            Market: 0            
        }, {new: true})
        console.log('Stock total editado correctamente!')
        e.reply('stock-editado', JSON.stringify(stockEditado));
    }
})

    //edita el stock de Almacen y de paso el de Market restando total y almacen
ipcMain.on('editar-almacen', async (e, arg) => {
    const sotckAlmacen = await ProductosExremos.findByIdAndUpdate(arg.idAEditar, {
        Almacen: arg.inputQty,
        Market: arg.StockMarket - arg.inputQty
    }, {new: true})
    console.log('Stock Almacen editado correctamente!')
    e.reply('stock-editado', JSON.stringify(sotckAlmacen));
})
ipcMain.on('editar-almini', async (e, arg) =>  {
    const minimoAlmacen = await ProductosExremos.findByIdAndUpdate(arg.idAEditar, {
        almini: arg.inputQty
    }, {new: true})
    console.log('Minimo de Almacen editado correctamente!')
    e.reply('stock-editado', JSON.stringify(minimoAlmacen));
})
ipcMain.on('editar-almaxi', async (e, arg) =>  {
    const maximoAlmacen = await ProductosExremos.findByIdAndUpdate(arg.idAEditar, {
        almaxi: arg.inputQty
    }, {new: true})
    console.log('Maximo de Almacen editado correctamente!')
    e.reply('stock-editado', JSON.stringify(maximoAlmacen));
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
        Stock: arg.valorStock,
        Stock_Final: Number(arg.valorStock) - Number(arg.inputQty),
        Almacen: Number(arg.valorPicos) - Number(arg.inputQty),
        Market: Number(arg.MarketValue) + Number(arg.inputQty),
        Cantidad: '-' + arg.inputQty ,
        fecha: new Date
    }
    const entradaRegistro = new movimintosExtremos(nuevoRegistro)
    await entradaRegistro.save()
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
        Stock_Final: Number(arg.valorStock) + Number(arg.inputQty),
        Almacen: Number(arg.valorPicos) + Number(arg.inputQty),
        Market: Number(arg.valorMarket) - (arg.valorPicos),
        Cantidad: '+' + arg.inputQty,
        fecha: new Date
    }
    const entradaRegistro = new movimintosExtremos(nuevoRegistro)
    await entradaRegistro.save()
    console.log('Mercancia ingresada por despacho!')
    e.reply('stock-editado', JSON.stringify(entradaAlmacen));
})
ipcMain.on('entrada-interna', async (e, arg) =>  {
    console.log(arg.idAEditar)
    const entradaInterna = await ProductosExremos.findByIdAndUpdate(arg.idAEditar, {
        Market: arg.valorMarket - arg.inputQty,
        Almacen: Number(arg.valorPicos) + Number(arg.inputQty),
    }, {new: true})
    e.reply('stock-editado', JSON.stringify(entradaInterna));
})
//REGISTRO_D_E_MOVIMIENTOS
    //recibo de info
    ipcMain.on('pase-de-info', async (e, args) => {
        const infoProducts = await movimintosExtremos.find({Codf: args.paseCodigo})
        e.reply('info-product', JSON.stringify(infoProducts))
    })
//Caja Chica 
    //recibe los datos para crear una vueva caja
    ipcMain.on('pase-nueva-caja', async (e, args) => {
        const nueva_caja_chica = {
            Creacion: {
                responsable: args.responsable,
                montoInit: args.montoInit,
                fechaInit: new Date
            }
        }
        const nuevaCaja = new cajaSchema(nueva_caja_chica)
        const guardarCaja = await nuevaCaja.save()
        e.reply('caja-creada', JSON.stringify(guardarCaja))
    })
    //busca todo los documentos de la coleccion para renderizarlos por fecha
    ipcMain.on('get-list', async (e, args) => {
        const showList = await cajaSchema.find().limit(20); //busca todos los documentos en la coleccion productos 
        e.reply('show-list', JSON.stringify(showList));
    });
    //busca los datos para mostrar la info de la caja
    ipcMain.on('caja-elegida', async (e, arg) => {
        const infoCaja = await cajaSchema.findOne({_id: arg.idAMostrar})
        console.log("infoCaja", infoCaja)
        e.reply('envio-info', JSON.stringify(infoCaja))
    })