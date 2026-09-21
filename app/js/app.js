/* ============================================================
   Sur les pas de saint Germain d'Auxerre — Conjugarium System
   Logique de médiation sonore, lecteur flottant, visualiseur
   tactile et navigation responsive conforme aux tokens.
   ============================================================ */

(function () {
  "use strict";

  // SVG Icons constants
  var ICONS = {
    play: '<svg class="cjg-icon" viewBox="0 0 256 256"><path fill="currentColor" d="M240 128a15.74 15.74 0 0 1-7.6 13.51L88.32 229.65a16 16 0 0 1-16.2.3A15.86 15.86 0 0 1 64 216.13V39.87a15.86 15.86 0 0 1 8.12-13.82a16 16 0 0 1 16.2.3l144.08 88.14A15.74 15.74 0 0 1 240 128Z"/></svg>',
    pause: '<svg class="cjg-icon" viewBox="0 0 256 256"><path fill="currentColor" d="M216 48v160a16 16 0 0 1-16 16h-40a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h40a16 16 0 0 1 16 16ZM96 32H56a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h40a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16Z"/></svg>',
    musicNote: '<svg class="cjg-icon" viewBox="0 0 256 256"><path fill="currentColor" d="M212.92 42.14a8 8 0 0 0-6.86-2l-112 18.67A8 8 0 0 0 88 66.67V169.38A36 36 0 1 0 104 200V81.33l96-16V145.4a36 36 0 1 0 16 30.6V48a8 8 0 0 0-3.08-5.86Z"/></svg>',
    eye: '<svg class="cjg-icon cjg-icon--sm" viewBox="0 0 256 256"><path fill="currentColor" d="M247.31 124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57 61.26 162.88 48 128 48S61.43 61.26 36.34 86.35C17.51 105.18 9 124 8.69 124.76a8 8 0 0 0 0 6.5c.35.79 8.82 19.57 27.65 38.4C61.43 194.74 93.12 208 128 208s66.57-13.26 91.66-38.34c18.83-18.83 27.3-37.61 27.65-38.4a8 8 0 0 0 0-6.5ZM128 192c-30.78 0-57.67-11.19-79.93-33.25A133.47 133.47 0 0 1 25 128a133.33 133.33 0 0 1 23.07-30.75C70.33 75.19 97.22 64 128 64s57.67 11.19 79.93 33.25A133.47 133.47 0 0 1 231.05 128c-7.21 13.46-38.62 64-103.05 64Zm0-112a48 48 0 1 0 48 48a48.05 48.05 0 0 0-48-48Zm0 80a32 32 0 1 1 32-32a32 32 0 0 1-32 32Z"/></svg>',
    speakerHigh: '<svg class="cjg-icon" viewBox="0 0 256 256"><path fill="currentColor" d="M168 32a8 8 0 0 0-8.76 1.15L89.47 96H40a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h49.47l69.77 62.85A8 8 0 0 0 176 216V40a8 8 0 0 0-8-8Zm-8 163.69l-61.47-55.32A8 8 0 0 0 93.19 138H40v-20h53.19a8 8 0 0 0 5.34-2.37L160 60.31ZM216 128a55.93 55.93 0 0 1-16.4 39.6a8 8 0 1 1-11.32-11.31a40 40 0 0 0 0-56.58a8 8 0 1 1 11.32-11.31A55.93 55.93 0 0 1 216 128Z"/></svg>',
    speakerMute: '<svg class="cjg-icon" viewBox="0 0 256 256"><path fill="currentColor" d="M213.66 181.66a8 8 0 0 1-11.32 11.32l-24-24a8 8 0 0 1 0-11.32l24-24a8 8 0 0 1 11.32 11.32L201.31 156l12.35 12.34a8 8 0 0 1 0 13.32ZM168 32a8 8 0 0 0-8.76 1.15L89.47 96H40a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h49.47l69.77 62.85A8 8 0 0 0 176 216V40a8 8 0 0 0-8-8Zm-8 163.69l-61.47-55.32A8 8 0 0 0 93.19 138H40v-20h53.19a8 8 0 0 0 5.34-2.37L160 60.31Z"/></svg>',
    video: '<svg class="cjg-icon cjg-icon--sm" viewBox="0 0 256 256"><path fill="currentColor" d="m245.66 77.92l-40 24A8 8 0 0 0 201.6 108.7v38.6a8 8 0 0 0 4.06 6.78l40 24A8 8 0 0 0 256 171.3V84.7a8 8 0 0 0-10.34-6.78ZM240 157.8l-24-14.4V112.6l24-14.4ZM184 64H32a16 16 0 0 0-16 16v96a16 16 0 0 0 16 16h152a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16Zm0 112H32V80h152v96Z"/></svg>',
    image: '<svg class="cjg-icon cjg-icon--sm" viewBox="0 0 256 256"><path fill="currentColor" d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16Zm0 160H40V56h176v144ZM96 96a16 16 0 1 1-16-16a16 16 0 0 1 16 16Zm104 88H56l48-64l36 48l24-32l40 48Z"/></svg>'
  };

  var state = {
    config: null,
    chapters: [],
    currentIndex: 0,
    isPlaying: false,
    activeTab: "playlist", // "playlist" or "gallery"
    searchQuery: "",
    lastVolume: 1
  };

  var dom = {};

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    cacheDom();
    bindEvents();
    loadConfig();
  }

  function cacheDom() {
    dom.appTitle = document.getElementById("app-title");
    dom.appSubtitle = document.getElementById("app-subtitle");
    dom.appMeta = document.getElementById("app-meta");
    dom.badgeChapterCount = document.getElementById("badge-chapter-count");
    dom.headerSubtitle = document.getElementById("header-subtitle");
    dom.footerTagline = document.getElementById("footer-tagline");

    // Scène de lecture active (Hero)
    dom.heroCover = document.getElementById("hero-cover");
    dom.heroVideo = document.getElementById("hero-video");
    dom.heroMediaBadge = document.getElementById("hero-media-badge");
    dom.heroMediaBadgeText = document.getElementById("hero-media-badge-text");
    dom.btnExpandStage = document.getElementById("btn-expand-stage");
    dom.heroChapterBadge = document.getElementById("hero-chapter-badge");
    dom.heroTypeIndicator = document.getElementById("hero-type-indicator");
    dom.heroChapterTitle = document.getElementById("hero-chapter-title");
    dom.heroChapterSubtitle = document.getElementById("hero-chapter-subtitle");
    dom.heroChapterText = document.getElementById("hero-chapter-text");
    dom.stagePlayBtn = document.getElementById("stage-play-btn");
    dom.stagePlayIcon = document.getElementById("stage-play-icon");
    dom.stagePlayLabel = document.getElementById("stage-play-label");
    dom.stagePrevBtn = document.getElementById("stage-prev-btn");
    dom.stageNextBtn = document.getElementById("stage-next-btn");

    dom.playlist = document.getElementById("chapter-playlist");
    dom.grid = document.getElementById("chapter-grid");
    dom.emptyResults = document.getElementById("empty-results");
    dom.searchInput = document.getElementById("search-input");
    dom.tabPlaylist = document.getElementById("tab-playlist");
    dom.tabGallery = document.getElementById("tab-gallery");
    dom.btnPlayAll = document.getElementById("btn-play-all");
    dom.btnToggleFullscreen = document.getElementById("btn-toggle-fullscreen");

    dom.audio = document.getElementById("audio-engine");
    dom.floatingPlayer = document.getElementById("floating-player");
    dom.playerPlayBtn = document.getElementById("player-play-btn");
    dom.playerPlayIcon = document.getElementById("player-play-icon");
    dom.playerTitle = document.getElementById("player-title");
    dom.playerTimeCurrent = document.getElementById("player-time-current");
    dom.playerTimeTotal = document.getElementById("player-time-total");
    dom.playerSeek = document.getElementById("player-seek");
    dom.playerViewBtn = document.getElementById("player-view-btn");
    dom.playerMuteBtn = document.getElementById("player-mute-btn");
    dom.playerMuteIcon = document.getElementById("player-mute-icon");
    dom.playerVolume = document.getElementById("player-volume");

    // Modal visualiseur grand format
    dom.viewerModal = document.getElementById("chapter-viewer-modal");
    dom.viewerBadge = document.getElementById("viewer-badge");
    dom.viewerMediaTag = document.getElementById("viewer-media-tag");
    dom.viewerTitle = document.getElementById("viewer-title");
    dom.viewerStoryTitle = document.getElementById("viewer-story-title");
    dom.viewerSubtitle = document.getElementById("viewer-subtitle");
    dom.viewerText = document.getElementById("viewer-text");
    dom.viewerImg = document.getElementById("viewer-img");
    dom.viewerVideo = document.getElementById("viewer-video");
    dom.viewerMediaIndicator = document.getElementById("viewer-media-indicator");
    dom.viewerCloseBtn = document.getElementById("viewer-close-btn");
    dom.viewerPrevBtn = document.getElementById("viewer-prev-btn");
    dom.viewerNextBtn = document.getElementById("viewer-next-btn");
    dom.viewerPlayBtn = document.getElementById("viewer-play-btn");
    dom.viewerPlayIcon = document.getElementById("viewer-play-icon");
    dom.viewerPlayLabel = document.getElementById("viewer-play-label");
    dom.viewerStepper = document.getElementById("viewer-stepper");
  }

  function loadConfig() {
    fetch("config/chapters.json", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("Erreur HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        state.config = data;
        state.chapters = data.chapitres || [];
        renderAll();
      })
      .catch(function (err) {
        console.warn("Utilisation de la configuration locale de secours :", err);
        state.config = {
          titre: "Sur les pas de saint Germain d'Auxerre",
          sousTitre: "Une vie en six étapes",
          credits: "Église Saint-Germain-l'Auxerrois — parcours de visite",
          autoplayALOuverture: false
        };
        state.chapters = [
          { id: "01", titre: "Accroche", image: "assets/images/01-accroche.jpg", audio: "assets/audio/01-accroche.mp3" },
          { id: "02", titre: "Jeunesse et rivalité avec Amatre", image: "assets/images/02-jeunesse-et-rivalite-avec-amatre.jpg", audio: "assets/audio/02-jeunesse-et-rivalite-avec-amatre.mp3" },
          { id: "03", titre: "Évêque bâtisseur", image: "assets/images/03-eveque-batisseur.jpg", audio: "assets/audio/03-eveque-batisseur.mp3" },
          { id: "04", titre: "Voyages et miracles", image: "assets/images/04-voyages-et-miracles.jpg", audio: "assets/audio/04-voyages-et-miracles.mp3" },
          { id: "05", titre: "Rencontre avec Geneviève", image: "assets/images/05-rencontre-avec-genevieve.jpg", audio: "assets/audio/05-rencontre-avec-genevieve.mp3" },
          { id: "06", titre: "Mort et postérité", image: "assets/images/06-mort-et-posterite.jpg", audio: "assets/audio/06-mort-et-posterite.mp3" }
        ];
        renderAll();
      });
  }

  function renderAll() {
    var title = state.config.titre || "Sur les pas de saint Germain d'Auxerre";
    var subtitle = state.config.sousTitre || "Une vie en six étapes";
    var credits = state.config.credits || "Église Saint-Germain-l'Auxerrois — parcours de visite";

    document.title = title + " — Conjugarium";
    if (dom.appTitle) dom.appTitle.textContent = title;
    if (dom.appSubtitle) dom.appSubtitle.textContent = subtitle;
    if (dom.appMeta) dom.appMeta.textContent = state.chapters.length + " épisodes • Récit & musiques";
    if (dom.badgeChapterCount) dom.badgeChapterCount.textContent = "✓ " + state.chapters.length + " chapitres";
    if (dom.headerSubtitle) dom.headerSubtitle.textContent = credits;
    if (dom.footerTagline) dom.footerTagline.textContent = credits;

    renderPlaylist();
    renderGallery();
    renderViewerStepper();

    if (state.chapters.length > 0) {
      loadChapter(0, false);
    }
  }

  function getFilteredChapters() {
    var query = (state.searchQuery || "").trim().toLowerCase();
    if (!query) return state.chapters;
    return state.chapters.filter(function (chap) {
      return (
        chap.titre.toLowerCase().indexOf(query) !== -1 ||
        chap.id.toLowerCase().indexOf(query) !== -1 ||
        (chap.texte && chap.texte.toLowerCase().indexOf(query) !== -1)
      );
    });
  }

  function formatProse(text) {
    if (!text) return "";
    var paragraphs = text.split(/\n\s*\n/);
    return paragraphs
      .map(function (p) {
        var trimmed = p.trim();
        return trimmed ? "<p>" + trimmed.replace(/\n/g, "<br />") + "</p>" : "";
      })
      .join("");
  }

  function renderPlaylist() {
    dom.playlist.innerHTML = "";
    var filtered = getFilteredChapters();

    if (filtered.length === 0) {
      dom.emptyResults.style.display = "block";
      return;
    }
    dom.emptyResults.style.display = "none";

    filtered.forEach(function (chap) {
      var realIndex = state.chapters.indexOf(chap);
      var isCurrent = realIndex === state.currentIndex;
      var isVideo = chap.mediaType === "video" && chap.video;
      var mediaTag = isVideo ? "Vidéo en boucle" : "Illustration";
      var subtitleText = chap.sousTitre || "Épisode historique";

      var li = document.createElement("li");
      li.className = "cl-row" + (isCurrent ? " cl-row--active" : "");
      li.setAttribute("role", "listitem");
      li.setAttribute("tabindex", "0");

      var numContent = isCurrent && state.isPlaying
        ? '<span class="cl-pulse" aria-hidden="true">' + ICONS.musicNote + '</span>'
        : chap.id;

      li.innerHTML =
        '<span class="cl-row__num" aria-hidden="true">' + numContent + '</span>' +
        '<div style="position:relative; width:48px; height:48px; border-radius:var(--r-md); overflow:hidden; flex-shrink:0;">' +
          '<img class="cl-row__thumb" src="' + chap.image + '" alt="" loading="lazy" style="width:100%; height:100%; object-fit:cover;" />' +
          (isVideo ? '<span style="position:absolute; bottom:2px; right:2px; background:rgba(0,0,0,0.8); color:#fff; border-radius:3px; padding:1px 4px; font-size:10px; font-weight:700; line-height:1;">▶</span>' : '') +
        '</div>' +
        '<div class="cl-row__info">' +
          '<div class="cl-row__titleline">' +
            '<span class="cl-row__title">' + chap.titre + '</span>' +
            '<span class="cl-row__tag">' + mediaTag + '</span>' +
          '</div>' +
          '<span class="cl-row__desc">' + subtitleText + '</span>' +
        '</div>' +
        '<div class="cl-row__actions">' +
          '<button class="cl-icon-btn action-play-btn" aria-label="' + (isCurrent && state.isPlaying ? "Mettre en pause" : "Écouter " + chap.titre) + '">' +
            (isCurrent && state.isPlaying ? ICONS.pause : ICONS.play) +
          '</button>' +
          '<button class="cl-icon-btn--outline action-view-btn" aria-label="Voir le récit et le média en grand" title="Agrandir">' +
            ICONS.eye +
          '</button>' +
        '</div>';

      // Click row info plays/opens
      li.querySelector(".cl-row__info").addEventListener("click", function () {
        if (state.currentIndex === realIndex) {
          togglePlay();
        } else {
          loadChapter(realIndex, true);
        }
      });

      // Play button action
      li.querySelector(".action-play-btn").addEventListener("click", function (e) {
        e.stopPropagation();
        if (state.currentIndex === realIndex) {
          togglePlay();
        } else {
          loadChapter(realIndex, true);
        }
      });

      // View illustration action
      li.querySelector(".action-view-btn").addEventListener("click", function (e) {
        e.stopPropagation();
        openViewer(realIndex);
      });

      // Accessible enter key
      li.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          loadChapter(realIndex, true);
        }
      });

      dom.playlist.appendChild(li);
    });
  }

  function renderGallery() {
    dom.grid.innerHTML = "";
    var filtered = getFilteredChapters();

    filtered.forEach(function (chap) {
      var realIndex = state.chapters.indexOf(chap);
      var isCurrent = realIndex === state.currentIndex;
      var isVideo = chap.mediaType === "video" && chap.video;
      var mediaTag = isVideo ? "Vidéo en boucle" : "Illustration";

      var card = document.createElement("div");
      card.className = "cjg-card-chapter" + (isCurrent ? " active-track" : "");
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", "Chapitre " + chap.id + " : " + chap.titre);

      card.innerHTML =
        '<div class="cjg-card-chapter__thumb-wrap">' +
          '<img class="cjg-card-chapter__thumb" src="' + chap.image + '" alt="' + chap.titre + '" loading="lazy" />' +
          '<span class="cjg-card-chapter__num">Chapitre ' + chap.id + ' • ' + (isVideo ? "Vidéo" : "Image") + '</span>' +
          '<span class="cjg-card-chapter__play-overlay" aria-hidden="true">' +
            (isCurrent && state.isPlaying ? ICONS.pause : ICONS.play) +
          '</span>' +
        '</div>' +
        '<div class="cjg-card-chapter__body">' +
          '<h3 class="cjg-card-chapter__title">' + chap.titre + '</h3>' +
          (chap.sousTitre ? '<p class="cl-desc" style="font-size:0.85rem; margin-bottom:8px; line-height:1.4;">' + chap.sousTitre + '</p>' : '') +
          '<div class="cjg-card-chapter__meta">' +
            '<span>Commentaire sonore</span>' +
            '<span class="cl-badge cl-badge--ghost">' + mediaTag + '</span>' +
          '</div>' +
        '</div>';

      card.addEventListener("click", function () {
        openViewer(realIndex);
        loadChapter(realIndex, true);
      });

      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openViewer(realIndex);
          loadChapter(realIndex, true);
        }
      });

      dom.grid.appendChild(card);
    });
  }

  function renderViewerStepper() {
    dom.viewerStepper.innerHTML = "";
    state.chapters.forEach(function (chap, i) {
      var dot = document.createElement("button");
      dot.className = "cjg-step-dot" + (i === state.currentIndex ? " active" : "");
      dot.setAttribute("aria-label", "Aller au chapitre " + chap.id);
      dot.addEventListener("click", function () {
        loadChapter(i, state.isPlaying);
        updateViewer();
      });
      dom.viewerStepper.appendChild(dot);
    });
  }

  function loadChapter(index, autoPlay) {
    if (index < 0 || index >= state.chapters.length) return;
    state.currentIndex = index;
    var chap = state.chapters[index];

    if (dom.playerTitle) {
      dom.playerTitle.textContent = chap.id + " — " + chap.titre;
    }
    dom.audio.src = chap.audio;
    dom.playerSeek.value = 0;
    dom.playerTimeCurrent.textContent = "0:00";
    dom.playerTimeTotal.textContent = "0:00";

    updateActiveHighlights();
    updateEpisodeStage(chap);
    updateViewer();

    if (autoPlay || (state.config && state.config.autoplayALOuverture)) {
      dom.audio.play().then(function () {
        setPlaying(true);
      }).catch(function () {
        setPlaying(false);
      });
    } else {
      setPlaying(false);
    }
  }

  function updateEpisodeStage(chap) {
    if (!chap) return;
    var isVideo = chap.mediaType === "video" && chap.video;

    // Mise à jour du média dans la scène principale
    if (dom.heroVideo && dom.heroCover) {
      if (isVideo) {
        dom.heroCover.style.display = "none";
        dom.heroVideo.style.display = "block";
        if (dom.heroVideo.getAttribute("data-src") !== chap.video) {
          dom.heroVideo.setAttribute("data-src", chap.video);
          dom.heroVideo.src = chap.video;
        }
        dom.heroVideo.poster = chap.image || "";
        dom.heroVideo.muted = true;
        dom.heroVideo.loop = true;
        dom.heroVideo.playsInline = true;
        dom.heroVideo.play().catch(function () {});
      } else {
        if (!dom.heroVideo.paused) {
          dom.heroVideo.pause();
        }
        dom.heroVideo.style.display = "none";
        dom.heroCover.style.display = "block";
        dom.heroCover.src = chap.image;
        dom.heroCover.alt = chap.titre;
      }
    }

    if (dom.heroMediaBadge) {
      dom.heroMediaBadge.className = "cl-stage-media-pill" + (isVideo ? " video-pill" : "");
      dom.heroMediaBadge.innerHTML = (isVideo ? ICONS.video : ICONS.image) +
        '<span id="hero-media-badge-text">' + (isVideo ? "Vidéo silencieuse en boucle" : "Illustration d'époque") + '</span>';
    }

    if (dom.heroTypeIndicator) {
      dom.heroTypeIndicator.textContent = isVideo ? "Vidéo en boucle" : "Illustration";
    }

    if (dom.heroChapterBadge) {
      dom.heroChapterBadge.textContent = "Épisode " + chap.id + " / " + (state.chapters.length < 10 ? "0" + state.chapters.length : state.chapters.length);
    }

    if (dom.heroChapterTitle) {
      dom.heroChapterTitle.textContent = chap.titre;
    }

    if (dom.heroChapterSubtitle) {
      dom.heroChapterSubtitle.textContent = chap.sousTitre || "";
    }

    if (dom.heroChapterText) {
      dom.heroChapterText.innerHTML = formatProse(chap.texte);
    }
  }

  function setPlaying(isPlaying) {
    state.isPlaying = isPlaying;
    var icon = isPlaying ? ICONS.pause : ICONS.play;
    if (dom.playerPlayBtn) {
      dom.playerPlayBtn.innerHTML = icon;
      dom.playerPlayBtn.setAttribute("aria-label", isPlaying ? "Mettre en pause" : "Écouter");
    }
    if (dom.stagePlayBtn) {
      dom.stagePlayBtn.innerHTML = icon + ' <span id="stage-play-label">' + (isPlaying ? "Mettre en pause" : "Écouter l'épisode") + "</span>";
      dom.stagePlayBtn.setAttribute("aria-label", isPlaying ? "Mettre en pause" : "Écouter l'épisode");
    }
    if (dom.viewerPlayBtn) {
      dom.viewerPlayBtn.innerHTML = icon + ' <span id="viewer-play-label">' + (isPlaying ? "Mettre en pause" : "Écouter l'épisode") + "</span>";
      dom.viewerPlayBtn.setAttribute("aria-label", isPlaying ? "Mettre en pause" : "Écouter l'épisode");
    }

    updateActiveHighlights();
  }

  function togglePlay() {
    if (!dom.audio.src) {
      loadChapter(state.currentIndex, true);
      return;
    }
    if (dom.audio.paused) {
      dom.audio.play().then(function () {
        setPlaying(true);
      }).catch(function () {
        setPlaying(false);
      });
    } else {
      dom.audio.pause();
      setPlaying(false);
    }
  }

  function updateActiveHighlights() {
    renderPlaylist();
    renderGallery();
    renderViewerStepper();
  }

  function openViewer(index) {
    if (typeof index === "number") {
      state.currentIndex = index;
      var chap = state.chapters[index];
      if (dom.audio.src.indexOf(chap.audio) === -1) {
        loadChapter(index, state.isPlaying);
      }
    }
    updateViewer();
    dom.viewerModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeViewer() {
    dom.viewerModal.classList.remove("active");
    document.body.style.overflow = "";
  }

  function updateViewer() {
    var chap = state.chapters[state.currentIndex];
    if (!chap) return;
    var isVideo = chap.mediaType === "video" && chap.video;

    if (dom.viewerBadge) {
      dom.viewerBadge.textContent = "Chapitre " + chap.id + " / " + (state.chapters.length < 10 ? "0" + state.chapters.length : state.chapters.length);
    }
    if (dom.viewerMediaTag) {
      dom.viewerMediaTag.textContent = isVideo ? "Vidéo en boucle" : "Illustration";
    }
    if (dom.viewerTitle) {
      dom.viewerTitle.textContent = chap.titre;
    }
    if (dom.viewerStoryTitle) {
      dom.viewerStoryTitle.textContent = chap.titre;
    }
    if (dom.viewerSubtitle) {
      dom.viewerSubtitle.textContent = chap.sousTitre || "";
    }
    if (dom.viewerText) {
      dom.viewerText.innerHTML = formatProse(chap.texte);
    }

    // Gestion du média vidéo silencieuse vs image dans le modal
    if (dom.viewerVideo && dom.viewerImg) {
      if (isVideo) {
        dom.viewerImg.style.display = "none";
        dom.viewerVideo.style.display = "block";
        if (dom.viewerVideo.getAttribute("data-src") !== chap.video) {
          dom.viewerVideo.setAttribute("data-src", chap.video);
          dom.viewerVideo.src = chap.video;
        }
        dom.viewerVideo.poster = chap.image || "";
        dom.viewerVideo.muted = true;
        dom.viewerVideo.loop = true;
        dom.viewerVideo.playsInline = true;
        dom.viewerVideo.play().catch(function () {});
      } else {
        if (!dom.viewerVideo.paused) {
          dom.viewerVideo.pause();
        }
        dom.viewerVideo.style.display = "none";
        dom.viewerImg.style.display = "block";
        dom.viewerImg.src = chap.image;
        dom.viewerImg.alt = chap.titre;
      }
    }

    if (dom.viewerMediaIndicator) {
      dom.viewerMediaIndicator.innerHTML = (isVideo ? ICONS.video : ICONS.image) +
        "<span>" + (isVideo ? "Vidéo silencieuse en boucle" : "Illustration") + "</span>";
    }

    if (dom.viewerPlayBtn) {
      dom.viewerPlayBtn.innerHTML = (state.isPlaying ? ICONS.pause : ICONS.play) +
        ' <span id="viewer-play-label">' + (state.isPlaying ? "Mettre en pause" : "Écouter l'épisode") + "</span>";
    }

    Array.prototype.forEach.call(dom.viewerStepper.children, function (dot, i) {
      dot.classList.toggle("active", i === state.currentIndex);
    });
  }

  function stepChapter(delta) {
    var next = state.currentIndex + delta;
    if (next < 0) next = state.chapters.length - 1;
    if (next >= state.chapters.length) next = 0;
    loadChapter(next, state.isPlaying);
    updateViewer();
  }

  function formatTime(sec) {
    sec = Math.floor(sec || 0);
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  function bindEvents() {
    // Player events
    dom.playerPlayBtn.addEventListener("click", togglePlay);
    dom.viewerPlayBtn.addEventListener("click", togglePlay);
    if (dom.stagePlayBtn) dom.stagePlayBtn.addEventListener("click", togglePlay);
    if (dom.stagePrevBtn) dom.stagePrevBtn.addEventListener("click", function () { stepChapter(-1); });
    if (dom.stageNextBtn) dom.stageNextBtn.addEventListener("click", function () { stepChapter(1); });
    if (dom.btnExpandStage) dom.btnExpandStage.addEventListener("click", function () { openViewer(state.currentIndex); });

    dom.btnPlayAll.addEventListener("click", function () {
      loadChapter(0, true);
      window.scrollTo({ top: dom.playlist.offsetTop - 120, behavior: "smooth" });
    });

    // Time update & seeking
    dom.audio.addEventListener("timeupdate", function () {
      var cur = dom.audio.currentTime || 0;
      var dur = dom.audio.duration || 0;
      dom.playerTimeCurrent.textContent = formatTime(cur);
      if (dur) {
        dom.playerTimeTotal.textContent = formatTime(dur);
        dom.playerSeek.value = (cur / dur) * 100;
      }
    });

    dom.audio.addEventListener("loadedmetadata", function () {
      var dur = dom.audio.duration || 0;
      dom.playerTimeTotal.textContent = formatTime(dur);
    });

    dom.audio.addEventListener("play", function () { setPlaying(true); });
    dom.audio.addEventListener("pause", function () { setPlaying(false); });
    dom.audio.addEventListener("ended", function () {
      // Auto-advance to next chapter if available
      if (state.currentIndex < state.chapters.length - 1) {
        loadChapter(state.currentIndex + 1, true);
      } else {
        setPlaying(false);
      }
    });

    dom.playerSeek.addEventListener("input", function () {
      var dur = dom.audio.duration || 0;
      if (dur) {
        var targetTime = (dom.playerSeek.value / 100) * dur;
        dom.audio.currentTime = targetTime;
        dom.playerTimeCurrent.textContent = formatTime(targetTime);
      }
    });

    // Volume & Mute
    dom.playerVolume.addEventListener("input", function () {
      var val = parseFloat(dom.playerVolume.value);
      dom.audio.volume = val;
      if (val === 0) {
        dom.playerMuteBtn.innerHTML = ICONS.speakerMute;
      } else {
        dom.playerMuteBtn.innerHTML = ICONS.speakerHigh;
        state.lastVolume = val;
      }
    });

    dom.playerMuteBtn.addEventListener("click", function () {
      if (dom.audio.volume > 0) {
        state.lastVolume = dom.audio.volume;
        dom.audio.volume = 0;
        dom.playerVolume.value = 0;
        dom.playerMuteBtn.innerHTML = ICONS.speakerMute;
      } else {
        dom.audio.volume = state.lastVolume || 1;
        dom.playerVolume.value = dom.audio.volume;
        dom.playerMuteBtn.innerHTML = ICONS.speakerHigh;
      }
    });

    // Viewer modal controls
    dom.playerViewBtn.addEventListener("click", function () {
      openViewer(state.currentIndex);
    });

    dom.viewerCloseBtn.addEventListener("click", closeViewer);
    dom.viewerModal.addEventListener("click", function (e) {
      if (e.target === dom.viewerModal) closeViewer();
    });

    dom.viewerPrevBtn.addEventListener("click", function () { stepChapter(-1); });
    dom.viewerNextBtn.addEventListener("click", function () { stepChapter(1); });

    // Tabs
    dom.tabPlaylist.addEventListener("click", function () {
      state.activeTab = "playlist";
      dom.tabPlaylist.classList.add("cl-pill--active");
      dom.tabPlaylist.setAttribute("aria-selected", "true");
      dom.tabGallery.classList.remove("cl-pill--active");
      dom.tabGallery.setAttribute("aria-selected", "false");
      dom.playlist.style.display = "flex";
      dom.grid.style.display = "none";
    });

    dom.tabGallery.addEventListener("click", function () {
      state.activeTab = "gallery";
      dom.tabGallery.classList.add("cl-pill--active");
      dom.tabGallery.setAttribute("aria-selected", "true");
      dom.tabPlaylist.classList.remove("cl-pill--active");
      dom.tabPlaylist.setAttribute("aria-selected", "false");
      dom.playlist.style.display = "none";
      dom.grid.style.display = "grid";
    });

    // Search filter
    dom.searchInput.addEventListener("input", function () {
      state.searchQuery = dom.searchInput.value;
      renderPlaylist();
      renderGallery();
    });

    // Fullscreen toggle (Kiosk / Borne)
    dom.btnToggleFullscreen.addEventListener("click", function () {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(function () {});
        dom.btnToggleFullscreen.textContent = "Quitter plein écran";
      } else {
        document.exitFullscreen().catch(function () {});
        dom.btnToggleFullscreen.textContent = "Plein écran";
      }
    });

    document.addEventListener("fullscreenchange", function () {
      if (document.fullscreenElement) {
        document.body.classList.add("kiosk-mode");
        dom.btnToggleFullscreen.textContent = "Quitter plein écran";
      } else {
        document.body.classList.remove("kiosk-mode");
        dom.btnToggleFullscreen.textContent = "Plein écran";
      }
    });

    // Keyboard controls
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && dom.viewerModal.classList.contains("active")) {
        closeViewer();
      } else if (dom.viewerModal.classList.contains("active")) {
        if (e.key === "ArrowLeft") stepChapter(-1);
        if (e.key === "ArrowRight") stepChapter(1);
        if (e.key === " ") {
          e.preventDefault();
          togglePlay();
        }
      }
    });

    // Touch Swipe on Viewer
    bindSwipe(dom.viewerModal, function (dir) {
      stepChapter(dir === "left" ? 1 : -1);
    });
  }

  function bindSwipe(el, onSwipe) {
    var startX = 0;
    var startY = 0;
    el.addEventListener("touchstart", function (e) {
      var touch = e.changedTouches[0];
      startX = touch.clientX;
      startY = touch.clientY;
    }, { passive: true });

    el.addEventListener("touchend", function (e) {
      var touch = e.changedTouches[0];
      var diffX = touch.clientX - startX;
      var diffY = touch.clientY - startY;
      if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY) * 1.4) {
        onSwipe(diffX < 0 ? "left" : "right");
      }
    }, { passive: true });
  }
})();
