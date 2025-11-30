# 🚀 GrowBrandi - AI-Powered Digital Agency

A modern, responsive digital agency website built with React, TypeScript, Framer Motion, and Tailwind CSS. Features impressive styling, AI-powered interactions, and comprehensive digital services.

## ✨ Features

### 🎨 Design & UX
- **Modern UI**: Glassmorphic design with green/blue gradient palette
- **Inter Font**: Clean, modern typography throughout
- **Framer Motion**: Smooth animations and transitions
- **100% Mobile Responsive**: Pixel-perfect scaling and stacking
- **Accessibility**: ARIA labels, keyboard navigation, high contrast support

### 🧩 Components
- **Modular Services**: Flexible service components with custom SVG icons
- **Portfolio Grid**: Project cards with ratings, technologies, and results
- **Testimonial Slider**: Mobile-swipeable testimonial carousel
- **Company Statistics**: Animated stats counters
- **FAQ Section**: Expandable question/answer interface
- **Advanced Contact Form**: Validation with AI assistant integration

### 🔧 Technical Features
- **SEO Optimized**: Meta tags, Open Graph, Twitter Cards
- **Web App Manifest**: PWA-ready with proper icon setup
- **Google Analytics**: Integrated analytics tracking
- **Performance Optimized**: Lazy loading and efficient rendering
- **Error Handling**: Comprehensive error states and loading indicators

### 🤖 AI Integration
- **AI Chat Interface**: Context-aware chatbot (BrandiBot)
- **Slogan Generator**: AI-powered marketing copy generation
- **Smart Contact Forms**: AI-assisted message drafting

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS with custom CSS variables
- **Animations**: Framer Motion
- **Build Tool**: Vite
- **AI**: Google Gemini API
- **Icons**: Heroicons (React components)

## 🚀 Quick Start

**Prerequisites:** Node.js 16+

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure AI (Optional):**
   Update the `GEMINI_API_KEY` in `.env.local` with your actual API key for AI features:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   - Local: http://localhost:3000/
   - Network: http://192.168.0.166:3000/

## 📱 Pages & Sections

### Home Page
- Hero section with animated CTA
- Company statistics
- Services preview
- AI slogan generator
- Projects showcase
- Testimonials slider
- FAQ section

### Services Page
- Detailed service cards with features and pricing
- Modular design for easy addition/editing
- Custom gradient colors per service

### Projects Page
- Portfolio grid with project details
- Client information and results
- Technology stack display
- Rating system

### Contact Page
- Advanced form with validation
- AI-powered message drafting
- Comprehensive contact information
- Newsletter signup

## 🎨 Design System

### Colors
```css
--primary-green: #10b981   /* emerald-500 */
--primary-blue: #3b82f6    /* blue-500 */
--accent-teal: #14b8a6     /* teal-500 */
--glass-bg: rgba(255, 255, 255, 0.05)
--glass-border: rgba(255, 255, 255, 0.1)
```

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800, 900

### Components
- **Glass Effects**: Backdrop blur with transparency
- **Gradients**: Multi-color gradients for accents
- **Hover States**: Smooth transitions and scale effects

## 🔧 Customization

### Adding New Services
1. Update `constants.ts` with new service data
2. Include features, pricing, and color theme
3. Components automatically render new services

### Modifying Colors
1. Update CSS variables in `index.html`
2. Adjust Tailwind classes in components
3. Update manifest theme colors

### Content Updates
- **Services**: Edit `SERVICES` array in `constants.ts`
- **Projects**: Update `PROJECTS` array with new portfolio items
- **Testimonials**: Modify `TESTIMONIALS` array
- **FAQ**: Add/edit questions in `FAQ_DATA`

## 📊 Analytics & SEO

- **Google Analytics**: Ready for GA4 integration
- **Meta Tags**: Comprehensive SEO meta tags
- **Open Graph**: Social media sharing optimization
- **Structured Data**: Ready for schema markup
- **Web App Manifest**: PWA configuration

## ♿ Accessibility Features

- **Skip Navigation**: Jump to main content
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Indicators**: Visible focus states
- **High Contrast**: Media query support
- **Reduced Motion**: Respects user preferences

## 🚀 Deployment

The app is ready for deployment on any static hosting platform:

- **Build**: `npm run build`
- **Preview**: `npm run preview`
- **Deploy**: Upload `dist/` folder to your hosting provider

## 📈 Performance

- **Lazy Loading**: Images and components load on demand
- **Code Splitting**: Automatic route-based splitting
- **Optimized Assets**: Compressed images and minified code
- **Fast Loading**: Vite's optimized development and build process

---

Built with ❤️ using modern web technologies. Perfect for digital agencies, startups, and professional service providers.
# growbrandi
# Growbrandi-PRD
