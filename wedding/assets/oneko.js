// oneko.js: https://github.com/adryd325/oneko.js

(function oneko() {
  const isReducedMotion =
    window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
    window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

  if (isReducedMotion) return;

  const nekoEl = document.createElement("div");
  let nekoEl2 = document.createElement("div");

  let nekoPosX = 250;
  let nekoPosY = 40;

  let mousePosX = 0;
  let mousePosY = 0;

  let frameCount = 0;
  let idleTime = 0;
  let idleAnimation = null;
  let idleAnimationFrame = 0;

  const nekoSpeed = 10;

  // Add subtle motion randomization for more natural movement
  let wobbleOffset = { x: 0, y: 0 };
  let wobbleOffset2 = { x: 0, y: 0 };
  let wobbleTime = 0;

  // Dynamic separation between cats
  let neko2OffsetX = 5; // Start close
  const neko2OffsetXMoving = 30; // Distance when moving
  const neko2OffsetXIdle = 2; // Distance when idle
  const spriteSets = {
    idle: [[-3, -3]],
    alert: [[-7, -3]],
    scratchSelf: [
      [-5, 0],
      [-6, 0],
      [-7, 0],
    ],
    scratchWallN: [
      [0, 0],
      [0, -1],
    ],
    scratchWallS: [
      [-7, -1],
      [-6, -2],
    ],
    scratchWallE: [
      [-2, -2],
      [-2, -3],
    ],
    scratchWallW: [
      [-4, 0],
      [-4, -1],
    ],
    tired: [[-3, -2]],
    sleeping: [
      [-2, 0],
      [-2, -1],
    ],
    N: [
      [-1, -2],
      [-1, -3],
    ],
    NE: [
      [0, -2],
      [0, -3],
    ],
    E: [
      [-3, 0],
      [-3, -1],
    ],
    SE: [
      [-5, -1],
      [-5, -2],
    ],
    S: [
      [-6, -3],
      [-7, -2],
    ],
    SW: [
      [-5, -3],
      [-6, -1],
    ],
    W: [
      [-4, -2],
      [-4, -3],
    ],
    NW: [
      [-1, 0],
      [-1, -1],
    ],
  };

  // Create RPG-style speech bubble
  const speechBubble = document.createElement("div");
  speechBubble.id="speechBubble";
  speechBubble.textContent = "Tap anywhere";
  speechBubble.style.cssText = `
    position: fixed;
    font-family: 'Courier New', monospace;
    font-size: 10px;
    font-weight: bold;
    color: #000;
    background: #fff;
    padding: 2px 5px;
    box-shadow: rgb(0, 0, 0) 4px 4px 0px;
    border-radius: 0;
    pointer-events: none;
    z-index: 10001;
    opacity: 0;
    transition: opacity 0.3s ease;
    white-space: nowrap;
    image-rendering: pixelated;
  `;

  // Add arrow/pointer style
  const bubbleStyle = document.createElement('style');
  bubbleStyle.textContent = `
    #speechBubble::before {
      content: '';
      position: absolute;
      top: -6px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-bottom: 6px solid #000;
    }
    #speechBubble::after {
      content: '';
      position: absolute;
      top: -3px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-bottom: 4px solid #fff;
    }
  `;
  document.head.appendChild(bubbleStyle);
  
  let bubbleVisible = false;

  window.bubbleShownCount = 0;
  function hideSpeechBubble() {
    speechBubble.style.opacity = '0';
    bubbleVisible = false;
  }

  function showSpeechBubble() {
    if (!bubbleVisible) {
      speechBubble.style.opacity = '1';
      window.bubbleShownCount++;
      if(window.bubbleShownCount % 2 == 0){
        speechBubble.textContent = "Keep tapping to hear us meow!";
      } else {
        speechBubble.textContent = "Tap anywhere (volume up)";
      }
      bubbleVisible = true;
      setTimeout(hideSpeechBubble, 2000);
    }
  }
  function updateSpeechBubblePosition() {
    if (bubbleVisible) {
      // Position below the first cat
      speechBubble.style.left = `${nekoPosX - 12}px`;
      speechBubble.style.top = `${nekoPosY + 40}px`;
    }
  }

  function init() {
    nekoEl.id = "oneko";
    nekoEl.ariaHidden = true;
    nekoEl.style.width = "32px";
    nekoEl.style.height = "32px";
    nekoEl.style.position = "fixed";
    nekoEl.style.zIndex = 10000;
    nekoEl.style.pointerEvents = "auto";
    nekoEl.style.imageRendering = "pixelated";
    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
    nekoEl.style.zIndex = 10000;
    nekoEl.style.cursor = "pointer";

    let nekoFile = "./assets/oneko.gif";
    let nekoFile2 = "./assets/oneko-black.gif";
    const curScript = document.currentScript;
    if (curScript && curScript.dataset.cat) {
      nekoFile = curScript.dataset.cat;
    }
    nekoEl.style.backgroundImage = `url(${nekoFile})`;
    nekoEl.style.transform = `scale(1.6)`;
    nekoEl2 = nekoEl.cloneNode(true);
    nekoEl2.id = "neko2";
    nekoEl2.style.zIndex = nekoEl.style.zIndex - 1;
    // Use the inverted black sprite for nekoEl2
    nekoEl2.style.backgroundImage = `url(${nekoFile2})`;

    document.body.appendChild(nekoEl);
    document.body.appendChild(nekoEl2);
    document.body.appendChild(speechBubble);

    document.addEventListener("mousemove", function (event) {
      mousePosX = event.clientX;
      mousePosY = event.clientY;
      hideSpeechBubble();
    });

    window.requestAnimationFrame(onAnimationFrame);
  }

  let lastFrameTimestamp;

  function onAnimationFrame(timestamp) {
    // Stops execution if the neko element is removed from DOM
    if (!nekoEl.isConnected) {
      return;
    }
    if (!lastFrameTimestamp) {
      lastFrameTimestamp = timestamp;
    }
    if (timestamp - lastFrameTimestamp > 100) {
      lastFrameTimestamp = timestamp;
      frame();
    }
    window.requestAnimationFrame(onAnimationFrame);
  }

  function setSprite(name, frame) {
    const sprite = spriteSets[name][frame % spriteSets[name].length];
    nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
    nekoEl2.style.backgroundPosition = `${sprite[0] * 32}px ${
      sprite[1] * 32
    }px`;
  }

  function resetIdleAnimation() {
    idleAnimation = null;
    idleAnimationFrame = 0;
  }

  function idle() {
    idleTime += 1;

    // Show speech bubble once after being idle for a while
    if (idleTime > 7 && window.bubbleShownCount < 3) {
      showSpeechBubble();
      updateSpeechBubblePosition();
    }

    // every ~ 10 seconds
    if (
      idleTime > 10 &&
      Math.floor(Math.random() * 100) == 0 &&
      idleAnimation == null
    ) {
      let avalibleIdleAnimations = ["scratchSelf", "sleeping"];
      if (nekoPosX < 150) {
        avalibleIdleAnimations.push("scratchWallW");
      }
      if (nekoPosY < 150) {
        avalibleIdleAnimations.push("scratchWallN");
      }
      if (nekoPosX > window.innerWidth - 150) {
        avalibleIdleAnimations.push("scratchWallE");
      }
      if (nekoPosY > window.innerHeight - 150) {
        avalibleIdleAnimations.push("scratchWallS");
      }
      idleAnimation =
        avalibleIdleAnimations[
          Math.floor(Math.random() * avalibleIdleAnimations.length)
        ];
    }

    switch (idleAnimation) {
      case "sleeping":
        if (idleAnimationFrame < 8) {
          setSprite("tired", 0);
          break;
        }
        setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
        if (idleAnimationFrame > 192) {
          resetIdleAnimation();
        }
        break;
      case "scratchWallN":
      case "scratchWallS":
      case "scratchWallE":
      case "scratchWallW":
      case "scratchSelf":
        setSprite(idleAnimation, idleAnimationFrame);
        if (idleAnimationFrame > 9) {
          resetIdleAnimation();
        }
        break;
      default:
        setSprite("idle", 0);
        return;
    }
    idleAnimationFrame += 1;
  }

  function explodeHearts() {
    const parent = nekoEl.parentElement;
    const rect = nekoEl.getBoundingClientRect();
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const centerX = rect.left + rect.width + scrollLeft;
    const centerY = rect.top + rect.height / 2 + scrollTop;

    for (let i = 0; i < 10; i++) {
      const heart = document.createElement("div");
      heart.className = "heart";
      heart.textContent = "❤";
      const offsetX = (Math.random() - 0.5) * 50;
      const offsetY = (Math.random() - 0.5) * 50;
      heart.style.left = `${centerX + offsetX - 16}px`;
      heart.style.top = `${centerY + offsetY - 16}px`;
      heart.style.transform = `translate(-50%, -50%) rotate(${
        Math.random() * 360
      }deg)`;
      parent.appendChild(heart);

      setTimeout(() => {
        parent.removeChild(heart);
      }, 1000);
    }
  }

  const style = document.createElement("style");
  style.innerHTML = `
		  @keyframes heartBurst {
			  0% { transform: scale(0); opacity: 1; }
			  100% { transform: scale(1); opacity: 0; }
		  }
		  .heart {
			  position: absolute;
			  font-size: 2em;
			  animation: heartBurst 1s ease-out;
			  animation-fill-mode: forwards;
			  color: #ab9df2;
		  }
	  `;

  document.head.appendChild(style);
  window.nekoTaps = 3;
  // When neko is clicked, explode hearts AND play Romeo's meow!
  nekoEl.addEventListener("click", function () {
    window.nekoTaps--;
    // Trigger Romeo's meow if the function is available
    if (window.nekoTaps < 0 && typeof window.playRomeoMeow === "function") {
      explodeHearts();
      window.playRomeoMeow();
    } else {
      console.log("playRomeoMeow not available yet");
    }
  });

  // Also make the second cat clickable
  nekoEl2.addEventListener("click", function () {
    window.nekoTaps--;
    // Trigger Romeo's meow if the function is available
    if (window.nekoTaps < 0 && typeof window.playRomeoMeow === "function") {
      explodeHearts();
      window.playRomeoMeow();
    } else {
      console.log("playRomeoMeow not available yet");
    }
  });

  function frame() {
    frameCount += 1;

    const diffX = nekoPosX - mousePosX;
    const diffY = nekoPosY - mousePosY;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

    if (distance < nekoSpeed || distance < 48) {
      // When idle, gradually dampen the wobble to zero
      wobbleOffset.x *= 0.85;
      wobbleOffset.y *= 0.85;
      wobbleOffset2.x *= 0.85;
      wobbleOffset2.y *= 0.85;

      // Smoothly bring cats closer together when idle
      neko2OffsetX += (neko2OffsetXIdle - neko2OffsetX) * 0.15;

      idle();
      return;
    }

    idleAnimation = null;
    idleAnimationFrame = 0;

    if (idleTime > 1) {
      // Still dampening wobble while alerted
      wobbleOffset.x *= 0.85;
      wobbleOffset.y *= 0.85;
      wobbleOffset2.x *= 0.85;
      wobbleOffset2.y *= 0.85;

      // Also bring cats closer while alert
      neko2OffsetX += (neko2OffsetXIdle - neko2OffsetX) * 0.15;

      setSprite("alert", 0);
      // count down after being alerted before moving
      idleTime = Math.min(idleTime, 7);
      idleTime -= 1;
      return;
    }

    // Only update wobble when actually moving
    wobbleTime += 1;

    // Smoothly increase distance when moving
    neko2OffsetX += (neko2OffsetXMoving - neko2OffsetX) * 0.15;
    const wobbleStrength = 5;
    const wobbleStrengthY = 1; // Much less Y wobble to avoid rabbit-like hopping
    const wobbleSpeed = 0.35;
    wobbleOffset.x = Math.sin(wobbleTime * wobbleSpeed) * wobbleStrength;
    wobbleOffset.y = Math.cos(wobbleTime * wobbleSpeed * 0.8) * wobbleStrengthY;

    // Second cat has slightly different wobble pattern
    wobbleOffset2.x =
      Math.sin(wobbleTime * wobbleSpeed * 1.1 + 1) * wobbleStrength * 1.2;
    wobbleOffset2.y =
      Math.cos(wobbleTime * wobbleSpeed * 0.9 + 0.5) * wobbleStrengthY * 1.2;

    let direction;
    direction = diffY / distance > 0.5 ? "N" : "";
    direction += diffY / distance < -0.5 ? "S" : "";
    direction += diffX / distance > 0.5 ? "W" : "";
    direction += diffX / distance < -0.5 ? "E" : "";
    setSprite(direction, frameCount);

    nekoPosX -= (diffX / distance) * nekoSpeed;
    nekoPosY -= (diffY / distance) * nekoSpeed;

    nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
    nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);

    // Apply positions with natural wobble for both cats
    nekoEl.style.left = `${nekoPosX - 6 + wobbleOffset.x}px`;
    nekoEl.style.top = `${nekoPosY - 2 + wobbleOffset.y}px`;
    nekoEl2.style.left = `${nekoPosX + neko2OffsetX + wobbleOffset2.x}px`;
    nekoEl2.style.top = `${nekoPosY + 1 + wobbleOffset2.y}px`;
  }

  init();
})();
