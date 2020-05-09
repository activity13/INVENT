const { ipcRenderer, remote } = require('electron');
const path = require('path');

//Declaracion de ID de registroMovimientos.html
const codigo = document.getElementById('codigo')
const infoGeneral = document.getElementById('infoGeneral')
const stockActual = document.getElementById('stockActual')

ipcRenderer.on('info-product', (e, args) => {

//     codigo.innerHTML = `<h1>${args.Codf}</h1>`;
// infoGeneral.innerHTML = `
//     <h2>${args.Descr}</h2>
//     <h3>S/. Gasto generado </h3> 
//     <br>
//     <h3>S/. Ventas Producidas </h3>
// `
// stockActual.innerHTML = `<h1>${args.Stock}</h1>`
})
