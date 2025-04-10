document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const screens = document.querySelectorAll('.game-screen');
    const titleScreen = document.getElementById('title-screen');
    const menuScreen = document.getElementById('menu-screen');
    const instructionsScreen = document.getElementById('instructions-screen');
    const gameScreen = document.getElementById('game-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const leaderboardScreen = document.getElementById('leaderboard-screen');

    const newGameBtn = document.getElementById('new-game-btn');
    const leaderboardBtn = document.getElementById('leaderboard-btn');
    const readyYesBtn = document.getElementById('ready-yes-btn');
    const readyNoBtn = document.getElementById('ready-no-btn');
    const submitScoreBtn = document.getElementById('submit-score-btn');
    const backToMenuBtn = document.getElementById('back-to-menu-btn'); // From Game Over
    const menuFromLeaderboardBtn = document.getElementById('menu-from-leaderboard-btn');

    const timeLeftDisplay = document.getElementById('time-left');
    const currentScoreDisplay = document.getElementById('current-score');
    const outputArea = document.getElementById('output-area');
    const commandInput = document.getElementById('command-input');
    const finalScoreDisplay = document.getElementById('final-score');
    const playerNameInput = document.getElementById('player-name');
    const leaderboardList = document.getElementById('leaderboard-list');

    // --- Game Configuration ---
    const GAME_DURATION_SECONDS = 60;
    // Updated Leaderboard Key for the new game name
    const LEADERBOARD_KEY = 'commandLineHeroLeaderboard';

    // --- Command Database ---
    // Easily extensible: Add new keys for ecosystems and arrays of commands.
    // Use lowercase for easier matching.
    const commandDatabase = {
        'Windows CMD': ['dir', 'cd', 'cls', 'echo', 'mkdir', 'rmdir', 'copy', 'move', 'del', 'type', 'ren', 'ipconfig', 'ping', 'netstat', 'tasklist', 'taskkill'],
        'Linux': ['ls', 'cd', 'clear', 'pwd', 'mkdir', 'rmdir', 'cp', 'mv', 'rm', 'cat', 'touch', 'chmod', 'chown', 'ifconfig', 'ping', 'netstat', 'ps', 'kill', 'grep', 'find', 'man'],
        'Git': ['git init', 'git clone', 'git status', 'git add', 'git commit', 'git push', 'git pull', 'git branch', 'git checkout', 'git merge', 'git log', 'git diff', 'git remote', 'git fetch', 'git tag'],
        'Docker': ['docker run', 'docker ps', 'docker images', 'docker build', 'docker pull', 'docker push', 'docker stop', 'docker rm', 'docker rmi', 'docker network', 'docker volume', 'docker-compose up', 'docker-compose down', 'docker logs', 'docker exec'],
        'Kubernetes': ['kubectl get pods', 'kubectl get services', 'kubectl get deployments', 'kubectl apply -f', 'kubectl delete', 'kubectl describe', 'kubectl logs', 'kubectl exec', 'kubectl config view', 'kubectl cluster-info', 'kubectl top node', 'kubectl top pod', 'kubectl rollout status', 'kubectl scale', 'helm install', 'helm list'],
        // Add new ecosystems here, e.g.:
        // 'PowerShell': ['Get-ChildItem', 'Set-Location', 'Clear-Host', 'Write-Host', 'New-Item', 'Remove-Item', ...]
    };

    // --- Game State ---
    let score = 0;
    let timeLeft = GAME_DURATION_SECONDS;
    let timerInterval = null;
    let leaderboard = [];

    // --- Functions ---

    // Function to switch active screen AND set initial focus (Keyboard Enhanced)
    function showScreen(screenToShow) {
        screens.forEach(screen => screen.classList.remove('active'));
        screenToShow.classList.add('active');

        // Find the first focusable element (button or input) in the new screen
        // Prioritize specific elements if needed (e.g., command input in game)
        let firstFocusableElement;
        if (screenToShow.id === 'game-screen') {
            firstFocusableElement = commandInput;
        } else if (screenToShow.id === 'game-over-screen') {
             firstFocusableElement = playerNameInput; // Focus name input first
        } else {
            // Find the first button or text input that is visible
            firstFocusableElement = screenToShow.querySelector('button, input[type="text"]');
        }

        // Use setTimeout to ensure the element is visible and focusable
        if (firstFocusableElement) {
            setTimeout(() => {
                try { // Add try-catch for robustness if element becomes hidden quickly
                     firstFocusableElement.focus();
                } catch (e) {
                    console.warn("Could not focus element:", firstFocusableElement, e);
                }
            }, 0); // Delay slightly to allow rendering
        }
    }

    // Load leaderboard from localStorage
    function loadLeaderboard() {
        try {
            const storedLeaderboard = localStorage.getItem(LEADERBOARD_KEY);
            if (storedLeaderboard) {
                leaderboard = JSON.parse(storedLeaderboard);
            } else {
                leaderboard = [];
            }
        } catch (e) {
            console.error("Could not load leaderboard from localStorage:", e);
            leaderboard = []; // Reset leaderboard if storage fails
        }
    }

    // Save leaderboard to localStorage
    function saveLeaderboard() {
         try {
            leaderboard.sort((a, b) => b.score - a.score); // Sort before saving
             localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
         } catch (e) {
            console.error("Could not save leaderboard to localStorage:", e);
         }
    }

    // Display the leaderboard
    function displayLeaderboard() {
        // Ensure leaderboard data is sorted (might have been loaded without sorting)
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboardList.innerHTML = ''; // Clear previous list

        if (leaderboard.length === 0) {
             leaderboardList.innerHTML = '<li>No scores yet!</li>';
        } else {
            leaderboard.slice(0, 10).forEach((entry, index) => { // Show top 10
                const li = document.createElement('li');
                // Pad score for alignment if desired, e.g., entry.score.toString().padStart(4, ' ')
                li.textContent = `${(index + 1).toString().padEnd(2, ' ')}. ${entry.name.padEnd(10, ' ')} - ${entry.score}`;
                leaderboardList.appendChild(li);
            });
        }
        showScreen(leaderboardScreen);
    }

    // Show the main menu
    function showMenu() {
        // Clear potential leftover game state visually if needed
        if (timerInterval) {
             clearInterval(timerInterval);
             timerInterval = null;
        }
        commandInput.disabled = false; // Ensure input is enabled if returning from game over early
        showScreen(menuScreen);
    }

     // Show instructions and ready prompt
     function promptNewGame() {
        showScreen(instructionsScreen);
    }

    // Start the game timer
    function startTimer() {
        timeLeft = GAME_DURATION_SECONDS;
        timeLeftDisplay.textContent = timeLeft;
        // Clear any existing interval just in case
        if(timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            timeLeftDisplay.textContent = timeLeft;
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }

    // End the game
    function endGame() {
        clearInterval(timerInterval);
        timerInterval = null;
        commandInput.disabled = true;
        finalScoreDisplay.textContent = score;
        playerNameInput.value = ''; // Clear previous name
        showScreen(gameOverScreen);
        // Focus handled by showScreen now
    }

    // Reset game state for a new game
    function resetGame() {
        score = 0;
        timeLeft = GAME_DURATION_SECONDS;
        currentScoreDisplay.textContent = score;
        timeLeftDisplay.textContent = timeLeft;
        outputArea.innerHTML = ''; // Clear output
        commandInput.value = '';
        commandInput.disabled = false;
    }

    // Start a new game
    function startGame() {
        resetGame();
        showScreen(gameScreen); // This will now handle focus
        startTimer();
    }

     // Process the entered command
    function processCommand(commandText) {
        const trimmedCommand = commandText.trim().toLowerCase();
        if (trimmedCommand === '') return; // Ignore empty input

        let commandFound = false;
        const foundInEcosystems = [];

        // Check against the database
        for (const ecosystem in commandDatabase) {
            // Check if the entered command *starts with* any known command base
            // This allows commands like 'git commit -m "message"' to match 'git commit'
            if (commandDatabase[ecosystem].some(cmd => trimmedCommand.startsWith(cmd) && cmd.length > 0)) {
                 commandFound = true;
                 // Avoid adding duplicates if multiple commands match (e.g., 'ls' and 'ls -l' if both were listed)
                 if (!foundInEcosystems.includes(ecosystem)){
                     foundInEcosystems.push(ecosystem);
                 }
            }
        }

        // Display result in output area
        const entryDiv = document.createElement('div');
        entryDiv.classList.add('command-entry');

        const commandSpan = document.createElement('span');
        commandSpan.textContent = `> ${commandText}`; // Show original case
        entryDiv.appendChild(commandSpan);

        if (commandFound) {
            score++; // Award point
            currentScoreDisplay.textContent = score;
            foundInEcosystems.forEach(eco => {
                const ecoSpan = document.createElement('span');
                ecoSpan.classList.add('ecosystem-check');
                ecoSpan.textContent = `[${eco}] ✓`; // Indicate match
                entryDiv.appendChild(ecoSpan);
            });
        } else {
            const errorSpan = document.createElement('span');
            errorSpan.textContent = `[Command not recognized]`;
            errorSpan.style.color = '#ff6b6b'; // Reddish color for error
            entryDiv.appendChild(errorSpan);
        }

        outputArea.appendChild(entryDiv);
        // Auto-scroll to bottom only if the user isn't scrolled up
        if (outputArea.scrollHeight - outputArea.scrollTop <= outputArea.clientHeight + 50) { // Tolerance
             outputArea.scrollTop = outputArea.scrollHeight;
        }
    }

    // Handle command input submission (Specific listener for this input)
    function handleCommandInputSubmit(event) {
        if (event.key === 'Enter' && !commandInput.disabled) {
             event.preventDefault(); // Prevent any default action
            processCommand(commandInput.value);
            commandInput.value = ''; // Clear input field
        }
    }

    // Save score to leaderboard
    function submitScore() {
        const playerName = playerNameInput.value.trim().slice(0, 10) || 'Anonymous'; // Max 10 chars

        leaderboard.push({ name: playerName, score: score });
        saveLeaderboard(); // Saves and sorts
        displayLeaderboard(); // Displays sorted list
    }

    // --- Event Listeners ---

    // Button Clicks (still needed for mouse users and direct calls)
    newGameBtn.addEventListener('click', promptNewGame);
    leaderboardBtn.addEventListener('click', () => {
        loadLeaderboard(); // Ensure it's up-to-date
        displayLeaderboard();
    });
    readyYesBtn.addEventListener('click', startGame);
    readyNoBtn.addEventListener('click', showMenu);
    submitScoreBtn.addEventListener('click', submitScore);
    backToMenuBtn.addEventListener('click', showMenu); // From Game Over
    menuFromLeaderboardBtn.addEventListener('click', showMenu); // From Leaderboard

    // Specific listener for the command input field's Enter key
    commandInput.addEventListener('keydown', handleCommandInputSubmit);


    // --- Global Keyboard Listener for Navigation & Actions ---
    document.addEventListener('keydown', (event) => {
        const activeScreen = document.querySelector('.game-screen.active');
        if (!activeScreen) return; // Exit if no screen is active

        // Special handling ONLY if the event target is NOT the command input or player name input
        // These inputs have their own Enter key logic or specific handling below.
        const isTypingInput = event.target === commandInput || event.target === playerNameInput;

        const focusedElement = document.activeElement;

        // --- Enter Key Logic ---
        if (event.key === 'Enter') {
            // If a button is focused within the active screen, click it
            if (focusedElement && focusedElement.tagName === 'BUTTON' && activeScreen.contains(focusedElement)) {
                event.preventDefault(); // Prevent default button behavior
                focusedElement.click(); // Simulate click
            }
            // If the player name input is focused on Game Over screen, click Submit
            else if (focusedElement === playerNameInput && activeScreen.id === 'game-over-screen') {
                 event.preventDefault();
                 submitScoreBtn.click();
            }
            // Note: Command input Enter is handled by its own 'keydown' listener
        }

        // --- Escape Key Logic ---
        // Always allow Escape regardless of focus, unless typing command
        else if (event.key === 'Escape' && event.target !== commandInput) {
            event.preventDefault(); // Prevent potential browser default actions for Escape
            // Go back to menu from Leaderboard, Instructions, or Game Over
            if (activeScreen.id === 'leaderboard-screen' && menuFromLeaderboardBtn) {
                 menuFromLeaderboardBtn.click();
            } else if (activeScreen.id === 'instructions-screen' && readyNoBtn) {
                 readyNoBtn.click(); // This button goes back to the menu
            } else if (activeScreen.id === 'game-over-screen' && backToMenuBtn) {
                 backToMenuBtn.click();
            }
        }

        // --- Tab Key Logic (Focus Cycling) ---
        // Allow default Tab behavior unless specific trapping/wrapping is needed.
        // The commented-out code below is an example of manual focus trapping.
        
        else if (event.key === 'Tab') {
            // Only manage tab if focus is currently within the active screen
            if (activeScreen.contains(focusedElement)) {
                const focusableElements = Array.from(activeScreen.querySelectorAll('button, input[type="text"]'))
                                            .filter(el => el.offsetParent !== null && !el.disabled); // Get visible, enabled focusable elements

                if (focusableElements.length > 1) { // Only trap if more than one element
                    const currentIndex = focusableElements.indexOf(focusedElement);

                    let nextIndex;
                    if (event.shiftKey) { // Shift + Tab (Backwards)
                        nextIndex = (currentIndex <= 0) ? focusableElements.length - 1 : currentIndex - 1;
                    } else { // Tab (Forwards)
                        nextIndex = (currentIndex >= focusableElements.length - 1) ? 0 : currentIndex + 1;
                    }

                    event.preventDefault(); // Prevent default tab behavior
                    focusableElements[nextIndex].focus();
                } else if (focusableElements.length === 1) {
                     event.preventDefault(); // Prevent tabbing away if only one element
                }
            }
        }
        
    });


    // --- Initialization ---
    function init() {
        // Show title briefly, then menu
        showScreen(titleScreen);
        loadLeaderboard(); // Load existing scores on startup
        setTimeout(() => {
            showMenu(); // showScreen within showMenu handles initial focus
        }, 2500); // Show title for 2.5 seconds
    }

    init(); // Start the game setup
});