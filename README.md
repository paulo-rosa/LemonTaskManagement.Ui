# Lemon Task Management - Frontend

A Kanban-style task management application built with React and TypeScript. This frontend application connects to the .NET Core backend API to provide a complete task management solution.

## Tech Stack

- **React 19** with TypeScript - Modern UI with full type safety
- **MobX 6** - Reactive state management
- **Material-UI 7** - Component library and design system
- **Vite** - Fast build tool and dev server
- **Axios** - HTTP client with interceptors
- **SCSS** - Modular styling with BEM methodology
- **React Router 7** - Client-side routing

## Setup Instructions

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- Backend API running on `http://localhost:5130`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Access the application at `http://localhost:5173`

### Default Credentials

Use the following credentials to log in (configured in the backend):
- Username: `john.doe`
- Password: `Password123!`
##
- Username: `jane.smith`
- Password: `Password123!`
##
- Username: `admin`
- Password: `Admin123!`


## Frontend Architecture

### Component Design

The application follows a layered architecture pattern:

```
┌─────────────────────────────────────┐
│         Pages (Views)                │
│  - Login, Boards, BoardDetail        │
└───────────────┬─────────────────────┘
                │
┌───────────────▼─────────────────────┐
│         UI Stores                    │
│  - Page-specific logic & state       │
└───────────────┬─────────────────────┘
                │
┌───────────────▼─────────────────────┐
│         Domain Stores                │
│  - Business logic & API calls        │
│  - auth, board, card                 │
└───────────────┬─────────────────────┘
                │
┌───────────────▼─────────────────────┐
│         API Client (NSwag)           │
│  - Type-safe API communication       │
└─────────────────────────────────────┘
```

**Key Components:**
- **ProtectedRoute**: Authentication guard for secured routes
- **AddCardDialog / EditCardDialog**: Reusable dialogs for card operations
- **Layout**: Application shell with header and navigation

### State Management

MobX stores handle reactive state with clear separation of concerns:

- **AuthStore**: Authentication state, login/logout, token management
- **BoardStore**: Board listing and details
- **CardStore**: Card CRUD operations (create, update, move)
- **UserStore**: User data (currently minimal, prepared for future features)

All stores extend `BaseStore` which provides common error handling and loading states.

### Communication with Backend

- **NSwag-generated client** provides fully typed API calls
- **Axios interceptors** handle authentication tokens automatically
- **Environment-based configuration** for different deployment targets
- API base URL configured via `VITE_API_BASE_URL` environment variable

### Project Structure

```
src/
├── api/                    # NSwag-generated API client
├── components/             # Reusable components
│   ├── AddCardDialog.tsx
│   ├── EditCardDialog.tsx
│   └── ProtectedRoute.tsx
├── pages/                  # Route-based views
│   ├── Login/             # Authentication
│   ├── Boards/            # Board listing
│   └── BoardDetail/       # Kanban board with drag-and-drop
├── stores/                 # MobX state management
│   ├── auth.store.ts
│   ├── board.store.ts
│   ├── card.store.ts
│   └── base.store.ts
├── layout/                 # App shell with header/logout
├── router/                 # React Router configuration
└── styles/                 # Global SCSS variables
```

## Features Implemented (Production MVP)

### Core Functionality
- **User Authentication** - JWT-based login with token storage
- **Board Management** - View all boards for logged-in user
- **Kanban Board View** - Visual board with columns and cards
- **Card CRUD Operations** - Create, read, update cards
- **Drag & Drop** - Move cards between columns and reorder within columns
- **Auto-assignment** - Cards automatically assigned to creator
- **Logout** - Clear session and return to login

### UI/UX Features
- Responsive Material Design interface
- Loading states and error handling
- Visual feedback during drag operations
- User-friendly dialogs for card operations
- Current user display in header

## Assumptions & Trade-offs

### Assumptions
1. **Single tenant per session** - Users only see their own boards and cards
2. **Auto-assignment** - New cards automatically assigned to creator (no manual user selection)
3. **Order-based positioning** - Cards use 1-based numeric ordering for position
4. **In-memory sessions** - Tokens stored in localStorage (acceptable for MVP)

### Trade-offs

**Chosen: NSwag client generation**
- Pros: Full type safety, auto-sync with backend, compile-time errors
- Cons: Requires regeneration when API changes, larger bundle size
- Alternative: Manual Axios calls would be more flexible but lose type safety

**Chosen: MobX over Redux**
- Pros: Less boilerplate, more intuitive for simple flows, better performance
- Cons: Less ecosystem tooling, potential for uncontrolled mutations
- Alternative: Redux would provide better time-travel debugging

**Chosen: HTML5 Drag & Drop API**
- Pros: Native browser support, no additional dependencies
- Cons: Limited mobile support, more complex event handling
- Alternative: React DnD or react-beautiful-dnd would have better mobile support but add bundle size

**Chosen: localStorage for tokens**
- Pros: Simple, persists across sessions, widely supported
- Cons: Vulnerable to XSS attacks
- Alternative: httpOnly cookies would be more secure but require backend changes

## Future Enhancements

### Short-term (Next Sprint)
- [ ] **Real-time updates** - WebSocket integration for collaborative editing
- [ ] **Card details modal** - Rich text descriptions, due dates, attachments
- [ ] **User assignment UI** - Ability to reassign cards to other users
- [ ] **Board/Column CRUD** - Create, edit, delete boards and columns
- [ ] **Search & Filter** - Filter cards by assignee, date, status

### Medium-term (Next Quarter)
- [ ] **Mobile optimization** - Touch-friendly drag & drop
- [ ] **Activity log** - Audit trail of card movements and changes
- [ ] **Comments** - Discussion threads on cards
- [ ] **Labels/Tags** - Categorize cards with colored labels
- [ ] **Dark mode** - Theme switcher

### Long-term (Roadmap)
- [ ] **Notifications** - In-app and email notifications
- [ ] **Advanced permissions** - Role-based access control
- [ ] **Analytics dashboard** - Burndown charts, velocity metrics
- [ ] **Templates** - Pre-configured board templates
- [ ] **API rate limiting UI** - Handle backend throttling gracefully
- [ ] **Offline mode** - Service worker for offline functionality

## Scalability Considerations

### Current Limitations
- **No pagination** - Loads all boards/cards at once (fine for MVP, not for thousands of items)
- **No optimistic updates** - Waits for server response before updating UI
- **localStorage size limits** - Token storage constrained by browser limits (~5-10MB)

### Scaling Strategy
1. **Add pagination/infinite scroll** - Lazy load boards and cards
2. **Optimize re-renders** - Use React.memo and useMemo for expensive components
3. **Code splitting** - Route-based splitting to reduce initial bundle
4. **CDN deployment** - Serve static assets from edge locations
5. **Service worker caching** - Cache API responses for faster subsequent loads

## Build & Deployment

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

Environment variables (`.env.*` files):
- `VITE_API_BASE_URL` - Backend API URL (default: `http://localhost:5130`)
- `VITE_APP_ENV` - Environment name

## Testing

```bash
# Run tests
npm test

# Coverage report
npm run test:coverage
```

**Note:** Test coverage is minimal in this MVP. Production-ready app would require:
- Unit tests for all stores
- Component tests for all UI components
- Integration tests for critical user flows
- E2E tests with Playwright/Cypress
