# Hansel Fit — Website

**Personal Trainer & Fitness Coach — Hansel Cerquera**

---

## How to open locally (offline)

1. **Simply double-click `index.html`** in Windows Explorer.  
   The site opens directly in your browser — no server required, no Node.js, no installation.

2. All styles (`css/style.css`) and scripts (`js/main.js`) use relative paths and work under `file://`.

3. Images are served from `public/images/` — no CDN or server needed.

---

## Project Structure

```
Pagina Hansel.Fit 2/
│
├── index.html                  ← Main website (open this)
│
├── css/
│   └── style.css               ← All styles
│
├── js/
│   └── main.js                 ← All interactivity (FAQ, comparator, nav, etc.)
│
├── public/
│   └── images/
│       ├── hero/               ← hero-main.jpeg, hero-training.jpeg
│       ├── about/              ← about-portrait.jpeg, about-coaching.jpeg, about-assessment.jpeg, ABOUT 7.jpeg
│       ├── services/           ← service-personal-training.jpeg, service-online-coaching.jpeg, service-training-plans.jpeg, service-nutrition.jpeg
│       ├── methodology/        ← method-assessment.png, method-planning.png, method-execution.jpeg, method-progress.png
│       ├── transformations/    ← results-juan-before/after.jpeg, results-client-02/03-before/after.jpeg, results-testimonial-01.png
│       └── contact/            ← contact-coach.png
│
├── Hansel_Cerquera_Banco_Visual/  ← Original bank (DO NOT delete — preserved as-is)
│
├── _redirects                  ← Cloudflare Pages routing
└── README.md                   ← This file
```

---

## Configuration — Required before publishing

Open `js/main.js` and update the `CONFIG` object at the top:

```js
var CONFIG = {
  whatsappNumber: '573001234567',     // Your number: country code + number, no + or spaces
  whatsappDefaultMsg: 'Hello Hansel! I am interested in your coaching services.',
  instagramHandle: 'hanselfit',       // Without @
  contactEmail: 'hansel@email.com'    // Your professional email
};
```

Save and reload — all WhatsApp buttons, Instagram links, and the form will use these values automatically.

---

## Sections implemented

| Section | Status |
|---------|--------|
| Navigation (desktop + mobile) | ✅ Complete |
| Hero — Train With Purpose | ✅ Complete |
| About Hansel | ✅ Complete |
| Services (4 cards) | ✅ Complete |
| The Hansel Method (4 stages) | ✅ Complete |
| Transformations + Before/After comparator | ✅ Complete |
| Training in Motion (content placeholders) | ✅ Prepared |
| FAQ (8 questions, animated accordion) | ✅ Complete |
| Contact + Application form | ✅ Complete |
| Client Login (module in development notice) | ✅ Prepared |
| Footer | ✅ Complete |
| WhatsApp float button | ✅ Complete |

---

## Functions that require internet

| Feature | Requires internet |
|---------|-------------------|
| Google Fonts (Barlow Condensed + Inter) | ✅ Falls back to system fonts offline |
| WhatsApp buttons | ✅ Need internet to open WhatsApp Web |
| Instagram links | ✅ Need internet |
| Form submission (opens WhatsApp/email) | ✅ WhatsApp needs internet; email client works offline |
| Google Analytics (not installed) | — Placeholder only |
| All layout, images, animations, FAQ | ❌ Work 100% offline |

---

## Deployment on Cloudflare Pages

### Option A — Drag & Drop (simplest)

1. Go to [https://dash.cloudflare.com](https://dash.cloudflare.com) → **Pages** → **Create a Project**
2. Choose **"Upload assets"**
3. Zip the contents of this folder (everything except `Hansel_Cerquera_Banco_Visual` if you want a smaller zip, or include it — it won't hurt)
4. Upload → Deploy
5. Done. Your site is live.

### Option B — Git (recommended for updates)

1. Push this folder to a GitHub/GitLab repository
2. In Cloudflare Pages: Connect to Git → Select repo
3. Build settings:
   - **Framework preset**: None
   - **Build command**: (leave empty)
   - **Build output directory**: `/` (root)
4. Deploy

### Custom domain

In Cloudflare Pages → Custom Domains → Add your domain. Cloudflare manages HTTPS automatically.

### The `_redirects` file

Already included. It handles SPA-style 404 fallback for Cloudflare Pages:
```
/* /index.html 200
```

---

## What's prepared for future phases

### Phase 2 — Video content
- `training-card` components are ready to receive video
- Add `data-video-src` or `data-video-url` attributes
- Wire up a lightweight player in `js/main.js`
- Compatible with Cloudflare Stream URLs

### Phase 3 — Client Portal
- Login page shell is ready (`#login-page`)
- Modular structure: add auth (Cloudflare Access, Supabase, etc.)
- Dashboard pages can be added as separate HTML files

### Phase 4 — Spanish version
- All content is in clearly marked HTML sections
- Add a language toggle in the nav
- Duplicate sections with `lang="es"` class and toggle visibility via JS

### Phase 5 — Backend / Form
- Replace the WA/mailto form action with a real endpoint
- Options: Cloudflare Workers + email, Formspree, Resend, Netlify Forms

---

## Data to complete / configure

| Item | Location | Action needed |
|------|----------|---------------|
| WhatsApp number | `js/main.js` → `CONFIG.whatsappNumber` | Add your number |
| Instagram handle | `js/main.js` → `CONFIG.instagramHandle` | Add your handle |
| Contact email | `js/main.js` → `CONFIG.contactEmail` | Add your email |
| Client names (02, 03) | `index.html` → `#results` section | Confirm with clients |
| Meta description | `index.html` → `<meta name="description">` | Refine if needed |
| Open Graph URL | `index.html` → `<meta property="og:url">` | Add your real domain |
| Favicon | `index.html` → `<link rel="icon">` | Replace with real .ico file |
| Google Analytics | `index.html` → comment near `</head>` | Add tracking ID when ready |
| Privacy Policy | Footer links | Create when ready for publishing |

---

*Built with HTML5, CSS3 and vanilla JavaScript. No frameworks. No build tools required. Works offline and deploys to Cloudflare Pages as-is.*
