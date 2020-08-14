// import { existsSync, mkdirSync, readFile, writeFile, readdir, statSync } from "fs-extra";
// import fs from "fs-extra";
// import fs from "fs-extra";
const fs: typeof import("fs-extra") = require("fs-extra");
// const { existsSync, mkdirSync, readFile, writeFile, readdir, statSync } = require("fs-extra");
const watch: any = require('node-watch');
const exec: typeof import("child_process").exec = require('child_process').exec;
const term: typeof import("terminal-kit").terminal = require('terminal-kit').terminal;
const minify: any = require('@node-minify/core');
const cleanCSS: any = require('@node-minify/clean-css');
const path: typeof import("path") = require("path");
import { join } from "path";

var args = process.argv.slice(2);
var w: boolean = args.indexOf("--watch") > -1 || args.indexOf("-w") > -1;

/* #region rsync helpers */
export async function copyFolderTo(folderPath: string, to: string, del: boolean = false) {
  if (to.indexOf(":") === -1) {
    fs.ensureDirSync(path.resolve(to));
  }
  return new Promise((resolve, reject) => {
    // exec(`rsync -raRP ${del ? "--del" : ""} ${folderPath} ${to}`, (err: any, stdout: any, stderr: any) => {
    exec(`rsync -rl --update ${del ? "--del" : ""} ${folderPath} ${to}`, (err: any, stdout: any, stderr: any) => {
      if (err) {
        term.red(err);
      }
      resolve();
    });
  });
}
export type SyncOptions = {
  source: string;
  dest: string;
  folders: string | string[];
  del?: boolean;
}
export async function sync(options: SyncOptions) {
  const source: string = options.source,
    dest = options.dest,
    folders = Array.isArray(options.folders) ? options.folders : [options.folders],
    del = options.del !== undefined ? options.del : false;
  folders.forEach((folder) => {
    term.bold.green(`sync: \t${source} ${dest}/${folder}`);
    if (dest.indexOf(":") === -1) {
      fs.ensureDirSync(path.resolve(`${dest}/${folder}`));
    }
    // if (!fs.existsSync(`${dest}/${folder}`)) { fs.mkdirSync(`${dest}/${folder}`); }
    return new Promise((res, rej) => {
      copyFolderTo(`${source}/${folder}`, dest, del).then(() => {
        if (w) {
          watch(`${source}/${folder}`, { recursive: true }, (evt: any, name: any) => {
            copyFolderTo(`${source}/${folder}`, dest, del);
          });
        } else {
          res();
        }
      });
    });
  });
}
/* #endregion */
/* #region helpers */
export function hasArg(arg: string): boolean {
  return process.argv.indexOf(arg) > -1;
}
/* #endregion */
/* #region simple replace */
export async function replaceManyInFile(path: string, replacements: string[][]) {
  fs.readFile(path, 'utf8', (err: any, data: string) => {
    if (err) { return console.log("ERROR: ", err); }
    var newData = data;
    replacements.forEach(item => {
      var search = item[0];
      var replacement = item[1];
      var regex = new RegExp(search, 'g');
      newData = newData.replace(regex, replacement);
    });
    fs.writeFile(path, newData, 'utf8', function (err: any) {
      if (err) return console.log("ERROR: ", err);
    });
  });
}
export async function replaceManyInDir(pathDir: string, replacements: string[][]) {
  fs.readdir(pathDir, (err, paths) => {
    if (err) return;
    paths.forEach(subPath => {
      const subPathFull = join(pathDir, subPath);
      if (fs.statSync(subPathFull).isFile()) {
        replaceManyInFile(subPathFull, replacements);
      } else {
        replaceManyInDir(subPathFull, replacements);
      }
    });
  });
}
/* #endregion sas */
/* #region regex replace in file */
export async function regexReplaceInFile(path: string, regex: RegExp, replace: string) {
  fs.readFile(path, 'utf8', (err: any, data: string) => {
    if (err) { return console.log("ERROR: ", err); }
    var newData = data;
    newData = newData.replace(regex, replace);
    fs.writeFile(path, newData, 'utf8', function (err: any) {
      if (err) return console.log("ERROR: ", err);
    });
  });
}
/* #endregion */
