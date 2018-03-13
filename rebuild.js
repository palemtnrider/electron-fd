var exec = require('child_process').exec
var electronRebuild = require('electron-rebuild')
var path = require('path')

var ELECTRON_VERSION = '1.7.3'

var appDir = '/home/mkraev/Projects/personal/electron-fd'

exec("npm install && npm prune", {cwd: appDir}, function (err, res) {
  electronRebuild.installNodeHeaders(ELECTRON_VERSION)
    .then(() => electronRebuild.rebuildNativeModules(ELECTRON_VERSION, path.join(appDir, 'node_modules')))
});