# Platform numbers

Use these instead of guessing. When the platform gives a semantic value (a text style, a system color, a default spacing), prefer it over the number.

## Tap targets

| | Minimum | Notes |
| --- | --- | --- |
| iOS | 44 x 44 pt | Smaller icons get padding or `hitSlop` to reach it |
| Android | 48 x 48 dp | Material touch target; 8 dp between targets |

## Spacing

- A 4 point grid. Common steps: 4, 8, 12, 16, 20, 24, 32.
- iOS screen margins follow the layout margins: 16 pt on most phones, 20 pt on larger ones. Grouped lists inset their own content; do not add another margin around a `List`.
- Android screen margins: 16 dp on phones.
- Space between related items is smaller than space between groups. If every gap is the same, grouping is lost.

## iOS text styles (default size, pt)

| Style | Size | Use |
| --- | --- | --- |
| Large Title | 34 | Root screen titles |
| Title 1 / 2 / 3 | 28 / 22 / 20 | Section and card titles, sparingly |
| Headline | 17 semibold | Row titles, emphasized body |
| Body | 17 | Default text |
| Callout | 16 | Secondary blocks |
| Subheadline | 15 | Supporting text |
| Footnote | 13 | Captions under lists |
| Caption 1 / 2 | 12 / 11 | Metadata |

All of them scale with Dynamic Type. Accessibility sizes go up to roughly 3x for body text; layouts must reflow, not clip.

## Material 3 type scale (sp)

Display L/M/S 57/45/36, Headline L/M/S 32/28/24, Title L/M/S 22/16/14, Body L/M/S 16/14/12, Label L/M/S 14/12/11.

## Color

- iOS: `label`, `secondaryLabel`, `tertiaryLabel`, `systemBackground`, `secondarySystemBackground`, `systemGroupedBackground`, `separator`, `systemFill`, plus one tint.
- Android: Material roles `primary`, `onPrimary`, `surface`, `onSurface`, `surfaceContainer*`, `outlineVariant`; dynamic color where the app allows it.
- Text contrast at least 4.5:1, large text 3:1.

## Corners and elevation

- iOS uses continuous corners. Grouped list sections, sheets and buttons already have the right radius; custom cards around 10 to 16 pt, consistent across the app.
- iOS rarely uses drop shadows on content; separation comes from background color layers. Android uses tonal elevation (surface containers) more than shadows.

## Navigation

- iOS: tab bar for 3 to 5 top level sections, navigation stack with large titles, sheets for focused tasks with a grabber and detents, swipe back always works.
- Android: navigation bar for 3 to 5 sections, top app bar, system back and predictive back gesture, bottom sheets.

## Motion

- Use system transitions and spring defaults. Durations around 200 to 350 ms for UI changes.
- When Reduce Motion is on, replace movement with fades or nothing.
