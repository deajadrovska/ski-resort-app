import { render, screen } from '@testing-library/react';
import App from './App';

test('renders ski resort management app', () => {
  render(<App />);
  const headerElement = screen.getByText(/ski resort management/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders add new resort form', () => {
  render(<App />);
  const addResortText = screen.getByText(/add new resort/i);
  expect(addResortText).toBeInTheDocument();
});

test('renders resort name input', () => {
  render(<App />);
  const resortNameInput = screen.getByPlaceholderText(/resort name/i);
  expect(resortNameInput).toBeInTheDocument();
});

test('renders add resort button', () => {
  render(<App />);
  const addButton = screen.getByRole('button', { name: /add resort/i });
  expect(addButton).toBeInTheDocument();
});

test('renders empty resorts message', () => {
  render(<App />);
  const emptyMessage = screen.getByText(/no ski resorts found/i);
  expect(emptyMessage).toBeInTheDocument();
});