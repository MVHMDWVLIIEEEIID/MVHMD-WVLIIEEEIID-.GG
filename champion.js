let champID = new URLSearchParams(window.location.search).get('name');
let language = new URLSearchParams(window.location.search).get('lang');
const langBtn = document.querySelector('.language-toggle');

document.title = `${champID} Details By MVHMD WVLIIEEEIID™.GG`;

async function getLatestLoLVersion() {
  const response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
  const versions = await response.json();
  return versions[0];
}

async function fetchJsonData(champID, version, lang) {
  try {
    const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/${lang}/champion/${champID}.json`);
    const json = await response.json();
    console.log(Object.values(json.data));
    return Object.values(json.data);
  } catch (error) {
    console.error("Failed to load champions:", error);
    return [];
  }
}

function changeFavicon(src) {
  link = document.createElement('link');
  link.rel = 'icon';
  document.head.appendChild(link);
  link.href = src;
}

function changeBg(src) {
  document.querySelector('.js-bg').src = src;
}

function generateChampionData(championData) {
  let temp = '';
  const infoElem = document.querySelector('.info-div');
  championData.tags.forEach(element => {
    temp += `<div class="role center glassy">${element}</div>`
  })
  infoElem.innerHTML = `      
      <div class="header glassy">
        <div class="title center">
          ${championData.name + ' : ' + championData.title}
        </div>
      </div>
      <div class="lore center glassy">
        ${championData.lore}
      </div>
      <div class="roles glassy">
        ${temp}
      </div>
      `
}

function generateSkillsData(championData, version) {
  let temp = '';
  const skillsElem = document.querySelector('.skills');
  championData.spells.forEach(spell => {
    temp += `
      <div class="skill center" label="${spell.name}">
        <img src="https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${spell.image.full}">
      </div>
    `
  })

  temp += `
    <div class="skill center passive" label="${championData.passive.name}">
      <img src="https://ddragon.leagueoflegends.com/cdn/${version}/img/passive/${championData.passive.image.full}">
    </div>
  `
  skillsElem.innerHTML = temp;
  skillsElem.firstElementChild.classList.add('selected');

  const skills = document.querySelectorAll('.skill');
  skills.forEach(s => {
    s.addEventListener('click', e => {
      if (!s.classList.contains('selected')) {
        skills.forEach(skill => skill.classList.remove('selected'));
        s.classList.add('selected');
        updateSkillDetailsData(championData, s.getAttribute("label"));
      }
    })
  })
}

function updateSkillDetailsData(championData, label) {
  let detailsElem = document.querySelector('.js-details');
  championData.spells.forEach(spell => {
    console.log(label)
    if (label === spell.name) {
      detailsElem.innerHTML = `<strong>${spell.name}<br></strong>${spell.description}`;
    } else if (label === championData.passive.name) {
      detailsElem.innerHTML = `<strong>${championData.passive.name}<br></strong>${championData.passive.description}`;
    }
  })
}

function generateSkinsData(championData) {
  let temp = '';
  const skinsElem = document.querySelector('.js-skins');

  championData.skins.forEach(skin => {
    temp += `
      <li class="splide__slide">
        <img src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champID}_${skin.num}.jpg">
      </li>
    `
    skinsElem.innerHTML = temp;

    new Splide('.splide', {
      type: 'loop',
      direction: 'ttb',
      height: '100%',
      arrows: false,
      pagination: false,
      autoplay: true,
      interval: 3000,
      speed: 1000,
      pauseOnHover: true,
      pauseOnFocus: true,
      drag: 'free',
      snap: true,
      reducedMotion: {
        autoplay: true,
        speed: 1000,
      }
    }).mount();
  })
}

function generatePageData(championData, version) {
  generateChampionData(championData);
  generateSkillsData(championData, version);
  generateSkinsData(championData);
  updateSkillDetailsData(championData, championData.spells[0].name);
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
  const championData = await fetchJsonData(champID, latestPatch, lang);

  console.log(championData)

  languageCheck();
  updateButtonText();

  if (champID) {
    const foundChamp = championData.find(champ => champ.id === champID);
    if (foundChamp) {
      changeFavicon(`https://ddragon.leagueoflegends.com/cdn/${latestPatch}/img/champion/${champID}.png`);
      changeBg(`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champID}_0.jpg`)
      generatePageData(foundChamp, latestPatch);
    } else {
      window.location.href = 'lol.html';
    }
  } else {
    window.location.href = 'lol.html';
  }
  langBtn.addEventListener('click', toggleLanguage);
}

main();