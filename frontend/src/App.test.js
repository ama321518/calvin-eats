import { render, screen } from '@testing-library/react';
import Auth from './Auth';
import StarRating from './StarRating';

test('login form shows email and password inputs', () => {
  render(<Auth onLogin={() => {}} />);
  expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
});

test('login button is visible', () => {
  render(<Auth onLogin={() => {}} />);
  const buttons = screen.getAllByText('Login');
  expect(buttons.length).toBeGreaterThan(0);
});

test('star rating renders 5 stars', () => {
  render(<StarRating mealName="Grilled Chicken" />);
  const stars = screen.getAllByText('★');
  expect(stars).toHaveLength(5);
});