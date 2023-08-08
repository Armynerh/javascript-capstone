import './style.css';

const dishes = [
  { name: 'Dish Name 1', likes: 123 },
  { name: 'Dish Name 2', likes: 123 },
  { name: 'Dish Name 3', likes: 123 },
  { name: 'Dish Name 4', likes: 123 },
  { name: 'Dish Name 5', likes: 123 },
  { name: 'Dish Name 6', likes: 123 },
];

const itemContainer = document.getElementById('itemContainer');

dishes.forEach((dish) => {
  const itemDiv = document.createElement('div');
  itemDiv.className = 'item';

  const img = document.createElement('img');
  img.src = 'images/food.jpeg';
  img.alt = 'Image not available';

  const h2 = document.createElement('h2');
  h2.innerHTML = `${dish.name} <span class="like-icon"><i class="fa-regular fa-heart"></i></span>`;

  const likes = document.createElement('p');
  likes.className = 'likes';
  likes.textContent = `${dish.likes} Likes`;

  const commentButton = document.createElement('button');
  commentButton.className = 'comment-button';
  commentButton.textContent = 'Comments';

  const reservationButton = document.createElement('button');
  reservationButton.className = 'reservation-button';
  reservationButton.textContent = 'Reservations';

  itemDiv.appendChild(img);
  itemDiv.appendChild(h2);
  itemDiv.appendChild(likes);
  itemDiv.appendChild(commentButton);
  itemDiv.appendChild(reservationButton);

  itemContainer.appendChild(itemDiv);
});

// JavaScript code for the popup functionality

// Function to show the popup
function showPopup() {
  const popup = document.createElement('div');
  popup.className = 'popup';

  const closeButton = document.createElement('button');
  closeButton.className = 'close-button';
  closeButton.innerHTML = '&times;'; // Use 'times' symbol (X) as the button text

  const nameInput = document.createElement('input');
  nameInput.className = 'name-input';
  nameInput.placeholder = 'Your Name';

  const commentInput = document.createElement('textarea');
  commentInput.className = 'comment-input';
  commentInput.placeholder = 'Type your comment here...';

  const submitButton = document.createElement('button');
  submitButton.className = 'submit-button';
  submitButton.textContent = 'Submit';

  const commentDisplay = document.createElement('div');
  commentDisplay.className = 'comment-display';

  popup.appendChild(closeButton);
  popup.appendChild(nameInput);
  popup.appendChild(commentInput);
  popup.appendChild(submitButton);
  popup.appendChild(commentDisplay);

  document.body.appendChild(popup);

  // Close the popup when the Close button is clicked
  closeButton.addEventListener('click', () => {
    popup.remove();
  });

  // Submit the comment and display the entered name and comment above the form
  submitButton.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const commentText = commentInput.value.trim();
    if (name !== '' && commentText !== '') {
      commentDisplay.innerHTML = `<p><strong>${name}:</strong> ${commentText}</p>`;
      popup.appendChild(commentDisplay);
    } else {
      throw new Error('Please enter your name and a valid comment.');
    }
  });
}

// Add event listeners to each "Comments" button
const commentButtons = document.querySelectorAll('.comment-button');
commentButtons.forEach((button) => {
  button.addEventListener('click', showPopup);
});
