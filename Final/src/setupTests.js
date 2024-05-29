// src/setupTests.js

// Mock localStorage for Jest tests
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn(),
  };
  
  global.localStorage = localStorageMock;
  