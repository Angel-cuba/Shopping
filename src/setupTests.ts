// jest-dom adds custom jest matchers for asserting on DOM nodes.
import '@testing-library/jest-dom';

// lottie-web / lottie-react use canvas APIs (fillStyle, getContext, etc.)
// that jsdom does not implement. Mock the library globally so tests that
// render any component importing lottie-react don't crash at module-load time.
jest.mock('lottie-react', () => ({
  useLottie: () => ({ View: null }),
  default: () => null,
}));
