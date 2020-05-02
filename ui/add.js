const electron = require('electron');
const submitBtn = document.getElementById('submitBtn');
const qtyTask = document.querySelector('#qtyTask');
const submit = document.querySelector('#submitBtn');


submit.addEventListener('submit', function() {
    electron.ipcRenderer.send('edited-qty', qtyTask.value);
    var window = electron.remote.getCurrentWindow();
    window.close();     
})

submit.addEventListener('click', function() {
    electron.ipcRenderer.send('edited-almini', qtyTask.value);
    var window = electron.remote.getCurrentWindow();
    window.close();     
})

