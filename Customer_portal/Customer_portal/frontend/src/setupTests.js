import '@testing-library/jest-dom';
import 'jest-canvas-mock';
import 'jest-intersection-observer';

// Ensure window is defined
if (typeof window === 'undefined') {
  global.window = {};
}

// Mock window.matchMedia
global.window.matchMedia = global.window.matchMedia || function () {
  return {
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  };
};

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
