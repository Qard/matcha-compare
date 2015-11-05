#!/usr/bin/env node
var compare = require('./')
var path = require('path')
var chalk = require('chalk')
var yargs = require('yargs')
  .usage('Usage: $0 [options] <before-file> <after-file>')
	// Help
	.help('h')
  .alias('h', 'help')
	// Threshold
	.alias('t', 'threshold')
  .describe('t', 'Allowed ops/s variance threshold')
  .default('t', 0.01)
	// Removals
	.boolean('r')
	.alias('r', 'removals')
  .describe('r', 'Fail on benchmark removals')
	// Verbose
	.boolean('v')
	.alias('v', 'verbose')
  .describe('v', 'Also display success messages')

var argv = yargs.argv

// Ensure we have before and after files
if (argv._.length < 2) {
	return console.error(yargs.help())
}

var before = loadFile(argv._[0])
var after = loadFile(argv._[1])

var result = compare(before, after)
var hasError = false

checkRemovals(result)
result.changed.forEach(function (suite) {
	console.log(suite.name)
	checkRemovals(suite)
	suite.changed.forEach(checkVariance)
})

process.exit(hasError ? 1 : 0)

//
// Helpers
//
function loadFile (file) {
	try { return require(path.resolve(file)) }
	catch (e) {
		console.error(file + ' not found')
		process.exit(1)
	}
}

function error (msg) {
	hasError = true
	console.error(chalk.bold.red('✘ ') + msg)
}

function success (msg) {
	console.log(chalk.bold.green('✔ ') + msg)
}

function checkRemovals (obj) {
	if (argv.removals) {
		if (obj.removed.length) {
			obj.removed.forEach(function (v) {
				if (v.name) {
					error('Removed suite "' + v.name + '"')
				} else if (v.title) {
					error('Removed benchmark "' + v.title + '"')
				}
			})
		} else if (argv.verbose) {
			success('No removed ' + (obj.title ? 'benchmarks' : 'suites'))
		}
	}
}

function checkVariance (bench) {
	if (bench.ops.variance > argv.threshold) {
		error('Too much variance in benchmark "' + bench.title + '"')
	} else if (argv.verbose) {
		success('Acceptable variance for benchmark "' + bench.title + '"')
	}
}
