# Tells of an AI-made mobile screen

Name what the screen actually shows, worst first. One tell is a detail; five together are why the app "looks AI-made". The code hints are what `scan.mjs` looks for.

## Structure

- **Web page in a phone.** A hero block, a headline, three feature cards and a big button, where the platform would use a list, a large title and a toolbar.
- **Cards inside cards.** Rounded, shadowed containers nested two or three deep. Lists drawn as a stack of separate cards with gaps.
- **Custom tab bar.** A floating pill or a home made bar with a glowing center button instead of the native tab bar. Hint: `tabBar={` with a custom component, absolutely positioned bars, `TabView` replaced by an `HStack`.
- **Custom back button.** An arrow icon in a circle that breaks the swipe back gesture. Hint: `headerLeft` with a custom icon, `.navigationBarBackButtonHidden(true)`.
- **Everything centered.** Titles, body text and lists centered on every screen.
- **Fixed heights.** Screens built for one phone size: a primary button pushed off screen on a small phone or at a large text size, onboarding pages that cannot scroll. Hint: `height: 7xx`, `Dimensions.get('window').height *`, `.frame(height: 6xx)`.

## Color and surfaces

- **Gradient chrome.** Gradient headers, gradient buttons, gradient text, gradient tab bars. Hint: `LinearGradient`, `expo-linear-gradient`, `MaskedView` around text.
- **Purple, violet and teal by default.** Indigo to violet, violet to pink, cyan to teal. Hint: `#8B5CF6`, `#7C3AED`, `#6366F1`, `#A855F7`, `#EC4899`, `.purple`, `.indigo`.
- **Glow.** Colored shadows, neon borders, blurred blobs behind content. Hint: `shadowColor` set to a brand color, `.shadow(color: .purple`.
- **Shadow on everything.** Every card, button and chip with a drop shadow.
- **Glass for its own sake.** Blur on surfaces that sit on a flat background.
- **Hard-coded light and dark.** `#FFFFFF` and `#000000` everywhere, dark mode missing or broken.

## Type

- **Typed in sizes.** `fontSize: 28`, `.font(.system(size: 28))` everywhere instead of text styles, so Dynamic Type and font scale do nothing or break the layout.
- **Scaling turned off.** `allowFontScaling={false}`, `.dynamicTypeSize(.large)` locks.
- **Too many weights.** Black, bold, semibold and light on one screen.
- **Shouting.** ALL CAPS tracked labels, title case everywhere, exclamation marks.

## Icons and decoration

- **Emoji as UI.** Emoji in tab labels, buttons, list bullets and section titles. "🔥 Streak", "✨ Pro", "🚀 Get started".
- **Mixed icon families.** Ionicons next to SF Symbols next to emoji. Hint: `@expo/vector-icons` sets mixed in one screen.
- **Sparkle badges.** "New ✨", "AI ✨", "PRO" chips with gradients.
- **Stock illustrations.** Generic 3D blobs, isometric people, Lottie confetti on ordinary screens.

## Touch and feedback

- **Tiny targets.** Icon buttons of 24 to 32 points with no hit slop.
- **No pressed state.** `TouchableWithoutFeedback`, `Pressable` without a pressed style, `onTapGesture` on plain views.
- **Haptics on everything.** A haptic on every tap, so none means anything.
- **Toasts for errors.** A toast that disappears before it can be read instead of an inline message.

## Copy

- **Marketing voice in the app.** "Unlock your full potential", "Supercharge your day", "Your journey starts now!".
- **Vague buttons.** "Continue", "Let's go", "Get started" where a specific verb fits.
- **Fake personalisation.** "Hey there, superstar!" with no name known.

## Motion

- **Everything animates.** Pulsing buttons, looping shimmer, bouncing icons in the chrome.
- **Custom transitions.** Fades and slides that replace the platform push and sheet.
- **Ignores Reduce Motion.**

## Onboarding and paywall

- **Five slides of claims** before the user sees the app.
- **Permission requests on launch** for notifications, location and tracking at once.
- **Paywall tricks.** A tiny or delayed close button, a fake countdown, a crossed out price that never existed, the weekly price shown as the hero, no restore button, no terms or privacy links. These are App Review rejections, not only design problems.
