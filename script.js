// تخزين الحلقات في localStorage
let episodes = JSON.parse(localStorage.getItem('episodes')) || [];

// عناصر HTML
const createEpisodeBtn = document.getElementById('createEpisodeBtn');
const episodesContainer = document.getElementById('episodesContainer');
const episodeFormContainer = document.getElementById('episodeFormContainer');
const episodeNameInput = document.getElementById('episodeName');
const playerCountInput = document.getElementById('playerCount');
const playersContainer = document.getElementById('playersContainer');
const addQuestionBtn = document.getElementById('addQuestionBtn');
const questionsContainer = document.getElementById('questionsContainer');
const saveEpisodeBtn = document.getElementById('saveEpisodeBtn');
const cancelEpisodeBtn = document.getElementById('cancelEpisodeBtn');
const episodeManagerContainer = document.getElementById('episodeManagerContainer');
const episodeTitle = document.getElementById('episodeTitle');
const gameScreen = document.getElementById('gameScreen');
const endEpisodeBtn = document.getElementById('endEpisodeBtn');

// إظهار نموذج إنشاء حلقة
createEpisodeBtn.addEventListener('click', () => {
  episodeFormContainer.classList.remove('hidden');
  episodeNameInput.value = '';
  playerCountInput.value = '';
  playersContainer.innerHTML = '';
  questionsContainer.innerHTML = '';
});

// إضافة أسماء المتسابقين
playerCountInput.addEventListener('input', () => {
  playersContainer.innerHTML = '';
  let count = parseInt(playerCountInput.value);
  for (let i = 0; i < count; i++) {
    let input = document.createElement('input');
    input.type = "text";
    input.placeholder = `اسم المتسابق ${i + 1}`;
    playersContainer.appendChild(input);
  }
});

// إضافة سؤال جديد
addQuestionBtn.addEventListener('click', () => {
  let questionDiv = document.createElement('div');
  questionDiv.innerHTML = `
    <input type="text" placeholder="السؤال">
    <input type="text" placeholder="الخيار 1">
    <input type="text" placeholder="الخيار 2">
    <input type="text" placeholder="الخيار 3">
    <input type="text" placeholder="الخيار 4">
    <input type="number" min="1" max="4" placeholder="رقم الإجابة الصحيحة">
  `;
  questionsContainer.appendChild(questionDiv);
});

// حفظ الحلقة الجديدة
saveEpisodeBtn.addEventListener('click', () => {
  let episodeName = episodeNameInput.value.trim();
  if (!episodeName) return alert("يجب إدخال اسم الحلقة!");

  let players = Array.from(playersContainer.children).map(input => input.value.trim()).filter(v => v);
  let questions = Array.from(questionsContainer.children).map(q => {
    let inputs = q.getElementsByTagName('input');
    return {
      question: inputs[0].value.trim(),
      options: [inputs[1].value.trim(), inputs[2].value.trim(), inputs[3].value.trim(), inputs[4].value.trim()],
      correctAnswer: parseInt(inputs[5].value)
    };
  });

  let episode = { id: Date.now(), name: episodeName, players, questions };
  episodes.push(episode);
  localStorage.setItem('episodes', JSON.stringify(episodes));

  episodeFormContainer.classList.add('hidden');
  renderEpisodes();
});

// إلغاء إنشاء الحلقة
cancelEpisodeBtn.addEventListener('click', () => {
  episodeFormContainer.classList.add('hidden');
});

// عرض الحلقات
function renderEpisodes() {
  episodesContainer.innerHTML = '';
  episodes.forEach(ep => {
    let div = document.createElement('div');
    div.classList.add('episode-item');
    div.innerHTML = `
      <span>${ep.name}</span>
      <button onclick="startEpisode(${ep.id})">بدء الحلقة</button>
      <button onclick="deleteEpisode(${ep.id})">❌ حذف</button>
    `;
    episodesContainer.appendChild(div);
  });
}

// بدء الحلقة
function startEpisode(id) {
  let episode = episodes.find(e => e.id === id);
  if (!episode) return;

  episodeTitle.textContent = episode.name;
  gameScreen.innerHTML = "يتم الآن تشغيل الحلقة...";
  episodeManagerContainer.classList.remove('hidden');
}

// حذف الحلقة
function deleteEpisode(id) {
  episodes = episodes.filter(e => e.id !== id);
  localStorage.setItem('episodes', JSON.stringify(episodes));
  renderEpisodes();
}

// إنهاء الحلقة
endEpisodeBtn.addEventListener('click', () => {
  episodeManagerContainer.classList.add('hidden');
});

window.onload = renderEpisodes;
