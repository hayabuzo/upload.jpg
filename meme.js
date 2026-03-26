// ─── Modal ────────────────────────────────────────────────────────────────────

function createMemeModal() {
  modal = document.createElement('div');
  modal.style.cssText = `
    display: none; position: fixed;
    inset: 0; background: rgba(0,0,0,0.75);
    z-index: 999; justify-content: center; align-items: center;
  `;

  const box = document.createElement('div');
  box.style.cssText = `
    background: #1c1c1e; border-radius: 16px; padding: 20px;
    width: 82%; max-width: 340px;
    display: flex; flex-direction: column; gap: 10px;
    font-family: -apple-system, sans-serif;
  `;

  function makeInput(id, placeholder) {
    const inp = document.createElement('input');
    inp.id = id;
    inp.type = 'text';
    inp.placeholder = placeholder;
    inp.autocomplete = 'off';
    inp.style.cssText = `
      padding: 10px 12px; border-radius: 10px; border: none;
      font-size: 16px; background: #2c2c2e; color: #fff;
      outline: none; width: 100%; box-sizing: border-box;
    `;
    return inp;
  }

  const btnRow = document.createElement('div');
  btnRow.style.cssText = 'display:flex; gap:10px; margin-top:2px;';

  function makeBtn(label, bg, handler) {
    const b = document.createElement('button');
    b.textContent = label;
    b.style.cssText = `
      flex:1; padding:12px; border-radius:10px; border:none;
      background:${bg}; color:#fff; font-size:16px;
      font-weight:600; cursor:pointer;
    `;
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

  box.appendChild(makeInput('memeTop', 'верхний текст'));
  box.appendChild(makeInput('memeBottom', 'нижний текст'));
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
  g.textFont('Impact');
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