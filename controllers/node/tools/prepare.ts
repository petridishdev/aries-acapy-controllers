import * as shell from 'shelljs'

// Copy assets
shell.cp('-R', './data', './dist')
shell.cp('-R', './views', './dist')
shell.cp('-R', './public', './dist')
