# DossierBJ Design Notes

## Direction

DossierBJ uses a calm civic workspace style: readable, source-first, mobile-friendly and intentionally restrained. The interface should feel like a trustworthy public-interest tool, not a marketing page or an opaque AI demo.

## Principles

- Put source status, disclaimers and verification notes near the administrative claim they qualify.
- Keep pages scannable: short sections, visible citations, direct actions.
- Use cards only for repeated items or framed tools; page sections should stay open and easy to scan.
- Avoid decorative graphics that compete with source review work.
- Do not use negative letter spacing. Let type breathe with line-height and spacing.
- Keep the color system balanced across warm canvas, ink, teal, amber and semantic states.

## Tokens

```text
canvas: #faf9f5
surface-soft: #f5f0e8
surface-card: #efe9de
surface-dark: #181715
ink: #141413
body: #3d3d3a
muted: #6c6a64
primary: #cc785c
primary-active: #a9583e
accent-teal: #5db8a6
accent-amber: #e8a55a
success: #5db872
warning: #d4a017
error: #c64545
```

## Typography

- Display: Cormorant Garamond, weight 400, letter spacing 0.
- UI/body: Inter, weights 400-600, letter spacing 0 unless uppercase labels need positive tracking.
- Mono: JetBrains Mono for code, IDs and command examples.

## Component Guidance

- Primary actions use the coral primary button.
- Secondary actions use light neutral buttons or text links.
- Source badges and confidence indicators should use semantic colors, not decorative gradients.
- Forms must explain local-only behavior through nearby helper text when data is stored in `localStorage`.
- Navigation should remain compact on desktop and use the mobile sheet below 768px.

## Accessibility

- Preserve visible focus states.
- Keep contrast readable on both canvas and dark surfaces.
- Do not encode verification status with color alone.
- Buttons and links should have clear labels in French.
