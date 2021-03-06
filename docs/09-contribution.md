# Contribution Guidelines

When you're ready to submit pull requests, make sure you create a new branch off of the most recent tag (`git checkout -b <nameOfYourBranch> <version>`), modify your code, run `npm version patch`, then push the commit.

## _Porting_

For those interested in porting FlowNote to another language, here are the dependencies that are optional:

* Node [v8.11.1](https://nodejs.org/en/blog/release/v8.11.1/): Host language
* Colors [v1.2.0-rc0](https://github.com/Marak/colors.js/tree/v1.2.0-rc0): Cross-terminal coloring tool
* ESM [v3.2.10](https://github.com/standard-things/esm/tree/3.2.10): Easy import/export support
* Fast Safe Stringify [v2.0.6](https://github.com/davidmarkclements/fast-safe-stringify/tree/v2.0.6): Fast JSON representation (Event emissions)
* ClinicJS [v4.0.0](https://github.com/nearform/node-clinic/tree/v4.0.0): Profiling tool

These dependencies are needed and will also have to be ported or be given similar alternatives:

* Ohm [v0.14.0](https://github.com/harc/ohm/tree/v0.14.0): Parser, lexer, and compiler
* Flatted [v2.0.0](https://github.com/WebReflection/flatted/tree/v2.0.0): Safely represents and restores circular JSON (Application snapshots)
* HyperID [v1.4.1](https://github.com/mcollina/hyperid/tree/ad1ccf743358ed6d79fad9ffbbf470645f8da612): Fast GUID generation

##### Documentation

( 
[Installation](01-installation.md) | 
[Features](07-features.md) | 
[Application](02-application.md) | 
[Flow](03-flow.md) | 
[Nodes](04-nodes.md) | 
[Channels](05-channels.md) | 
[Use Cases](06-use-cases.md) | 
[Language](08-language.md) | 
Contribution Overview | 
[Roadmap](10-roadmap.md) | 
[Known Problems](11-known-problems.md)
)