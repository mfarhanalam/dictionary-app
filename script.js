const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const resultsDiv = document.getElementById('results');
const themeToggle = document.getElementById('theme-toggle');
const fontSelector = document.getElementById('font-selector');

searchBtn.addEventListener('click', searchWord);
searchInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') searchWord();
});
themeToggle.addEventListener('click', toggleTheme);
fontSelector.addEventListener('change', changeFont);

if (localStorage.getItem('darkMode') === 'enabled') {
  document.body.classList.add('dark-mode');
  themeToggle.textContent = 'Light Mode';
}

const savedFont = localStorage.getItem('selectedFont');
if (savedFont) {
  document.body.style.fontFamily = savedFont;
  fontSelector.value = savedFont;
}

function searchWord() {
  const word = searchInput.value.trim();
  if (!word) return;

  resultsDiv.innerHTML = `<div class="loading"><p>Searching for "${word}"...</p></div>`;

  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(response => {
      if (!response.ok) throw new Error('Word not found');
      return response.json();
    })
    .then(data => displayResults(data))
    .catch(error => {
      resultsDiv.innerHTML = `
        <div class="error">
          <p>${error.message}</p>
          <p>Please check the spelling or try another word.</p>
        </div>
      `;
    });
}

function displayResults(data) {
  const wordData = data[0];
  let html = `
    <div class="result-card">
      <div class="word-header">
        <h2 class="word">${wordData.word}</h2>
        ${wordData.phonetic ? `<p class="phonetic">${wordData.phonetic}</p>` : ''}
      </div>
  `;

  wordData.meanings.forEach(meaning => {
    html += `<h3 class="part-of-speech">${meaning.partOfSpeech}</h3><ol>`;
    meaning.definitions.forEach(def => {
      html += `
        <li class="definition">
          <p>${def.definition}</p>
          ${def.example ? `<p class="example">Example: "${def.example}"</p>` : ''}
        </li>
      `;
    });
    html += '</ol>';

    if (meaning.synonyms.length > 0) {
      html += `
        <div class="synonyms">
          <span>Synonyms: </span>${meaning.synonyms.slice(0, 5).join(', ')}
        </div>
      `;
    }
  });

  html += '</div>';
  resultsDiv.innerHTML = html;
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  themeToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
}

function changeFont() {
  const selectedFont = fontSelector.value;
  document.body.style.fontFamily = selectedFont;
  localStorage.setItem('selectedFont', selectedFont);
}
