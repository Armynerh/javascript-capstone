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