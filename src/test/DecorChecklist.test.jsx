import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { DecorChecklist } from '../components/DecorChecklist';

describe('DecorChecklist Component', () => {
  const sampleItems = [
    {
      id: 'item-1',
      category: 'Lighting & Ambiance',
      name: 'Fairy Light Webbing',
      quantity: 1,
      unitCost: 500,
      completed: true,
      notes: 'Across rafters'
    },
    {
      id: 'item-2',
      category: 'Florals & Greenery',
      name: 'Ceremonial Altar Arch',
      quantity: 1,
      unitCost: 1200,
      completed: false,
      notes: 'White roses and eucalyptus'
    }
  ];

  it('renders budget summary and item details', () => {
    render(
      <DecorChecklist
        checklist={sampleItems}
        onUpdateChecklist={vi.fn()}
        venueTitle="Test Venue"
      />
    );

    expect(screen.getByText('Itemized Vendor Decor Checklist')).toBeInTheDocument();
    expect(screen.getByText('Fairy Light Webbing')).toBeInTheDocument();
    expect(screen.getByText('Ceremonial Altar Arch')).toBeInTheDocument();
    expect(screen.getByText('$1,700')).toBeInTheDocument(); // Total cost
    expect(screen.getAllByText('$500').length).toBeGreaterThan(0); // Completed cost
  });

  it('toggles item completion when checkbox is clicked', () => {
    const handleUpdate = vi.fn();
    render(
      <DecorChecklist
        checklist={sampleItems}
        onUpdateChecklist={handleUpdate}
      />
    );

    const toggleBtn = screen.getByLabelText(/mark ceremonial altar arch as complete/i);
    fireEvent.click(toggleBtn);

    expect(handleUpdate).toHaveBeenCalledTimes(1);
    const updated = handleUpdate.mock.calls[0][0];
    expect(updated.find((i) => i.id === 'item-2').completed).toBe(true);
  });

  it('switches currency when currency pill is clicked', () => {
    render(
      <DecorChecklist
        checklist={sampleItems}
        onUpdateChecklist={vi.fn()}
      />
    );

    const eurBtn = screen.getByRole('button', { name: 'EUR' });
    fireEvent.click(eurBtn);

    expect(screen.getAllByText(/€/).length).toBeGreaterThan(0);
  });

  it('filters items by category pill', () => {
    render(
      <DecorChecklist
        checklist={sampleItems}
        onUpdateChecklist={vi.fn()}
      />
    );

    const floralsTab = screen.getByRole('button', { name: 'Florals & Greenery' });
    fireEvent.click(floralsTab);

    expect(screen.getByText('Ceremonial Altar Arch')).toBeInTheDocument();
    expect(screen.queryByText('Fairy Light Webbing')).not.toBeInTheDocument();
  });

  it('allows adding a custom decor item', () => {
    const handleUpdate = vi.fn();
    render(
      <DecorChecklist
        checklist={sampleItems}
        onUpdateChecklist={handleUpdate}
      />
    );

    // Open add item form
    const addBtn = screen.getByRole('button', { name: /add item/i });
    fireEvent.click(addBtn);

    expect(screen.getByText(/add custom decor item/i)).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText(/vintage champagne coupe tower/i);
    fireEvent.change(nameInput, { target: { value: 'Ice Sculpture' } });

    const submitBtn = screen.getByRole('button', { name: /save item/i });
    fireEvent.click(submitBtn);

    expect(handleUpdate).toHaveBeenCalledTimes(1);
    const updatedList = handleUpdate.mock.calls[0][0];
    expect(updatedList.some((i) => i.name === 'Ice Sculpture')).toBe(true);
  });

  it('rejects adding custom items with whitespace-only names and bounds quantity and unitCost', () => {
    const handleUpdate = vi.fn();
    render(
      <DecorChecklist
        checklist={sampleItems}
        onUpdateChecklist={handleUpdate}
      />
    );

    // Open add item form
    const addBtn = screen.getByRole('button', { name: /add item/i });
    fireEvent.click(addBtn);

    const nameInput = screen.getByPlaceholderText(/vintage champagne coupe tower/i);
    const submitBtn = screen.getByRole('button', { name: /save item/i });

    // Try saving empty name
    fireEvent.change(nameInput, { target: { value: '   ' } });
    fireEvent.click(submitBtn);
    expect(handleUpdate).not.toHaveBeenCalled();

    // Now save with negative cost and 0 quantity
    fireEvent.change(nameInput, { target: { value: 'Negative Cost Item' } });
    const costInput = screen.getByLabelText(/unit cost/i);
    fireEvent.change(costInput, { target: { value: '-100' } });
    const qtyInput = screen.getByLabelText(/quantity/i);
    fireEvent.change(qtyInput, { target: { value: '0' } });

    fireEvent.submit(submitBtn.closest('form'));
    expect(handleUpdate).toHaveBeenCalledTimes(1);
    const saved = handleUpdate.mock.calls[0][0].find((i) => i.name === 'Negative Cost Item');
    expect(saved.unitCost).toBeGreaterThanOrEqual(0);
    expect(saved.quantity).toBeGreaterThanOrEqual(1);
  });

  it('deletes an item when trash icon is clicked', () => {
    const handleUpdate = vi.fn();
    render(
      <DecorChecklist
        checklist={sampleItems}
        onUpdateChecklist={handleUpdate}
      />
    );

    const deleteBtn = screen.getByLabelText(/delete fairy light webbing/i);
    fireEvent.click(deleteBtn);

    expect(handleUpdate).toHaveBeenCalledTimes(1);
    const updatedList = handleUpdate.mock.calls[0][0];
    expect(updatedList.length).toBe(1);
    expect(updatedList[0].id).toBe('item-2');
  });

  it('correctly calculates converted budget amounts for GBP and INR', () => {
    render(
      <DecorChecklist
        checklist={sampleItems}
        onUpdateChecklist={vi.fn()}
      />
    );

    // Switch to GBP (rate 0.79) -> 1700 * 0.79 = 1343
    const gbpBtn = screen.getByRole('button', { name: 'GBP' });
    fireEvent.click(gbpBtn);
    expect(screen.getByText('£1,343')).toBeInTheDocument();

    // Switch to INR (rate 85) -> 1700 * 85 = 144,500
    const inrBtn = screen.getByRole('button', { name: 'INR' });
    fireEvent.click(inrBtn);
    expect(screen.getByText(/₹1[,.]?44[,.]?500/)).toBeInTheDocument();
  });

  it('provides an aria-live region on the budget summary for screen readers', () => {
    const { container } = render(
      <DecorChecklist
        checklist={sampleItems}
        onUpdateChecklist={vi.fn()}
      />
    );

    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
  });
});
