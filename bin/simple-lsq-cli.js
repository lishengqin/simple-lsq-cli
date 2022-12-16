#!/usr/bin/env node
import path from 'path';
import fs from 'fs';
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templateUrl = `../template`;
function deleteFolder(filePath) {
  let files = [];
  if (fs.existsSync(filePath)) {
    files = fs.readdirSync(filePath);
    files.forEach(one => {
      let currentPath = path.resolve(filePath, one);
      if (fs.statSync(currentPath).isDirectory()) {
        deleteFolder(currentPath);
      } else {
        fs.unlinkSync(currentPath);
      }
    });
    fs.rmdirSync(filePath);
  }
}

const { dirName } = await inquirer.prompt([
  {
    name: 'dirName',
    type: 'input',
    message: '文件夹名称',
  },
]);
let toDirPath = path.resolve(process.cwd(), './' + dirName);
let exist = fs.existsSync(toDirPath);
if (exist) {
  const { isCover } = await inquirer.prompt([
    { type: 'confirm', name: 'isCover', message: `目录下已存在${dirName}，是否覆盖` },
  ]);
  if (isCover) {
    deleteFolder(toDirPath);
    fs.mkdirSync(toDirPath);
  }
} else {
  fs.mkdirSync(toDirPath);
}
let files = fs.readdirSync(path.resolve(__dirname, templateUrl));
files.forEach(file => {
  let originFileUrl = path.resolve(__dirname, templateUrl, file);
  const data = fs.readFileSync(originFileUrl, 'utf-8');
  fs.writeFileSync(path.resolve(toDirPath, file), data);
});
console.log(`${dirName}文件已生成！`);
