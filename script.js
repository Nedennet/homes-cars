// Numéro WhatsApp par défaut (au format international sans espaces)
const whatsappNumber = "221776148620";

const whatsappTemplates = {
  general: `Bonjour, je souhaite organiser mon sejour avec Bambilor Homes & Cars.\n\nDate d'arrivee :\nDate de depart :\nNombre de personnes :\nBesoin principal (logement/transport/pack) :\n\nPouvez-vous me proposer une formule ?`,
  studio: `Bonjour, je souhaite reserver le Studio Bambilor.\n\nDates :\nNombre de personnes :\nDuree du sejour :\nBesoin de transport avec chauffeur : oui/non`,
  pickup: `Bonjour, je souhaite reserver le pick-up avec chauffeur.\n\nDates :\nNombre de passagers :\nType de trajets (ville, aeroport, longue distance) :\nDuree :`,
  f5: `Bonjour, je souhaite reserver l'Appartement F5 a Bambilor.\n\nDates :\nNombre de personnes :\nDuree du sejour :\nBesoin de transport avec chauffeur : oui/non`,
  'pack-sejour': `Bonjour, je suis interesse par le PACK SEJOUR (Studio + transport avec chauffeur).\n\nDates :\nNombre de personnes :\nDuree :\nPouvez-vous me confirmer le meilleur tarif pack ?`,
  'pack-arrivee': `Bonjour, je suis interesse par le PACK ARRIVEE.\n\nDate et heure d'arrivee :\nVol/Aeroport :\nNombre de personnes :\nDuree du sejour :`,
  'pack-business': `Bonjour, je souhaite une offre PACK BUSINESS pour une mission autour de Dakar/Diamniadio/Bambilor/Rufisque/AIBD.\n\nEntreprise :\nNombre de collaborateurs :\nDates :\nBesoins logement/transport :`,
  'pack-famille': `Bonjour, je suis interesse par le PACK FAMILLE (F5 + transport + assistance locale).\n\nDates :\nNombre d'adultes :\nNombre d'enfants :\nDuree du sejour :`
};

const mediaLibrary = {
  studio: {
    title: 'Studio à Bambilor',
    description: 'Photos du studio et vidéo de présentation.',
    items: [
      { type: 'image', src: 'photos/salon.jpeg', alt: 'Vue principale du studio à Bambilor' },
      { type: 'image', src: 'photos/chambreS.jpeg', alt: 'Chambre du studio' },
      { type: 'image', src: 'photos/salonS.jpeg', alt: 'Salon du studio' },
      { type: 'video', src: 'photos/video1.mp4', title: 'Vidéo du studio' }
    ]
  },
  pickup: {
    title: 'Pick-up avec Chauffeur',
    description: 'Galerie du véhicule et vidéo de démonstration.',
    items: [
      { type: 'image', src: 'photos/pickup1.jpg', alt: 'Pick-up avec chauffeur à Bambilor' },
      { type: 'image', src: 'photos/pickup2.jpg', alt: 'Extérieur du pick-up' },
    ]
  },
  f5: {
    title: 'Appartement F5 Spacieux',
    description: 'Photos des espaces de vie et vidéo de visite.',
    items: [
      { type: 'image', src: 'photos/salon2.jpeg', alt: 'Appartement F5 Bambilor' },
      { type: 'image', src: 'photos/chambreF.jpeg' },
      { type: 'image', src: 'photos/Cuisine.jpeg', alt: 'Cuisine de l’appartement F5' },
      { type: 'video', src: 'photos/video1.mp4', title: 'Vidéo de l’appartement F5' }
    ]
  }
};

let currentMediaKey = null;
let currentMediaIndex = 0;

const mediaModal = document.getElementById('media-modal');
const mediaStage = document.getElementById('media-stage');
const mediaTitle = document.getElementById('media-modal-title');
const mediaDescription = document.getElementById('media-modal-description');
const mediaCounter = document.getElementById('media-counter');
const mediaThumbs = document.getElementById('media-thumbs');

function renderMediaItem(item) {
  if (item.type === 'video') {
    return `<video controls playsinline src="${item.src}" title="${item.title || ''}"></video>`;
  }

  return `<img src="${item.src}" alt="${item.alt}">`;
}

function updateMediaViewer() {
  const media = mediaLibrary[currentMediaKey];
  if (!media) {
    return;
  }

  const item = media.items[currentMediaIndex];
  mediaStage.innerHTML = renderMediaItem(item);
  mediaTitle.textContent = media.title;
  mediaDescription.textContent = media.description;
  mediaCounter.textContent = `${currentMediaIndex + 1} / ${media.items.length}`;

  mediaThumbs.innerHTML = media.items.map((thumb, index) => {
    const activeClass = index === currentMediaIndex ? ' is-active' : '';
    const thumbContent = thumb.type === 'video'
      ? `<video muted playsinline src="${thumb.src}"></video>`
      : `<img src="${thumb.src}" alt="${thumb.alt}">`;

    return `<button type="button" class="media-thumb${activeClass}" onclick="goToMedia(${index})" aria-label="Voir l’élément ${index + 1}">${thumbContent}</button>`;
  }).join('');
}

function openMediaViewer(mediaKey) {
  currentMediaKey = mediaKey;
  currentMediaIndex = 0;
  updateMediaViewer();
  mediaModal.classList.add('is-open');
  mediaModal.setAttribute('aria-hidden', 'false');
}

function closeMediaViewer() {
  mediaModal.classList.remove('is-open');
  mediaModal.setAttribute('aria-hidden', 'true');
  mediaStage.innerHTML = '';
}

function goToMedia(index) {
  const media = mediaLibrary[currentMediaKey];
  if (!media) {
    return;
  }

  currentMediaIndex = (index + media.items.length) % media.items.length;
  updateMediaViewer();
}

function nextMedia() {
  goToMedia(currentMediaIndex + 1);
}

function previousMedia() {
  goToMedia(currentMediaIndex - 1);
}

document.addEventListener('keydown', (event) => {
  if (!mediaModal.classList.contains('is-open')) {
    return;
  }

  if (event.key === 'Escape') {
    closeMediaViewer();
  }

  if (event.key === 'ArrowRight') {
    nextMedia();
  }

  if (event.key === 'ArrowLeft') {
    previousMedia();
  }
});

function setWhatsAppLink(templateKey = 'general') {
  const whatsappBtn = document.getElementById('whatsapp-link');
  if (!whatsappBtn) {
    return;
  }

  const template = whatsappTemplates[templateKey] || whatsappTemplates.general;
  const message = encodeURIComponent(template);
  whatsappBtn.href = `https://wa.me/${whatsappNumber}?text=${message}`;
}

function openWhatsAppIntent(templateKey = 'general') {
  setWhatsAppLink(templateKey);
  const whatsappBtn = document.getElementById('whatsapp-link');

  if (!whatsappBtn) {
    return;
  }

  window.open(whatsappBtn.href, '_blank', 'noopener');
}

// Définit un message générique au chargement de la page.
setWhatsAppLink('general');