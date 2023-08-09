import './style.css';
import { fetchBaseData, fetchLikes, updateInteraction, createApp } from './modules/callApi';

const itemContainer = document.getElementById('itemContainer');
const commentsPopup = document.getElementById('commentsPopup');
const commentsForm = document.getElementById('commentsForm');
const commentsList = document.getElementById('commentsList');
const itemComments = document.getElementById('itemComments');

let appId;

async function populateItems() {
  try {
    const items = await fetchBaseData();

    appId = await createApp();

    items.forEach((item) => {
      const itemDiv = createItemDiv(item);
      itemContainer.appendChild(itemDiv);
    });
  } catch (error) {
    console.error('Error fetching items:', error);
  }
}

function createItemDiv(item) {
  const itemDiv = document.createElement('div');
  itemDiv.className = 'item';

  const h2 = document.createElement('h2');
  h2.textContent = item.name;

  const likes = document.createElement('p');
  likes.className = 'likes';
  likes.textContent = `${item.likes || 0} Likes`;

  const likeIcon = document.createElement('span');
  likeIcon.className = 'like-icon';
  likeIcon.innerHTML = '<i class="far fa-heart"></i>';

  const commentButton = document.createElement('button');
  commentButton.className = 'comment-button';
  commentButton.textContent = 'Comment';

  likeIcon.addEventListener('click', async () => {
    try {
      const updated = await updateInteraction(appId, item.id);
      if (updated) {
        const updatedLikesData = await fetchLikes(appId);
        const likeCount = updatedLikesData.find((like) => like.item_id === item.id).likes || 0;
        likes.textContent = `${likeCount} Likes`;
      }
    } catch (error) {
      console.error('Error updating interaction:', error);
    }
  });

  commentButton.addEventListener('click', () => {
    showCommentsPopup(item);
  });

  h2.appendChild(likeIcon);
  itemDiv.appendChild(h2);
  itemDiv.appendChild(likes);
  itemDiv.appendChild(commentButton);

  return itemDiv;
}

async function showCommentsPopup(item) {
  try {
    commentsPopup.classList.add('visible');
    itemComments.textContent = `Comments for ${item.name}`;

    // Fetch comments from local storage
    const comments = fetchCommentsFromLocalStorage(item.id);

    // Update the comments popup content
    updateCommentsList(comments);

    // Handle comment submission
    commentsForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const nameInput = commentsForm.querySelector('.name-input');
      const commentInput = commentsForm.querySelector('.comment-input');

      const name = nameInput.value;
      const commentText = commentInput.value;

      if (name && commentText) {
        try {
          // Record comment in local storage
          const newComment = recordCommentInLocalStorage(item.id, name, commentText);

          // Update comments list
          comments.push(newComment);
          updateCommentsList(comments);

          // Reset form inputs
          nameInput.value = '';
          commentInput.value = '';
        } catch (error) {
          console.error('Error submitting comment:', error);
        }
      }
    });

    // Close button functionality
    const closeButton = commentsPopup.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
      commentsPopup.classList.remove('visible');
    });
  } catch (error) {
    console.error('Error showing comments popup:', error);
  }
}

// Additional helper functions

function fetchCommentsFromLocalStorage(itemId) {
  const commentsKey = `comments_${itemId}`;
  return JSON.parse(localStorage.getItem(commentsKey)) || [];
}

function recordCommentInLocalStorage(itemId, name, commentText) {
  const commentsKey = `comments_${itemId}`;
  const existingComments = JSON.parse(localStorage.getItem(commentsKey)) || [];
  const newComment = { name, text: commentText };
  existingComments.push(newComment);
  localStorage.setItem(commentsKey, JSON.stringify(existingComments));
  return newComment;
}

function updateCommentsList(comments) {
  commentsList.innerHTML = ''; // Clear previous comments

  comments.forEach(comment => {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';
    commentDiv.innerHTML = `
      <strong>${comment.name}:</strong>
      <p>${comment.text}</p>
    `;
    commentsList.appendChild(commentDiv);
  });
}

document.addEventListener('DOMContentLoaded', populateItems);
