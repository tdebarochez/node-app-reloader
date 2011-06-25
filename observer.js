#!/usr/bin/env node

var fs = require('fs')
  , exec = require('child_process').exec
  , spawn = require('child_process').spawn
  , child = null
  , args = []
  , files = []
  , double_dashes = false
  , i = 0;

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
  watch(chunk.split('\n'));
});
process.stdin.on('close', function () {
  start();
});

process.argv.forEach(function (arg) {
  if (++i < 3) {
    return;
  }
  if (arg == '--') {
    double_dashes = true;
    return;
  }
  if (double_dashes) {
    files.push(arg);
  }
  else {
    args.push(arg);
  }
});

if (args.length < 1
   || !double_dashes
   || process.argv.length < 4) {
  process.stderr.write('Usage: node-app-reloader [node-options] script.js -- files\n');
  process.exit(1); 
}

watch(files);
if (files.length > 0) {
  start();
}

function reload() {
  stop();
  start();
}

function stop() {
  if (child === null) {
    return;
  }
  child.kill();
}

function start() {
  if (child !== null
      && !child.killed) {
    return;
  }
  var opts = {customFds: [process.stdin, process.stdout, process.stderr],
              cwd: process.cwd()};
  child = spawn('node', args, opts);
}

function watch(files) {
  files.forEach(function (filename) {
    if (filename.length <= 3) {
      return;
    }
    fs.watchFile(filename, function (curr, prev) {
      if (+curr.mtime !== +prev.mtime) {
        reload();
      }
    });
  }); 
}
