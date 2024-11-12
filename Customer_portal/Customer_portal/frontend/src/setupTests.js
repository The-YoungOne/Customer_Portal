import '@testing-library/jest-dom';
import 'jest-canvas-mock';
// Remove this line if you couldn't install the package
// import 'jest-intersection-observer';

// Manually mock IntersectionObserver if not using the package
if (!global.IntersectionObserver) {
  class IntersectionObserverMock {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
    }
    observe(element) {
      this.callback([{ isIntersecting: true, target: element }]);
    }
    unobserve() {}
    disconnect() {}
  }
  global.IntersectionObserver = IntersectionObserverMock;
}

// Ensure window is defined
if (typeof window === 'undefined') {
  global.window = {};
}

// Mock window.matchMedia
if (!window.matchMedia) {
  window.matchMedia = function () {
    return {
      matches: false,
      media: '',
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  };
}

// Mock localStorage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
};

// Suppress console errors during tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Mock getContext for Canvas if necessary
HTMLCanvasElement.prototype.getContext = jest.fn(() => {
  return {
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    // ... other methods as needed
  };
});
