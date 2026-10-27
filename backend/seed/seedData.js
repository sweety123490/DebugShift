export const challenges = [
  {
    title: 'Stale Closure in useEffect Timer',
    slug: 'stale-closure-useeffect-timer',
    category: 'React Hooks',
    difficulty: 'Easy',
    description:
      'The developer built a live stopwatch timer component in React. However, regardless of how long the timer runs, the counter on the screen freezes at 1 or fluctuates erratically instead of incrementing every second.',
    language: 'javascript',
    brokenCode: `import React, { useState, useEffect } from 'react';

export default function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timerId = setInterval(() => {
      // Bug: 'seconds' is captured from initial render closure
      setSeconds(seconds + 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, []); // Empty dependency array captures stale 'seconds' = 0

  return (
    <div className="p-4 bg-slate-900 text-white rounded">
      <h3>Elapsed Seconds: {seconds}</h3>
    </div>
  );
}`,
    referenceSolution: `import React, { useState, useEffect } from 'react';

export default function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // Fix: Use functional state update to access the latest state value
    const timerId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, []); // Dependency array remains empty without stale closure risk

  return (
    <div className="p-4 bg-slate-900 text-white rounded">
      <h3>Elapsed Seconds: {seconds}</h3>
    </div>
  );
}`,
    expectedBehavior:
      'The timer should smoothly increment by 1 every 1000ms continuously without freezing or re-creating intervals on every tick.',
    bugExplanation:
      'Because the useEffect dependency array is empty [], the setInterval callback forms a closure over the initial render scope where seconds is 0. On every interval tick, setSeconds(0 + 1) is invoked, keeping the count perpetually at 1. The fix is to use the functional state updater form setSeconds(prev => prev + 1).',
    hints: [
      'Look closely at how setSeconds is called inside the setInterval callback.',
      'What value of "seconds" does the callback see when the effect only runs on mount?',
      'Consider using the functional state updater syntax: setSeconds(prev => ...).',
    ],
    evaluationRubric: {
      keyIssuesToFix: ['setSeconds(prevSeconds => prevSeconds + 1)', 'functional state update', 'stale closure'],
      mustIncludeConcepts: ['closure', 'stale state', 'functional update', 'dependency array'],
      commonMistakes: ['adding seconds to dependencies without clearing interval properly', 'removing cleanup function'],
    },
    estimatedMinutes: 10,
  },
  {
    title: 'Batch Update Lost in React Counter',
    slug: 'batch-update-lost-react-counter',
    category: 'State Management',
    difficulty: 'Easy',
    description:
      'A shopping cart component has a "+3 Quick Add" button. The developer wrote three consecutive setState calls to increment quantity by 3, but clicking the button only increments quantity by 1.',
    language: 'javascript',
    brokenCode: `import React, { useState } from 'react';

export default function QuickCart() {
  const [quantity, setQuantity] = useState(1);

  const handleQuickAddThree = () => {
    // Bug: All three calls read the same 'quantity' from the current render snapshot
    setQuantity(quantity + 1);
    setQuantity(quantity + 1);
    setQuantity(quantity + 1);
  };

  return (
    <div>
      <p>Quantity in cart: {quantity}</p>
      <button onClick={handleQuickAddThree}>+3 Quick Add</button>
    </div>
  );
}`,
    referenceSolution: `import React, { useState } from 'react';

export default function QuickCart() {
  const [quantity, setQuantity] = useState(1);

  const handleQuickAddThree = () => {
    // Fix: Functional updates queue state transitions based on previous state
    setQuantity((prev) => prev + 1);
    setQuantity((prev) => prev + 1);
    setQuantity((prev) => prev + 1);
    // Alternatively: setQuantity((prev) => prev + 3);
  };

  return (
    <div>
      <p>Quantity in cart: {quantity}</p>
      <button onClick={handleQuickAddThree}>+3 Quick Add</button>
    </div>
  );
}`,
    expectedBehavior:
      'Clicking "+3 Quick Add" should increase quantity by exactly 3, transitioning from 1 to 4 on first click.',
    bugExplanation:
      'React state updates are batched. In the current render, quantity is evaluated once (e.g., 1). All three setQuantity(1 + 1) calls schedule the same final value of 2. Using functional updaters setQuantity(prev => prev + 1) queues functions that receive the dynamically updated intermediate state.',
    hints: [
      'React batches state updates and state variables behave like fixed snapshots within a single render.',
      'How does passing a function to setQuantity alter React’s state queue?',
    ],
    evaluationRubric: {
      keyIssuesToFix: ['setQuantity(prev => prev + 1)', 'functional update', 'prev state'],
      mustIncludeConcepts: ['batching', 'snapshot', 'functional updater', 'queue'],
      commonMistakes: ['using setQuantity(quantity + 3) without explaining why multiple calls failed', 'using synchronous mutations'],
    },
    estimatedMinutes: 10,
  },
  {
    title: 'Unhandled Promise Rejection in Express Route',
    slug: 'unhandled-promise-rejection-express',
    category: 'JavaScript Async/Await',
    difficulty: 'Medium',
    description:
      'An asynchronous Express API route fetches user payment details from a 3rd party provider. When the 3rd party fails or rejects, the client hangs indefinitely without a response, and Node logs an UnhandledPromiseRejection.',
    language: 'javascript',
    brokenCode: `import express from 'express';
const router = express.Router();

router.get('/api/users/:id/billing', async (req, res, next) => {
  // Bug: Missing try/catch block around asynchronous operations
  const user = await findUserInDatabase(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // If this third-party call throws a network error, the route never catches it
  const billingInfo = await fetchBillingProvider(user.billingId);
  res.json({ user: user.name, billing: billingInfo });
});

export default router;`,
    referenceSolution: `import express from 'express';
const router = express.Router();

router.get('/api/users/:id/billing', async (req, res, next) => {
  try {
    const user = await findUserInDatabase(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const billingInfo = await fetchBillingProvider(user.billingId);
    return res.json({ user: user.name, billing: billingInfo });
  } catch (error) {
    // Forward error to centralized Express error handler
    return next(error);
  }
});

export default router;`,
    expectedBehavior:
      'When an async operation fails, the error must be safely caught and passed to next(error) or returned with an appropriate HTTP error status (500) rather than hanging the HTTP connection.',
    bugExplanation:
      'In Express 4, unhandled rejected promises inside async route handlers are not caught automatically by Express. They bypass Express middleware, causing the request to hang until client timeout. Wrapping the async body in try/catch and passing errors to next(error) ensures proper centralized error handling.',
    hints: [
      'What happens in Express when an error is thrown inside an async function without a try/catch block?',
      'Check how Express expects asynchronous errors to be forwarded to error middleware.',
    ],
    evaluationRubric: {
      keyIssuesToFix: ['try/catch', 'next(error)', 'error handling', '500 status'],
      mustIncludeConcepts: ['unhandled rejection', 'try/catch block', 'next error middleware', 'hung request'],
      commonMistakes: ['catching error but not responding or calling next()', 'missing return statement'],
    },
    estimatedMinutes: 15,
  },
  {
    title: 'Double next() Invocation & Headers Sent in Middleware',
    slug: 'double-next-headers-sent-middleware',
    category: 'Express Middleware',
    difficulty: 'Medium',
    description:
      'An authentication middleware checks for a bearer token. When an invalid token is provided, the server responds with 401 Unauthorized, but shortly after, crashes with "Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client".',
    language: 'javascript',
    brokenCode: `export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    // Bug: Missing 'return' statement causes execution to continue below
    res.status(401).json({ error: 'Token missing' });
  }

  // This will still execute even if token was missing!
  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).json({ error: 'Invalid token' });
  }

  req.user = decoded;
  next(); // next() is invoked after response has already been sent
};`,
    referenceSolution: `export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    // Fix: Return immediately after sending 401 response
    return res.status(401).json({ error: 'Token missing' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    // Fix: Return immediately after sending 401 response
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.user = decoded;
  return next();
};`,
    expectedBehavior:
      'If authorization fails, the middleware must respond with 401 and immediately exit without attempting token verification or invoking next().',
    bugExplanation:
      'res.json() or res.send() initiates sending the HTTP response headers and body, but does NOT terminate function execution. Without a return statement, JavaScript continues executing subsequent lines, attempting verifyToken and calling next(), which causes subsequent route handlers to attempt to write headers again.',
    hints: [
      'Sending a response with res.status(...).json(...) does not exit the middleware function.',
      'What happens to execution flow when you omit return before res.status(...)?',
    ],
    evaluationRubric: {
      keyIssuesToFix: ['return res.status(401)', 'exit function execution', 'prevent double next()'],
      mustIncludeConcepts: ['return statement', 'headers sent error', 'middleware control flow'],
      commonMistakes: ['wrapping with else but forgetting return on final next()', 'leaving verifyToken exposed to undefined'],
    },
    estimatedMinutes: 15,
  },
  {
    title: 'Search Autocomplete Race Condition',
    slug: 'search-autocomplete-race-condition',
    category: 'API Error Handling',
    difficulty: 'Hard',
    description:
      'In a live user search input, typing "react" triggers API requests for "r", "re", "rea", "reac", "react". If the network response for "re" arrives after the response for "react", the UI displays stale results for "re".',
    language: 'javascript',
    brokenCode: `import React, { useState, useEffect } from 'react';

export default function UserSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    // Bug: Slow responses from earlier queries can resolve AFTER fast responses from newer queries
    fetch(\`/api/search?q=\${encodeURIComponent(query)}\`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data.items);
      });
  }, [query]);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>{results.map((r) => <li key={r.id}>{r.name}</li>)}</ul>
    </div>
  );
}`,
    referenceSolution: `import React, { useState, useEffect } from 'react';

export default function UserSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    // Fix: Use AbortController (or an ignore flag) to cancel obsolete requests
    const controller = new AbortController();

    fetch(\`/api/search?q=\${encodeURIComponent(query)}\`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        setResults(data.items || []);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Fetch error:', err);
        }
      });

    return () => {
      // Abort in-flight network request on query change or unmount
      controller.abort();
    };
  }, [query]);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>{results.map((r) => <li key={r.id}>{r.name}</li>)}</ul>
    </div>
  );
}`,
    expectedBehavior:
      'Results on screen must always strictly correspond to the latest query typed. In-flight obsolete network requests must be cancelled or discarded.',
    bugExplanation:
      'Network requests resolve asynchronously and unpredictably. A query with higher latency can resolve after a newer query has already returned, overwriting newer state with obsolete data (a classic race condition). Utilizing AbortController or a cancellation flag in useEffect cleanup guarantees stale requests are cancelled.',
    hints: [
      'Asynchronous requests do not guarantee arrival in the order they were dispatched.',
      'Check the native AbortController API and how useEffect cleanup functions can abort previous fetches.',
      'Alternatively, consider an "isCurrent" or "ignore" boolean flag in the cleanup function.',
    ],
    evaluationRubric: {
      keyIssuesToFix: ['AbortController', 'cleanup function', 'controller.abort()', 'ignore flag'],
      mustIncludeConcepts: ['race condition', 'out of order response', 'AbortController', 'cancellation'],
      commonMistakes: ['debouncing without cancelling previous promises', 'ignoring AbortError in catch block'],
    },
    estimatedMinutes: 20,
  },
  {
    title: 'Window Event Listener Memory Leak in React',
    slug: 'window-event-listener-memory-leak',
    category: 'Memory Leaks',
    difficulty: 'Medium',
    description:
      'A modal component attaches a "keydown" event listener to the window to detect the Escape key. Every time the modal opens and closes, memory usage increases and multiple duplicate Escape handlers execute.',
    language: 'javascript',
    brokenCode: `import React, { useEffect } from 'react';

export default function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Bug: Event listener is attached but never removed on unmount or isOpen change
    window.addEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">{children}</div>
    </div>
  );
}`,
    referenceSolution: `import React, { useEffect } from 'react';

export default function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Fix: Return cleanup function to remove event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">{children}</div>
    </div>
  );
}`,
    expectedBehavior:
      'When the modal is closed or unmounted, the keydown event listener must be detached cleanly from window.',
    bugExplanation:
      'Every time isOpen turns true or onClose changes, a new anonymous/closure handleKeyDown listener is registered on window. Because no cleanup function is returned from useEffect, previous listeners remain in memory forever on window, causing memory leaks and firing onClose multiple times per key press.',
    hints: [
      'Effects that subscribe to global window events need to unsubscribe when the component re-renders or unmounts.',
      'What must a useEffect callback return to perform teardown?',
    ],
    evaluationRubric: {
      keyIssuesToFix: ['return () => window.removeEventListener', 'cleanup function'],
      mustIncludeConcepts: ['memory leak', 'cleanup', 'removeEventListener', 'unmount'],
      commonMistakes: ['passing an inline arrow function to removeEventListener which will not match reference', 'forgetting to return the cleanup function'],
    },
    estimatedMinutes: 15,
  },
  {
    title: 'Silent 404/500 Failure in Fetch API',
    slug: 'silent-fetch-http-status-handling',
    category: 'API Error Handling',
    difficulty: 'Easy',
    description:
      'A user profile card fetches user data using standard Fetch API. When the server returns HTTP 404 (Not Found) or 500 (Internal Server Error), the catch block is bypassed, res.json() parses the error payload, and the UI displays broken undefined profile values.',
    language: 'javascript',
    brokenCode: `async function loadUserProfile(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);

    // Bug: fetch() does NOT reject on HTTP 404 or 500 error status codes!
    const userData = await response.json();
    displayUserProfile(userData);
  } catch (error) {
    // Only runs on network partition or DNS failure, NOT HTTP 404 or 500
    displayErrorMessage('Failed to load profile. Please try again.');
  }
}`,
    referenceSolution: `async function loadUserProfile(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);

    // Fix: Explicitly check response.ok (status in range 200-299)
    if (!response.ok) {
      throw new Error(\`HTTP Error \${response.status}: \${response.statusText}\`);
    }

    const userData = await response.json();
    displayUserProfile(userData);
  } catch (error) {
    displayErrorMessage(error.message || 'Failed to load profile. Please try again.');
  }
}`,
    expectedBehavior:
      'Non-2xx HTTP response statuses (such as 404, 401, 500) must be detected and treated as errors, properly invoking the error handling flow.',
    bugExplanation:
      'The native window.fetch() Promise only rejects on catastrophic network failures or blocked requests (CORS/offline). HTTP error statuses like 404 Not Found or 500 Server Error resolve successfully. Developers must inspect response.ok (which is true only for statuses 200-299) and throw an error manually.',
    hints: [
      'Does window.fetch reject its promise when the server responds with 404 or 500?',
      'Check what property on the Response object indicates if the HTTP status was successful.',
    ],
    evaluationRubric: {
      keyIssuesToFix: ['if (!response.ok)', 'throw new Error', 'check response.status'],
      mustIncludeConcepts: ['fetch does not reject on HTTP errors', 'response.ok', 'status codes 404/500'],
      commonMistakes: ['checking response.status === 200 only, ignoring 201/204', 'forgetting to throw inside if (!response.ok)'],
    },
    estimatedMinutes: 10,
  },
  {
    title: 'Direct State Mutation with Array.push in React',
    slug: 'direct-array-mutation-react-state',
    category: 'State Management',
    difficulty: 'Easy',
    description:
      'A Todo list component allows adding items. The developer uses todos.push(newTodo) and calls setTodos(todos), but the list on the screen never updates unless another unrelated state causes a re-render.',
    language: 'javascript',
    brokenCode: `import React, { useState } from 'react';

export default function TodoList() {
  const [todos, setTodos] = useState(['Review PRs', 'Write Unit Tests']);
  const [text, setText] = useState('');

  const handleAddTodo = () => {
    if (!text.trim()) return;

    // Bug: Mutates the existing state array in place
    todos.push(text);

    // React compares Object.is(prevTodos, nextTodos). Since the reference is identical, React skips re-rendering!
    setTodos(todos);
    setText('');
  };

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={handleAddTodo}>Add</button>
      <ul>{todos.map((item, idx) => <li key={idx}>{item}</li>)}</ul>
    </div>
  );
}`,
    referenceSolution: `import React, { useState } from 'react';

export default function TodoList() {
  const [todos, setTodos] = useState(['Review PRs', 'Write Unit Tests']);
  const [text, setText] = useState('');

  const handleAddTodo = () => {
    if (!text.trim()) return;

    // Fix: Create a new array reference using spread syntax or functional update
    setTodos((prevTodos) => [...prevTodos, text]);
    setText('');
  };

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={handleAddTodo}>Add</button>
      <ul>{todos.map((item, idx) => <li key={idx}>{item}</li>)}</ul>
    </div>
  );
}`,
    expectedBehavior:
      'Submitting a new item should immediately render the item in the list by providing a fresh array reference to the state setter.',
    bugExplanation:
      'React uses referential equality (Object.is) to determine if state has changed. Mutating an array in place using .push() alters the same memory reference. When setTodos(todos) is called, React checks oldState === newState, sees identical references, and skips the re-render. Creating a new array with [...todos, text] ensures a new reference.',
    hints: [
      'How does React know when a state variable has actually changed?',
      'What is referential equality and why does mutating state directly violate React immutability rules?',
      'Try creating a new array copy using the spread operator [...todos, text].',
    ],
    evaluationRubric: {
      keyIssuesToFix: ['[...prevTodos, text]', 'immutability', 'spread operator'],
      mustIncludeConcepts: ['referential equality', 'Object.is', 'immutability', 'new reference'],
      commonMistakes: ['calling todos.push() then spreading [...todos]', 'using Object.assign on array without copy'],
    },
    estimatedMinutes: 10,
  },
];
