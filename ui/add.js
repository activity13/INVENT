const electron = require('electron');
const submitBtn = document.getElementById('submitBtn');
const qtyTask = document.querySelector('#qtyTask');
const submit = document.querySelector('#submitBtn');


submit.addEventListener('click', function() {
    electron.ipcRenderer.send('edited-qty', qtyTask.value);
    var window = electron.remote.getCurrentWindow();
    window.close();     
})