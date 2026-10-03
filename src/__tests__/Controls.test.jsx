import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Slider, Select, ColorPicker, Toggle, Button, PositionGrid } from '../components/Controls';

describe('Controls', () => {
  describe('Slider', () => {
    it('renders label and value', () => {
      render(<Slider label="Opacity" value={50} onChange={() => {}} unit="%" />);
      expect(screen.getByText('Opacity')).toBeInTheDocument();
      expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('calls onChange', () => {
      const fn = vi.fn();
      render(<Slider label="X" value={50} onChange={fn} />);
      fireEvent.change(screen.getByRole('slider'), { target: { value: '75' } });
      expect(fn).toHaveBeenCalledWith(75);
    });
  });

  describe('Select', () => {
    it('renders options', () => {
      render(
        <Select
          label="Font"
          value="Arial"
          onChange={() => {}}
          options={[{ value: 'Arial', label: 'Arial' }, { value: 'Georgia', label: 'Georgia' }]}
        />
      );
      expect(screen.getByText('Font')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('Button', () => {
    it('renders children and handles click', () => {
      const fn = vi.fn();
      render(<Button onClick={fn}>Click Me</Button>);
      fireEvent.click(screen.getByText('Click Me'));
      expect(fn).toHaveBeenCalled();
    });

    it('disables when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByText('Disabled')).toBeDisabled();
    });
  });

  describe('PositionGrid', () => {
    it('renders 9 position buttons', () => {
      render(<PositionGrid value="center" onChange={() => {}} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(9);
    });

    it('calls onChange with position', () => {
      const fn = vi.fn();
      render(<PositionGrid value="center" onChange={fn} />);
      fireEvent.click(screen.getAllByRole('button')[0]);
      expect(fn).toHaveBeenCalledWith('top-left');
    });
  });

  describe('Toggle', () => {
    it('renders label', () => {
      render(<Toggle label="Bold" checked={false} onChange={() => {}} />);
      expect(screen.getByText('Bold')).toBeInTheDocument();
    });
  });

  describe('ColorPicker', () => {
    it('renders label and hex value', () => {
      render(<ColorPicker label="Color" value="#ff0000" onChange={() => {}} />);
      expect(screen.getByText('Color')).toBeInTheDocument();
      expect(screen.getByText('#ff0000')).toBeInTheDocument();
    });
  });
});
