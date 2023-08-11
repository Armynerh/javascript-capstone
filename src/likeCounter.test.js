import { updateItemCount } from './modules/itemCounter.js';

describe('updateItemCount', () => {
  let itemCount;

  beforeEach(() => {
    itemCount = document.createElement('span');
    document.body.appendChild(itemCount);
  });

  afterEach(() => {
    document.body.removeChild(itemCount);
  });

  test('updates the item count correctly', () => {
    const count = 10;
    updateItemCount(count);

    expect(itemCount.textContent).toBe(`(${count})`);
  });
});
