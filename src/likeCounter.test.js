import { screen } from '@testing-library/dom';
import { updateItemCount } from './modules/itemCounter.js';
import '@testing-library/jest-dom';

describe('updateItemCount', () => {
  test('updates the item count correctly', () => {
    const count = 10;
    document.body.innerHTML = '<div id="itemCount"></div>';
    updateItemCount(count);

    const itemCount = screen.getByText(`(${count})`);
    expect(itemCount).toBeInTheDocument();
  });
});
