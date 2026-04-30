# Gamma HA Cards

A fast Home Assistant Lovelace card collection for compact, animated dashboard controls.

## Cards

- `custom:glow-light-card` - a resizable glowing toggle card for lights and other toggleable entities.
- `custom:glow-switch-card` - a compact switch-only button with a green on-state outline glow.
- `custom:glow-lock-card` - a compact smart lock card with instant lock and unlock feedback.
- `custom:glow-thermostat-card` - a dial-style thermostat card with instant setpoint controls.
- `custom:dual-outlet-card` - one duplex socket card for two switch entities, with independent tap toggles and a red on-state outline glow.
- `custom:speed-fan-card` - a compact fan card with Off, 1, 2, and 3 speed controls.

## Installation

### HACS

Add this repository as a custom HACS dashboard repository:

```text
https://github.com/AnielGammaTech/gamma-ha-cards
```

Resource path:

```text
/hacsfiles/gamma-ha-cards/gamma-ha-cards.js
```

Resource type:

```text
JavaScript module
```

## Glow Light Card

```yaml
type: custom:glow-light-card
entity: light.bar_lights
name: Bar Lights
icon: mdi:ceiling-light
has_dimmer: true
show_light_controls: true
```

### Glow Light Options

| Name            | Type      | Default             | Description                       |
| --------------- | --------- | ------------------- | --------------------------------- |
| `entity`        | `string`  | Required            | Entity to display and toggle.     |
| `name`          | `string`  | Entity friendly name | Display name.                     |
| `icon`          | `string`  | `mdi:ceiling-light` | Icon shown on the left.           |
| `width`         | `string`  | `260px`             | CSS width of the card.            |
| `fill_container` | `boolean` | `false`            | Stretch the card to the full dashboard column width. |
| `height`        | `string`  | `56px`              | CSS minimum height of the card.   |
| `border_radius` | `string`  | `999px`             | CSS border radius.                |
| `has_dimmer`    | `boolean` | `false`             | Turn the light button into a brightness slider. |
| `show_light_controls` | `boolean` | `false`        | Show the two-row lamp panel with brightness, color, temperature, and effect controls. |
| `show_color_presets` | `boolean` | `true`          | Show the color selector line when light controls are enabled. |
| `show_color_temp` | `boolean` | `true`            | Show color temperature presets when supported. |
| `show_effects`  | `boolean` | `false`             | Optionally show effect chips from the light entity's `effect_list`. |
| `color_presets` | `array`   | Built in            | Optional selector colors using `name` and `rgb_color`. |
| `show_state`    | `boolean` | `true`              | Show state text under the name.   |
| `state_display` | `string`  | `state`             | `state`, `brightness`, or `auto`. |
| `on_color`      | `string`  | `#ff8a1c`           | Glow color when on.               |
| `off_color`     | `string`  | `#697382`           | Icon/border color when off.       |
| `background`    | `string`  | `#101722`           | Base card background.             |
| `tap_action`    | `string`  | `toggle`            | `toggle`, `more-info`, or `none`. |
| `hold_action`   | `string`  | `more-info`         | `toggle`, `more-info`, or `none`. |
| `animated`      | `boolean` | `true`              | Enable glow animation when on.    |

## Glow Switch Card

```yaml
type: custom:glow-switch-card
entity: switch.coffee_maker
name: Coffee Maker
icon: mdi:coffee-maker
```

### Glow Switch Options

| Name             | Type      | Default             | Description                       |
| ---------------- | --------- | ------------------- | --------------------------------- |
| `entity`         | `string`  | Required            | Switch entity to display and toggle. |
| `name`           | `string`  | Entity friendly name | Display name.                    |
| `icon`           | `string`  | `mdi:toggle-switch` | Icon shown on the left.           |
| `width`          | `string`  | `260px`             | CSS width of the card.            |
| `fill_container` | `boolean` | `false`             | Stretch the card to the full dashboard column width. |
| `height`         | `string`  | `56px`              | CSS minimum height of the card.   |
| `border_radius`  | `string`  | `999px`             | CSS border radius.                |
| `show_state`     | `boolean` | `true`              | Show state text under the name.   |
| `on_color`       | `string`  | `#45d158`           | Glow color when on.               |
| `off_color`      | `string`  | `#697382`           | Icon/border color when off.       |
| `background`     | `string`  | `#101722`           | Base card background.             |
| `tap_action`     | `string`  | `toggle`            | `toggle`, `more-info`, or `none`. |
| `hold_action`    | `string`  | `more-info`         | `toggle`, `more-info`, or `none`. |
| `animated`       | `boolean` | `true`              | Enable glow animation when on.    |

## Glow Lock Card

```yaml
type: custom:glow-lock-card
entity: lock.front_door
name: Front Door
```

### Glow Lock Options

