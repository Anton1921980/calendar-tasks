import '@testing-library/jest-dom';

// Mock env module
jest.mock('./src/config/env');

// Mock TextEncoder/TextDecoder
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
