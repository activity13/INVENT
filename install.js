const electronInstaller = require('electron-winstaller');

try {
    await electronInstaller.createWindowsInstaller({
      appDirectory: 'C:\Users\isaac\Documents\ELECTRON',
      outputDirectory: 'C:\Users\isaac\Documents\ELECTRON\release-builds',
      authors: 'INVENT Inc.',
      exe: 'invent.exe'
    });
    console.log('It worked!');
  } catch (e) {
    console.log(`No dice: ${e.message}`);
  }