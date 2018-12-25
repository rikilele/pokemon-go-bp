# pokemongo-bp

## Background

### Introduction

Pokemon GO has three different leagues for their PVP battle feature:

- Great League (Max CP: 1500)
- Ultra League (Max CP: 2500)
- Master League (No CP Limit)

The Great and Ultra leagues are of special interest because of their CP caps.
By standardizing all Pokemon to a certain CP, Pokemon that used to be strong due to their high CP values cannot enjoy that benefit anymore.
As a result, we see crazy results like Alolan Raticates regularly beating Tyranitars in battles.

We now need a measure of a Pokemon's strength other than the CP for PVP battles.

And the BP does it.

### BP Calculation

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

### Optimization

This script generates a list of Pokemon stats (IV and PL) optimized for BP.

- `npm run optimize`

### Analyze your own Pokemon

This is a interactive command line tool to calculate BP for specific Pokemon.

- `npm run analyze`
