# LemonTaskManagement.UI

A modern task management application built with React, TypeScript, and Material-UI.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Material-UI (MUI)** - Component library
- **MobX** - State management
- **Axios** - HTTP client
- **SCSS** - Styling with variables and mixins
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing utilities

## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

## Installation

1. Navigate to the project directory:

```bash
cd d:\source\repos\Personal\TaskManagementApp\LemonTaskManagement.UI
```

2. Install dependencies:

```bash
npm install
```

## Running the Application

### Development Mode

To run the application in development mode with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

The development environment will connect to the API at `http://localhost:5130`.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Building for Deployment

### Development Build

```bash
npm run build
```

This creates an optimized production build in the `dist` folder using the development environment configuration.

### Stage Build

```bash
npm run build:stage
```

This creates a build for the staging environment. The build will use the configuration from `.env.stage`.

**Note:** Currently points to `http://localhost:5130`. Update `.env.stage` with the actual staging API URL.

### Production Build

```bash
npm run build:prod
```

This creates a build for the production environment. The build will use the configuration from `.env.production`.

**Note:** Currently points to `http://localhost:5130`. Update `.env.production` with the actual production API URL.

## Testing

### Run Tests

Run all tests in watch mode:

```bash
npm test
```

### Run Tests with UI

Run tests with Vitest's interactive UI:

```bash
npm run test:ui
```

### Run Tests with Coverage

Generate test coverage report:

```bash
npm run test:coverage
```

## Environment Configuration

The application uses environment-specific configuration files:

- `.env.development` - Development environment
- `.env.stage` - Staging environment
- `.env.production` - Production environment

### Environment Variables

Each environment file contains the following variables:

- `VITE_API_BASE_URL` - The base URL for API requests
- `VITE_APP_ENV` - The current environment name

**Important:** Update the `VITE_API_BASE_URL` in `.env.stage` and `.env.production` with the actual API endpoints before deploying to those environments.

## Project Structure

```
src/
├── components/          # React components
│   ├── TaskItem/       # Individual task component
│   └── TaskList/       # Task list container component
├── services/           # API services
│   └── api.service.ts  # Axios API client
├── stores/             # MobX stores
│   ├── task.store.ts   # Task state management
│   └── index.ts        # Store context and hooks
├── styles/             # Global styles
│   ├── variables.scss  # SCSS variables
│   └── global.scss     # Global styles
├── test/               # Test configuration
│   └── setup.ts        # Test setup file
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── vite-env.d.ts       # TypeScript declarations for Vite
```

## Styling

The project uses SCSS for styling with:

- Global SCSS variables defined in `src/styles/variables.scss`
- Component-specific SCSS modules
- Material-UI theme customization

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (development config)
- `npm run build:stage` - Build for staging environment
- `npm run build:prod` - Build for production environment
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm test` - Run tests in watch mode
- `npm run test:ui` - Run tests with interactive UI
- `npm run test:coverage` - Generate test coverage report

## Development Tips

### Adding New Components

1. Create a new folder in `src/components/`
2. Add the component TypeScript file (e.g., `MyComponent.tsx`)
3. Add the component SCSS file (e.g., `MyComponent.scss`)
4. Create tests (e.g., `MyComponent.test.tsx`)

### Working with MobX Stores

1. Create store files in `src/stores/`
2. Use `makeAutoObservable` for reactive state
3. Access stores using the `useStore` hook in components
4. Wrap components with `observer` from `mobx-react-lite`

### Making API Calls

Use the `apiService` from `src/services/api.service.ts`:

```typescript
import { apiService } from '../services/api.service';

// GET request
const data = await apiService.get<ResponseType>('/endpoint');

// POST request
const result = await apiService.post<ResponseType>('/endpoint', payload);
```

## Important Notes

- **TODO:** Update API URLs in `.env.stage` and `.env.production` before deploying to those environments
- The development environment connects to `http://localhost:5130` by default
- Make sure the backend API is running when testing the application
- All environment variables must be prefixed with `VITE_` to be accessible in the application

## Deployment

After building for the target environment, deploy the contents of the `dist` folder to your web server or hosting platform.

Popular deployment options:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Azure Static Web Apps
- GitHub Pages

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Run linting and tests
5. Submit a pull request

## License

This project is private and proprietary
