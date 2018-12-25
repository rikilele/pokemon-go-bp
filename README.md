# pokemongo-bp

## Background

### Introduction

Pokemon GO has three different leagues for their PVP battle feature:

- Great League (Max CP: 1500)
- Ultra League (Max CP: 2500)
- Master League (No CP Limit)

The Great and Ultra leagues are of special interest because their of their CP caps.
By standardizing all Pokemon to a certain CP, Pokemon that used to be strong because of their high CPs cannot enjoy that benefit anymore.
As a result, we see crazy results like Alolan Raticate beating Tyranitar.

Now that CPs are fixed, we need a measure of a Pokemon's strength other than the CP.

### How the BP is calculated

The battle logic of Pokemon GO is explained in detail [here](https://pokemongo.gamepress.gg/damage-mechanics).

TL;DR: Damage is calculated as `Attack / Defense`.

We can compare how strong a Pokemon is relative to another by calculating:

```
(my stamina / their damage) - (their stamina / my damage)
```

The more positive the result is, the stronger the Pokemon is compared to its opponent.

The more negative the result is, the weaker the Pokemon is compared to its opponent.

Given that the damage has to do with `Attack / Defense`, the previous equation resolves to:

```
(my stamina * my defense / their attack) - (their stamina * their defense / my attack)
```

This is exactly how the BP is calculated, but by taking average stamina, attack, and defense stats as the opponent to be compared with.

## Script

### Setup

- Clone this repository
- `npm install`

### Usage

To run an optimization with respect to BP on all Pokemon in the game

- `npm run optimize`
- Check `out/*.csv` for results

To run an interactive command line tool to calculate BP on specific stats

- `npm run analyze`
