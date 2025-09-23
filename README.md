
=======
# 🌦️ Advanced Weather Monitoring Dashboard

A modern, responsive weather monitoring application built with React, TypeScript, and Chakra UI. Features real-time weather data, interactive charts, air quality monitoring, and multi-location tracking.


## ✨ Features

### 🎯 Core Functionality
- **Real-time Weather Data** - Current conditions, temperature, humidity, wind speed
- **24-Hour Forecast** - Interactive temperature charts with Recharts
- **5-Day Weather Outlook** - Weekly forecast with precipitation probability
- **Air Quality Index** - AQI monitoring with pollutant breakdown (PM2.5, PM10, NO₂, O₃)
- **Multi-location Tracking** - Monitor weather in multiple cities
- **Location Search** - Search and add new locations

### 🎨 UI/UX Features
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Modern UI Components** - Professional design using Chakra UI
- **Interactive Charts** - Beautiful data visualization with Recharts
- **Weather Icons** - Intuitive weather condition icons
- **Loading States** - Smooth loading animations and skeleton screens
- **Tabbed Interface** - Organized data presentation

### 🔧 Technical Features
- **TypeScript** - Full type safety and better developer experience
- **Component Architecture** - Modular, reusable components
- **Custom Hooks** - Clean state management and data fetching
- **Error Handling** - Robust error boundaries and fallbacks
- **Performance Optimized** - Efficient rendering and memoization
- **Accessibility** - WCAG compliant with proper ARIA labels

## 🚀 Quick Start

### Prerequisites
- Node.js 20.18.0 or higher
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/weather-dashboard.git
cd weather-dashboard

# Install dependencies
npm install

# Install additional packages
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion react-icons recharts

# Start development server
npm run dev
```

### Environment Setup

Create a `.env` file in the root directory:

```env
# Weather API Configuration
VITE_WEATHER_API_KEY=api_key
VITE_WEATHER_API_BASE_URL=https://api.openweathermap.org/data/2.5
VITE_AIR_QUALITY_API_BASE_URL=https://api.openweathermap.org/data/2.5
VITE_GEOCODING_API_BASE_URL=https://api.openweathermap.org/geo/1.0

```



## 🌐 API Integration

### Recommended Weather APIs

#### 1. **OpenWeatherMap** 🥇
- **Free Tier**: 1,000 calls/day, 60 calls/minute
- **Features**: Current weather, 5-day/3-hour forecast, air quality, geocoding
- **Cost**: Free tier available, paid plans from $40/month
- **Documentation**: [OpenWeatherMap API](https://openweathermap.org/api)




## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Testing (if added)
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:
- **Desktop**: 1200px+ (Full feature set)
- **Tablet**: 768px - 1199px (Adapted layout)
- **Mobile**: 320px - 767px (Stacked components)

## 🔒 Environment Variables

```env
# Required
VITE_WEATHER_API_KEY=your_api_key

# Optional
VITE_WEATHER_API_BASE_URL=https://api.openweathermap.org/data/2.5
VITE_AIR_QUALITY_API_BASE_URL=https://api.openweathermap.org/data/2.5
VITE_GEOCODING_API_BASE_URL=https://api.openweathermap.org/geo/1.0
VITE_DEFAULT_CITY=London
VITE_DEFAULT_COUNTRY=ENG
VITE_REFRESH_INTERVAL=300000
```

## 🚀 Deployment

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```


## 🙏 Acknowledgments

- **Chakra UI** - For the beautiful component library
- **Recharts** - For interactive data visualization
- **React Icons** - For weather and UI icons
- **OpenWeatherMap** - For weather data API
- **Vite** - For the blazing fast build tool

