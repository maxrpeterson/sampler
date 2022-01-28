module.exports = {
  watch: true,
  server: {
    baseDir: ['app', 'node_modules'],
    serveStaticOptions: {
      extensions: ['js', '.worklet.js'],
      index: ['index.html', 'index.js'],
    },
    middleware: [
      (req, res, next) => {
        if (
          typeof req.url === 'string'
          && /\/tone\/.+\.worklet$/.test(req.url)
        ) {
          req.url = `${req.url}.js`
        }
        next()
      },
    ],
  },
}
