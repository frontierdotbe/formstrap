const esbuild = require('esbuild')
const sassPlugin = require('esbuild-sass-plugin').sassPlugin
const watch = process.argv.includes('-w')

// Used to skip external URLs in scss files
const externalUrlPlugin = {
  name: 'custom-resolver',
  setup (build) {
    build.onResolve({ filter: /^https?:\/\// }, ({ path }) => {
      return { path, external: true, namespace: 'provided' }
    })
  }
}

esbuild.build({
  entryPoints: ['src/scss/formstrap.scss'],
  outfile: 'app/assets/stylesheets/formstrap.css',
  bundle: true,
  watch: watch,
  allowOverwrite: true,
  plugins: [
    externalUrlPlugin,
    sassPlugin()
  ]
}).catch((e) => console.error(e.message))
