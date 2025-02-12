document.addEventListener("DOMContentLoaded", () => {
    let box = document.getElementById("movableBox");
    let image = document.getElementById("zulul");
    
    if (!image) {
    console.error("Error: 'targetImage' not found!");
    return;
}
    if (!box) {
        console.error("Error: 'movableBox' not found!");
        return;
    }

    console.log("✅ JavaScript found the box and the image!");

    let soundPaths = [
        "./Sound_Effects/bonk.mp3",
        "./Sound_Effects/cyka.mp3",
        "./Sound_Effects/dio.mp3",
        "./Sound_Effects/honk.mp3",
        "./Sound_Effects/steel.mp3"
    ];
    
    let soundQueue = [...soundPaths]; // Clone the array to shuffle
    shuffleArray(soundQueue); // Shuffle on start

    let currentSoundIndex = 0;
    let canPlaySound = false; // Prevent playing unless colliding

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    let isPlaying = false;

    function playNextSound() {
        if (isPlaying) return; // If already playing, exit
    
        if (currentSoundIndex >= soundQueue.length) {
            shuffleArray(soundQueue); // Shuffle again
            currentSoundIndex = 0;
        }
    
        let audio = new Audio(soundQueue[currentSoundIndex]);
        isPlaying = true; // 🔒 Lock playback
    
        audio.play();
        audio.onended = () => {
            isPlaying = false; // 🔓 Unlock after sound ends
        };
    
        currentSoundIndex++;
    }

    function checkCollision() {
        console.log("Checking collision...");
        let boxRect = box.getBoundingClientRect();
        let imageRect = image.getBoundingClientRect();

        return !(
            boxRect.right < imageRect.left ||
            boxRect.left > imageRect.right ||
            boxRect.bottom < imageRect.top ||
            boxRect.top > imageRect.bottom
        );
    }

    // Initial position
    let boxRect = box.getBoundingClientRect();
    let posX = boxRect.left;
    let posY = boxRect.top;
    let velX = 0, velY = 0;
    let accel = 0.2, maxSpeed = 5, friction = 0.1;
    let keys = {};

    // Set box position explicitly
    box.style.position = "absolute"; 
    box.style.left = `${posX}px`;
    box.style.top = `${posY}px`;

    document.addEventListener("keydown", (event) => {
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
            event.preventDefault();
            keys[event.key] = true;
        } 

        if (event.key === " " && canPlaySound) { // Spacebar
            playNextSound();
        }

        if (event.key === " ") {
            console.log("🔘 Spacebar pressed! Can play sound:", canPlaySound);
            if (canPlaySound) {
                playNextSound();
            }
        }
    });

    document.addEventListener("keyup", (event) => {
        if (keys[event.key]) {
            keys[event.key] = false;
        }
    });

    // ✅ Fix: Reset keys & stop movement when switching tabs
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            keys = {}; // Clears key states
            velX = 0;  
            velY = 0;  
        }
    });

    function moveBox() {
        if (keys["ArrowUp"]) velY = Math.max(velY - accel, -maxSpeed);
        if (keys["ArrowDown"]) velY = Math.min(velY + accel, maxSpeed);
        if (keys["ArrowLeft"]) velX = Math.max(velX - accel, -maxSpeed);
        if (keys["ArrowRight"]) velX = Math.min(velX + accel, maxSpeed);

        // Apply friction
        if (!keys["ArrowUp"] && !keys["ArrowDown"]) velY *= (1 - friction);
        if (!keys["ArrowLeft"] && !keys["ArrowRight"]) velX *= (1 - friction);

        posX += velX;
        posY += velY;

        posX = Math.max(0, Math.min(posX, window.innerWidth - box.offsetWidth));
        posY = Math.max(0, Math.min(posY, window.innerHeight - box.offsetHeight));

        box.style.left = `${posX}px`;
        box.style.top = `${posY}px`;

        if (checkCollision()) {
            image.classList.add("image-highlight");
            canPlaySound = true;
        } else {
            image.classList.remove("image-highlight");
            canPlaySound = false;
        }
        
        requestAnimationFrame(moveBox);
    }

    function playNextSound() {
        if (currentSoundIndex >= soundQueue.length) {
            shuffleArray(soundQueue); // Shuffle again
            currentSoundIndex = 0;
        }

        let audio = new Audio(soundQueue[currentSoundIndex]);
        audio.play();
        currentSoundIndex++;
    }

    moveBox();
});