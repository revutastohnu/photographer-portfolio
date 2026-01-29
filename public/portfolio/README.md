# Photographer Portfolio

> **Note**: This folder contains portfolio images organized by photo set.

## Structure

Each subfolder corresponds to a photo set defined in `/content/sets/`:

```
portfolio/
  set-slug/
    cover.jpg
    1.jpg
    2.jpg
    3.jpg
    ...
```

## Adding Images

1. Create a folder matching your set's slug
2. Add images referenced in your `set.json`
3. Recommended: Use optimized JPGs (1920px wide max)
4. Next.js will automatically optimize images via `next/image`

## Placeholder Images

For development, you can use placeholder services:
- https://placehold.co/
- https://picsum.photos/
- Or add your own images here
