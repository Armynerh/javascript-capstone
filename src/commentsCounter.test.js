import { screen } from '@testing-library/dom';
import { updateCommentCounter } from './modules/commentester.js';
import '@testing-library/jest-dom';

describe('updateCommentCounter', () => {
  test('updates the comment counter correctly', () => {
    const count = 5;
    document.body.innerHTML = ' <div><h3 id="commentCounter"></h3></div>';
    updateCommentCounter(count);

    const commentCounter = screen.getByText(`Comments(${count})`);
    expect(commentCounter).toBeInTheDocument();
  });
});
