import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { TaskList, TaskItem, formatTime } from '../TaskApp';

jest.useFakeTimers();

describe('TaskApp Components', () => {
  describe('formatTime', () => {
    it('formats seconds correctly', () => {
      expect(formatTime(0)).toBe('00:00:00');
      expect(formatTime(61)).toBe('00:01:01');
      expect(formatTime(3661)).toBe('01:01:01');
    });
  });

  describe('TaskItem', () => {
    const mockTask = { id: 1, title: 'Test Task', completed: false, timeSpent: 0 };
    const mockToggle = jest.fn();
    const mockTimeUpdate = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('renders task item correctly', () => {
      render(
        <TaskItem 
          task={mockTask} 
          onToggle={mockToggle} 
          onTimeUpdate={mockTimeUpdate} 
        />
      );

      expect(screen.getByText('Test Task')).toBeInTheDocument();
      expect(screen.getByText('00:00:00')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '開始' })).toBeInTheDocument();
    });

    it('toggles task completion when checkbox is clicked', () => {
      render(
        <TaskItem 
          task={mockTask} 
          onToggle={mockToggle} 
          onTimeUpdate={mockTimeUpdate} 
        />
      );

      fireEvent.click(screen.getByRole('checkbox'));
      expect(mockToggle).toHaveBeenCalledWith(1);
    });

    it('starts and stops timer when button is clicked', () => {
      render(
        <TaskItem 
          task={mockTask} 
          onToggle={mockToggle} 
          onTimeUpdate={mockTimeUpdate} 
        />
      );

      fireEvent.click(screen.getByRole('button', { name: '開始' }));
      expect(screen.getByRole('button', { name: '停止' })).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(mockTimeUpdate).toHaveBeenCalledTimes(5);
      expect(mockTimeUpdate).toHaveBeenLastCalledWith(5);

      fireEvent.click(screen.getByRole('button', { name: '停止' }));
      expect(screen.getByRole('button', { name: '開始' })).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(mockTimeUpdate).toHaveBeenCalledTimes(5);
    });
  });

  describe('TaskList', () => {
    it('renders task list correctly', () => {
      render(<TaskList />);
      
      expect(screen.getByText('タスク一覧')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('新しいタスクを入力')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument();
      
      expect(screen.getByText('タスク1')).toBeInTheDocument();
      expect(screen.getByText('タスク2')).toBeInTheDocument();
    });

    it('adds a new task when form is submitted', () => {
      render(<TaskList />);
      
      const input = screen.getByPlaceholderText('新しいタスクを入力');
      const addButton = screen.getByRole('button', { name: '追加' });
      
      fireEvent.change(input, { target: { value: '新しいタスク' } });
      fireEvent.click(addButton);
      
      expect(screen.getByText('新しいタスク')).toBeInTheDocument();
      
      expect(input).toHaveValue('');
    });

    it('does not add empty tasks', () => {
      render(<TaskList />);
      
      const initialTaskCount = screen.getAllByRole('listitem').length;
      
      const addButton = screen.getByRole('button', { name: '追加' });
      fireEvent.click(addButton);
      
      expect(screen.getAllByRole('listitem')).toHaveLength(initialTaskCount);
    });

    it('toggles task completion status', () => {
      render(<TaskList />);
      
      const firstTaskCheckbox = screen.getAllByRole('checkbox')[0];
      
      fireEvent.click(firstTaskCheckbox);
      
      expect(screen.getByText('タスク1').className).toContain('line-through');
      
      fireEvent.click(firstTaskCheckbox);
      
      expect(screen.getByText('タスク1').className).not.toContain('line-through');
    });
  });
});
