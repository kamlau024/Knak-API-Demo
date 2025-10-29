# Project Context
You are assisting with the development of a web application. Please follow these guidelines to ensure consistent, high-quality assistance throughout the project. The project is a web application that streamlines the workflow of mortgage brokers specializing in private lending. The mortgage brokers will have to handle communication between the borrowers by understanding their needs and why they are borrowing money from private lenders. The mortgage brokers will also have to work with private lenders to find the best match for the lender.

## General Principles
*   Write clean, readable, and maintainable code
*   Follow established conventions for the technologies being used
*   Prioritize code clarity over cleverness
*   Include meaningful comments for complex logic
*   Use descriptive variable and function names

## Code Structure
*   Organize code into logical modules/components
*   Separate concerns appropriately (HTML structure, CSS styling, JavaScript functionality)
*   Follow the DRY (Don't Repeat Yourself) principle
*   Implement proper error handling and validation

## Technology Guidelines
### HTML
*   Use semantic HTML5 elements
*   Ensure proper document structure and hierarchy
*   Include appropriate meta tags and accessibility attributes
*   Validate markup for standards compliance

### CSS
*   Use modern CSS features appropriately
*   Implement responsive design principles
*   Follow a consistent naming convention (BEM, camelCase, etc.)
*   Organize styles logically (components, utilities, etc.)
*   Optimize for performance (minimize redundancy, use efficient selectors)
*   Use components from shadcn/ui as much as possible to reduce the use of custom css or inline style

### JavaScript
*   Use ES6+ features where appropriate
*   Implement proper error handling with try/catch blocks
*   Write modular, reusable functions
*   Handle asynchronous operations correctly (promises, async/await)
*   Validate user inputs and sanitize data

## Development Best Practices
### Security
*   Always validate and sanitize user inputs
*   Implement proper authentication and authorization
*   Use HTTPS and secure headers
*   Avoid exposing sensitive information in client-side code
*   Follow OWASP security guidelines

### Performance
*   Optimize images and assets
*   Minimize HTTP requests
*   Use appropriate caching strategies
*   Implement lazy loading where beneficial
*   Monitor and optimize bundle sizes

### Accessibility
*   Follow WCAG guidelines
*   Ensure keyboard navigation works properly
*   Use appropriate ARIA labels and roles
*   Maintain good color contrast ratios
*   Test with screen readers when possible

## Communication Guidelines
### Code Explanations
*   Explain the reasoning behind code decisions
*   Highlight potential trade-offs or alternatives considered
*   Point out areas that might need future optimization
*   Mention any dependencies or requirements

### Problem Solving
*   Break down complex problems into smaller, manageable pieces
*   Provide step-by-step implementation guidance
*   Suggest testing strategies for new features
*   Offer debugging approaches when issues arise

### Documentation
*   Include inline comments for complex logic
*   Provide clear README instructions and keep it updated for other developers
*   Document API endpoints and data structures
*   Maintain a changelog for significant updates

## Testing and Debugging
### Testing Strategy
*   Suggest appropriate testing approaches (unit, integration, e2e)
*   Include test cases for edge cases and error conditions
*   Recommend tools and frameworks suitable for the project
*   Emphasize the importance of testing user interactions

### Debugging Assistance
*   Help identify potential sources of bugs
*   Suggest debugging tools and techniques
*   Provide systematic approaches to isolate issues
*   Recommend logging and monitoring strategies

## Project Management
### Version Control
*   Encourage meaningful commit messages
*   Suggest logical commit groupings
*   Recommend branching strategies when appropriate
*   Highlight files that should be gitignored

### Deployment Considerations
*   Consider environment differences (dev, staging, production)
*   Suggest appropriate build processes
*   Recommend deployment strategies and tools
*   Emphasize the importance of backup and rollback plans

## Specific Preferences
### Framework/Library Choices
*   React.js with functional components and hooks
*   Tailwind CSS for utility-first styling
*   Node.js with Express.js for backend
*   PostgreSQL with Prisma ORM
*   Guidelines for each technology and what to avoid

### Coding Style
*   JavaScript/React conventions (2-space indentation, single quotes)
*   File and component naming conventions
*   Tailwind class ordering best practices

### Browser Support
*   Primary targets: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
*   Mobile browsers: iOS Safari 14+, Chrome Mobile 90+, Samsung Internet 14+
*   JavaScript features: ES6+ features are acceptable (async/await, destructuring, arrow functions)
*   CSS features: Modern CSS Grid and Flexbox (fully supported by Tailwind CSS)
*   Polyfills: Minimal polyfill usage; prefer progressive enhancement
*   Performance: Prioritize Core Web Vitals (LCP, FID, CLS) for mobile experience

### Review and Feedback
*   Before providing code solutions:
1. Consider the broader application architecture
2. Think about scalability and maintainability
3. Evaluate security implications
4. Consider performance impact
5. Ensure accessibility compliance

## Questions to Ask
*   When uncertain about requirements, please ask about:
1. Target audience and user needs
2. Performance requirements and constraints
3. Browser and device support requirements
4. Integration with existing systems
5. Timeline and priority constraints   
