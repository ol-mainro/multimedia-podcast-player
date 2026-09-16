/* ============================================================
   Sur les pas de saint Germain d'Auxerre — borne tactile
   Logique de l'application. Aucune dépendance externe,
   fonctionne entièrement hors-ligne une fois servi en local.
   ============================================================ */

(function () {
  "use strict";

  var state = {
    config: null,
    chapters: [],
    currentIndex: 0
  };

  var els = {};

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    cacheEls();
    bindGlobalEvents();
    loadConfig();
  }

  function cacheEls() {
    els.screenHome = document.getElementById("screen-home");
    els.screenChapter = document.getElementById("screen-chapter");
    els.appTitle = document.getElementById("app-title");
    els.appSubtitle = document.getElementById("app-subtitle");
    els.chapterGrid = document.getElementById("chapter-grid");
    els.chapterImage = document.getElementById("chapter-image");
    els.chapterIndex = document.getElementById("chapter-index");
    els.chapterTitle = document.getElementById("chapter-title");
    els.chapterDots = document.getElementById("chapter-dots");
    els.btnHome = document.getElementById("btn-home");
    els.btnPrev = document.getElementById("btn-prev");
    els.btnNext = document.getElementById("btn-next");
    els.btnPlay = document.getElementById("btn-play");
    els.audioPlayerWrap = document.querySelector(".audio-player");
    els.audioTrack = document.getElementById("audio-track");
    els.audioFill = document.getElementById("audio-fill");
    els.audioHandle = document.getElementById("audio-handle");
    els.timeCurrent = document.getElementById("time-current");
    els.timeTotal = document.getElementById("time-total");
    els.audio = document.getElementById("audio-player-el");
  }

  function loadConfig() {
    fetch("config/chapters.json", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        state.config = data;
        state.chapters = data.chapitres || [];
        render();
      })
      .catch(function (err) {
        showConfigError(err);
      });
  }

  function showConfigError(err) {
    document.body.innerHTML =
      '<div style="font-family:sans-serif;max-width:640px;margin:8vh auto;' +
      'padding:0 24px;line-height:1.6;color:#2E2A22;">' +
      "<h1>Impossible de charger la configuration</h1>" +
      "<p>Le fichier <code>config/chapters.json</code> n'a pas pu être lu " +
      "(" + err.message + ").</p>" +
      "<p>Si vous avez ouvert <code>index.html</code> directement depuis le " +
      "dossier (double-clic), certains navigateurs bloquent la lecture de " +
      "fichiers locaux par sécurité. Lancez l'application avec le script " +
      "<code>demarrer-mac.command</code> ou <code>demarrer-windows.bat</code> " +
      "fourni dans ce dossier — il ouvre un petit serveur local, sans " +
      "connexion internet requise, puis affiche la page correctement.</p>" +
      "</div>";
  }

  function render() {
    els.appTitle.textContent = state.config.titre || "";
    els.appSubtitle.textContent = state.config.sousTitre || "";
    document.title = state.config.titre || "Borne interactive";

    els.chapterGrid.innerHTML = "";
    state.chapters.forEach(function (chap, i) {
      var card = document.createElement("button");
      card.className = "chapter-card";
      card.setAttribute("aria-label", "Chapitre " + chap.id + " : " + chap.titre);
      card.innerHTML =
        '<span class="medallion">' +
          '<img src="' + chap.image + '" alt="" />' +
          '<span class="num">' + chap.id + "</span>" +
        "</span>" +
        '<span class="label">' + chap.titre + "</span>";
      card.addEventListener("click", function () {
        openChapter(i, true);
      });
      els.chapterGrid.appendChild(card);
    });

    buildDots();
    goHome();
  }

  function buildDots() {
    els.chapterDots.innerHTML = "";
    state.chapters.forEach(function (chap, i) {
      var dot = document.createElement("button");
      dot.className = "dot";
      dot.setAttribute("aria-label", "Aller au chapitre " + chap.id);
      dot.addEventListener("click", function () {
        openChapter(i);
      });
      els.chapterDots.appendChild(dot);
    });
  }

  function bindGlobalEvents() {
    els.btnHome.addEventListener("click", goHome);
    els.btnPrev.addEventListener("click", function () { stepChapter(-1); });
    els.btnNext.addEventListener("click", function () { stepChapter(1); });
    els.btnPlay.addEventListener("click", togglePlay);

    els.audioTrack.addEventListener("click", seekFromEvent);

    els.audio.addEventListener("timeupdate", updateProgress);
    els.audio.addEventListener("loadedmetadata", updateProgress);
    els.audio.addEventListener("play", function () {
      els.audioPlayerWrap.classList.add("playing");
      els.btnPlay.textContent = "❚❚";
      els.btnPlay.setAttribute("aria-label", "Mettre en pause");
    });
    els.audio.addEventListener("pause", function () {
      els.audioPlayerWrap.classList.remove("playing");
      els.btnPlay.textContent = "▶";
      els.btnPlay.setAttribute("aria-label", "Écouter");
    });
    els.audio.addEventListener("ended", function () {
      els.audioPlayerWrap.classList.remove("playing");
      els.btnPlay.textContent = "▶";
    });
    els.audio.addEventListener("error", function () {
      els.timeTotal.textContent = "audio manquant";
    });

    document.addEventListener("keydown", function (e) {
      if (!els.screenChapter.classList.contains("active")) return;
      if (e.key === "ArrowRight") stepChapter(1);
      if (e.key === "ArrowLeft") stepChapter(-1);
      if (e.key === " ") { e.preventDefault(); togglePlay(); }
      if (e.key === "Escape") goHome();
    });

    bindSwipe(els.screenChapter);
  }

  function bindSwipe(target) {
    var startX = null, startY = null;
    target.addEventListener("touchstart", function (e) {
      var t = e.changedTouches[0];
      startX = t.clientX; startY = t.clientY;
    }, { passive: true });
    target.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var t = e.changedTouches[0];
      var dx = t.clientX - startX;
      var dy = t.clientY - startY;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        stepChapter(dx < 0 ? 1 : -1);
      }
      startX = null; startY = null;
    }, { passive: true });
  }

  function goHome() {
    stopAudio();
    els.screenChapter.classList.remove("active");
    els.screenHome.classList.add("active");
  }

  function openChapter(index, autoplay) {
    if (index < 0 || index >= state.chapters.length) return;
    state.currentIndex = index;
    stopAudio();

    var chap = state.chapters[index];
    els.chapterImage.src = chap.image;
    els.chapterImage.alt = chap.titre;
    els.chapterIndex.textContent = "Chapitre " + chap.id + " / " + state.chapters.length;
    els.chapterTitle.textContent = chap.titre;
    els.audio.src = chap.audio;
    els.timeCurrent.textContent = "0:00";
    els.timeTotal.textContent = "0:00";
    els.audioFill.style.width = "0%";
    els.audioHandle.style.left = "0%";

    Array.prototype.forEach.call(els.chapterDots.children, function (dot, i) {
      dot.classList.toggle("current", i === index);
    });

    els.screenHome.classList.remove("active");
    els.screenChapter.classList.add("active");

    if (autoplay || state.config.autoplayALOuverture) {
      els.audio.play().catch(function () { /* lecture auto refusée, l'utilisateur touchera play */ });
    }
  }

  function stepChapter(delta) {
    var next = state.currentIndex + delta;
    if (next < 0) next = state.chapters.length - 1;
    if (next >= state.chapters.length) next = 0;
    openChapter(next, true);
  }

  function togglePlay() {
    if (els.audio.paused) {
      els.audio.play().catch(function () {});
    } else {
      els.audio.pause();
    }
  }

  function stopAudio() {
    els.audio.pause();
    els.audio.currentTime = 0;
  }

  function updateProgress() {
    var dur = els.audio.duration || 0;
    var cur = els.audio.currentTime || 0;
    var pct = dur ? (cur / dur) * 100 : 0;
    els.audioFill.style.width = pct + "%";
    els.audioHandle.style.left = pct + "%";
    els.timeCurrent.textContent = formatTime(cur);
    if (dur) els.timeTotal.textContent = formatTime(dur);
  }

  function seekFromEvent(e) {
    var rect = els.audioTrack.getBoundingClientRect();
    var x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    var pct = Math.min(1, Math.max(0, x / rect.width));
    if (els.audio.duration) {
      els.audio.currentTime = pct * els.audio.duration;
    }
  }

  function formatTime(sec) {
    sec = Math.floor(sec || 0);
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  }
})();
