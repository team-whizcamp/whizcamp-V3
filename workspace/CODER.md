<instructions>
This file will be automatically added to your context. 
It serves multiple purposes:
  1. Storing frequently used tools so you can use them without searching each time
  2. Recording the user's code style preferences (naming conventions, preferred libraries, etc.)
  3. Maintaining useful information about the codebase structure and organization
  4. Remembering tricky quirks from this codebase

When you spend time searching for certain configuration files, tricky code coupled dependencies, or other codebase information, add that to this CODER.md file so you can remember it for next time.
Keep entries sorted in DESC order (newest first) so recent knowledge stays in prompt context if the file is truncated.
</instructions>

<coder>
## 2026-10-28
- Replaced the static services list in `index.html` (`.frame-35`) with a six-item interactive accordion using `.services-accordion*` classes.
- Added inline script in `index.html` that toggles each panel independently, updates `aria-expanded`, and animates `max-height` for smooth open/close transitions.
- `style.css` now includes accordion layout, plus/minus icon states, animated panel reveal, and pill-tag/media styles while preserving section spacing and visual hierarchy.
- Added `.responsive-stage` wrapper in `index.html` so the fixed 1440px composition scales fluidly without horizontal scrolling.
- `style.css` now uses root sizing variables (`--page-width`, `--page-height`, `--page-scale`) plus breakpoint-driven scaling for 1440/1024/768/480/320 behavior.
- Preserved existing absolute-layout hierarchy while making all sections scale proportionally from 1920 desktop down to small mobile widths.
- Hero orbit badge (`.group-5`) is now split into layered nodes in `index.html`: `.orbit-badge__ring` and `.orbit-badge__center`.
- `style.css` uses radial mask separation so the outer text ring rotates while the center lightbulb remains static.
- Smooth animation uses `@keyframes orbit-spin` (`28s linear infinite`) with GPU-safe transform/backface settings to avoid flicker.

# File Content Goes Here
</coder>
