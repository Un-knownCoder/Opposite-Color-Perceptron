const {BrowserWindow, app} = require('electron');

app.on('ready', () => {
   let win = new BrowserWindow({
      width: 1000,
      height: 600,
      title: 'Neural Network - [Aldrigo, Coradin, Sclifos, Vettori]',
      resizable: false
   });

   win.on('closed', _ => {
      app.exit();
   });

   win.loadURL(__dirname + '/ui/index.html');
});

