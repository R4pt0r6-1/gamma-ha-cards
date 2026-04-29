# Gamma HA Cards Agent Guide

This repo is a Home Assistant Lovelace card collection. Future agents should read this before adding or changing cards.

## Product Direction

- Build compact dashboard controls, not generic Lovelace clones.
- Cards should feel fast, polished, and useful on a real wall/tablet dashboard.
- Default sizing should work in small dashboard grids, with every card resizable through config.
- Active states should be obvious through an outline glow around the whole control, not only a tiny icon color change.
- Off states should be quiet: dark background, muted icon, no heavy glow.
- Text should be centered in the pill/card body unless the existing card pattern clearly needs otherwise.
- Do not render separate card headers like `Switch`, `Light`, or `Fan` above compact pill controls. The dashboard layout can supply section headings when the user wants them.
- Avoid explanatory UI copy inside the card itself. The dashboard should look clean, not like documentation.

## Visual Style

- Base background: dark glass-like pill/tile using layered gradients and subtle inset highlights.
- Default card background: `#101722`.
- Default off color: `#697382`.
- Default glow colors by domain:
  - Lights: orange, usually `#ff8a1c`.
  - Switches and fans: green, usually `#45d158`.
  - Outlets: red, usually `#ff3b30`.
- Use an outline glow all around the active card. Keep the glow visible on all edges.
- Use `border-radius: 999px` for pill controls unless the card represents a grouped object like a duplex outlet.
- Keep cards usable at narrow widths. Long names must truncate cleanly and never overlap icons/buttons.
- Prefer `ha-icon` with MDI icons from Home Assistant. Only use custom CSS/SVG when the normal icon looks wrong for the object, like the duplex outlet.

## Engineering Pattern

- One card per file under `src/cards/`.
- Use Lit with `LitElement`, `css`, `html`, and `nothing`.
- Keep the card class and its visual editor class in the same file.
- Register the custom element at the bottom of the file with a guarded `customElements.define`.
- Push a metadata entry into `window.customCards` so the card appears in Home Assistant's card picker.
- Import the card from `src/index.ts`.
- Do not hand-edit generated bundles. Run `npm run build`; it writes both `dist/gamma-ha-cards.js` and root `gamma-ha-cards.js` for HACS.

## Home Assistant Behavior

- Every card must accept `hass` as a property with `{ attribute: false }`.
- Every card must throw `Entity is required` when its required entity is missing.
- Use `this.hass.states[entityId]` as the source of truth.
- Treat missing, `unknown`, and `unavailable` entities as unavailable and disable service actions.
- Use Home Assistant services instead of local-only state changes:
  - Toggle cards call `<domain>.toggle`.
  - Turn-off actions call `<domain>.turn_off`.
  - Light dimmers call `light.turn_on` with `brightness_pct`.
  - Fan speed controls call `fan.set_percentage`.
- Interactive controls should update optimistically before the Home Assistant service round-trip finishes, then fall back to HA state after a short timeout or on service failure.
- Dimmer controls should keep an optimistic brightness percent after pointer release so the slider fill and glow do not snap back while Home Assistant updates.
- Dispatch `hass-more-info` for more-info actions:

```ts
this.dispatchEvent(
  new CustomEvent('hass-more-info', {
    detail: { entityId: this.config.entity },
    bubbles: true,
    composed: true,
  }),
);
```

## Visual Editor Requirements

- Each new card should provide `static getConfigElement()` and a matching editor custom element.
- Use domain-specific entity selectors so the user only sees valid entities:
  - Light card: `selector: { entity: { domain: 'light' } }`
  - Switch card: `selector: { entity: { domain: 'switch' } }`
  - Fan card: `selector: { entity: { domain: 'fan' } }`
- Include visual editor controls for the expected dashboard options:
  - Entity
  - Name
  - Icon
  - Width
  - Height
  - Radius
  - Fill container
  - Show state
  - On color
  - Off color
  - Background
  - Tap action
  - Hold action
  - Animated glow
- Keep editor layouts simple: sections named `Main`, `Style`, `Actions`, and a domain section when needed.
- Use existing `fireConfigChanged`, `updateConfig`, `renderTextInput`, `renderIconPicker`, `renderSwitch`, and `renderSelect` patterns from existing cards.

## Adding A New Card Checklist

1. Create `src/cards/<card-name>.ts`.
2. Define a typed config interface and `DEFAULT_CONFIG`.
3. Implement the card render with the established dark pill/glow style.
4. Implement action handling and unavailable-state handling.
5. Implement the visual editor with a domain-specific entity selector.
6. Register the custom element and `window.customCards` metadata.
7. Import the new file in `src/index.ts`.
8. Add a demo section and mock entities in `demo/index.html`.
9. Add README docs with YAML and option table.
10. Run `npm run build`.
11. Commit source, docs, demo, and generated bundle files together.

## Existing Cards To Copy From

- `src/cards/glow-light-card.ts`: best reference for a simple glowing pill plus dimmer behavior.
- `src/cards/glow-switch-card.ts`: best reference for a plain switch-only glowing toggle.
- `src/cards/speed-fan-card.ts`: best reference for compact controls inside the pill.
- `src/cards/dual-outlet-card.ts`: best reference for grouped controls and custom object styling.

## HACS And Release Notes

- HACS serves the root bundle: `gamma-ha-cards.js`.
- `hacs.json` must keep `"filename": "gamma-ha-cards.js"`.
- Home Assistant resource URL should look like:

```text
/hacsfiles/gamma-ha-cards/gamma-ha-cards.js?v=<cache-bump>
```

- When users report `Custom element doesn't exist`, verify:
  - The card file is imported by `src/index.ts`.
  - `npm run build` was run.
  - The generated root `gamma-ha-cards.js` contains the new custom element.
  - The HACS resource URL cache query was bumped.
