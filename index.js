module.exports = function (before, after) {
	var removed = before.filter(function (item) {
		return ! after.filter(matchField(item, 'name')).length
	})

	var added = after.filter(function (item) {
		return ! before.filter(matchField(item, 'name')).length
	})

	var changed = after.filter(notIn(added, removed)).map(function (suite, i) {
		var previous = before.filter(matchField(suite, 'name'))[0].benchmarks
		var current = suite.benchmarks

		var removed = previous
			.filter(function (item) {
				return ! current.filter(matchField(item, 'title')).length
			})

		var added = current
			.filter(function (item) {
				return ! previous.filter(matchField(item, 'title')).length
			})

		var changed = current
			.filter(notIn(added, removed))
			.map(function (bench, i) {
				return diffBench(bench, previous[i])
			})

		return {
			name: suite.name,
			added: added,
			removed: removed,
			changed: changed
		}
	})

	return {
		added: added,
		removed: removed,
		changed: changed
	}
}

//
// Helpers
//
function diffBench (before, after) {
	var fields = ['iterations','elapsed','ops']
	var data = { title: after.title }

	fields.forEach(function (field) {
		var diff = after[field] - before[field]
		data[field] = {
			before: before[field],
			after: after[field],
			diff: diff,
			variance: diff / before[field]
		}
	})

	return data
}

function matchField (a, field) {
	return function (b) {
		return a[field] === b[field]
	}
}

function contains (list, value) {
	return !!~list.indexOf(value)
}

function notIn () {
	var args = Array.prototype.slice.call(arguments)
	return function (v) {
		return ! args.reduce(function (m, list) {
			return m || contains(list, v)
		}, false)
	}
}
