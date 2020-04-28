# hubot-duckhunt

A DuckHunt game. Let's shoot some ducks!\
(no ducks were harmed in the making of this script)

See [`src/duckhunt.js`](src/duckhunt.js) for full documentation.

## Installation

In hubot project repo, run:

`npm install hubot-duckhunt --save`

Then add **hubot-duckhunt** to your `external-scripts.json`:

```json
[
  "hubot-duckhunt"
]
```

## Configuration
    - HUBOT_DUCKHUNT_DUCKS - Number of ducks during a hunt, default: 5
    - HUBOT_DUCKHUNT_MAXDELAY - Maximum number of seconds before a new duck appears, default: 90

## Commands
    - hubot starthunt - starts a DuckHunt game
    - hubot stophunt - stops the current DuckHunt game
    - bang! - shoots the duck
