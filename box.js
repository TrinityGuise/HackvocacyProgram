document.addEventListener("DOMContentLoaded", () => {
    let box = document.getElementById("movableBox");

    if (!box) {
        console.error("Error: 'movableBox' not found!");
        return;
    }

    console.log("✅ JavaScript found the box!");

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

        requestAnimationFrame(moveBox);
    }

    moveBox();
});