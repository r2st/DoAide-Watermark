import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders the header', () => {
    render(<App />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getAllByText('Watermark').length).toBeGreaterThanOrEqual(1);
  });

  it('renders the title', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Free Image.*Watermark.*Tool/);
  });

  it('renders all tab buttons', () => {
    render(<App />);
    expect(screen.getByText('Text')).toBeInTheDocument();
    expect(screen.getByText('Logo')).toBeInTheDocument();
    expect(screen.getByText('Tiled')).toBeInTheDocument();
    expect(screen.getByText('Batch')).toBeInTheDocument();
    expect(screen.getByText('Resize')).toBeInTheDocument();
    expect(screen.getByText('Compare')).toBeInTheDocument();
  });

  it('switches tabs on click', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Resize'));
    expect(screen.getByText('Resize & compress images')).toBeInTheDocument();
  });

  it('shows text watermark by default', () => {
    render(<App />);
    expect(screen.getByText('Text Watermark Settings')).toBeInTheDocument();
  });

  it('renders the footer', () => {
    render(<App />);
    expect(screen.getByText(/Everything runs in your browser/)).toBeInTheDocument();
  });
});
