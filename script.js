(function () {
  const program = [
    { time: '19:00', title: 'Karşılama & Kokteyl', note: 'Bahçede karşılama içecekleri' },
    { time: '20:00', title: 'Yemek', note: '' },
    { time: '21:00', title: 'Kutlama & Dans', note: 'İlk dans ve pistin açılışı' },
  ];

  const programList = document.getElementById('program-list');
  program.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'program-row';
    row.innerHTML = `
      <div class="program-time">${item.time}</div>
      <div>
        <div class="program-title">${item.title}</div>
        ${item.note ? `<div class="program-note">${item.note}</div>` : ''}
      </div>
    `;
    programList.appendChild(row);
  });

  const address = 'Murat Reis Mah. Yeni Ocak Sk. No:39, Üsküdar, İstanbul';
  const encoded = encodeURIComponent(address);
  document.getElementById('map-embed').src = `https://www.google.com/maps?q=${encoded}&output=embed`;
  document.getElementById('map-directions').href = `https://www.google.com/maps/search/?api=1&query=${encoded}`;

  const form = document.getElementById('rsvp-form');
  const nameInput = document.getElementById('rsvp-name');
  const noteInput = document.getElementById('rsvp-note');
  const guestCountField = document.getElementById('field-guest-count');
  const guestCountSelect = document.getElementById('rsvp-guest-count');
  const plusOneField = document.getElementById('field-plus-one');
  const plusOneInput = document.getElementById('rsvp-plus-one');
  const yesBtn = document.getElementById('btn-attending-yes');
  const noBtn = document.getElementById('btn-attending-no');
  const submitBtn = document.getElementById('rsvp-submit');
  const confirmationPanel = document.getElementById('rsvp-confirmation');
  const confirmationTitle = document.getElementById('confirmation-title');

  let attending = null; // 'yes' | 'no' | null

  function updateAttendanceUI() {
    yesBtn.classList.toggle('selected-yes', attending === 'yes');
    noBtn.classList.toggle('selected-no', attending === 'no');
    guestCountField.classList.toggle('hidden', attending !== 'yes');
    plusOneField.classList.toggle('hidden', !(attending === 'yes' && guestCountSelect.value === '2'));
    updateSubmitState();
  }

  function updateSubmitState() {
    submitBtn.disabled = !(nameInput.value.trim() && attending);
  }

  yesBtn.addEventListener('click', () => { attending = 'yes'; updateAttendanceUI(); });
  noBtn.addEventListener('click', () => { attending = 'no'; updateAttendanceUI(); });
  nameInput.addEventListener('input', updateSubmitState);
  guestCountSelect.addEventListener('change', updateAttendanceUI);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!(nameInput.value.trim() && attending)) return;

    // NOTE: no backend/network call wired up yet — connect this to whatever
    // service (spreadsheet/email/etc.) should receive RSVPs.
    const name = nameInput.value.trim();
    confirmationTitle.textContent = `Teşekkürler, ${name}!`;
    form.classList.add('hidden');
    confirmationPanel.classList.remove('hidden');
  });

  updateAttendanceUI();
})();
