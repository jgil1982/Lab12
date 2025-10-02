// === Interruptor para forzar error (ponlo en true para probar) ===
//const FORCE_ERROR = false;

// Variables globales
let coffeeData = [];

// === Función para crear estrellas ===
function createStars(rating) {
  let stars = '';
  for (let i = 0; i < Math.floor(rating); i++) {
    stars += '⭐';
  }
  return stars;
}

// === Función para crear una tarjeta de café ===
function createCoffeeCard(coffee) {
  const card = document.createElement('div');
  card.className = 'coffee-card';

  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'card-image-wrapper';

  const img = document.createElement('img');
  img.src = coffee.image;
  img.alt = coffee.name;
  img.className = 'card-image';
  imageWrapper.appendChild(img);

  if (coffee.popular) {
    const badge = document.createElement('div');
    badge.className = 'popular-badge';
    badge.textContent = 'Popular';
    imageWrapper.appendChild(badge);
  }

  card.appendChild(imageWrapper);

  const cardContent = document.createElement('div');
  cardContent.className = 'card-content';

  const cardHeader = document.createElement('div');
  cardHeader.className = 'card-header';

  const title = document.createElement('h3');
  title.className = 'card-title';
  title.textContent = coffee.name;
  cardHeader.appendChild(title);

  const price = document.createElement('div');
  price.className = 'card-price';
  price.textContent = coffee.price;
  cardHeader.appendChild(price);

  cardContent.appendChild(cardHeader);

  const cardRating = document.createElement('div');
  cardRating.className = 'card-rating';

  if (coffee.rating) {
    const starsSpan = document.createElement('span');
    starsSpan.className = 'stars';
    starsSpan.textContent = createStars(coffee.rating);
    cardRating.appendChild(starsSpan);

    const ratingText = document.createElement('span');
    ratingText.className = 'rating-text';
    ratingText.textContent = coffee.rating;
    cardRating.appendChild(ratingText);

    const votes = document.createElement('span');
    votes.className = 'votes';
    votes.textContent = `(${coffee.votes} votes)`;
    cardRating.appendChild(votes);
  } else {
    const noRatings = document.createElement('span');
    noRatings.className = 'no-ratings';
    noRatings.textContent = '✘ No ratings';
    cardRating.appendChild(noRatings);
  }

  if (!coffee.available) {
    const soldOut = document.createElement('span');
    soldOut.className = 'sold-out';
    soldOut.textContent = 'Sold out';
    cardRating.appendChild(soldOut);
  }

  cardContent.appendChild(cardRating);
  card.appendChild(cardContent);

  return card;
}

// === Función para mostrar los cafés ===
function displayCoffees(coffees) {
  const coffeeGrid = document.getElementById('coffeeGrid');
  if (!coffeeGrid) {
    console.warn('No se encontró #coffeeGrid en el DOM.');
    return;
  }

  coffeeGrid.innerHTML = '';
  coffees.forEach(function (coffee) {
    const card = createCoffeeCard(coffee);
    coffeeGrid.appendChild(card);
  });
}

// === Función para cargar los datos ===
function loadCoffees() {
  const coffeeGrid = document.getElementById('coffeeGrid');

  // ---- try–catch para error intencional (simple) ----
  try {
    if (FORCE_ERROR) {
      throw new Error('Error en el café (modo demo activado)');
    }

    // IMPORTANTE: Cambia esta URL por la que te proporcionaron
    fetch('https://raw.githubusercontent.com/devchallenges-io/curriculum/refs/heads/main/4-frontend-libaries/challenges/group_1/data/simple-coffee-listing-data.json')
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
      })
      .then(function (data) {
        coffeeData = data;
        displayCoffees(data);
      })
      .catch(function (error) {
        console.error('Error:', error);
        const htmlErr =
          '<div style="grid-column: 1 / -1; text-align: center; padding: 40px;">' +
            '<p style="color: #ef4444; font-size: 18px; margin-bottom: 10px;">⚠️ Error</p>' +
            '<p style="color: #9ca3af; font-size: 14px;">' + error.message + '</p>' +
          '</div>';

        if (coffeeGrid) {
          coffeeGrid.innerHTML = htmlErr;
        } else {
          // Fallback si el grid no existe
          const fallback = document.createElement('div');
          fallback.innerHTML = htmlErr;
          document.body.prepend(fallback);
        }
      });

  } catch (error) {
    // Si FORCE_ERROR = true, caes aquí y NO se hace fetch (no se cargan fotos)
    console.error('Error (intencional):', error);
    const htmlErr =
      '<div style="grid-column: 1 / -1; text-align: center; padding: 40px;">' +
        '<p style="color: #ef4444; font-size: 18px; margin-bottom: 10px;">⚠️ Error</p>' +
        '<p style="color: #9ca3af; font-size: 14px;">' + error.message + '</p>' +
      '</div>';

    if (coffeeGrid) {
      coffeeGrid.innerHTML = htmlErr;
    } else {
      const fallback = document.createElement('div');
      fallback.innerHTML = htmlErr;
      document.body.prepend(fallback);
    }
  }
}

// === Función para filtrar cafés disponibles ===
function filterAvailableCoffees() {
  const availableCoffees = coffeeData.filter(function (coffee) {
    return coffee.available === true;
  });
  displayCoffees(availableCoffees);
}

// === Event Listeners para los botones ===
function setupFilters() {
  const btnAllProducts = document.getElementById('btnAllProducts');
  const btnAvailable = document.getElementById('btnAvailable');

  if (!btnAllProducts || !btnAvailable) {
    console.warn('No se encontraron botones de filtro en el DOM.');
    return;
  }

  btnAllProducts.addEventListener('click', function () {
    btnAllProducts.classList.add('active');
    btnAvailable.classList.remove('active');
    displayCoffees(coffeeData);
  });

  btnAvailable.addEventListener('click', function () {
    btnAvailable.classList.add('active');
    btnAllProducts.classList.remove('active');
    filterAvailableCoffees();
  });
}

// === Inicialización ===
document.addEventListener('DOMContentLoaded', function () {
  loadCoffees();
  setupFilters();
});
