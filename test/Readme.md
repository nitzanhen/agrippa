# Agrippa test directory

This directory contains Agrippa's testing modules. These divide into three groups:

- Unit tests: test a single function or operation, just like traditional unit tests. They can be found under the `unit` directory.
- Integration tests: test Agrippa's `run` function - the main entry point to the JS API. The bulk of all tests is intended to fall under this category. Integration tests can be found under the `integration` directory.
- End-To-End tests: test a full run of Agrippa - from its CLI, through `run` and the JS API and down into the output logic. These can be found under the `end-to-end` directory.

Tests should, eventually, run in a Docker container, for true isolation. 