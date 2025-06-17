# Project Structure

```
financeforward/
├── README.md                           # Project documentation
├── package.json                        # Dependencies and scripts
├── index.html                          # Main HTML template
├── vite.config.js                      # Vite configuration
├── tailwind.config.js                  # Tailwind CSS configuration
├── src/
│   ├── App.jsx                         # Main application component
│   ├── App.css                         # Global styles and animations
│   ├── main.jsx                        # Application entry point
│   ├── components/                     # Reusable components
│   │   ├── Lesson.jsx                  # Individual lesson display
│   │   └── LearningPath.jsx            # Learning path management
│   ├── data/                           # JSON content files
│   │   ├── financial-foundations.json  # 2 lessons on money basics
│   │   ├── banking-credit.json         # 6 lessons on banking/credit
│   │   ├── student-life-finance.json   # 7 lessons on student finances
│   │   └── building-future.json        # 5 lessons on investing/planning
│   └── assets/                         # Static assets
│       └── images/                     # Educational images
├── dist/                               # Production build output
└── node_modules/                       # Dependencies
```

## Key Files

### Core Application
- **App.jsx**: Main component with navigation and state management
- **App.css**: Tailwind CSS with custom animations and styling
- **main.jsx**: React application entry point

### Components
- **Lesson.jsx**: Renders individual lessons with formatted content
- **LearningPath.jsx**: Displays lesson lists and progress for each path

### Content
- **JSON files**: Structured lesson content with metadata
- **Images**: Educational illustrations and icons

### Configuration
- **package.json**: Project dependencies and build scripts
- **vite.config.js**: Build tool configuration
- **tailwind.config.js**: CSS framework configuration

## Content Structure

Each JSON file contains:
```json
{
  "id": "path-identifier",
  "title": "Learning Path Title",
  "description": "Brief description",
  "duration": "Estimated time",
  "lessons": [
    {
      "id": "lesson-id",
      "title": "Lesson Title",
      "content": "Main content...",
      "sections": [...],
      "keyTakeaways": [...],
      "nextSteps": [...]
    }
  ]
}
```

## Development Workflow

1. **Content Updates**: Edit JSON files in `src/data/`
2. **Component Changes**: Modify React components in `src/components/`
3. **Styling**: Update `src/App.css` for visual changes
4. **Testing**: Run `pnpm run dev` for local development
5. **Building**: Run `pnpm run build` for production
6. **Deployment**: Deploy `dist/` folder to hosting platform

