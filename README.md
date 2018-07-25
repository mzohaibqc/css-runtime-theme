# css-runtime-theme

This script allows you to generate a less file `color.less` which you can import in your `index.html` file and then you can change color specific theme on runtime in browser without any new build.


```
const options = {
    source: path.join(__dirname, './src/index.css'), // File or css string,
    variables: {
        '@color1': '#cccccc', // must add @ sign 
        '@color2': '#343312'
    },
    stylesDir: path.join(__dirname, './src'), // if your styles are in multiple files, specifiy the directory
    output: path.join(__dirname, './dist/color.less'), // output file path, filename should have .less extension and folder should be there,
    withoutGrey: false, // set to true to remove rules that only have grey colors
    withoutMonochrome: false, // set to true to remove rules that only have grey, black, or white colors
};

generateTheme(options).then(less => {
  console.log('Theme generated successfully');
})
.catch(error => {
  console.log('Error', error);
});

```

Add following lines in your main html file

```
<link rel="stylesheet/less" type="text/css" href="/color.less" />
<script>
  window.less = {
    async: false,
    env: 'production'
  };
</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/less.js/2.7.2/less.min.js"></script>
```

Now you can update colors by updating less avriables like this

```
window.less.modifyVars({
  '@primary-color': '#0035ff'
})
```
