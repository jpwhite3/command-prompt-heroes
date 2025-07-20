document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const screens = document.querySelectorAll('.game-screen');
  const titleScreen = document.getElementById('title-screen');
  const menuScreen = document.getElementById('menu-screen');
  const instructionsScreen = document.getElementById('instructions-screen');
  const gameScreen = document.getElementById('game-screen');
  const gameOverSplashScreen = document.getElementById(
    'game-over-splash-screen'
  );
  const finalScoreSplash = document.getElementById('final-score-splash');
  const gameOverScreen = document.getElementById('game-over-screen');
  const leaderboardScreen = document.getElementById('leaderboard-screen');
  const demoModeIndicator = document.getElementById('demo-mode-indicator');
  const ecosystemList = document.getElementById('ecosystem-list');

  const newGameBtn = document.getElementById('new-game-btn');
  const leaderboardBtn = document.getElementById('leaderboard-btn');
  const demoModeBtn = document.getElementById('demo-mode-btn');
  const readyYesBtn = document.getElementById('ready-yes-btn');
  const readyNoBtn = document.getElementById('ready-no-btn');
  const submitScoreBtn = document.getElementById('submit-score-btn');
  const backToMenuBtn = document.getElementById('back-to-menu-btn');
  const menuFromLeaderboardBtn = document.getElementById(
    'menu-from-leaderboard-btn'
  );
  const downloadDataBtn = document.getElementById('download-data-btn');
  const resetDataBtn = document.getElementById('reset-data-btn');

  const timeLeftDisplay = document.getElementById('time-left');
  const currentScoreDisplay = document.getElementById('current-score');
  const outputArea = document.getElementById('output-area');
  const commandInput = document.getElementById('command-input');
  const finalScoreDisplay = document.getElementById('final-score');
  const playerNameInput = document.getElementById('player-name');
  const leaderboardList = document.getElementById('leaderboard-list');
  const gamesPlayedCount = document.getElementById('games-played-count');

  // --- Game Configuration ---
  const GAME_DURATION_SECONDS = 60;
  const LEADERBOARD_KEY = 'commandLineHeroLeaderboard';
  const STATS_KEY = 'commandLineHeroStats';
  const konamiCode = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
  ];

  // --- Game State ---
  let score = 0;
  let timeLeft = GAME_DURATION_SECONDS;
  let timerInterval = null;
  let leaderboard = [];
  let gameStats = { totalGamesPlayed: 0 };
  let konamiIndex = 0;
  let isDemoMode = false;
  let demoModeInterval = null;
  let typingInterval = null;

  // --- Functions ---

  function showScreen(screenToShow) {
    screens.forEach((screen) => screen.classList.remove('active'));
    screenToShow.classList.add('active');
    let firstFocusableElement;
    if (screenToShow.id === 'game-screen') {
      firstFocusableElement = commandInput;
    } else if (screenToShow.id === 'game-over-screen') {
      firstFocusableElement = playerNameInput;
    } else {
      firstFocusableElement = screenToShow.querySelector(
        'button, input[type="text"]'
      );
    }
    if (firstFocusableElement) {
      setTimeout(() => {
        try {
          firstFocusableElement.focus();
        } catch (e) {
          console.warn('Could not focus element:', firstFocusableElement, e);
        }
      }, 0);
    }
  }

  function updateEcosystemList() {
    const ecosystems = Object.keys(commandDatabase);
    let listString = '';
    if (ecosystems.length > 1) {
      listString =
        ecosystems.slice(0, -1).join(', ') + ', and ' + ecosystems.slice(-1);
    } else if (ecosystems.length === 1) {
      listString = ecosystems[0];
    }
    ecosystemList.textContent = listString;
  }

  function loadGameData() {
    try {
      const storedLeaderboard = localStorage.getItem(LEADERBOARD_KEY);
      const storedStats = localStorage.getItem(STATS_KEY);
      leaderboard = storedLeaderboard ? JSON.parse(storedLeaderboard) : [];
      gameStats = storedStats
        ? JSON.parse(storedStats)
        : { totalGamesPlayed: 0 };
    } catch (e) {
      console.error('Could not load game data from localStorage:', e);
      leaderboard = [];
      gameStats = { totalGamesPlayed: 0 };
    }
  }

  function saveGameData() {
    if (isDemoMode) return;
    try {
      leaderboard.sort((a, b) => b.score - a.score);
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
      localStorage.setItem(STATS_KEY, JSON.stringify(gameStats));
    } catch (e) {
      console.error('Could not save game data to localStorage:', e);
    }
  }

  function displayLeaderboard() {
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboardList.innerHTML = '';
    gamesPlayedCount.textContent = gameStats.totalGamesPlayed || 0;

    if (leaderboard.length === 0) {
      leaderboardList.innerHTML = '<li>No scores yet!</li>';
    } else {
      leaderboard.slice(0, 10).forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = `${(index + 1)
          .toString()
          .padEnd(2, ' ')}. ${entry.name.padEnd(10, ' ')} - ${entry.score}`;
        leaderboardList.appendChild(li);
      });
    }
    showScreen(leaderboardScreen);
  }

  function showMenu() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    commandInput.disabled = false;
    showScreen(menuScreen);
  }

  function promptNewGame() {
    showScreen(instructionsScreen);
  }

  function startTimer() {
    timeLeft = GAME_DURATION_SECONDS;
    timeLeftDisplay.textContent = timeLeft;
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      timeLeftDisplay.textContent = timeLeft;
      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);
  }

  function endGame() {
    clearInterval(timerInterval);
    timerInterval = null;
    if (typingInterval) {
      clearInterval(typingInterval);
      typingInterval = null;
    }

    if (isDemoMode) {
      resetGame(true);
      startTimer();
      const allCommands = Object.values(commandDatabase).flat();
      demoModeInterval = setInterval(() => {
        if (timeLeft > 0) {
          const randomCommand =
            allCommands[Math.floor(Math.random() * allCommands.length)];
          simulateTyping(randomCommand);
        }
      }, 2500); // Start typing a new command every 2.5 seconds
      return;
    }

    if (demoModeInterval) {
      clearInterval(demoModeInterval);
      demoModeInterval = null;
    }
    commandInput.disabled = true;

    finalScoreSplash.textContent = score;
    showScreen(gameOverSplashScreen);

    setTimeout(() => {
      finalScoreDisplay.textContent = score;
      playerNameInput.value = '';
      document
        .getElementById('game-over-screen')
        .querySelector('h2').textContent = '-- Game Over --';
      submitScoreBtn.disabled = false;
      showScreen(gameOverScreen);
    }, 5000);
  }

  function resetGame(keepDemoMode = false) {
    score = 0;
    timeLeft = GAME_DURATION_SECONDS;
    currentScoreDisplay.textContent = score;
    timeLeftDisplay.textContent = timeLeft;
    outputArea.innerHTML = '';
    commandInput.value = '';
    commandInput.disabled = false;
    konamiIndex = 0;
    if (typingInterval) {
      clearInterval(typingInterval);
      typingInterval = null;
    }
    if (!keepDemoMode) {
      isDemoMode = false;
      demoModeIndicator.style.display = 'none';
      if (demoModeInterval) {
        clearInterval(demoModeInterval);
        demoModeInterval = null;
      }
    }
  }

  function startGame() {
    resetGame(isDemoMode);
    if (!isDemoMode) {
      gameStats.totalGamesPlayed++;
      saveGameData();
    }
    showScreen(gameScreen);
    startTimer();
  }

  function simulateTyping(command) {
    let i = 0;
    commandInput.value = '';
    if (typingInterval) {
      clearInterval(typingInterval);
    }
    typingInterval = setInterval(() => {
      if (i < command.length) {
        commandInput.value += command.charAt(i);
        i++;
      } else {
        clearInterval(typingInterval);
        typingInterval = null;
        processCommand(command);
        commandInput.value = '';
      }
    }, 100); // Typing speed
  }

  function activateDemoMode() {
    isDemoMode = true;
    demoModeIndicator.style.display = 'block';
    commandInput.disabled = true;
    startGame();
    const allCommands = Object.values(commandDatabase).flat();
    demoModeInterval = setInterval(() => {
      if (timeLeft > 0) {
        const randomCommand =
          allCommands[Math.floor(Math.random() * allCommands.length)];
        simulateTyping(randomCommand);
      }
    }, 2500);
  }

  function exitDemoMode() {
    isDemoMode = false;
    demoModeIndicator.style.display = 'none';
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    if (demoModeInterval) {
      clearInterval(demoModeInterval);
      demoModeInterval = null;
    }
    if (typingInterval) {
      clearInterval(typingInterval);
      typingInterval = null;
    }
    resetGame();
    showMenu();
  }

  function processCommand(commandText) {
    const trimmedCommand = commandText.trim().toLowerCase();
    if (trimmedCommand === '') return;

    let commandFound = false;
    const foundInEcosystems = [];

    for (const ecosystem in commandDatabase) {
      if (
        commandDatabase[ecosystem].some(
          (cmd) => trimmedCommand.startsWith(cmd) && cmd.length > 0
        )
      ) {
        commandFound = true;
        if (!foundInEcosystems.includes(ecosystem)) {
          foundInEcosystems.push(ecosystem);
        }
      }
    }

    const entryDiv = document.createElement('div');
    entryDiv.classList.add('command-entry');
    const commandSpan = document.createElement('span');
    commandSpan.textContent = `> ${commandText}`;
    entryDiv.appendChild(commandSpan);

    if (commandFound) {
      score++;
      currentScoreDisplay.textContent = score;
      foundInEcosystems.forEach((eco) => {
        const ecoSpan = document.createElement('span');
        ecoSpan.classList.add('ecosystem-check');
        ecoSpan.textContent = `[${eco}] ✓`;
        entryDiv.appendChild(ecoSpan);
      });
    } else {
      const errorSpan = document.createElement('span');
      errorSpan.textContent = `[Command not recognized]`;
      errorSpan.style.color = '#ff6b6b';
      entryDiv.appendChild(errorSpan);
    }

    outputArea.appendChild(entryDiv);
    if (
      outputArea.scrollHeight - outputArea.scrollTop <=
      outputArea.clientHeight + 50
    ) {
      outputArea.scrollTop = outputArea.scrollHeight;
    }
  }

  function handleCommandInputSubmit(event) {
    if (event.key === 'Enter' && !commandInput.disabled) {
      event.preventDefault();
      processCommand(commandInput.value);
      commandInput.value = '';
    }
  }

  function submitScore() {
    if (isDemoMode) return;
    const playerName = playerNameInput.value.trim().slice(0, 10) || 'Anonymous';
    leaderboard.push({ name: playerName, score: score });
    saveGameData();
    displayLeaderboard();
  }

  function downloadData() {
    const dataToDownload = {
      leaderboard: leaderboard,
      stats: gameStats,
    };
    const dataStr = JSON.stringify(dataToDownload, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'command_prompt_heroes_data.json';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }

  function resetData() {
    if (
      confirm(
        'Are you sure you want to reset all scores and stats? This cannot be undone.'
      )
    ) {
      leaderboard = [];
      gameStats = { totalGamesPlayed: 0 };
      saveGameData();
      displayLeaderboard();
      console.log('All game data has been reset.');
    }
  }

  // --- Event Listeners ---
  newGameBtn.addEventListener('click', promptNewGame);
  leaderboardBtn.addEventListener('click', () => {
    loadGameData();
    displayLeaderboard();
  });
  demoModeBtn.addEventListener('click', () => {
    activateDemoMode();
  });
  readyYesBtn.addEventListener('click', startGame);
  readyNoBtn.addEventListener('click', showMenu);
  submitScoreBtn.addEventListener('click', submitScore);
  backToMenuBtn.addEventListener('click', showMenu);
  menuFromLeaderboardBtn.addEventListener('click', showMenu);
  downloadDataBtn.addEventListener('click', downloadData);
  resetDataBtn.addEventListener('click', resetData);

  commandInput.addEventListener('keydown', handleCommandInputSubmit);

  document.addEventListener('keydown', (event) => {
    const activeScreen = document.querySelector('.game-screen.active');
    if (!activeScreen) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      if (isDemoMode) {
        exitDemoMode();
        return;
      }
      if (activeScreen.id === 'leaderboard-screen' && menuFromLeaderboardBtn) {
        menuFromLeaderboardBtn.click();
      } else if (activeScreen.id === 'instructions-screen' && readyNoBtn) {
        readyNoBtn.click();
      } else if (activeScreen.id === 'game-over-screen' && backToMenuBtn) {
        backToMenuBtn.click();
      }
    }

    if (activeScreen.id === 'game-screen' && !isDemoMode) {
      if (event.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          activateDemoMode();
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    }

    const focusedElement = document.activeElement;

    if (event.key === 'Enter') {
      if (
        focusedElement &&
        focusedElement.tagName === 'BUTTON' &&
        activeScreen.contains(focusedElement)
      ) {
        event.preventDefault();
        focusedElement.click();
      } else if (
        focusedElement === playerNameInput &&
        activeScreen.id === 'game-over-screen'
      ) {
        event.preventDefault();
        submitScoreBtn.click();
      }
    } else if (event.key === 'Tab') {
      if (activeScreen.contains(focusedElement)) {
        const focusableElements = Array.from(
          activeScreen.querySelectorAll('button, input[type="text"]')
        ).filter((el) => el.offsetParent !== null && !el.disabled);

        if (focusableElements.length > 1) {
          const currentIndex = focusableElements.indexOf(focusedElement);
          let nextIndex;
          if (event.shiftKey) {
            nextIndex =
              currentIndex <= 0
                ? focusableElements.length - 1
                : currentIndex - 1;
          } else {
            nextIndex =
              currentIndex >= focusableElements.length - 1
                ? 0
                : currentIndex + 1;
          }
          event.preventDefault();
          focusableElements[nextIndex].focus();
        } else if (focusableElements.length === 1) {
          event.preventDefault();
        }
      }
    }
  });

  // --- Initialization ---
  function init() {
    showScreen(titleScreen);
    if (
      typeof commandDatabase === 'undefined' ||
      Object.keys(commandDatabase).length === 0
    ) {
      console.error(
        'Command database not loaded. Make sure commands.js is included correctly.'
      );
      outputArea.innerHTML =
        '<div style="color: #ff6b6b;">Error: Could not load command definitions.</div>';
      newGameBtn.disabled = true;
      return;
    }
    updateEcosystemList();
    loadGameData();
    setTimeout(() => {
      showMenu();
    }, 2500);
  }

  init();
});
