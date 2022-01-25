# Integration tests / examples

This directory contains the integration tests for Agrippa; each directory marks a unique case (command & environment), tested end-to-end. 
These tests can be used as examples for seeing how a feature works or getting a general understanding of Agrippa's usage.

> More user-friendly examples are WIP. 

Each case has a `solution` folder, which is the *exact output* Agrippa is expected to output for the given command in the given environment.
The command itself is read from `testinfo.json`, which also contains a unique name for the test and a short description. 
The "environment", in this case, is the case folder itself; everything outside it has no effect on the output (due to tests being run in a Docker container).

If you're looking for examples, hopefully these tests can be of help. If something remains unclear, please reach out, by opening an issue here on GitHub, or elsewhere.