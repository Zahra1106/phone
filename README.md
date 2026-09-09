# ReCircuit — Certified Rebuilt Phones

Website for ReCircuit, a phone repair and certified-rebuilt-phone shop in Faisalabad.
Built with plain HTML/CSS/JS and [Vite](https://vitejs.dev/).

## Project structure

```
phone/
├── index.html          # All page markup (header, hero, process, shop, etc.)
├── src/
│   ├── main.js          # Product data, product card rendering, scroll effects
│   └── style.css         # All styling
├── public/
│   ├── images/            # Product images (add your phone photos here)
│   └── video/             # Videos used in the scroll-intro and process section
├── package.json
└── README.md
```

## Setup

Requires [Node.js](https://nodejs.org/) installed.

```bash
npm install
```

## Running locally

```bash
npm run dev
```

This starts a local dev server (Vite prints the URL, usually `http://localhost:5173`).
The page auto-reloads when you edit files.

## Building for production

```bash
npm run build
```

Output goes into a `dist/` folder — this is what you upload to your hosting.

To preview the production build locally:

```bash
npm run preview
```

## Common edits

### Add / change a product

Open `src/main.js` and edit the `products` array near the top. Each product looks like:

```js
{
  name: "iPhone 12 · 128GB",
  grade: "A",
  battery: "92% health",
  specs: { RAM: "4GB", Storage: "128GB", Screen: "No marks", Camera: "12MP dual" },
  price: "Rs 68,500",
  was: "Rs 89,000",
  image: "/images/iphone12.jpg",
}
```

- `image` must point to a file inside `public/images/` and start with `/images/...`.
- `grade` must be `"A"`, `"B"`, or `"C"` (used for the filter buttons and badge color).

### Add a product image

1. Put the image file inside `public/images/`.
2. Set `image: "/images/your-file-name.jpg"` on that product in `src/main.js`.

### Change a video

Videos live in `public/video/`. Reference them in `index.html` with a path like
`/video/your-file.mp4`.

### Edit text / sections

All visible text and section layout is in `index.html`. Styling (colors, spacing,
fonts) is in `src/style.css`.

## WhatsApp ordering

The "Order now" button on each product card opens WhatsApp with a pre-filled
message, using this number in `src/main.js`:

```
https://wa.me/923000000000?text=...
```

Replace `923000000000` with the real business WhatsApp number (country code + number, no `+` or spaces).
