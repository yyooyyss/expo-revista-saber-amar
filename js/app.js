/* Casa Común · navegación de páginas + actividad interactiva */
(function () {
  'use strict';

  var pages = Array.prototype.slice.call(document.querySelectorAll('.page'));
  var total = pages.length;
  var current = 0;

  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');
  var dotsBox = document.getElementById('dots');
  var label = document.getElementById('pageLabel');
  var bar = document.getElementById('progressBar');

  function buildDots() {
    pages.forEach(function (p, i) {
      var b = document.createElement('button');
      b.className = 'dot';
      b.type = 'button';
      b.title = (p.getAttribute('data-title') || ('Página ' + (i + 1)));
      b.setAttribute('aria-label', 'Ir a ' + b.title);
      b.addEventListener('click', function () { go(i); });
      dotsBox.appendChild(b);
    });
  }

  function render() {
    pages.forEach(function (p, i) { p.classList.toggle('is-active', i === current); });
    Array.prototype.forEach.call(dotsBox.children, function (d, i) {
      d.classList.toggle('is-active', i === current);
    });
    label.textContent = 'Página ' + (current + 1) + ' de ' + total;
    bar.style.width = (((current + 1) / total) * 100).toFixed(1) + '%';
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function go(i) {
    if (i < 0 || i >= total) return;
    current = i;
    render();
    if (history.replaceState) {
      history.replaceState(null, '', '#' + (current + 1));
    }
  }

  prevBtn.addEventListener('click', function () { go(current - 1); });
  nextBtn.addEventListener('click', function () { go(current + 1); });

  document.addEventListener('keydown', function (e) {
    if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); go(current + 1); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(current - 1); }
    if (e.key === 'Home') { go(0); }
    if (e.key === 'End') { go(total - 1); }
  });

  /* ---------------- Actividad interactiva ---------------- */
  var QUESTIONS = [
    {
      q: '¿Qué significa la expresión «casa común»?',
      opts: [
        'Únicamente la casa donde vive mi familia',
        'El planeta entero, incluidos el agua, el aire, el suelo y las personas que lo habitamos',
        'Un edificio de la escuela',
        'Un parque nacional protegido'
      ],
      a: 1,
      why: 'La casa común designa el planeta entero y, sobre todo, las personas con quienes compartimos la vida.'
    },
    {
      q: 'En la encíclica Laudato Si\', la frase «todo está conectado» se refiere a que…',
      opts: [
        'Todo se puede comprar y vender',
        'Internet conecta a todo el mundo',
        'El grito de la tierra y el grito de los pobres son un mismo grito',
        'Solo los científicos pueden cuidar el ambiente'
      ],
      a: 2,
      why: 'La ecología integral une lo ambiental, lo económico, lo social, lo cultural y lo cotidiano.'
    },
    {
      q: '¿Cuál de estas NO es una dimensión de la ecología integral?',
      opts: [
        'Dimensión ambiental',
        'Dimensión social',
        'Dimensión cultural',
        'Dimensión publicitaria'
      ],
      a: 3,
      why: 'Las cinco dimensiones son ambiental, económica, social, cultural y de la vida cotidiana.'
    },
    {
      q: 'Según Gn 2,15, el ser humano fue puesto en el jardín «para cultivarlo y cuidarlo». Esto significa que somos…',
      opts: [
        'Dueños absolutos de la naturaleza',
        'Mayordomos responsables de la creación',
        'Dueños de todos los animales',
        'Observadores sin ninguna responsabilidad'
      ],
      a: 1,
      why: 'La custodia, no la explotación, define nuestra vocación sobre la creación.'
    },
    {
      q: 'El sumak kawsay o Buen Vivir sostiene que la vida plena se alcanza…',
      opts: [
        'Acumulando la mayor cantidad de bienes posible',
        'Conviviendo en armonía con la comunidad y la naturaleza',
        'Aislándose de los demás',
        'Trabajando sin descanso para consumir más'
      ],
      a: 1,
      why: 'Es la filosofía de los pueblos andinos recogida en la Constitución del Ecuador (2008).'
    },
    {
      q: '¿Cuál de estos es un ejemplo de innovación al servicio del cuidado de la casa común?',
      opts: [
        'Una aplicación que optimiza las rutas de recolección de residuos',
        'Una red social para vender productos innecesarios',
        'Un videojuego de consumo ilimitado',
        'Un bot que difunde información falsa'
      ],
      a: 0,
      why: 'La tecnología guiada por la ética se vuelve una herramienta del cuidado.'
    }
  ];

  var quizBox = document.getElementById('quiz');

  function buildQuiz() {
    if (!quizBox) return;
    quizBox.innerHTML = '';
    QUESTIONS.forEach(function (item, qi) {
      var wrap = document.createElement('div');
      wrap.className = 'q';
      var t = document.createElement('p');
      t.className = 'q__t';
      t.textContent = (qi + 1) + '. ' + item.q;
      wrap.appendChild(t);

      var opts = document.createElement('div');
      opts.className = 'q__opts';
      item.opts.forEach(function (text, oi) {
        var lab = document.createElement('label');
        lab.className = 'opt';
        var input = document.createElement('input');
        input.type = 'radio';
        input.name = 'q' + qi;
        input.value = String(oi);
        var span = document.createElement('span');
        span.textContent = text;
        lab.appendChild(input);
        lab.appendChild(span);
        opts.appendChild(lab);
      });
      wrap.appendChild(opts);
      quizBox.appendChild(wrap);
    });
  }

  var checkBtn = document.getElementById('quizCheck');
  var resetBtn = document.getElementById('quizReset');
  var scoreEl = document.getElementById('quizScore');

  if (checkBtn) {
    checkBtn.addEventListener('click', function () {
      var score = 0;
      var unanswered = 0;
      var labels = quizBox.querySelectorAll('.q');

      Array.prototype.forEach.call(labels, function (block, qi) {
        var chosen = block.querySelector('input:checked');
        var opts = block.querySelectorAll('.opt');
        Array.prototype.forEach.call(opts, function (o) { o.classList.remove('is-ok', 'is-bad'); });

        if (!chosen) { unanswered++; return; }
        var idx = Number(chosen.value);
        if (idx === QUESTIONS[qi].a) {
          score++;
          opts[idx].classList.add('is-ok');
        } else {
          opts[idx].classList.add('is-bad');
          opts[QUESTIONS[qi].a].classList.add('is-ok');
        }
      });

      var msg = 'Puntaje: ' + score + ' / ' + QUESTIONS.length;
      if (unanswered > 0) msg += ' · Te faltan ' + unanswered + ' pregunta(s) sin responder.';
      if (score === QUESTIONS.length) msg += ' · ¡Excelente! Dominas la sección.';
      else if (score >= QUESTIONS.length - 2) msg += ' · Muy bien, repasa las respuestas marcadas.';
      else msg += ' · Vuelve a leer la sección y reintenta.';

      scoreEl.hidden = false;
      scoreEl.textContent = msg;
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (!quizBox) return;
      var inputs = quizBox.querySelectorAll('input');
      Array.prototype.forEach.call(inputs, function (i) { i.checked = false; });
      var opts = quizBox.querySelectorAll('.opt');
      Array.prototype.forEach.call(opts, function (o) { o.classList.remove('is-ok', 'is-bad'); });
      if (scoreEl) { scoreEl.hidden = true; scoreEl.textContent = ''; }
      quizBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  buildDots();
  buildQuiz();

  var start = parseInt((location.hash || '').replace('#', ''), 10);
  go(!isNaN(start) && start >= 1 && start <= total ? start - 1 : 0);
})();
