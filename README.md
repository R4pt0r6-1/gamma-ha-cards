# Glow Light Card

A fast, resizable Home Assistant Lovelace card for lights.

It is designed for compact dashboard rows like kitchen, bar, porch, and accent lights. When the light is on, the card uses a warm glowing gradient and border. When off, it falls back to a quiet dark pill.

## Features

- Works with any `light.*` entity, and can also toggle other domains that support `toggle`
- Custom icon, name, width, height, radius, colors, and actions
- Optional brightness percentage display
- Fast CSS-only glow animation
- Visual editor support
- HACS-ready

## Installation

### HACS

Add this repository as a custom HACS dashboard repository:

```text
https://github.com/AnielGammaTech/glow-light-card
```

Resource path:

```text
/hacsfiles/glow-light-card/glow-light-card.js
```

Resource type:

```text
JavaScript module
```

## Basic Usage

```yaml
type: custom:glow-light-card
entity: light.bar_lights
name: Bar Lights
icon: mdi:ceiling-light
```

## Example

```yaml
type: custom:glow-light-card
entity: light.bar_lights
name: Bar Lights
icon: mdi:ceiling-light
width: 260px
height: 64px
on_color: '#ff8a1c'
off_color: '#697382'
background: '#101722'
state_display: state
tap_action: toggle
hold_action: more-info
```

## Options

| Name            | Type      | Default             | Description                                 |
| --------------- | --------- | ------------------- | ------------------------------------------- |
| `entity`        | `string`  | Required            | Entity to display and toggle.               |
| `name`          | `string`  | Entity friendly name | Display name.                               |
| `icon`          | `string`  | `mdi:ceiling-light` | Icon shown on the left.                     |
| `width`         | `string`  | `260px`             | CSS width of the card.                      |
| `height`        | `string`  | `64px`              | CSS minimum height of the card.             |
| `border_radius` | `string`  | `999px`             | CSS border radius.                          |
| `show_state`    | `boolean` | `true`              | Show state text under the name.             |
| `state_display` | `string`  | `state`             | `state`, `brightness`, or `auto`.           |
| `on_color`      | `string`  | `#ff8a1c`           | Glow color when on.                         |
| `off_color`     | `string`  | `#697382`           | Icon/border color when off.                 |
| `background`    | `string`  | `#101722`           | Base card background.                       |
| `tap_action`    | `string`  | `toggle`            | `toggle`, `more-info`, or `none`.           |
| `hold_action`   | `string`  | `more-info`         | `toggle`, `more-info`, or `none`.           |
| `animated`      | `boolean` | `true`              | Enable the subtle glow animation when on.   |

## Local Development

```bash
npm install
npm run build
npm run demo
```

Then open the local Vite URL.

## License

MIT
