<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Harun's Blog - Seth Godin Style Blog

A modern, performant blog application built with React, TypeScript, and Vite. Features AI-powered post generation using Google's Gemini AI.

## ✨ Features

- 🚀 **Fast & Optimized** - Built with Vite for lightning-fast development and optimized production builds
- 🎨 **Seth Godin Inspired Design** - Clean, minimal, and focused on content
- 🤖 **AI Post Generation** - Generate blog posts using Google's Gemini AI
- 🔍 **Search & Filter** - Filter posts by tags and search through content
- 📊 **Analytics Ready** - Google Analytics 4 integration
- 📱 **Responsive Design** - Works seamlessly on all devices
- ⚡ **Performance Optimized** - React.memo, code splitting, and lazy loading

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe code
- **Vite** - Next-generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **React Markdown** - Markdown rendering
- **Lucide React** - Beautiful icons
- **Google Gemini AI** - AI-powered content generation

## 🚀 Quick Start

**Prerequisites:** Node.js 18+

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Harun-s-Blog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your API keys:
   - `VITE_GEMINI_API_KEY` - Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - `VITE_GA_MEASUREMENT_ID` - (Optional) Your Google Analytics 4 ID

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

## 📦 Project Structure

```
├── components/          # React components
│   ├── Header.tsx
│   ├── PostList.tsx
│   ├── PostDetail.tsx
│   ├── Sidebar.tsx
│   └── MarkdownRenderer.tsx
├── services/           # Service layer
│   ├── geminiService.ts    # AI integration
│   ├── analytics.ts        # Google Analytics
│   └── viewService.ts      # View counting
├── utils/              # Utility functions
├── posts/              # Blog post content
├── App.tsx             # Main application
└── index.tsx           # Entry point
```

## 🎯 Performance Optimizations

- ✅ All components wrapped with `React.memo` to prevent unnecessary re-renders
- ✅ Event handlers use `useCallback` for stable references
- ✅ Code splitting with manual chunks (React, Markdown, Utils)
- ✅ Terser minification with console.log removal in production
- ✅ Optimized TypeScript configuration
- ✅ Production builds exclude source maps for smaller bundles

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (with type checking)
- `npm run preview` - Preview production build
- `npm run lint` - Type check without emitting files

## 🌐 Deployment

This app can be deployed to any static hosting service:
- GitHub Pages
- Vercel
- Netlify
- Cloudflare Pages

## 📄 License

MIT

## 👤 Author

**Harun Aksaya**

---

Built with ❤️ using React, TypeScript, and Vite
