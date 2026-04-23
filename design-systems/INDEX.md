# ALwith Design Systems Library

Pre-downloaded DESIGN.md files for AI-driven UI generation.
Location: `~/.alwith/design-systems/`

## Available Styles

| File            | Brand    | Style Keywords                                 |
| --------------- | -------- | ---------------------------------------------- |
| `notion.md`     | Notion   | warm minimalism, serif headings, soft surfaces |
| `apple.md`      | Apple    | premium white space, SF Pro, cinematic imagery |
| `stripe.md`     | Stripe   | purple gradients, elegant, fintech             |
| `vercel.md`     | Vercel   | black & white precision, Geist font, developer |
| `linear-app.md` | Linear   | minimalist, purple accent, issue tracker       |
| `figma.md`      | Figma    | colorful, playful, professional                |
| `supabase.md`   | Supabase | dark emerald, code-first, developer            |
| `spotify.md`    | Spotify  | dark + vibrant green, bold type, album art     |
| `airbnb.md`     | Airbnb   | warm coral, photography-driven, rounded UI     |
| `tesla.md`      | Tesla    | extreme reduction, cinematic, full-bleed       |
| `claude.md`     | Claude   | warm terracotta, clean editorial layout        |
| `cursor.md`     | Cursor   | sleek dark, gradient accents, developer IDE    |

## Usage

Copy the desired `.md` file to your project root as `DESIGN.md`, then tell ALwith:
"Build UI following the DESIGN.md in project root."

## Adding More

```bash
cd your-project && npx getdesign@latest add <website-name>
```
