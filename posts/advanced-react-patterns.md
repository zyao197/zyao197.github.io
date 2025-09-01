
# Advanced React Patterns for Modern Applications

*Published on December 22, 2024 · 7 min read*

![React Patterns](https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop)

## Introduction

React has evolved significantly over the years, and with it, the patterns we use to build scalable and maintainable applications. In this article, we'll explore some advanced React patterns that can help you write better code.

## 1. Compound Components Pattern

The compound components pattern allows you to create flexible and reusable component APIs.

```jsx
// Accordion component using compound pattern
function Accordion({ children, ...props }) {
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (id) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="accordion" {...props}>
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          isOpen: openItems.has(index),
          onToggle: () => toggleItem(index),
          index
        })
      )}
    </div>
  );
}

// Usage
function App() {
  return (
    <Accordion>
      <AccordionItem title="First Item">
        <p>Content for first item</p>
      </AccordionItem>
      <AccordionItem title="Second Item">
        <p>Content for second item</p>
      </AccordionItem>
    </Accordion>
  );
}
```

## 2. Render Props Pattern

Render props provide a way to share code between components using a prop whose value is a function.

```jsx
function DataFetcher({ url, render }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [url]);

  return render({ data, loading, error });
}

// Usage
function UserProfile({ userId }) {
  return (
    <DataFetcher
      url={`/api/users/${userId}`}
      render={({ data, loading, error }) => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error: {error}</div>;
        return <div>Hello, {data.name}!</div>;
      }}
    />
  );
}
```

## 3. Custom Hooks for Logic Reuse

Custom hooks are the React way to share stateful logic between components.

```jsx
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  }, [key]);

  return [storedValue, setValue];
}

// Usage
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [language, setLanguage] = useLocalStorage('language', 'en');

  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}
```

## 4. Higher-Order Components (HOCs)

HOCs are functions that take a component and return a new component with additional functionality.

```jsx
function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      checkAuthStatus().then(status => {
        setIsAuthenticated(status);
        setLoading(false);
      });
    }, []);

    if (loading) {
      return <div>Checking authentication...</div>;
    }

    if (!isAuthenticated) {
      return <LoginForm />;
    }

    return <WrappedComponent {...props} />;
  };
}

// Usage
const ProtectedDashboard = withAuth(Dashboard);
```

## 5. Context + Reducer Pattern

For complex state management, combining Context with useReducer creates a powerful pattern.

```jsx
const AppStateContext = createContext();
const AppDispatchContext = createContext();

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    default:
      return state;
  }
}

function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, {
    user: null,
    theme: 'light',
    sidebarOpen: false
  });

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

// Custom hooks for consuming context
function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context;
}

function useAppDispatch() {
  const context = useContext(AppDispatchContext);
  if (!context) {
    throw new Error('useAppDispatch must be used within AppProvider');
  }
  return context;
}
```

## Best Practices

### 1. Component Composition Over Inheritance

React favors composition over inheritance. Use these patterns to build flexible component hierarchies.

### 2. Performance Optimization

- Use `React.memo()` for expensive components
- Implement proper key props for lists
- Optimize re-renders with `useMemo` and `useCallback`

### 3. Error Boundaries

Always implement error boundaries for better user experience:

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong.</h2>;
    }

    return this.props.children;
  }
}
```

## Conclusion

These advanced React patterns provide powerful tools for building maintainable and scalable applications. Choose the right pattern based on your specific use case and requirements.

Remember:
- **Compound Components**: For flexible APIs
- **Render Props**: For sharing logic
- **Custom Hooks**: For reusable stateful logic
- **HOCs**: For cross-cutting concerns
- **Context + Reducer**: For complex state management

---

**Tags**: #React #JavaScript #WebDevelopment #Frontend #Patterns #Architecture

**Related Articles**:
- [Modern Web Development with React 18](blog.html#post-react-18)
- [Performance Optimization in React](blog.html#post-performance)
