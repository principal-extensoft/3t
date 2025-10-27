# CSS Architecture Documentation

## Overview

The tracker application now uses a modular CSS architecture that separates structural/layout concerns from visual/theming concerns. This makes it easy to maintain consistent functionality while creating different visual themes.

## File Structure

```
css/
├── base.css              # Structural & layout styles (theme-agnostic)
├── theme-default.css     # Default light theme
├── theme-dark.css        # Dark mode theme
├── tracker.css           # Legacy styles (kept for compatibility)
└── rocket-styles.css     # Legacy styles (kept for compatibility)
```

## Architecture Principles

### `base.css` - Structure & Layout
Contains **theme-agnostic** styles:
- Layout properties (display, position, flex, grid)
- Spacing (padding, margin)
- Sizing (width, height)
- Typography structure (font-size, font-weight, line-height)
- Animations and transitions
- Z-index and layering
- Element positioning

**Does NOT contain:**
- Colors
- Background colors
- Border colors
- Box shadows
- Gradient backgrounds

### `theme-*.css` - Colors & Visual Styling
Contains **theme-specific** styles:
- All color values
- Background colors and gradients
- Border colors
- Box shadows
- Color-based hover/focus states
- Theme-specific visual enhancements

## Using the Themes

### In HTML
```html
<!-- Base structure (required) -->
<link href="css/base.css" rel="stylesheet">

<!-- Choose one theme -->
<link href="css/theme-default.css" rel="stylesheet">
<!-- OR -->
<link href="css/theme-dark.css" rel="stylesheet">
```

### Switching Themes
To switch themes, simply replace the theme CSS file reference in your HTML:

**Default Light Theme:**
```html
<link href="css/theme-default.css" rel="stylesheet">
```

**Dark Theme:**
```html
<link href="css/theme-dark.css" rel="stylesheet">
```

## Creating New Themes

To create a new theme:

1. Copy `theme-default.css` to `theme-yourname.css`
2. Modify only the color values, keeping all property names and selectors the same
3. Test with `base.css` to ensure layout remains consistent

### Theme Color Categories

When creating a theme, focus on these color categories:

#### Core UI Colors
- Body background
- Text colors (primary, secondary, muted)
- Border colors
- Shadow colors

#### Component States
- Default state
- Hover state
- Active/selected state
- Disabled state

#### Semantic Colors
- Success/completed (green tones)
- Warning/deferred (yellow tones)
- Error/blocked (red tones)
- Info/in-progress (blue tones)
- Neutral/not-started (gray tones)

#### Urgency & Importance
- High urgency (red)
- Medium urgency (yellow)
- Low urgency (green)

## Example Theme Variations

### Current Themes

**Default Theme** (`theme-default.css`)
- Light background (#f8f9fa)
- Bootstrap-inspired colors
- Professional appearance
- High contrast for readability

**Dark Theme** (`theme-dark.css`)
- Dark background (#1a1d23)
- Reduced eye strain for low-light
- Vibrant accent colors
- Modern aesthetic

### Future Theme Ideas

**High Contrast Theme** - For accessibility
- Pure black backgrounds
- Pure white text
- Maximum contrast ratios
- WCAG AAA compliant

**Colorblind-Friendly Theme**
- Color combinations safe for all types of color blindness
- Shape/pattern based differentiation
- Higher reliance on text labels

**Minimal Theme**
- Monochromatic color scheme
- Subtle gradients
- Clean, distraction-free design

**Custom Branded Theme**
- Company/personal brand colors
- Logo color integration
- Custom accent colors

## Benefits of This Architecture

1. **Easy Theme Switching** - Change one file reference
2. **Consistent Layout** - Structure never changes between themes
3. **Maintainable** - Layout fixes happen once in base.css
4. **Scalable** - Add unlimited themes without touching layout
5. **Clear Separation** - Know exactly where to make changes
6. **No Duplication** - Layout code written once
7. **Team Friendly** - Designers work on themes, developers on structure

## Migration Notes

The legacy `tracker.css` and `rocket-styles.css` files are still loaded for backward compatibility. Over time, their styles can be migrated into the new architecture:
- Structural styles → `base.css`
- Visual styles → appropriate `theme-*.css` files

## Best Practices

### When Adding New Styles

**For structural changes:**
- Add to `base.css`
- Use generic property names (not color-specific)
- Think about how it works with any color scheme

**For visual changes:**
- Add to ALL theme files
- Maintain consistency across themes
- Test with different themes

### Naming Conventions

Use semantic class names that describe purpose, not appearance:
- ✅ `.status-completed` (semantic)
- ❌ `.green-background` (appearance)

This allows themes to interpret the meaning with their own colors.

## Testing Themes

To test a theme:
1. Load the app with the theme
2. Navigate through all views (Today, Calendar, Board, Work, Reports)
3. Check all component states (hover, active, disabled)
4. Verify text readability on all backgrounds
5. Test with actual data (tasks, time logs, etc.)

## Contributing New Themes

When contributing a new theme:
1. Follow the existing theme structure
2. Include all selectors from `theme-default.css`
3. Test thoroughly across all views
4. Document any special considerations
5. Provide screenshot examples

## Performance Considerations

- Keep theme files focused only on colors
- Avoid duplicating layout properties across themes
- Use CSS custom properties (variables) where appropriate for easier maintenance
- Minimize specificity conflicts between base and theme files

## Future Enhancements

Potential improvements to the architecture:
- CSS custom properties for runtime theme switching
- Theme selection UI in settings
- User preference persistence in localStorage
- Automatic theme based on system preference (prefers-color-scheme)
- Theme preview before applying
