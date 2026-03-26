// ─── Modal ────────────────────────────────────────────────────────────────────

function createMemeModal() {
  modal = document.createElement('div');
  modal.style.cssText = `
    display: none; 
    position: fixed;
    inset: 0; 
    background: rgba(0,0,0,0.85);
    backdrop-filter: blur(4px);
    z-index: 9999; 
    justify-content: center; 
    align-items: center;
    padding: 16px;
    box-sizing: border-box;
  `;

  const box = document.createElement('div');
  box.style.cssText = `
    background: #1c1c1e; 
    border-radius: 20px; 
    padding: 28px;
    width: 100%;
    max-width: 480px; /* Увеличили для мобильных */
    max-height: 85vh;
    overflow-y: auto;
    display: flex; 
    flex-direction: column; 
    gap: 20px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    box-sizing: border-box;
    box-shadow: 0 15px 35px rgba(0,0,0,0.6);
    color: #fff;
  `;

  function makeInput(id, placeholder) {
    const inp = document.createElement('input');
    inp.id = id;
    inp.type = 'text';
    inp.placeholder = placeholder;
    inp.autocomplete = 'off';
    inp.style.cssText = `
      padding: 16px 18px; 
      border-radius: 14px; 
      border: 2px solid #3a3a3c;
      font-size: 17px;
      background: #2c2c2e; 
      color: #fff;
      outline: none; 
      width: 100%; 
      box-sizing: border-box;
      transition: border-color 0.2s, transform 0.1s;
    `;
    
    inp.onfocus = () => {
      inp.style.borderColor = '#2ecc71';
      inp.style.transform = 'scale(1.02)';
    };
    inp.onblur = () => {
      inp.style.borderColor = '#3a3a3c';
      inp.style.transform = 'scale(1)';
    };
    
    return inp;
  }

  const btnRow = document.createElement('div');
  btnRow.style.cssText = `
    display:flex; 
    gap: 14px; 
    margin-top: 10px;
  `;

  function makeBtn(label, bg, handler) {
    const b = document.createElement('button');
    b.textContent = label;
    b.style.cssText = `
      flex:1; 
      padding: 18px; 
      border-radius: 14px; 
      border: none;
      background:${bg}; 
      color:#fff; 
      font-size: 17px;
      font-weight: 700; 
      cursor:pointer;
      transition: transform 0.1s, opacity 0.2s;
      -webkit-tap-highlight-color: transparent;
      min-height: 54px; /* Минимальная высота для удобного тапа */
    `;
    
    b.onmousedown = () => b.style.transform = 'scale(0.97)';
    b.onmouseup = () => b.style.transform = 'scale(1)';
    b.onmouseleave = () => b.style.transform = 'scale(1)';
    
    b.addEventListener('click', handler);
    return b;
  }

  btnRow.appendChild(makeBtn('Отмена', '#3a3a3c', () => closeModal()));
  btnRow.appendChild(makeBtn('ОК', '#2ecc71', () => {
    const top = document.getElementById('memeTop').value.trim();
    const bot = document.getElementById('memeBottom').value.trim();
    applyMemeText(top, bot);
    closeModal();
  }));

  box.appendChild(makeInput('memeTop', 'Текст сверху'));
  box.appendChild(makeInput('memeBottom', 'Текст снизу'));
  box.appendChild(btnRow);
  modal.appendChild(box);
  document.body.appendChild(modal);
}

function openModal() {
  document.getElementById('memeTop').value = '';
  document.getElementById('memeBottom').value = '';
  modal.style.display = 'flex';
  modalOpen = true;
}

function closeModal() {
  modal.style.display = 'none';
  modalOpen = false;
  mouseIsPressed = false; // сброс, чтобы draw() не поймал клик по закрытию
}

// ─── Мем-текст ────────────────────────────────────────────────────────────────

function applyMemeText(topText, bottomText) {
  if (!topText && !bottomText) return;

  const g = img;
  const fs = imgSize[0] * 0.13;
  const padding = fs * 0.3;
  const maxW = imgSize[0] - padding * 2;

  g.push();
  g.textFont(impactFont);
  g.textSize(fs);
  g.strokeWeight(fs * 0.14);
  g.strokeJoin(ROUND);
  g.stroke(0);
  g.fill(255);
  g.textLeading(fs * 1.05);

  if (topText) {
    g.textAlign(CENTER, TOP);
    g.text(topText.toUpperCase(), padding, fs * 0.25, maxW, imgSize[1]);
  }

  if (bottomText) {
    // для нижнего текста считаем фактическую высоту блока и сдвигаем вверх
    const lineCount = Math.ceil(g.textWidth(bottomText.toUpperCase()) / maxW);
    const blockH = lineCount * fs * 1.05;
    g.textAlign(CENTER, TOP);
    g.text(bottomText.toUpperCase(), padding, imgSize[1] - blockH - fs * 0.25, maxW, imgSize[1]);
  }

  g.pop();
}