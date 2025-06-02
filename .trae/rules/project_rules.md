# Project Rules for TRAE AI

## Project Overview
This is a modern portfolio website built with React 18, TypeScript, Vite, and styled-components. The project features advanced animations, internationalization (i18n), and a component-based architecture with a focus on performance and user experience.

## Technology Stack
- *Frontend Framework*: React 18 with TypeScript
- *Build Tool*: Vite
- *Styling*: Styled-components, CSS modules, Tailwind utilities
- *State Management*: Redux Toolkit
- *Routing*: React Router DOM v6
- *Animations*: Framer Motion, GSAP, React Spring
- *Internationalization*: i18next, react-i18next
- *Testing*: Jest, React Testing Library
- *Code Quality*: ESLint, Prettier, Husky
- *3D Graphics*: Spline, OGL

## Code Style and Formatting

### TypeScript Guidelines
- Use strict TypeScript configuration
- Prefer explicit typing over any
- Use interface for object shapes, type for unions/primitives
- Enable all strict mode options in tsconfig.json
- Use proper generic constraints and conditional types

### React Best Practices
- Use functional components with hooks exclusively
- Implement proper error boundaries for component trees
- Use React.memo() for performance optimization when appropriate
- Prefer custom hooks for reusable logic
- Use React.lazy() for code splitting large components
- Always provide proper dependency arrays for useEffect

### Component Architecture
- Follow the established folder structure: each component in its own folder
- Include index.ts files for clean imports
- Separate concerns: logic, styling, and presentation
- Use composition over inheritance
- Keep components small and focused (single responsibility)
- Use proper prop types and default values

### File Naming Conventions
- Components: PascalCase (e.g., ContactButton.tsx)
- Hooks: camelCase starting with 'use' (e.g., useScrollDirection.ts)
- Utilities: camelCase (e.g., scrollDetection.ts)
- Types: PascalCase with descriptive names
- Constants: UPPER_SNAKE_CASE

### Import Organization
typescript
// 1. React and React-related imports
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

// 2. Third-party libraries
import styled from 'styled-components';
import { motion } from 'framer-motion';

// 3. Internal imports (using path aliases)
import { store } from '@store/index';
import ContactButton from '@components/ContactButton';
import { theme } from '@styles/theme';
import { cn } from '@utils/cn';

// 4. Relative imports
import './Component.css';


