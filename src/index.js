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
const commentsDiv = document.getElementById('form-content');
const commentsList = document.getElementById('commentsList');
const itemComments = document.getElementById('itemComments');
const itemImg = document.getElementById('itemImage');
const commentCounterPopup = document.getElementById('commentCounter');
const closeCommentsButton = document.getElementById('closeCommentsButton');

let appId;
let items = [];
export function updateItemCount(count) {
  itemCount.textContent = `(${count})`;
}

async function populateItems() {
  try {
    items = await fetchBaseData();
    updateItemCount(items.length);
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
  } catch (error) {
    console.error('Error fetching items:', error);
  }
}
export function updateCommentCounter(count) {
  commentCounterPopup.textContent = ` Comments(${count})`;
}
async function fetchAndUpdateComments(item) {
  try {
    const comments = await fetchComments(appId, item.id);

    updateCommentsList(item.id, comments);
    updateCommentCounter(comments.length);
  } catch (error) {
    console.error('Error fetching and updating comments:', error);
  }
}

async function updateLikes() {
  try {
    const likesData = await fetchLikes(appId);
    const LikesData = (itemId) => likesData.find((like) => like.item_id === itemId) || { likes: 0 };

    items.forEach((item) => {
      const likedItem = LikesData(item.id);

      const likeCount = likedItem.likes;
      const likesCountElement = document.getElementById(`likes-${item.id}`);
      if (likesCountElement) {
        likesCountElement.textContent = `${likeCount} Likes`;
      }
    });
  } catch (error) {
    console.error('Error updating likes:', error);
  }
}

async function getItemById(id) {
  try {
    const items = await fetchBaseData();
    const item = items.find((d) => d.id === id) || {};
    return item;
  } catch (error) {
    console.error('Failed to fetch item');
    return {};
  }
}

async function handleShowPopup() {
  const id = this['data-id'];
  const item = await getItemById(id);
  console.log({ item });
  showCommentsPopup(item);
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
  commentButton['data-id'] = item.id;

  likeIcon.addEventListener('click', async () => {
    try {
      const updated = await updateInteraction(appId, item.id);
      if (updated) {
        await populateItems();
      }
    } catch (error) {
      console.error('Error updating interaction:', error);
    }
  });
  commentButton.addEventListener('click', handleShowPopup);

  itemDiv.appendChild(image);
  itemDiv.appendChild(h2);
  h2.appendChild(likeIcon);
  likes.id = `likes-${item.id}`;
  itemDiv.appendChild(likes);
  itemDiv.appendChild(commentButton);

  return itemDiv;
}

async function submitCommentHandler(event) {
  event.preventDefault();
  const { id } = event.target.dataset;
  console.log({ id });
  const item = await getItemById(Number(id));
  const nameInput = commentsForm.querySelector('.name-input');
  const commentInput = commentsForm.querySelector('.comment-input');
  const name = nameInput.value;
  const commentText = commentInput.value;

  if (name && commentText) {
    try {
      const success = await submitComment(appId, item.id, name, commentText);
      if (success) {
        nameInput.value = '';
        commentInput.value = '';

        // Fetch and update comments for the specific item
        await fetchAndUpdateComments(item); // Add await here
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  }
}

function showCommentsPopup(item) {
  try {
    commentsPopup.classList.add('visible');
    itemComments.textContent = `Comments for ${item.name}`;

    itemImg.innerHTML = `<img src="${item.image.medium}" />`;
    commentsDiv.innerHTML = `<form id="commentsForm" data-id="${item.id}">
     <input type="text" class="name-input" placeholder="Your Name">
     <textarea class="comment-input" placeholder="Your Comment"></textarea>
     <button type="submit" class="submit-button">Submit</button>
 </form>`;
    // Reset the comment counter to initial value
    updateCommentCounter(0);

    // Fetch and update comments for the specific item
    fetchAndUpdateComments(item);
    const commentsForm = document.getElementById('commentsForm');

    // Attach the submit handler to the form
    commentsForm.addEventListener('submit', submitCommentHandler);
  } catch (error) {
    console.error('Error showing comments popup:', error);
  }
}

function updateCommentsList(itemId, comments) {
  const itemCommentsElement = commentsList;
  if (!itemCommentsElement) return;

  itemCommentsElement.innerHTML = '';

  comments.forEach((comment) => {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';
    commentDiv.innerHTML = `
      <p>${comment.username}:  ${comment.comment}</p>
      
    `;
    itemCommentsElement.appendChild(commentDiv);
  });
}

closeCommentsButton.addEventListener('click', () => {
  commentsPopup.classList.remove('visible');
});
document.addEventListener('DOMContentLoaded', () => {
  populateItems();
});
