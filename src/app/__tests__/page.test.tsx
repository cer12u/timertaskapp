import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../page';

jest.mock('../components/TaskApp', () => ({
  TaskList: () => <div data-testid="mock-task-list">TaskList Mock</div>
}));

describe('Home Page', () => {
  it('renders the header correctly', () => {
    render(<Home />);
    
    expect(screen.getByText('タイマータスクアプリ')).toBeInTheDocument();
  });
  
  it('includes the TaskList component', () => {
    render(<Home />);
    
    expect(screen.getByTestId('mock-task-list')).toBeInTheDocument();
  });
});
