# React Native and Expo fixes

Check the project's versions first (`package.json`). Prefer what the project already has; add a package only when the platform piece is missing.

## Navigation

- Use the native stack (`@react-navigation/native-stack`, or Expo Router's `Stack`, which is native). Replace JS stacks and custom transitions.
- Native tab bar: Expo Router `Tabs` or `@react-navigation/bottom-tabs` with default rendering; on recent Expo, `expo-router/unstable-native-tabs` renders the system tab bar. Remove floating custom tab bars.
- Large titles on iOS root screens: `headerLargeTitle: true` with a scroll view as the first child (`contentInsetAdjustmentBehavior="automatic"`).
- Sheets: `presentation: 'formSheet'` with `sheetAllowedDetents` and `sheetGrabberVisible` instead of a custom modal.
- Keep the system back button. If a custom `headerLeft` exists only for style, delete it.

## Layout

- Screens that can exceed the viewport scroll. Pin the primary action outside the `ScrollView`, give the scroll content `flexGrow: 1`, and never place the button after a `flex: 1` spacer in a non scrolling view.
- Safe areas: `react-native-safe-area-context` (`useSafeAreaInsets` or `SafeAreaView` with edges). Do not hard-code 44 or 34.
- Lists: `FlatList` or `SectionList` with separators. A settings or detail screen reads like an inset grouped list: section header, rows with a hairline separator (`StyleSheet.hairlineWidth`), footer text.
- Remove nested cards. One container level; inside it, rows.

## Type

- Do not set `allowFontScaling={false}`. If big sizes break a layout, cap with `maxFontSizeMultiplier` (around 1.3 to 1.6 for titles, higher or none for body), ideally through one shared `Text` wrapper.
- Define a small type ramp once (for example `largeTitle 34`, `title 22`, `headline 17/600`, `body 17`, `subhead 15`, `footnote 13`) and use it everywhere instead of typed in sizes.
- On iOS, the system font is the default; a custom display font only for the memorable moment.

## Color

- `PlatformColor` gives real system colors on iOS (`PlatformColor('label')`, `'secondaryLabel'`, `'systemGroupedBackground'`, `'separator'`) and Android (`'?attr/colorOnSurface'`). Or `DynamicColorIOS({ light, dark })`.
- `useColorScheme()` for dark mode; never ship hard-coded `#FFFFFF` backgrounds with no dark value.
- Replace `expo-linear-gradient` on headers and buttons with a flat accent or the system background.
- Remove `shadowColor` set to a brand color. If a card needs separation, use a slightly different background layer.

## Icons

- iOS: `expo-symbols` (`SymbolView`) for SF Symbols with weights that match the text. Android fallback: Material Symbols.
- One family per app. Remove emoji used as icons.

## Touch and feedback

- `Pressable` with a pressed style (`opacity` 0.6 to 0.75 or a background change) and `hitSlop` for small icons.
- `expo-haptics`: `selectionAsync` on selection changes, `notificationAsync(Success)` on a completed task. Not on every tap.
- Native controls: `Switch`, `@react-native-community/datetimepicker`, `@react-native-segmented-control/segmented-control`, `ActionSheetIOS` or a menu (`zeego`, `@react-native-menu/menu`) for overflow actions, `Alert.alert` for one destructive confirmation.
- Swipe actions on list rows with `react-native-gesture-handler` `Swipeable` instead of extra buttons.

## Motion

- `react-native-reanimated` layout animations (`FadeIn`, `LinearTransition`) with modest durations. Check `useReducedMotion()` and skip movement when it is on.
- Remove looping pulses and shimmer from chrome.

## Verify

- iOS simulator: `xcrun simctl ui booted content_size accessibility-extra-extra-extra-large` for the largest size, `xcrun simctl ui booted appearance dark` for dark mode. Reset with `content_size large` and `appearance light`.
- Android emulator: `adb shell settings put system font_scale 2.0` and `adb shell cmd uimode night yes`.
