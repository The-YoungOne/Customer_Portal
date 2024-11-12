// setupTests.js
import '@testing-library/jest-dom';
import 'jest-canvas-mock';

// Mock IntersectionObserver if you haven't already
if (!global.IntersectionObserver) {
  class IntersectionObserverMock {
    constructor(callback) {
      this.callback = callback;
    }
    observe(element) {
      this.callback([{ isIntersecting: true, target: element }]);
    }
    unobserve() {}
    disconnect() {}
  }
  global.IntersectionObserver = IntersectionObserverMock;
}

// Mock matchMedia
if (!window.matchMedia) {
  window.matchMedia = () => ({
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  });
}

// Mock localStorage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
};

// Suppress act warnings
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

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
