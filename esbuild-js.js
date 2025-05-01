const esbuild = require('esbuild')
const watch = process.argv.includes('-w')

esbuild.build({
  entryPoints: ['src/js/formstrap.js'],
  outfile: 'app/assets/javascripts/formstrap.js',
  bundle: true,
  allowOverwrite: true,
  format: 'esm',
  external: ['redactor'],
  watch
}).catch((e) => console.error(e.message))
