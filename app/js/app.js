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
    playLg: '<svg class="cjg-icon cjg-icon--lg" viewBox="0 0 256 256"><path fill="currentColor" d="M240 128a15.74 15.74 0 0 1-7.6 13.51L88.32 229.65a16 16 0 0 1-16.2.3A15.86 15.86 0 0 1 64 216.13V39.87a15.86 15.86 0 0 1 8.12-13.82a16 16 0 0 1 16.2.3l144.08 88.14A15.74 15.74 0 0 1 240 128Z"/></svg>',
    pause: '<svg class="cjg-icon" viewBox="0 0 256 256"><path fill="currentColor" d="M216 48v160a16 16 0 0 1-16 16h-40a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h40a16 16 0 0 1 16 16ZM96 32H56a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h40a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16Z"/></svg>',
    pauseLg: '<svg class="cjg-icon cjg-icon--lg" viewBox="0 0 256 256"><path fill="currentColor" d="M216 48v160a16 16 0 0 1-16 16h-40a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h40a16 16 0 0 1 16 16ZM96 32H56a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h40a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16Z"/></svg>',
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
    activeTab: "gallery", // "gallery" par défaut
    searchQuery: "",
    lastVolume: 1
  };

  var OFFICIAL_FIREBASE_STREAM_URL = "https://firebasestorage.googleapis.com/v0/b/creative-assets-server.firebasestorage.app/o/media%2FYKk3utzRXSnWhrvpzS2V%2Fb04d6e89-e599-4ba0-b11e-7c7b31798775.mp3?alt=media&token=1c48f14b-7832-42b1-9a81-6a29ce6d0246";

  var streamState = {
    currentUrl: OFFICIAL_FIREBASE_STREAM_URL,
    metadata: null,
    latency: null,
    activeMode: "remote"
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
    dom.btnBannerPlay = document.getElementById("btn-banner-play");
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
    dom.viewerStoryPanel = document.querySelector(".cjg-viewer-story-panel");
    dom.viewerSplit = document.querySelector(".cjg-viewer-split");

    // Éléments du gestionnaire de flux distant et lecteur dynamique
    dom.playerStreamBadge = document.getElementById("player-stream-badge");
    dom.playerAudioWave = document.getElementById("player-audio-wave");
    dom.playerStreamBtn = document.getElementById("player-stream-btn");
    dom.btnOpenStreamMgr = document.getElementById("btn-open-stream-mgr");
    dom.streamManagerModal = document.getElementById("stream-manager-modal");
    dom.streamManagerCloseBtn = document.getElementById("stream-manager-close-btn");
    dom.streamUrlText = document.getElementById("stream-url-text");
    dom.btnCopyStreamUrl = document.getElementById("btn-copy-stream-url");
    dom.btnPlayStreamNow = document.getElementById("btn-play-stream-now");
    dom.btnPlayStreamLabel = document.getElementById("btn-play-stream-label");
    dom.streamSelectEp1 = document.getElementById("stream-select-ep1");
    dom.streamSelectEp2 = document.getElementById("stream-select-ep2");
    dom.streamSelectEp3 = document.getElementById("stream-select-ep3");
    dom.streamChapterAssoc = document.getElementById("stream-chapter-assoc");
    dom.streamFormatBadge = document.getElementById("stream-format-badge");
    dom.toggleSourceRemote = document.getElementById("toggle-source-remote");
    dom.toggleSourceLocal = document.getElementById("toggle-source-local");
    dom.customStreamUrlInput = document.getElementById("custom-stream-url-input");
    dom.btnLoadCustomStream = document.getElementById("btn-load-custom-stream");
    dom.btnRestoreOfficialStream = document.getElementById("btn-restore-official-stream");
    dom.streamLatencyBadge = document.getElementById("stream-latency-badge");
    dom.metaValTitle = document.getElementById("meta-val-title");
    dom.metaValSize = document.getElementById("meta-val-size");
    dom.metaValRate = document.getElementById("meta-val-rate");
    dom.metaValEncoder = document.getElementById("meta-val-encoder");
    dom.toast = document.getElementById("cjg-toast");

    dom.aboutTitle = document.getElementById("about-title");
    dom.aboutDescription = document.getElementById("about-description");
    dom.bannerTitle = document.getElementById("banner-title");
    dom.bannerSubtitle = document.getElementById("banner-subtitle");
  }

  var NARRATIVES = {
    0: "Est-ce qu'un homme qui aime le luxe, la bonne chère et les grandes parties de chasse peut devenir un saint ? À première vue, ce n'est pas le chemin le plus direct. Et pourtant, c'est bien ce qui arriva à Germain d'Auxerre.\n\nMais comment cet aristocrate romain, ce gouverneur un peu provocateur, a-t-il pu devenir l'un des saints les plus célèbres de notre histoire ? Pour le comprendre, il faut reprendre les choses dans l'ordre.",
    1: "Nous sommes à la fin du IVe siècle. L'Empire romain existe encore, mais il vacille. Le christianisme, longtemps persécuté, lui, progresse. Le monde ancien commence à disparaître, mais le monde nouveau, lui, n'est pas encore né.\n\nEt c'est dans cette époque troublée que grandit le jeune Germain. Issu d'une riche famille gallo-romaine établie près d'Auxerre, alors appelée Autessiodurum, il étudie le droit à Rome avant de revenir en Gaule. Il devient gouverneur, exerce d'importantes responsabilités et épouse Eustachie, une femme de haute naissance. Riche, puissant et respecté, Germain a tout pour lui.\n\nMais à Auxerre vit un autre homme d'autorité, l'évêque Amâtre. Entre eux, l'entente est… délicate. Oui, Germain a un péché mignon qui agace prodigieusement l'évêque Amâtre : le gouverneur adore la chasse et, après chaque battue, il fait suspendre les têtes de ses gibiers aux branches d'un grand poirier, en plein centre d'Auxerre. Pour lui, c'est une manière d'exhiber ses victoires, mais pour Amâtre, c'est une provocation, un reste de vieux rite païen insupportable.\n\nAlors, un jour, profitant de l'absence du gouverneur, l'évêque Amâtre fait abattre le poirier. Et c'est là que l'histoire prend un tour inattendu. Amâtre aurait eu une vision : Germain, son adversaire, deviendra son successeur. Alors, il le fait arrêter pour le traîner dans la cathédrale, lui couper les cheveux et lui imposer la tonsure. En un instant, l'homme de pouvoir devient diacre.\n\nLa légende s'est sans doute mêlée à l'histoire, mais une chose est certaine : à la mort d'Amâtre en 418, Germain devient évêque d'Auxerre.",
    2: "La vie de Germain changea alors du tout au tout. Il renonce aux fastes, distribue une grande partie de sa fortune aux plus démunis et adopte une existence modeste. Mais Germain n'a rien perdu de son énergie.\n\nL'ancien administrateur devient un bâtisseur et un diplomate infatigable. Près de son palais, tout d'abord, il fait construire une chapelle destinée à abriter les reliques de Saint-Alban. Puis, sur l'autre rive de l'Yonne, il fonde un monastère où il aime se retirer, loin du pouvoir et du bruit. Sur ces terres, il fait également bâtir un modeste oratoire dédié à Saint-Maurice. C'est autour de cette petite chapelle que s'élèvera, bien plus tard, l'abbaye Saint-Germain. Mais revenons à notre histoire."
  };

  var SUBTITLES = {
    0: "D'aristocrate romain amateur de chasse à l'un des plus grands saints de Gaule",
    1: "Le poirier païen abattu et la tonsure inattendue imposée par l'évêque Amâtre",
    2: "Le renoncement aux fastes et les fondations sur les rives de l'Yonne"
  };

  function parseApiData(raw) {
    if (!raw) return null;
    var content = raw.data || raw;
    var cards = content.cards || content.chapitres || [];

    var chapters = cards.map(function (card, idx) {
      var num = String(idx + 1).padStart(2, "0");
      var imgUrl = (card.image && typeof card.image === "object") ? (card.image.url || "") : (card.image || "");
      var thumb = (card.image && typeof card.image === "object" && card.image.thumbUrl) ? card.image.thumbUrl : imgUrl;
      var audioUrl = (card.audio && typeof card.audio === "object") ? (card.audio.url || "") : (card.audio || "");
      var fallbackAudio = "assets/audio/" + (
        idx === 0 ? "01-accroche.mp3" :
        idx === 1 ? "02-jeunesse-et-rivalite-avec-amatre.mp3" :
        idx === 2 ? "03-eveque-batisseur.mp3" :
        idx === 3 ? "04-voyages-et-miracles.mp3" :
        idx === 4 ? "05-rencontre-avec-genevieve.mp3" : "06-mort-et-posterite.mp3"
      );
      var feedDescription = (typeof card.description === "string" && card.description.trim()) ? card.description.trim() : "";

      return {
        id: num,
        cardId: card.id || card.cardId || ("card-" + (idx + 1)),
        titre: card.title || card.titre || ("Chapitre " + (idx + 1)),
        sousTitre: feedDescription || card.sousTitre || SUBTITLES[idx] || ("Épisode " + (idx + 1)),
        description: feedDescription || card.sousTitre || "",
        image: imgUrl,
        thumbUrl: thumb,
        audio: audioUrl || fallbackAudio,
        audioRemote: audioUrl,
        audioLocal: card.audioLocal || fallbackAudio,
        mediaType: "image",
        sourceType: "firebase_storage",
        texte: card.body || card.texte || NARRATIVES[idx] || feedDescription || ""
      };
    });

    return {
      titre: content.title || content.titre || "Germain l'Auxerrois",
      sousTitre: content.sousTitre || "Fin du IVe siècle. L'Empire romain vacille et le christianisme progresse.",
      description: content.description || "Fin du IVe siècle. L'Empire romain vacille et le christianisme progresse. Le jeune Germain grandit au sein d'une riche famille gallo-romaine d'Autessiodurum (Auxerre). Après avoir étudié le droit à Rome, il devient gouverneur provincial, épouse Eustachie et mène grand train. Passionné de chasse, il fait suspendre les têtes de ses gibiers aux branches d'un grand poirier en plein centre d'Auxerre. Cette coutume exaspère l'évêque Amâtre, qui y voit un reste insupportable de rites païens. Profitant de l'absence du gouverneur, Amâtre fait abattre l'arbre.",
      lieu: content.lieu || "Auxerre — Autessiodurum",
      credits: content.credits || (content.title || content.titre || "Germain l'Auxerrois"),
      cardCount: content.cardCount || chapters.length,
      chapitres: chapters
    };
  }

  function loadConfig(isManual) {
    var ts = Date.now();
    var directUrl = "https://creative-assets-api.web.app/v1/contents/1?_t=" + ts;
    var proxyUrl = "/api/content?refresh=true&nocache=1&_t=" + ts;

    // 1. Appel direct de l'API demandée avec contournement complet de cache
    fetch(directUrl, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" }
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (apiJson) {
        var parsed = parseApiData(apiJson);
        if (parsed && parsed.chapitres && parsed.chapitres.length > 0) {
          applyNewConfig(parsed, isManual);
          return;
        }
        throw new Error("Format API inattendu");
      })
      .catch(function (err) {
        console.warn("API directe injoignable, bascule vers le proxy /api/content :", err);
        // 2. Fallback via proxy local sans aucun cache
        fetch(proxyUrl, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" }
        })
          .then(function (res) {
            if (!res.ok) throw new Error("HTTP " + res.status);
            return res.json();
          })
          .then(function (proxyJson) {
            var parsed = parseApiData(proxyJson);
            if (parsed && parsed.chapitres && parsed.chapitres.length > 0) {
              applyNewConfig(parsed, isManual);
              return;
            }
            throw new Error("Format proxy inattendu");
          })
          .catch(function (err2) {
            console.warn("Proxy injoignable, bascule vers config/chapters.json locale :", err2);
            // 3. Fallback vers config locale
            fetch("config/chapters.json?_t=" + ts, { cache: "no-store" })
              .then(function (res) { return res.json(); })
              .then(function (localJson) {
                var parsed = parseApiData(localJson);
                applyNewConfig(parsed || localJson, isManual);
              })
              .catch(function (err3) {
                console.error("Échec complet du chargement de la configuration :", err3);
                if (isManual) showToast("Impossible de synchroniser le flux (réseau indisponible)");
              });
          });
      });
  }

  function applyNewConfig(newConfig, notifyUser) {
    state.config = newConfig;
    state.chapters = newConfig.chapitres || [];
    renderAll();
    if (notifyUser) {
      showToast("Flux synchronisé en direct (" + state.chapters.length + " chapitres)");
    }
  }

  function renderAll() {
    var title = state.config.titre || state.config.title || "Germain l'Auxerrois";
    var subtitle = state.config.sousTitre || "";
    var description = state.config.description || "";
    var lieu = state.config.lieu || "Auxerre — Autessiodurum";
    var credits = state.config.credits || title;

    document.title = title;
    if (dom.appTitle) dom.appTitle.textContent = title;
    if (dom.appSubtitle) dom.appSubtitle.textContent = subtitle;
    if (dom.headerSubtitle) dom.headerSubtitle.textContent = title;
    if (dom.footerTagline) dom.footerTagline.textContent = credits;
    if (dom.aboutTitle) dom.aboutTitle.innerHTML = 'À propos <span class="cl-section-title__accent">de ' + title + '</span>';
    if (dom.aboutDescription && description) dom.aboutDescription.textContent = description;
    if (dom.bannerTitle) dom.bannerTitle.textContent = title;
    if (dom.bannerSubtitle) dom.bannerSubtitle.remove();

    renderPlaylist();
    renderGallery();
    renderViewerStepper();

    if (state.activeTab === "gallery") {
      if (dom.playlist) dom.playlist.style.display = "none";
      if (dom.grid) dom.grid.style.display = "grid";
    } else {
      if (dom.playlist) dom.playlist.style.display = "flex";
      if (dom.grid) dom.grid.style.display = "none";
    }

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
        (chap.description && chap.description.toLowerCase().indexOf(query) !== -1) ||
        (chap.sousTitre && chap.sousTitre.toLowerCase().indexOf(query) !== -1) ||
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

  function isFirebaseStream(chap) {
    if (!chap) return false;
    return chap.sourceType === "firebase_storage" ||
      chap.sourceType === "custom_stream" ||
      (chap.audio && chap.audio.indexOf("firebasestorage.googleapis.com") !== -1);
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
      var subtitleText = chap.description || chap.sousTitre || "Épisode historique";
      var imgThumb = chap.thumbUrl || chap.image;

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
          '<img class="cl-row__thumb" src="' + imgThumb + '" alt="" loading="lazy" style="width:100%; height:100%; object-fit:cover;" />' +
        '</div>' +
        '<div class="cl-row__info">' +
          '<div class="cl-row__titleline">' +
            '<span class="cl-row__title">' + chap.titre + '</span>' +
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
      var imgThumb = chap.thumbUrl || chap.image;
      var chapterDesc = chap.description || chap.sousTitre || "";

      var card = document.createElement("div");
      card.className = "cjg-card-chapter" + (isCurrent ? " active-track" : "");
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", "Chapitre " + chap.id + " : " + chap.titre);

      card.innerHTML =
        '<div class="cjg-card-chapter__thumb-wrap">' +
          '<img class="cjg-card-chapter__thumb" src="' + imgThumb + '" alt="' + chap.titre + '" loading="lazy" />' +
          '<span class="cjg-card-chapter__num">Chapitre ' + chap.id + '</span>' +
          '<span class="cjg-card-chapter__play-overlay" aria-hidden="true">' +
            (isCurrent && state.isPlaying ? ICONS.pause : ICONS.play) +
          '</span>' +
        '</div>' +
        '<div class="cjg-card-chapter__body">' +
          '<h3 class="cjg-card-chapter__title">' + chap.titre + '</h3>' +
          (chapterDesc ? '<p class="cl-desc" style="font-size:0.85rem; margin-bottom:0; line-height:1.4;">' + chapterDesc + '</p>' : '') +
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
    streamState.inspectedIndex = index;
    var chap = state.chapters[index];
    var isStream = isFirebaseStream(chap);

    if (dom.playerTitle) {
      dom.playerTitle.textContent = chap.id + " — " + chap.titre;
    }

    if (dom.playerStreamBadge) {
      dom.playerStreamBadge.style.display = "none";
    }
    if (dom.playerAudioWave) {
      dom.playerAudioWave.style.display = state.isPlaying ? "inline-flex" : "none";
      dom.playerAudioWave.classList.toggle("active", state.isPlaying);
    }

    // Gestion du fallback automatique en cas d'interruption du flux distant
    dom.audio.onerror = function () {
      console.warn("Échec du chargement audio :", dom.audio.src);
      if (chap.audioLocal && dom.audio.src.indexOf(chap.audioLocal) === -1) {
        showToast("Flux distant inaccessible — bascule automatique sur l'audio local");
        dom.audio.src = chap.audioLocal;
        if (state.isPlaying) {
          dom.audio.play().catch(function () {});
        }
      }
    };

    dom.audio.src = chap.audio;
    dom.playerSeek.value = 0;
    dom.playerTimeCurrent.textContent = "0:00";
    dom.playerTimeTotal.textContent = "0:00";

    updateActiveHighlights();
    updateEpisodeStage(chap);
    updateViewer();

    // Récupération asynchrone des métadonnées enrichies du flux
    if (isStream && (!streamState.metadata || streamState.currentUrl !== chap.audio)) {
      streamState.currentUrl = chap.audio;
      fetchStreamMetadata(chap.audio);
    }

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
      dom.heroMediaBadge.style.display = "none";
    }

    if (dom.heroTypeIndicator) {
      dom.heroTypeIndicator.style.display = "none";
    }

    if (dom.heroChapterBadge) {
      dom.heroChapterBadge.textContent = "Épisode " + chap.id + " / " + (state.chapters.length < 10 ? "0" + state.chapters.length : state.chapters.length);
    }

    if (dom.heroChapterTitle) {
      dom.heroChapterTitle.textContent = chap.titre;
    }

    if (dom.heroChapterSubtitle) {
      dom.heroChapterSubtitle.textContent = chap.description || chap.sousTitre || "";
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
    if (dom.btnBannerPlay) {
      var isEp1Playing = state.currentIndex === 0 && isPlaying;
      dom.btnBannerPlay.innerHTML = isEp1Playing ? ICONS.pauseLg : ICONS.playLg;
      dom.btnBannerPlay.setAttribute("aria-label", isEp1Playing ? "Mettre en pause l'épisode 1" : "Lancer la lecture de l'épisode 1");
      dom.btnBannerPlay.setAttribute("title", isEp1Playing ? "Mettre en pause" : "Lancer la lecture de l'épisode 1");
    }
    if (dom.btnPlayAll) {
      var isTourPlaying = isPlaying;
      dom.btnPlayAll.innerHTML = (isTourPlaying ? ICONS.pause : ICONS.play) + (isTourPlaying ? " Mettre en pause" : " Écouter tout le parcours");
      dom.btnPlayAll.setAttribute("aria-label", isTourPlaying ? "Mettre en pause la lecture" : "Démarrer l'écoute intégrale");
    }
    if (dom.stagePlayBtn) {
      dom.stagePlayBtn.innerHTML = icon + ' <span id="stage-play-label">' + (isPlaying ? "Mettre en pause" : "Écouter l'épisode") + "</span>";
      dom.stagePlayBtn.setAttribute("aria-label", isPlaying ? "Mettre en pause" : "Écouter l'épisode");
    }
    if (dom.viewerPlayBtn) {
      dom.viewerPlayBtn.innerHTML = icon + ' <span id="viewer-play-label">' + (isPlaying ? "Mettre en pause" : "Écouter l'épisode") + "</span>";
      dom.viewerPlayBtn.setAttribute("aria-label", isPlaying ? "Mettre en pause" : "Écouter l'épisode");
    }

    if (dom.playerAudioWave) {
      dom.playerAudioWave.style.display = isPlaying ? "inline-flex" : "none";
      dom.playerAudioWave.classList.toggle("active", isPlaying);
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
      dom.viewerMediaTag.style.display = "none";
    }
    if (dom.viewerTitle) {
      dom.viewerTitle.textContent = chap.titre;
    }
    if (dom.viewerStoryTitle) {
      dom.viewerStoryTitle.textContent = chap.titre;
    }
    if (dom.viewerSubtitle) {
      dom.viewerSubtitle.textContent = chap.description || chap.sousTitre || "";
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
      dom.viewerMediaIndicator.innerHTML = "";
      dom.viewerMediaIndicator.style.display = "none";
    }

    if (dom.viewerPlayBtn) {
      dom.viewerPlayBtn.innerHTML = (state.isPlaying ? ICONS.pause : ICONS.play) +
        ' <span id="viewer-play-label">' + (state.isPlaying ? "Mettre en pause" : "Écouter l'épisode") + "</span>";
    }

    Array.prototype.forEach.call(dom.viewerStepper.children, function (dot, i) {
      dot.classList.toggle("active", i === state.currentIndex);
    });

    if (dom.viewerStoryPanel) dom.viewerStoryPanel.scrollTop = 0;
    if (dom.viewerSplit) dom.viewerSplit.scrollTop = 0;
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

  function showToast(msg) {
    if (!dom.toast) return;
    dom.toast.textContent = msg;
    dom.toast.classList.add("visible");
    clearTimeout(dom.toast._timer);
    dom.toast._timer = setTimeout(function () {
      dom.toast.classList.remove("visible");
    }, 3200);
  }

  function selectStreamChapter(idx) {
    if (idx < 0 || idx >= state.chapters.length) return;
    streamState.inspectedIndex = idx;
    var chap = state.chapters[idx];
    streamState.currentUrl = chap.audio;
    streamState.metadata = null;
    fetchStreamMetadata(chap.audio);
    updateStreamManagerUI();
  }

  function fetchStreamMetadata(url) {
    if (!url) return;
    fetch("/api/audio-metadata?url=" + encodeURIComponent(url))
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        if (data && data.success) {
          streamState.metadata = data;
          streamState.latency = data.latencyMs;
          updateStreamManagerUI();
        }
      })
      .catch(function (err) {
        console.warn("Échec de la récupération des métadonnées du flux :", err);
      });
  }

  function updateStreamManagerUI() {
    var chapIdx = typeof streamState.inspectedIndex === "number" ? streamState.inspectedIndex : state.currentIndex;
    var chap = state.chapters[chapIdx] || state.chapters[0];

    if (dom.streamSelectEp1 && dom.streamSelectEp2 && dom.streamSelectEp3) {
      dom.streamSelectEp1.classList.toggle("cl-pill--active", chapIdx === 0);
      dom.streamSelectEp2.classList.toggle("cl-pill--active", chapIdx === 1);
      dom.streamSelectEp3.classList.toggle("cl-pill--active", chapIdx === 2);
    }

    if (dom.streamChapterAssoc && chap) {
      dom.streamChapterAssoc.textContent = "Associé au Chapitre " + chap.id + " (" + chap.titre + ")";
    }
    if (dom.btnPlayStreamLabel && chap) {
      dom.btnPlayStreamLabel.textContent = "Écouter " + chap.titre;
    }
    if (dom.streamUrlText) {
      dom.streamUrlText.textContent = streamState.currentUrl || (chap && chap.audio) || "";
    }
    if (streamState.metadata) {
      var m = streamState.metadata;
      if (dom.metaValTitle) dom.metaValTitle.textContent = (m.id3 && m.id3.title) ? m.id3.title : (chap ? chap.titre : "Germain l'Auxerrois");
      if (dom.metaValSize) dom.metaValSize.textContent = m.sizeFormatted + " (" + (m.sizeBytes ? m.sizeBytes.toLocaleString("fr-FR") : "") + " octets)";
      if (dom.metaValRate) dom.metaValRate.textContent = m.bitrateEstimated + " • " + m.sampleRate + " " + m.channels;
      if (dom.metaValEncoder) dom.metaValEncoder.textContent = (m.id3 && m.id3.year ? m.id3.year + " • " : "") + (m.id3 && m.id3.encoder ? m.id3.encoder : "Firebase Storage");
      if (dom.streamLatencyBadge) dom.streamLatencyBadge.textContent = "Latence : ~" + m.latencyMs + " ms";
    } else {
      if (dom.metaValTitle) dom.metaValTitle.textContent = chap ? chap.titre : "Germain l'Auxerrois";
      if (dom.metaValSize) dom.metaValSize.textContent = "Interrogation du flux...";
      if (dom.metaValRate) dom.metaValRate.textContent = "MP3 Stéréo 48 kHz";
      if (dom.metaValEncoder) dom.metaValEncoder.textContent = "2026 • Firebase CDN";
      if (dom.streamLatencyBadge) dom.streamLatencyBadge.textContent = "En ligne";
    }
    if (dom.toggleSourceRemote && dom.toggleSourceLocal) {
      var isRemote = streamState.activeMode === "remote";
      dom.toggleSourceRemote.classList.toggle("cl-pill--active", isRemote);
      dom.toggleSourceLocal.classList.toggle("cl-pill--active", !isRemote);
    }
  }

  function openStreamManager() {
    if (!dom.streamManagerModal) return;
    var chapIdx = typeof streamState.inspectedIndex === "number" ? streamState.inspectedIndex : state.currentIndex;
    if (state.chapters[chapIdx]) {
      streamState.currentUrl = state.chapters[chapIdx].audio;
    }
    updateStreamManagerUI();
    dom.streamManagerModal.classList.add("active");
    document.body.style.overflow = "hidden";
    if (!streamState.metadata && streamState.currentUrl) {
      fetchStreamMetadata(streamState.currentUrl);
    }
  }

  function closeStreamManager() {
    if (!dom.streamManagerModal) return;
    dom.streamManagerModal.classList.remove("active");
    if (!dom.viewerModal || !dom.viewerModal.classList.contains("active")) {
      document.body.style.overflow = "";
    }
  }

  function bindEvents() {
    // Player events
    dom.playerPlayBtn.addEventListener("click", togglePlay);
    dom.viewerPlayBtn.addEventListener("click", togglePlay);
    if (dom.stagePlayBtn) dom.stagePlayBtn.addEventListener("click", togglePlay);
    if (dom.stagePrevBtn) dom.stagePrevBtn.addEventListener("click", function () { stepChapter(-1); });
    if (dom.stageNextBtn) dom.stageNextBtn.addEventListener("click", function () { stepChapter(1); });
    if (dom.btnExpandStage) dom.btnExpandStage.addEventListener("click", function () { openViewer(state.currentIndex); });

    function openEpisode1BoxAndPlay() {
      openViewer(0);
      if (state.currentIndex === 0 && !dom.audio.paused) {
        // Si l'épisode 1 est déjà en cours de lecture, on maintient la lecture et on ouvre la boîte
      } else {
        loadChapter(0, true);
      }
    }

    if (dom.btnBannerPlay) {
      dom.btnBannerPlay.addEventListener("click", openEpisode1BoxAndPlay);
    }
    if (dom.btnPlayAll) {
      dom.btnPlayAll.addEventListener("click", openEpisode1BoxAndPlay);
    }

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

    // Search filter (si présent)
    if (dom.searchInput) {
      dom.searchInput.addEventListener("input", function () {
        state.searchQuery = dom.searchInput.value;
        renderPlaylist();
        renderGallery();
      });
    }

    // Fullscreen toggle (Kiosk / Borne)
    if (dom.btnToggleFullscreen) {
      dom.btnToggleFullscreen.addEventListener("click", function () {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(function () {});
          dom.btnToggleFullscreen.textContent = "Quitter plein écran";
        } else {
          document.exitFullscreen().catch(function () {});
          dom.btnToggleFullscreen.textContent = "Plein écran";
        }
      });
    }

    document.addEventListener("fullscreenchange", function () {
      if (document.fullscreenElement) {
        document.body.classList.add("kiosk-mode");
        if (dom.btnToggleFullscreen) dom.btnToggleFullscreen.textContent = "Quitter plein écran";
      } else {
        document.body.classList.remove("kiosk-mode");
        if (dom.btnToggleFullscreen) dom.btnToggleFullscreen.textContent = "Plein écran";
      }
    });

    // Auto-actualisation transparente quand l'onglet redevient actif
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") {
        loadConfig(false);
      }
    });
    window.addEventListener("focus", function () {
      loadConfig(false);
    });

    // Contrôles du Gestionnaire de Flux Distant (Firebase Storage)
    if (dom.btnOpenStreamMgr) {
      dom.btnOpenStreamMgr.addEventListener("click", openStreamManager);
    }
    if (dom.playerStreamBtn) {
      dom.playerStreamBtn.addEventListener("click", openStreamManager);
    }
    if (dom.streamManagerCloseBtn) {
      dom.streamManagerCloseBtn.addEventListener("click", closeStreamManager);
    }
    if (dom.streamManagerModal) {
      dom.streamManagerModal.addEventListener("click", function (e) {
        if (e.target === dom.streamManagerModal) closeStreamManager();
      });
    }

    if (dom.btnCopyStreamUrl) {
      dom.btnCopyStreamUrl.addEventListener("click", function () {
        var url = streamState.currentUrl;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(function () {
            showToast("URL du flux copiée dans le presse-papier");
          }).catch(function () {
            showToast("URL sélectionnée");
          });
        } else {
          showToast("URL du flux sélectionnée");
        }
      });
    }

    if (dom.streamSelectEp1) {
      dom.streamSelectEp1.addEventListener("click", function () { selectStreamChapter(0); });
    }
    if (dom.streamSelectEp2) {
      dom.streamSelectEp2.addEventListener("click", function () { selectStreamChapter(1); });
    }
    if (dom.streamSelectEp3) {
      dom.streamSelectEp3.addEventListener("click", function () { selectStreamChapter(2); });
    }

    if (dom.btnPlayStreamNow) {
      dom.btnPlayStreamNow.addEventListener("click", function () {
        var chapIdx = typeof streamState.inspectedIndex === "number" ? streamState.inspectedIndex : state.currentIndex;
        loadChapter(chapIdx, true);
        closeStreamManager();
        var chap = state.chapters[chapIdx];
        showToast("Lecture lancée : " + (chap ? chap.titre : "Chapitre"));
      });
    }

    if (dom.toggleSourceRemote) {
      dom.toggleSourceRemote.addEventListener("click", function () {
        streamState.activeMode = "remote";
        var chapIdx = typeof streamState.inspectedIndex === "number" ? streamState.inspectedIndex : state.currentIndex;
        var chap = state.chapters[chapIdx];
        if (chap && chap.audioRemote) {
          chap.audio = chap.audioRemote;
          chap.sourceType = "firebase_storage";
          if (state.currentIndex === chapIdx) {
            var wasPlaying = state.isPlaying;
            loadChapter(chapIdx, wasPlaying);
          } else {
            updateActiveHighlights();
          }
        }
        updateStreamManagerUI();
        showToast("Source basculée sur le flux distant Firebase");
      });
    }

    if (dom.toggleSourceLocal) {
      dom.toggleSourceLocal.addEventListener("click", function () {
        streamState.activeMode = "local";
        var chapIdx = typeof streamState.inspectedIndex === "number" ? streamState.inspectedIndex : state.currentIndex;
        var chap = state.chapters[chapIdx];
        if (chap && chap.audioLocal) {
          chap.audio = chap.audioLocal;
          chap.sourceType = "local";
          if (state.currentIndex === chapIdx) {
            var wasPlaying = state.isPlaying;
            loadChapter(chapIdx, wasPlaying);
          } else {
            updateActiveHighlights();
          }
        }
        updateStreamManagerUI();
        showToast("Source basculée sur le fichier local de secours");
      });
    }

    if (dom.btnLoadCustomStream && dom.customStreamUrlInput) {
      dom.btnLoadCustomStream.addEventListener("click", function () {
        var customUrl = (dom.customStreamUrlInput.value || "").trim();
        if (!customUrl || (!customUrl.startsWith("http://") && !customUrl.startsWith("https://"))) {
          showToast("Veuillez saisir une URL HTTP ou HTTPS valide");
          return;
        }
        var chapIdx = typeof streamState.inspectedIndex === "number" ? streamState.inspectedIndex : state.currentIndex;
        streamState.currentUrl = customUrl;
        streamState.activeMode = "remote";
        var targetChap = state.chapters[chapIdx] || state.chapters[0];
        if (targetChap) {
          targetChap.audio = customUrl;
          targetChap.sourceType = "custom_stream";
        }
        fetchStreamMetadata(customUrl);
        loadChapter(chapIdx, true);
        showToast("Flux personnalisé chargé avec succès");
      });
    }

    if (dom.btnRestoreOfficialStream) {
      dom.btnRestoreOfficialStream.addEventListener("click", function () {
        var chapIdx = typeof streamState.inspectedIndex === "number" ? streamState.inspectedIndex : state.currentIndex;
        var chap = state.chapters[chapIdx];
        if (chap && chap.audioRemote) {
          chap.audio = chap.audioRemote;
          chap.sourceType = "firebase_storage";
          streamState.currentUrl = chap.audioRemote;
          streamState.activeMode = "remote";
          fetchStreamMetadata(chap.audioRemote);
          updateStreamManagerUI();
          updateActiveHighlights();
          showToast("Flux officiel Firebase Storage restauré");
        }
      });
    }

    // Keyboard controls
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        if (dom.streamManagerModal && dom.streamManagerModal.classList.contains("active")) {
          closeStreamManager();
        } else if (dom.viewerModal && dom.viewerModal.classList.contains("active")) {
          closeViewer();
        }
      } else if (dom.viewerModal.classList.contains("active")) {
        if (e.key === "ArrowLeft") stepChapter(-1);
        if (e.key === "ArrowRight") stepChapter(1);
        if (e.key === " ") {
          e.preventDefault();
          togglePlay();
        }
      }
    });

    // Drag-to-scroll sur le panneau de récit pour bornes tactiles et ordinateurs
    enableDragToScroll(dom.viewerStoryPanel);
    enableDragToScroll(dom.viewerSplit);

    // Touch Swipe sur le visualiseur (navigation entre chapitres par glissement)
    bindSwipe(dom.viewerModal, function (dir) {
      stepChapter(dir === "left" ? 1 : -1);
    });
  }

  function bindSwipe(el, onSwipe) {
    var startX = 0;
    var startY = 0;
    var startedInStory = false;

    el.addEventListener("touchstart", function (e) {
      var touch = e.changedTouches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      // Si le geste commence dans le panneau de texte, on laisse le défilement naturel du texte
      startedInStory = !!(e.target && e.target.closest && e.target.closest(".cjg-viewer-story-panel"));
    }, { passive: true });

    el.addEventListener("touchend", function (e) {
      // Priorité absolue au défilement / swipe vertical du texte
      if (startedInStory) return;
      var touch = e.changedTouches[0];
      var diffX = touch.clientX - startX;
      var diffY = touch.clientY - startY;
      if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY) * 1.4) {
        onSwipe(diffX < 0 ? "left" : "right");
      }
    }, { passive: true });
  }

  function enableDragToScroll(el) {
    if (!el) return;
    var isDown = false;
    var startY = 0;
    var startScrollTop = 0;
    var lastY = 0;
    var velocity = 0;
    var animFrame = null;

    el.addEventListener("mousedown", function (e) {
      if (e.target && e.target.closest && e.target.closest("button, a, input, select")) return;
      isDown = true;
      startY = e.clientY;
      lastY = e.clientY;
      startScrollTop = el.scrollTop;
      velocity = 0;
      if (animFrame) cancelAnimationFrame(animFrame);
    });

    window.addEventListener("mousemove", function (e) {
      if (!isDown) return;
      var deltaY = e.clientY - startY;
      velocity = e.clientY - lastY;
      lastY = e.clientY;
      el.scrollTop = startScrollTop - deltaY;
    });

    window.addEventListener("mouseup", function () {
      if (!isDown) return;
      isDown = false;
      if (Math.abs(velocity) > 2) {
        var momentum = velocity * 1.2;
        function decay() {
          if (Math.abs(momentum) < 0.5) return;
          el.scrollTop -= momentum;
          momentum *= 0.92;
          animFrame = requestAnimationFrame(decay);
        }
        animFrame = requestAnimationFrame(decay);
      }
    });
  }
})();
