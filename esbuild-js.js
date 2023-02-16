const esbuild = require('esbuild')
const watch = process.argv.includes('-w')

esbuild.build({
  entryPoints: ['src/js/headmin.js'],
  outfile: 'app/assets/javascripts/headmin.js',
  bundle: true,
  allowOverwrite: true,
  format: 'esm',
  watch: watch
}).catch((e) => console.error(e.message))
