const fs = require('fs');
const pdf = require('pdf-parse');
const MarkdownIt = require('markdown-it');
const { program } = require('commander');

const md = new MarkdownIt();

program
  .option('-i, --input <file>', 'input PDF file')
  .option('-o, --output <type>', 'output type (markdown/json)')
  .parse(process.argv);

const options = program.opts();

if (options.input && options.output) {
  let dataBuffer = fs.readFileSync(options.input);
  
  pdf(dataBuffer).then(function(data) {
    if (options.output === 'markdown') {
      let markdownText = md.render(data.text);
      fs.writeFileSync('output.md', markdownText);
    } else if (options.output === 'json') {
      let jsonData = { content: data.text };
      fs.writeFileSync('output.json', JSON.stringify(jsonData, null, 2));
    }

    console.log('Conversion complete!');
  });
} else {
  console.log('Please provide an input file and output type.');
}
