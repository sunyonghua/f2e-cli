#!/usr/bin/env node
const fs = require('fs');
const program = require('commander');
const download = require('download-git-repo');
const inquirer = require('inquirer');
const Handlebars = require('Handlebars');
const ora = require('ora');
const templates = {
  'react-template': {
    gitUrl: 'https://github.com/sunyonghua/react-template',
    downloadUrl: 'https://github.com:sunyonghua/react-template#master',
    description: 'react版的webpack脚手架'
  },
  'vue-template': {
    gitUrl: 'https://github.com:sunyonghua/vue-template#master',
    downloadUrl: '',
    description: 'vue版的webpack脚手架'
  }
};
// 查看版本
program.version('1.0.0');

// 初始化项目模版
program
  .command('init <templateName> <projectName>')
  .description('init project template')
  .action((templateName, projectName) => {
    const spinner = ora('downloading...').start();
    download(`${templates[templateName].downloadUrl}`, projectName, { clone: true }, function(err) {
      if (err) {
        return spinner.fail("download fail !!");
      }
      spinner.succeed('download success !!');
      inquirer
        .prompt([
          { type: 'input', name: 'projectName', message: 'projectName' },
          { type: 'input', name: 'description', message: 'description' },
          { type: 'input', name: 'author', message: 'author' }
        ])
        .then(value => {
          const package = fs.readFileSync(`${projectName}/package.json`, 'utf-8');
          const result = Handlebars.compile(package)(value);
          fs.writeFileSync(`${projectName}/package.json`, result);
          console.log('项目创建成功')
        });
    });
  });

// 查看所有模版
program
  .command('list')
  .description('see all project')
  .action(() => {
    for (let key in templates) {
      console.log(`${key} --${templates[key].description}`);
    }
  });

program.parse(process.argv);
