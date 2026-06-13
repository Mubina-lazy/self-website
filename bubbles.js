(function () {
  const COLORS = [
    ['rgba(249,168,212,0.50)', 'rgba(249,168,212,0.15)'],
    ['rgba(196,181,253,0.48)', 'rgba(196,181,253,0.14)'],
    ['rgba(253,164,175,0.46)', 'rgba(253,164,175,0.13)'],
    ['rgba(253,186,116,0.42)', 'rgba(253,186,116,0.12)'],
    ['rgba(167,139,250,0.46)', 'rgba(167,139,250,0.13)'],
    ['rgba(244,114,182,0.44)', 'rgba(244,114,182,0.12)'],
    ['rgba(103,232,249,0.40)', 'rgba(103,232,249,0.11)'],
  ];

  const COUNT = 16;
  const bubbles = [];

  function makeBubble(small, startX, startY) {
    const el = document.createElement('div');
    el.className = 'floating-bubble';
    const size = small
      ? 18 + Math.random() * 28
      : 45 + Math.random() * 85;
    const c = COLORS[Math.floor(Math.random() * COLORS.length)];
    el.style.cssText = `
      width:${size}px;height:${size}px;
      background: radial-gradient(circle at 28% 28%, ${c[0]}, ${c[1]});
    `;
    document.body.appendChild(el);

    const speed = small ? 1.2 + Math.random() * 1 : 0.2 + Math.random() * 0.45;
    const angle = Math.random() * Math.PI * 2;
    const b = {
      el, size,
      x: startX !== undefined ? startX - size / 2 : Math.random() * window.innerWidth,
      y: startY !== undefined ? startY - size / 2 : Math.random() * window.innerHeight,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (small ? 0 : 0.08),
      wobble: Math.random() * Math.PI * 2,
      wobbleAmp: small ? 0.1 : 0.25 + Math.random() * 0.2,
      wobbleSpeed: 0.006 + Math.random() * 0.009,
      small,
    };

    if (!small) {
      el.addEventListener('click', function (e) {
        e.stopPropagation();
        splitBubble(b);
      });
    }

    return b;
  }

  function splitBubble(b) {
    b.el.style.visibility = 'hidden';
    const cx = b.x + b.size / 2;
    const cy = b.y + b.size / 2;
    const count = 4 + Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
      const mini = makeBubble(true, cx, cy);
      const angle2 = (i / count) * Math.PI * 2 + Math.random() * 0.4;
      const speed2 = 1.5 + Math.random() * 1.5;
      mini.vx = Math.cos(angle2) * speed2;
      mini.vy = Math.sin(angle2) * speed2;
      bubbles.push(mini);
      // Remove mini after 4 seconds
      setTimeout(() => {
        mini.el.remove();
        const idx = bubbles.indexOf(mini);
        if (idx !== -1) bubbles.splice(idx, 1);
      }, 3800 + Math.random() * 1000);
    }
    setTimeout(() => { b.el.style.visibility = ''; }, 2200);
  }

  function tick() {
    const W = window.innerWidth, H = window.innerHeight;
    for (let i = 0; i < bubbles.length; i++) {
      const b = bubbles[i];
      b.wobble += b.wobbleSpeed;
      b.x += b.vx + Math.sin(b.wobble) * b.wobbleAmp;
      b.y += b.vy + Math.cos(b.wobble * 0.8) * (b.wobbleAmp * 0.6);
      // Wrap edges
      if (b.x < -b.size)       b.x = W + 2;
      else if (b.x > W + b.size) b.x = -b.size + 2;
      if (b.y < -b.size)       b.y = H + 2;
      else if (b.y > H + b.size) b.y = -b.size + 2;
      b.el.style.transform = `translate(${b.x}px,${b.y}px)`;
    }
    requestAnimationFrame(tick);
  }

  for (let i = 0; i < COUNT; i++) bubbles.push(makeBubble(false));
  requestAnimationFrame(tick);
})();
