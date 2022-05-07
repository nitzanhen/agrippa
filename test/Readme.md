# Agrippa test directory

This directory contains Agrippa's testing modules. These divide into three groups:

- Unit tests: test a single function or operation, just like traditional unit tests. They can be found under the `unit` directory.

- Integration tests: test Agrippa's `run` function - the main entry point to the JS API. Integration tests can be found under the `integration` directory. These test a run of Agrippa's core, *in pure mode*, often with a focus on a single option/feature or a combination of those. 

- End-To-End tests: test a full run of Agrippa - from its CLI, through `run` and the JS API and down into the output logic. These can be found under the `end-to-end` directory. Tests for correct file loading & correct creation of files belogs here.

Integration tests are the core "safety net" among the testing types - an integration test should exist for every flag or feature of Agrippa.
As for unit or e2e tests - ideally we'd have as many of them as possible, however it's to be expected that they won't cover every feature.

Tests should, eventually, run in a Docker container, for true isolation. 