import updateItemCount from '../modules/itemCounter.js';

describe('updateItemCount', () => {
  test('updates countElement with correct item count', () => {
    // Arrange
    const countElement = document.createElement('span');
    const itemListElement = document.createElement('ul');
    itemListElement.innerHTML = '<li>Item 1</li><li>Item 2</li><li>Item 3</li>';

    // Act
    const itemCount = updateItemCount(countElement, itemListElement);

    // Assert
    expect(countElement.innerText).toBe('(3)');
    expect(itemCount).toBe(3);
  });
});