| Name             | Type      | Default                  | Description                       |
| ---------------- | --------- | ------------------------ | --------------------------------- |
| `entity`         | `string`  | Required                 | Lock entity to display and control. |
| `name`           | `string`  | Entity friendly name     | Display name.                     |
| `icon`           | `string`  | State icon               | Optional icon override.           |
| `locked_icon`    | `string`  | `mdi:lock`               | Icon when locked.                 |
| `unlocked_icon`  | `string`  | `mdi:lock-open-variant`  | Icon when unlocked.               |
| `width`          | `string`  | `260px`                  | CSS width of the card.            |
| `fill_container` | `boolean` | `false`                  | Stretch the card to the full dashboard column width. |
| `height`         | `string`  | `56px`                   | CSS minimum height of the card.   |
| `border_radius`  | `string`  | `999px`                  | CSS border radius.                |
| `show_state`     | `boolean` | `true`                   | Show state text under the name.   |
| `locked_color`   | `string`  | `#45d158`                | Glow color when locked.           |
| `unlocked_color` | `string`  | `#ff3b30`                | Glow color when unlocked.         |
| `pending_color`  | `string`  | `#ff8a1c`                | Glow color while locking or unlocking. |
| `jammed_color`   | `string`  | `#ff3b30`                | Glow color when jammed.           |
| `background`     | `string`  | `#101722`                | Base card background.             |
| `tap_action`     | `string`  | `toggle`                 | `toggle`, `lock`, `unlock`, `more-info`, or `none`. |
| `hold_action`    | `string`  | `more-info`              | `toggle`, `lock`, `unlock`, `more-info`, or `none`. |
| `animated`       | `boolean` | `true`                   | Enable glow animation.            |

## Glow Thermostat Card

```yaml
type: custom:glow-thermostat-card
entity: climate.hallway
name: Hallway
temperature_step: 1
```

Lanai AC feature example:

```yaml
type: custom:glow-thermostat-card
entity: climate.lanai_ac
name: Lanai AC
show_features: true
filter_entity: binary_sensor.lanai_air_conditioner_filter
problem_entity: binary_sensor.lanai_air_conditioner_problem
pm25_entity: sensor.lanai_air_conditioner_pm2_5
display_light_entity: light.lanai_air_conditioner_display
sleep_mode_entity: select.lanai_air_conditioner_sleep_mode
vertical_position_entity: select.lanai_air_conditioner_vertical_position
horizontal_position_entity: select.lanai_air_conditioner_horizontal_position
anti_frost_switch_entity: switch.lanai_air_conditioner_anti_frost
anti_mildew_switch_entity: switch.lanai_air_conditioner_anti_mildew
eco_switch_entity: switch.lanai_air_conditioner_eco_mode
health_switch_entity: switch.lanai_air_conditioner_health
soft_wind_switch_entity: switch.lanai_air_conditioner_soft_wind
sound_switch_entity: switch.lanai_air_conditioner_sound
```

### Glow Thermostat Options

| Name               | Type      | Default           | Description                       |
| ------------------ | --------- | ----------------- | --------------------------------- |
| `entity`           | `string`  | Required          | Climate entity to display and control. |
| `name`             | `string`  | Entity friendly name | Display name.                  |
| `width`            | `string`  | `320px`           | CSS width of the card.            |
| `fill_container`   | `boolean` | `false`           | Stretch the card to the full dashboard column width. |
| `height`           | `string`  | `auto`            | Optional fixed CSS height. Leave unset to shrink-wrap visible controls. |
| `border_radius`    | `string`  | `18px`            | CSS border radius.                |
| `show_state`       | `boolean` | `false`           | Show current state text under the title. |
| `show_current`     | `boolean` | `true`            | Show current temperature when available. |
| `show_controls`    | `boolean` | `true`            | Show `-` and `+` setpoint buttons. |
| `show_mode_buttons` | `boolean` | `true`            | Show HVAC mode buttons from the climate entity. |
| `show_features`    | `boolean` | `false`           | Show the compact feature controls area.  |
| `show_hvac_modes`  | `boolean` | `true`            | Show HVAC mode selector when `hvac_modes` are available. |
| `show_fan_modes`   | `boolean` | `true`            | Show fan mode selector when `fan_modes` are available. |
| `show_swing_modes` | `boolean` | `true`            | Show vertical swing selector when `swing_modes` are available. |
| `show_horizontal_swing_modes` | `boolean` | `true` | Show horizontal swing selector when supported. |
| `filter_entity`    | `string`  | Optional          | Binary problem sensor for filter alerts. |
| `problem_entity`   | `string`  | Optional          | Binary problem sensor for AC faults.     |
| `pm25_entity`      | `string`  | Optional          | PM2.5 sensor to display.                 |
| `display_light_entity` | `string` | Optional        | Display light entity to toggle.          |
| `sleep_mode_entity` | `string` | Optional          | Select entity for sleep mode.            |
| `vertical_position_entity` | `string` | Optional    | Select entity for vertical vane position. |
| `horizontal_position_entity` | `string` | Optional  | Select entity for horizontal vane position. |
| `anti_frost_switch_entity` | `string` | Optional   | Anti-frost switch entity to toggle.      |
| `anti_mildew_switch_entity` | `string` | Optional  | Anti-mildew switch entity to toggle.     |
| `eco_switch_entity` | `string` | Optional          | Eco mode switch entity to toggle.        |
| `health_switch_entity` | `string` | Optional       | Health switch entity to toggle.          |
| `soft_wind_switch_entity` | `string` | Optional    | Soft wind switch entity to toggle.       |
| `sound_switch_entity` | `string` | Optional       | Sound switch entity to toggle.           |
| `temperature_step` | `number`  | `1`               | Setpoint change per tap.          |
| `heat_color`       | `string`  | `#ff8a1c`         | Glow color when heating.          |
| `cool_color`       | `string`  | `#2f80ff`         | Glow color when cooling.          |
| `idle_color`       | `string`  | `#45d158`         | Glow color when active but idle.  |
| `off_color`        | `string`  | `#697382`         | Icon/border color when off.       |
| `background`       | `string`  | `#101722`         | Base card background.             |
| `tap_action`       | `string`  | `more-info`       | `more-info` or `none`.            |
| `hold_action`      | `string`  | `more-info`       | `more-info` or `none`.            |
| `animated`         | `boolean` | `true`            | Enable glow animation.            |

