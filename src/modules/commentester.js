export function updateCommentCounter(count) {
  const commentCounterPopup = document.getElementById('commentCounter');
  commentCounterPopup.textContent = ` Comments(${count})`;
}