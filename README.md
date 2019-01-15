# pokemon-go-bp

This repository contains the source code for BP calculation and related scripts.

## Installation

```sh
# Confirm node version >= 10.15.0
$ node -v

# Confirm npm version >= 6.5.0
$ npm -v

# Confirm yarn version >= 1.12.3
$ yarn -v

# Clone the repository
$ git clone https://github.com/Rikilele/pokemon-go-bp.git

# Enter the created directory
$ cd pokemon-go-bp

# Install and link all dependencies
$ yarn

# Build
$ yarn build
```

## Usage

To generate a list of Pokemon stats (IV and PL) optimized for BP

```sh
# Run optimization
$ yarn optimize

# Check results
$ cd packages/bp-cli/out

```

For an interactive command line tool to calculate BP for specific Pokemon

```sh
$ yarn analyze
```
## Dev

In the top level directory

```sh
# Linking
$ yarn

# Building
$ yarn build

# Linting
$ yarn lint
```