## Dual Outlet Card

```yaml
type: custom:dual-outlet-card
title: Desk Outlets
entity_1: switch.desk_outlet_top
entity_2: switch.desk_outlet_bottom
name_1: Top Outlet
name_2: Bottom Outlet
layout: duplex
```

### Dual Outlet Options

| Name            | Type      | Default                 | Description                       |
| --------------- | --------- | ----------------------- | --------------------------------- |
| `entity_1`      | `string`  | Required                | First outlet entity.              |
| `entity_2`      | `string`  | Optional                | Second outlet entity.             |
| `title`         | `string`  | `Outlets`               | Group title.                      |
| `name_1`        | `string`  | Entity friendly name    | First outlet display name.        |
| `name_2`        | `string`  | Entity friendly name    | Second outlet display name.       |
| `icon_1`        | `string`  | `mdi:power-socket-us`   | First outlet icon.                |
| `icon_2`        | `string`  | `mdi:power-socket-us`   | Second outlet icon.               |
| `width`         | `string`  | `320px`                 | CSS width of the card.            |
| `fill_container` | `boolean` | `false`                | Stretch the card to the full dashboard column width. |
| `button_height` | `string`  | `54px`                  | CSS minimum height per outlet.    |
| `gap`           | `string`  | `12px`                  | Space between outlet buttons.     |
| `layout`        | `string`  | `duplex`                | `duplex`, `grid`, or `stack`.     |
| `show_title`    | `boolean` | `false`                 | Show the group title.             |
| `show_state`    | `boolean` | `true`                  | Show outlet state text.           |
| `on_color`      | `string`  | `#ff3b30`               | Glow color when an outlet is on.  |
| `off_color`     | `string`  | `#697382`               | Icon/border color when off.       |
| `background`    | `string`  | `#101722`               | Base button background.           |
| `tap_action`    | `string`  | `toggle`                | `toggle`, `more-info`, or `none`. |
| `hold_action`   | `string`  | `more-info`             | `toggle`, `more-info`, or `none`. |
| `animated`      | `boolean` | `true`                  | Enable glow animation when on.    |

## Speed Fan Card

```yaml
type: custom:speed-fan-card
entity: fan.kitchen_fan
name: Fan
speed_1_percentage: 33
speed_2_percentage: 66
speed_3_percentage: 100
```

Tap the pill to cycle through Off, 1, 2, and 3. Tap a speed button to jump straight to that speed.

### Speed Fan Options

| Name                 | Type      | Default   | Description                       |
| -------------------- | --------- | --------- | --------------------------------- |
| `entity`             | `string`  | Required  | Fan entity to display and control. |
| `name`               | `string`  | Entity friendly name | Display name.             |
| `icon`               | `string`  | `mdi:fan` | Icon shown on the left.           |
| `width`              | `string`  | `260px`   | CSS width of the card.            |
| `fill_container`     | `boolean` | `false`   | Stretch the card to the full dashboard column width. |
| `height`             | `string`  | `56px`    | CSS minimum height of the card.   |
| `border_radius`      | `string`  | `999px`   | CSS border radius.                |
| `show_state`         | `boolean` | `true`    | Show state text under the name.   |
| `show_speed_buttons` | `boolean` | `true`    | Show Off, 1, 2, and 3 buttons.    |
| `speed_1_percentage` | `number`  | `33`      | Fan percentage for speed 1.       |
| `speed_2_percentage` | `number`  | `66`      | Fan percentage for speed 2.       |
| `speed_3_percentage` | `number`  | `100`     | Fan percentage for speed 3.       |
| `on_color`           | `string`  | `#45d158` | Glow color when on.               |
| `off_color`          | `string`  | `#697382` | Icon/border color when off.       |
| `background`         | `string`  | `#101722` | Base button background.           |
| `tap_action`         | `string`  | `cycle`   | `cycle`, `more-info`, or `none`.  |
| `hold_action`        | `string`  | `more-info` | `more-info` or `none`.          |
| `animated`           | `boolean` | `true`    | Enable glow and fan animation.    |

## Local Development

```bash
npm install
npm run build
npm run demo
```

Then open the local Vite URL.

## License

MIT
