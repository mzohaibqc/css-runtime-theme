const fs = require("fs");
const path = require("path");
const glob = require("glob");
const postcss = require("postcss");
const less = require("less");
var colorsOnly = require('postcss-colors-only');

function randomColor() {
  return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
}

/*
  This function takes color string as input and return true if string is a valid color otherwise returns false.
  e.g.
  isValidColor('#ffffff'); //true
  isValidColor('#fff'); //true 
  isValidColor('rgba(0, 0, 0, 0.5)'); //true
  isValidColor('20px'); //false
*/
function isValidColor(color) {
  if (!color || color.match(/px/g)) return false;
  if (color.match(/colorPalette|fade/g)) return true;
  if (color.charAt(0) === "#") {
    color = color.substring(1);
    return (
      [3, 4, 6, 8].indexOf(color.length) > -1 && !isNaN(parseInt(color, 16))
    );
  }
  return /^(rgb|hsl)a?\((\d+%?(deg|rad|grad|turn)?[,\s]+){2,3}[\s\/]*[\d\.]+%?\)$/i.test(
    color
  );
}


/*
  This is main function which call all other functions to generate color.less file which contins all color
  related css rules based on Ant Design styles and your own custom styles
  By default color.less will be generated in /public directory
*/
function generateTheme({
  source = '',
  stylesDir,
  variables = [],
  output,
  withoutGrey = false, // set to true to remove rules that only have grey colors
  withoutMonochrome = false, // set to true to remove rules that only have grey, black, or white colors
}) {
    /*
    - source - can either be file path or css string
    - variables - variable names and their values in an object
    - stylesDir - if specified, all css files in the directory will be used
    - output - output file path
  */

    let css = '';
    if (fs.existsSync(source)) {
        css = fs.readFileSync(source).toString();
    } else {
        css = source;
    }

    if (stylesDir) {
        const pattern = path.join(stylesDir, './**/*.css');
        const styles = glob.sync(pattern);
        css = `${css}\n${styles.map(s => fs.readFileSync(s).toString()).join('\n')}`; 
    }
    
    const options = {
      withoutGrey,
      withoutMonochrome
    };
    css = postcss()
        .use(colorsOnly(options))
        .process(css)
        .css;
    Object.keys(variables).forEach(varName => {
        let color = variables[varName];
        color = color.replace('(', '\\(').replace(')', '\\)');
        css = css.replace(new RegExp(`${color}`, "g"), varName);
    });

    Object.keys(variables).forEach(varName => {
        let color = variables[varName];
        css = `${varName}: ${color};\n${css}`;
    });

    fs.writeFileSync(output, css);
    console.log(
    `Theme generated successfully. OutputFile: ${output}`
    );
}

module.exports = {
  generateTheme,
  isValidColor,
  randomColor
};
