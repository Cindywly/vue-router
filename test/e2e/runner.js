const spawn = require('cross-spawn')
let args = []
const yargs = require('yargs')

const options = yargs
  .usage('Usage: $0 <file> [options]')
  .example('$0 src/index.js', 'bundles cjs, es, umd, and minified umd versions of your lib')
  .option('test', {
    describe: 'tests specs name to run',
    alias: ['t', 'tests'],
    array: true
  })
  .option('dev', {
    alias: 'd',
    describe: 'Run without development server'
  })
  .option('config', {
    alias: 'c',
    describe: 'Nightwatch config',
    default: 'test/e2e/nightwatch.config.js'
  })
  .option('env', {
    alias: 'e',
    default: 'phantomjs',
    describe: 'Run tests in a different environment'
  })
  .help('h')
  .alias('h', 'help')
  .argv

const server = options.dev
  ? null
  : require('../../examples/server')

args.push('--config', options.config)
args.push('--env', options.env)

args.push(...options.tests.map(t => `test/e2e/specs/${t.replace(/\.js$/, '')}.js`))

const runner = spawn('./node_modules/.bin/nightwatch', args, {
  stdio: 'inherit'
})

runner.on('exit', function (code) {
  server && server.close()
  process.exit(code)
})

runner.on('error', function (err) {
  server && server.close()
  throw err
})
