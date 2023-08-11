const commentCounterPopup = document.getElementById('commentCounter');
export function updateCommentCounter(count) {
  commentCounterPopup.textContent = ` Comments(${count})`;
}