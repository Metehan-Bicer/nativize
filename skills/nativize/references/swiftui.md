# SwiftUI fixes

Check the deployment target first; use the newest API the target allows and fall back cleanly.

## Navigation

- `NavigationStack` with `.navigationTitle` and the default large title on root screens. Remove `.navigationBarBackButtonHidden(true)` that exists only to draw a custom arrow.
- `TabView` with `Tab` items (or `.tabItem`) instead of an `HStack` pretending to be a tab bar.
- Sheets: `.sheet` with `.presentationDetents` and `.presentationDragIndicator(.visible)`.
- Toolbar actions in `.toolbar { ToolbarItem(placement: .primaryAction) { … } }`, not floating circles.

## Layout

- Lists are `List` with `.listStyle(.insetGrouped)` and `Section(header:footer:)`; settings are `Form`. Delete stacks of `RoundedRectangle` cards that imitate them.
- `ScrollView` for anything that can be taller than the screen; pin a primary action with `.safeAreaInset(edge: .bottom)`.
- Let the system manage margins; avoid `.padding(.horizontal, 24)` everywhere on top of a `List`.
- Use `ViewThatFits` or `AnyLayout` to switch an `HStack` to a `VStack` at large Dynamic Type sizes.

## Type

- Text styles: `.font(.largeTitle)`, `.title2`, `.headline`, `.body`, `.subheadline`, `.footnote`. Replace `.font(.system(size: 28))`.
- A custom font must scale: `.font(.custom("Name", size: 17, relativeTo: .body))`.
- Do not lock `.dynamicTypeSize`. If a single element breaks, give it a range like `.dynamicTypeSize(...DynamicTypeSize.accessibility2)`.
- `.fontWeight` once or twice per screen; `.foregroundStyle(.secondary)` for supporting text instead of a lighter weight.

## Color

- `.foregroundStyle(.primary / .secondary / .tertiary)`, `Color(.systemBackground)`, `Color(.secondarySystemGroupedBackground)`, `Color(.separator)`.
- One `.tint(...)` at the root for the accent. Asset catalog colors with dark variants for anything custom.
- Replace `LinearGradient` backgrounds on chrome with flat system backgrounds. Remove `.shadow(color: .purple, radius: 20)` glows.
- Materials (`.regularMaterial`) only over content that moves underneath.

## Icons

- SF Symbols: `Image(systemName:)` or `Label("Title", systemImage:)`. Match weight with `.fontWeight` and use `.symbolRenderingMode(.hierarchical)` for depth instead of gradients.
- No emoji in labels or buttons.

## Touch and feedback

- `Button` with a style (`.borderedProminent` for the one primary action, `.bordered` or plain for the rest) instead of `onTapGesture` on a shape.
- `.contentShape(Rectangle())` and `.frame(minWidth: 44, minHeight: 44)` for small tappable icons.
- `.sensoryFeedback(.selection, trigger:)` and `.sensoryFeedback(.success, trigger:)` on meaningful changes only.
- `Toggle`, `Picker` (`.pickerStyle(.segmented)` or `.menu`), `DatePicker`, `Menu`, `.swipeActions`, `.confirmationDialog` for destructive actions.

## Motion

- `withAnimation(.smooth)` or `.snappy`; `.contentTransition(.numericText())` for changing numbers.
- `@Environment(\.accessibilityReduceMotion)` and skip movement when it is true.
- Remove `repeatForever` animations from chrome.

## Verify

- Xcode previews with `.environment(\.dynamicTypeSize, .accessibility5)` and `.preferredColorScheme(.dark)`.
- Simulator: `xcrun simctl ui booted content_size accessibility-extra-extra-extra-large` and `xcrun simctl ui booted appearance dark`.
