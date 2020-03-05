import { existsSync, mkdirSync, readFile, writeFile, readdir, statSync } from "fs-extra";
const watch = require('node-watch');
const exec = require('child_process').exec;
const term = require('terminal-kit').terminal;
const minify = require('@node-minify/core');
const cleanCSS = require('@node-minify/clean-css');
import { join } from "path";

var args = process.argv.slice(2);
var w: boolean = args.indexOf("--watch") > -1 || args.indexOf("-w") > -1;

/* #region rsync helpers */
export async function copyFolderTo(folderPath: string, to: string, del: boolean = false) {
  return new Promise((resolve, reject) => {
    exec(`rsync -raRP ${del ? "--del" : ""} ${folderPath} ${to}`, (err: any, stdout: any, stderr: any) => {
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
    if (!existsSync(`${dest}/${folder}`)) { mkdirSync(`${dest}/${folder}`); }
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
  readFile(path, 'utf8', (err: any, data: string) => {
    if (err) { return console.log("ERROR: ", err); }
    var newData = data;
    replacements.forEach(item => {
      var search = item[0];
      var replacement = item[1];
      var regex = new RegExp(search, 'g');
      newData = newData.replace(regex, replacement);
    });
    writeFile(path, newData, 'utf8', function (err: any) {
      if (err) return console.log("ERROR: ", err);
    });
  });
}
export async function replaceManyInDir(pathDir: string, replacements: string[][]) {
  readdir(pathDir, (err, paths) => {
    if (err) return;
    paths.forEach(subPath => {
      const subPathFull = join(pathDir, subPath);
      if (statSync(subPathFull).isFile()) {
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
  readFile(path, 'utf8', (err: any, data: string) => {
    if (err) { return console.log("ERROR: ", err); }
    var newData = data;
    newData = newData.replace(regex, replace);
    writeFile(path, newData, 'utf8', function (err: any) {
      if (err) return console.log("ERROR: ", err);
    });
  });
}
/* #endregion */
