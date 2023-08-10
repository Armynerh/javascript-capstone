import './style.css';
import {
  fetchBaseData,
  fetchLikes,
  updateInteraction,
  createApp,
  submitComment,
  fetchComments,
} from './modules/callApi.js';

const itemContainer = document.getElementById('itemContainer');
const commentsPopup = document.getElementById('commentsPopup');
const commentsForm = document.getElementById('commentsForm');
const commentsList = document.getElementById('commentsList');
const itemComments = document.getElementById('itemComments');
const closeCommentsButton = document.getElementById('closeCommentsButton');

let appId;
let items = [];

async function populateItems() {
  try {
    items = await fetchBaseData();

    const existingAppId = localStorage.getItem('appId');

    if (existingAppId) {
      appId = existingAppId;
    } else {
      appId = await createApp();
      localStorage.setItem('appId', appId);
    }

    items.forEach(async (item) => {
      const itemDiv = await createItemDiv(item);
      itemContainer.appendChild(itemDiv);
    });

    await updateLikes();
    // await fetchAndUpdateComments();

  } catch (error) {
    console.error('Error fetching items:', error);
  }
}

async function fetchAndUpdateComments() {
  try {
    for (const item of items) {
      const comments = await fetchComments(appId, item.id);
      updateCommentsList(item.id, comments);
    }
  } catch (error) {
    console.error('Error fetching and updating comments:', error);
  }
}

async function updateLikes() {
  try {
    const likesData = await fetchLikes(appId);
    const getLikesData = (itemId) => likesData.find((like) => like.item_id === itemId) || { likes: 0 };
    for (const item of items) {
      const likedItem = getLikesData(item.id)
      console.log({ likedItem })

      const likeCount = likedItem.likes;
      const likesCountElement = document.getElementById(`likes-${item.id}`);
      console.log({ likesCountElement })
      if (likesCountElement) {
        likesCountElement.textContent = `${likeCount} Likes`;
      }
    }
  } catch (error) {
    console.error('Error updating likes:', error);
  }
}

async function createItemDiv(item) {
  const itemDiv = document.createElement('div');
  itemDiv.className = 'item';
  const image = document.createElement('img');
  image.src = item.image.medium;
  image.alt = item.name;
  const h2 = document.createElement('h2');
  h2.textContent = item.name;
  const likes = document.createElement('p');
  likes.className = 'likes';
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
        await populateItems()
      }
    } catch (error) {
      console.error('Error updating interaction:', error);
    }
  });

  commentButton.addEventListener('click', () => {
    showCommentsPopup(item);
  });

  itemDiv.appendChild(image);
  itemDiv.appendChild(h2);
  h2.appendChild(likeIcon);
  likes.id = `likes-${item.id}`
  itemDiv.appendChild(likes);
  itemDiv.appendChild(commentButton);

  return itemDiv;
}

async function showCommentsPopup(item) {
  try {
    commentsPopup.classList.add('visible');
    itemComments.textContent = `Comments for ${item.name}`;
    const comments = await fetchComments(appId, item.id);
    updateCommentsList(item.id, comments);

    commentsForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const nameInput = commentsForm.querySelector('.name-input');
      const commentInput = commentsForm.querySelector('.comment-input');
      const name = nameInput.value;
      const commentText = commentInput.value;

      if (name && commentText) {
        try {
          const success = await submitComment(appId, item.id, name, commentText);

          if (success) {
            const newComment = { name, text: commentText };
            updateCommentsList(item.id, [...comments, newComment]);
            nameInput.value = '';
            commentInput.value = '';
          }
        } catch (error) {
          console.error('Error submitting comment:', error);
        }
      }
    });

    closeCommentsButton.addEventListener('click', () => {
      commentsPopup.classList.remove('visible');
    });

  } catch (error) {
    console.error('Error showing comments popup:', error);
  }
}

function updateCommentsList(itemId, comments) {
  const itemCommentsElement = document.querySelector(`#commentsList-${itemId}`);
  if (!itemCommentsElement) return;

  itemCommentsElement.innerHTML = '';

  comments.forEach((comment) => {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';
    commentDiv.innerHTML = `
      <strong>${comment.name}:</strong>
      <p>${comment.text}</p>
    `;
    itemCommentsElement.appendChild(commentDiv);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  populateItems();
  
 
});
