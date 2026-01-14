const inputE = document.querySelector('.js-champion-search');
const dropDownElem = document.querySelector('.search-dropdown')
const langBtn = document.querySelector('.language-toggle');
const nicknames = {
  "lb": "LeBlanc",
  "gp": "Gangplank",
  "asol": "Aurelion Sol",
  "morg": "Morgana",
  "tf": "Twisted Fate",
  "ww": "Warwick",
  "yi": "Master Yi",
  "ls": "Lee Sin",
  "mf": "Miss Fortune",
  "tk": "Tahm Kench",
  "wk": "Wukong",
  "aka aka": "Akali"
}

async function getLatestLoLVersion() {
  const response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
  const versions = await response.json();
  return versions[0];
}

async function fetchChampionData(version, lang) {
  const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/${lang}/champion.json`;
  const response = await fetch(url);
  const data = await response.json();
  console.log("Champion Data:", data);
  return Object.values(data.data);
}

var typed3 = new Typed('.js-auto', {
  strings: ['to MVHMDWVLIIEEEIID™.GG', 'to The GOAT Website.', 'to The Best Emerald Player Website.', 'FCK OP.GG and FCK ur Search Engine !', 'Say Hello To The New ERA Begining <i class="fa-solid fa-fire"></i>'],
  typeSpeed: 30,
  backSpeed: 30,
  smartBackspace: true,
  loop: true
});

function redirect(targetUrl) {
  window.location.href = targetUrl;
  inputE.value = '';
}

function searchResults(champions, version, lang) {
  let found = false;
  let temp = '';
  const trimInput = inputE.value.trim().toLowerCase();
  function printF(x, y, z, m) {
    temp += `
    <div class="dropdown-item">
      <a href="champion.html?name=${z}&lang=${m}" class="row js-champ-btn">
        <div class="mini-champ-img">
          <img src="https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${y}">
        </div>
        <div class="champ-name">
          ${x}
        </div>
      </a>
    </div>
    `;
  }
  champions.forEach(champ => {
    const name = champ.name.toLowerCase();
    const id = champ.id.toLowerCase();
    const nicknameMatch = nicknames[trimInput];
    if (nicknameMatch) {
      if (champ.name === nicknameMatch) {
        printF(champ.name, champ.image.full, champ.id, lang)
        found = true;
      }
    } else {
      if (trimInput === '') {
        printF(champ.name, champ.image.full, champ.id, lang)
        found = true;
      }
      else if (name.startsWith(trimInput) || id.startsWith(trimInput)) {
        printF(champ.name, champ.image.full, champ.id, lang);
        found = true;
      }
    }
  });
  if (!found) {
    temp +=
      `
      <div class="dropdown-item">
        <div class="row">
          <div>
            No Champion With That Name.
          </div>
        </div>
      </div>
    `;
  }
  dropDownElem.innerHTML = temp;
}

function languageCheck() {
  const url = new URL(window.location);
  const allowedLangs = ['ar_AE', 'en_US'];

  let langParam = url.searchParams.get('lang');
  if (!langParam) {
    langParam = document.documentElement.lang;
  }
  const validLang = allowedLangs.includes(langParam) ? langParam : 'en_US';

  url.searchParams.set('lang', validLang);
  window.history.replaceState({}, '', url);
  document.documentElement.setAttribute('lang', validLang);

  console.log("Current Valid Language:", validLang);
  return validLang;
}

function toggleLanguage() {
  const url = new URL(window.location);
  const currentLang = url.searchParams.get('lang') || 'en_US';
  const newLang = (currentLang === 'en_US') ? 'ar_AE' : 'en_US';

  url.searchParams.set('lang', newLang);

  window.location.href = url.href;

  updateButtonText();
}

function updateButtonText() {
  const url = new URL(window.location);
  const lang = url.searchParams.get('lang') || 'en_US';
  const langBtn = document.querySelector('.language-toggle');

  if (langBtn) {
    langBtn.textContent = (lang === 'en_US')
      ? 'Change Data Language To Arabic'
      : 'Change Data Language To English';
  }
}

async function main() {
  const lang = languageCheck();
  const latestPatch = await getLatestLoLVersion();
  const championsData = await fetchChampionData(latestPatch, lang);

  languageCheck();
  updateButtonText();
  searchResults(championsData, latestPatch ,lang);

  inputE.addEventListener('input', () => {
    searchResults(championsData, latestPatch ,lang);
  });

  inputE.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && inputE.value.trim() != '') {
      const firstResult = dropDownElem.querySelector('.js-champ-btn');
      if (firstResult) {
        firstResult.click();
      }
    }
  })
  langBtn.addEventListener('click', toggleLanguage);
}

main();