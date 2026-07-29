(function () {
  const entryGate = document.getElementById('entry-gate');
  const entryGateBtn = document.getElementById('entry-gate-btn');

  let spotifyController = null;
  let playRequested = false;

  window.onSpotifyIframeApiReady = (IFrameAPI) => {
    const element = document.getElementById('spotify-embed');
    const options = {
      uri: 'spotify:playlist:2qsWnIKB2HUs1eXHvhvNCs',
      width: '100%',
      height: '352',
    };
    IFrameAPI.createController(element, options, (EmbedController) => {
      spotifyController = EmbedController;
      if (playRequested) {
        spotifyController.play();
        playRequested = false;
      }
    });
  };

  const spotifyApiScript = document.createElement('script');
  spotifyApiScript.src = 'https://open.spotify.com/embed/iframe-api/v1';
  document.head.appendChild(spotifyApiScript);

  entryGateBtn.addEventListener('click', () => {
    if (spotifyController) {
      spotifyController.play();
    } else {
      playRequested = true;
    }
    document.documentElement.classList.remove('gate-open');
    entryGate.classList.add('entry-gate-hidden');
    setTimeout(() => { entryGate.style.display = 'none'; }, 700);
  });

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

  const RSVP_FORM_ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLSevdQh51eCt9Jaj7mmnX_vTJzD0X8KtFRn-yqe6AEIKMyqToQ/formResponse';
  const RSVP_ENTRY_IDS = {
    name: 'entry.207878760',
    attending: 'entry.1820563630',
    guestCount: 'entry.471949994',
    plusOneName: 'entry.452103807',
    note: 'entry.46040072',
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!(nameInput.value.trim() && attending)) return;

    const name = nameInput.value.trim();
    const params = new URLSearchParams();
    params.set(RSVP_ENTRY_IDS.name, name);
    params.set(RSVP_ENTRY_IDS.attending, attending === 'yes' ? 'Katılıyorum' : 'Katılamıyorum');
    if (attending === 'yes') {
      params.set(RSVP_ENTRY_IDS.guestCount, guestCountSelect.value === '2' ? '2 Kişi (+1)' : '1 Kişi');
      if (guestCountSelect.value === '2') {
        params.set(RSVP_ENTRY_IDS.plusOneName, plusOneInput.value.trim());
      }
    }
    params.set(RSVP_ENTRY_IDS.note, noteInput.value.trim());

    fetch(RSVP_FORM_ACTION, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    }).catch(() => {});

    confirmationTitle.textContent = `Teşekkürler, ${name}!`;
    form.classList.add('hidden');
    confirmationPanel.classList.remove('hidden');
  });

  updateAttendanceUI();

  const weddingDate = new Date('2026-10-03T19:00:00+03:00').getTime();
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function updateCountdown() {
    const diff = Math.max(0, weddingDate - Date.now());
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    cdDays.textContent = pad(days);
    cdHours.textContent = pad(hours);
    cdMinutes.textContent = pad(minutes);
    cdSeconds.textContent = pad(seconds);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  const eventStart = new Date('2026-10-03T19:00:00+03:00');
  const eventEnd = new Date('2026-10-04T00:00:00+03:00');
  const eventTitle = 'Zeynep & Volkan Düğün';
  const eventLocation = 'Nazay Bahçe, Murat Reis Mah. Yeni Ocak Sk. No:39, Üsküdar / İstanbul';
  const eventDetails = 'Zeynep & Volkan\'ın nikah yemeği ve kutlaması. Akış: 19:00 Karşılama & Kokteyl, 20:00 Yemek, 21:00 Kutlama & Dans.';

  function toICSDateUTC(d) {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  const googleCalUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
    + '&text=' + encodeURIComponent(eventTitle)
    + '&dates=' + toICSDateUTC(eventStart) + '/' + toICSDateUTC(eventEnd)
    + '&details=' + encodeURIComponent(eventDetails)
    + '&location=' + encodeURIComponent(eventLocation);
  document.getElementById('cal-google').href = googleCalUrl;

  function icsEscape(text) {
    return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  }

  document.getElementById('cal-ics').addEventListener('click', () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Zeynep & Volkan Dugun//TR',
      'BEGIN:VEVENT',
      'UID:zeynep-volkan-dugun-2026@dugun-davetiyesi',
      'DTSTAMP:' + toICSDateUTC(new Date()),
      'DTSTART:' + toICSDateUTC(eventStart),
      'DTEND:' + toICSDateUTC(eventEnd),
      'SUMMARY:' + icsEscape(eventTitle),
      'DESCRIPTION:' + icsEscape(eventDetails),
      'LOCATION:' + icsEscape(eventLocation),
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zeynep-volkan-dugun.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
})();
