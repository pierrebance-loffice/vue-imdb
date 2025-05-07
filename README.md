# IMDB POC - Vue Version

This is a Vue.js version of the IMDB POC project. It demonstrates the use of Vue 3 with TypeScript, Vuetify, and Pinia for state management.

## Features

- Vue 3 with Composition API
- TypeScript support
- Vuetify 3 for UI components
- Pinia for state management
- Vue Router for navigation
- Tailwind CSS for styling
- Axios for API requests

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Lint and Format

```sh
npm run type-check
npm run lint
npm run format
```

### Build for Production

```sh
npm run build
```

### Preview Production Build

```sh
npm run preview
```

## Project Structure

- `src/` - Source files
  - `assets/` - Static assets
  - `components/` - Vue components
  - `router/` - Vue Router configuration
  - `stores/` - Pinia stores
  - `views/` - Page components
  - `App.vue` - Root component
  - `main.ts` - Application entry point

## API Integration

The application expects the following API endpoints:

- `/discover/movies` - Discover movies
- `/movies/123` - Get movie details
- `/people/123` - Get person details

## License

MIT
