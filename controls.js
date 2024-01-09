class Controls {
  constructor(controlType) {
    this.forward = false;
    this.right = false;
    this.backward = false;
    this.left = false;
    this.isBoosting = false;

    if (controlType === "Manual") {
      this.#addKeyboardListeners();
    } else {
      this.forward = true;
    }
  }

  #addKeyboardListeners() {
    const keysPressed = [];

    window.addEventListener("keydown", (e) => {
      if (keysPressed.includes(e.key)) return;

      keysPressed.push(e.key);

      this.#processKeysPressed(keysPressed);
    });

    window.addEventListener("keyup", (e) => {
      if (!keysPressed.includes(e.key)) return;

      const index = keysPressed.indexOf(e.key);

      keysPressed.splice(index, 1);

      this.#processKeysPressed(keysPressed);
    });
  }

  #processKeysPressed(keysPressed) {
    this.forward = keysPressed.includes(KEYS.ARROW_UP);
    this.right = keysPressed.includes(KEYS.ARROW_RIGHT);
    this.backward = keysPressed.includes(KEYS.ARROW_DOWN);
    this.left = keysPressed.includes(KEYS.ARROW_LEFT);
    this.isBoosting = keysPressed.includes(KEYS.SHIFT);
  }
}

const KEYS = {
  ARROW_UP: "ArrowUp",
  ARROW_RIGHT: "ArrowRight",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  SHIFT: "Shift",
};
