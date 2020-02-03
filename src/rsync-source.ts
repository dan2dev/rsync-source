var watch = require('node-watch');
var exec = require('child_process').exec;
var term = require('terminal-kit').terminal;
var fs = require('fs');

export async function move(source: string, dest: string, del: boolean = false) {
  return new Promise((resolve, reject) => {
    term.eraseLine().column(0);
    term.bold.green(' Syncing\t\t\t\t\t');
    exec(`rsync -rl --update ${del ? "--del" : ""} ${source} ${dest}`, (err: any, stdout: any, stderr: any) => {
      term.eraseLine().column(0);
      term.bold.green(' Watching\t\t\t\t\t').column(0);
      resolve();
    });
  });
}
export async function syncWatch(source: string, dest: string, folder: string) {
  if (!fs.existsSync(`${dest}/${folder}`)) { fs.mkdirSync(`${dest}/${folder}`); }
  move(`${source}/${folder}`, dest, true).then(() => {
    move(`${dest}/${folder}`, source, false)
      .then(() => {
        term.eraseLine().column(0);
        term.bold.green(' Watching\t\t\t\t\t').column(0);
        watch(`${source}/${folder}`, { recursive: true }, (evt: any, name: any) => {
          move(`${source}/${folder}`, dest, true);
        });
        watch(`${dest}/${folder}`, { recursive: true }, (evt: any, name: any) => {
          move(`${dest}/${folder}`, source);
        });
      });
  });
}
