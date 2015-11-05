# matcha-compare

With `matcha-compare` and `matcha-json-reporter`, you can compare timings
between two separate benchmark runs and use removal of benchmarks, or the
ops/s variance of each benchmark as a failure condition for a test suite.

## Usage

```sh
matcha-compare --threshold 0.1 before.json after.json
```
