const path = require('path');
const glob = require('glob');
const { generateTheme } = require('./index');

const options = {
    source: path.join(__dirname, './styles/styles.css'),
    variables: {
        '@primary': '#003957'
    },
    output: path.join(__dirname, './color.less'),
    // stylesDir: path.join(__dirname, './styles'),
    withoutGrey: false, // set to true to remove rules that only have grey colors
    withoutMonochrome: false, // set to true to remove rules that only have grey, black, or white colors
};

generateTheme(options);