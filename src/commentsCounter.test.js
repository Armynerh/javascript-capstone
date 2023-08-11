import { updateCommentCounter } from './modules/commentester.js';

describe('updateCommentCounter', () => {
  let commentCounterPopup;

  beforeEach(() => {
    commentCounterPopup = document.createElement('span');
    commentCounterPopup.id = 'commentCounter';
    document.body.appendChild(commentCounterPopup);
  });

  afterEach(() => {
    document.body.removeChild(commentCounterPopup);
  });

  test('updates the comment counter correctly', () => {
    const count = 5;
    updateCommentCounter(count);

    expect(commentCounterPopup.textContent).toBe(` Comments(${count})`);
  });
});
