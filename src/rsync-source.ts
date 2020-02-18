var watch = require('node-watch');
var exec = require('child_process').exec;
var term = require('terminal-kit').terminal;
var fs = require('fs');
var args = process.argv.slice(2);
var w: boolean = args.indexOf("--watch") > -1 || args.indexOf("-w") > -1;

export async function move(source: string, dest: string, del: boolean = false) {
  return new Promise((resolve, reject) => {
    exec(`rsync -rl --update ${del ? "--del" : ""} ${source} ${dest}`, (err: any, stdout: any, stderr: any) => {
      resolve();
    });
  });
}
export async function sync(source: string, dest: string, folder: string) {
  term.bold.green(`sync: \t${source} ${dest}/${folder}`);
  if (!fs.existsSync(`${dest}/${folder}`)) { fs.mkdirSync(`${dest}/${folder}`); }
  return new Promise((res, rej) => {
    move(`${source}/${folder}`, dest, true).then(() => {
      if (w) {
        watch(`${source}/${folder}`, { recursive: true }, (evt: any, name: any) => {
          move(`${source}/${folder}`, dest, true);
        });
      } else {
        res();
      }
    });
  });
}