### Path Aliases Usage
Always use the configured path aliases:
- @/* for src root
- @components/* for components
- @styles/* for styles
- @utils/* for utilities
- @hooks/* for custom hooks
- @store/* for Redux store
- @types/* for TypeScript types
- @services/* for API services

## Styling Guidelines

### Styled-Components
- Use styled-components for component-specific styles
- Follow the theme system defined in @styles/theme.ts
- Use proper TypeScript typing for styled components
- Prefer theme values over hardcoded values

### CSS Organization
- Use CSS modules for component-specific styles when needed
- Global styles in @styles/GlobalStyles.ts
- Animation styles in separate CSS files
- Use CSS custom properties for dynamic theming

### Responsive Design
- Mobile-first approach
- Use theme breakpoints consistently
- Test on multiple screen sizes
- Ensure touch-friendly interfaces

## Performance Guidelines

### Code Splitting
- Use React.lazy() for route-based code splitting
- Implement proper loading states and error boundaries
- Use dynamic imports for heavy components

### Bundle Optimization
- Follow the Vite configuration for chunk splitting
- Keep vendor chunks separate
- Monitor bundle size with build analysis

### Animation Performance
- Use transform and opacity for animations
- Prefer CSS animations over JavaScript when possible
- Use will-change property sparingly
- Implement proper cleanup for animation listeners

## Internationalization (i18n)

### Translation Keys
- Use descriptive, hierarchical keys
- Keep translations in public/locales/[lang]/
- Use interpolation for dynamic content
- Implement proper fallback mechanisms

### Language Support
- Currently supports English (en) and Spanish (es)
- Use react-i18next hooks consistently
- Implement language detection and persistence

## State Management

### Redux Toolkit
- Use createSlice for state management
- Implement proper action creators
- Use RTK Query for API calls when needed
- Keep state normalized and minimal

### Local State
- Prefer useState for component-local state
- Use useReducer for complex state logic
- Implement proper state lifting when needed

## Testing Guidelines

### Unit Testing
- Write tests for utility functions
- Test custom hooks thoroughly
- Use React Testing Library for component tests
- Maintain good test coverage

### Integration Testing
- Test component interactions
- Test routing and navigation
- Test form submissions and validations

## Error Handling

### Error Boundaries
- Implement error boundaries for major component trees
- Provide meaningful error messages
- Log errors appropriately

### Form Validation
- Use react-hook-form for form management
- Implement proper validation schemas
- Provide clear error messages to users

## Accessibility (a11y)

### ARIA Guidelines
- Use proper ARIA labels and roles
- Implement keyboard navigation
- Ensure proper focus management
- Test with screen readers

### Semantic HTML
- Use semantic HTML elements
- Provide proper heading hierarchy
- Include alt text for images
- Ensure proper color contrast

## Security Best Practices

### Data Handling
- Sanitize user inputs
- Use environment variables for sensitive data
- Implement proper CORS policies
- Validate data on both client and server

### Dependencies
- Keep dependencies updated
- Audit for security vulnerabilities
- Use exact versions in package.json

## Git and Development Workflow

### Commit Messages
- Use conventional commit format
- Write descriptive commit messages
- Keep commits atomic and focused

### Branch Strategy
- Use feature branches for new development
- Keep main branch stable
- Use pull requests for code review

### Code Quality
- Run ESLint and Prettier before commits
- Use Husky for pre-commit hooks
- Maintain consistent code formatting

## Documentation

### Code Documentation
- Write JSDoc comments for complex functions
- Document component props and usage
- Keep README.md updated
- Document API integrations

### Component Documentation
- Include usage examples
- Document prop interfaces
- Explain complex logic
- Provide migration guides for breaking changes

## Deployment and Build

### Build Process
- Use npm run build for production builds
- Test builds locally before deployment
- Monitor build performance and size

### Environment Configuration
- Use proper environment variables
- Configure different environments (dev, staging, prod)
- Implement proper error tracking

## AI Assistant Guidelines

When working with this codebase:

1. *Always follow the established patterns* in the existing codebase
2. *Use the configured path aliases* instead of relative imports
3. *Maintain the component folder structure* with index files
4. *Follow the TypeScript strict mode* requirements
5. *Use the theme system* for consistent styling
6. *Implement proper error handling* and loading states
7. *Consider performance implications* of changes
8. *Maintain accessibility standards* in all components
9. *Use the established animation libraries* (Framer Motion, GSAP)
10. *Follow the i18n patterns* for any text content
11. *Write tests* for new functionality
12. *Update documentation* when making significant changes
13. *Adhere to Fluent Design aesthetics* – every new component must follow the project’s Fluent Design look-and-feel, including acrylic transparency layers reminiscent of Windows 11.
14. *Provide bilingual text*: whenever you add UI text that I give you in Spanish (button label, heading, paragraph, etc.), include the corresponding English version as well so the site’s i18n toggle works.



## Common Patterns to Follow

### Component Creation
typescript
// ComponentName/ComponentName.tsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface ComponentNameProps {
  // Define props here
}

const ComponentName: React.FC<ComponentNameProps> = ({ ...props }) => {
  return (
    <StyledWrapper>
      {/* Component content */}
    </StyledWrapper>
  );
};

const StyledWrapper = styled(motion.div)`
  /* Styled-components styles */
`;

export default ComponentName;


### Custom Hook Pattern
typescript
// hooks/useCustomHook.ts
import { useState, useEffect } from 'react';

export const useCustomHook = (dependency: any) => {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // Effect logic
  }, [dependency]);
  
  return { state, setState };
};


This project emphasizes modern React development practices, performance optimization, and user experience. Always consider the impact of changes on bundle size, runtime performance, and accessibility.