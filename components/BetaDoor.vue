<template>
  <div class="beta-door-overlay" :class="{ 'beta-door-overlay--started': started }">
    <!-- Fond sombre + léger effet matrix -->
    <div class="beta-door-bg">
      <div class="beta-door-matrix"></div>
    </div>

    <div class="beta-door-scene">
      <!-- Porte + caméra (zoom via CSS sur ce wrapper) -->
      <div class="beta-door-camera">
        <div class="beta-door-wrapper">
          <div class="door-frame">
            <div class="door" :class="{ 'door--anim': started }">
              <div class="door-panel">
                <div class="door-handle"></div>
              </div>
            </div>
          </div>

          <!-- Globe : tu mets ton propre composant ici -->
<div class="door-globe">
  <DeckGlobe class="real-globe" />
</div>

        </div>
      </div>

      <!-- Message final discret, en bas -->
      <p class="final-message">
        Bienvenue dans le cercle des premiers testeurs.<br />
        Merci pour votre soutien. Vous serez informé(e) dès le lancement.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DeckGlobe from '../components/DeckGlobe.vue'

const started = ref(false)

/**
 * Appelle cette méthode depuis le parent quand le formulaire est validé.
 * Exemple parent :
 * const door = ref<InstanceType<typeof BetaDoor> | null>(null)
 * door.value?.start()
 */
const start = () => {
  if (!started.value) {
    started.value = true
  }
}

defineExpose({ start })
</script>

<style scoped>
.beta-door-overlay {
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at top, #02121a 0, #01050a 40%, #000000 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.6s ease;
}

.beta-door-overlay--started {
  opacity: 1;
  pointer-events: auto;
}

/* Fond + matrix */
.beta-door-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.beta-door-matrix {
  position: absolute;
  inset: -200px 0 0 0;
  background: repeating-linear-gradient(
    to bottom,
    rgba(0, 255, 166, 0.2),
    rgba(0, 255, 166, 0.2) 2px,
    transparent 3px,
    transparent 7px
  );
  opacity: 0;
  filter: blur(0.7px);
  animation: matrixFade 1s ease forwards 1.4s,
    matrixMove 16s linear infinite 1.4s;
}

/* Scène principale */
.beta-door-scene {
  position: relative;
  width: min(420px, 100%);
  max-width: 100%;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  z-index: 1;
}

/* Caméra (zoom après ouverture) */
.beta-door-camera {
  width: 100%;
  display: flex;
  justify-content: center;
  perspective: 1200px;
}

/* Wrapper sur lequel on applique le zoom "caméra" */
.beta-door-overlay--started .beta-door-camera {
  animation: cameraEnter 1.3s ease-out forwards 0.9s;
}

.beta-door-wrapper {
  position: relative;
  width: 220px;
  max-width: 60vw;
  height: 360px;
}

/* Cadre de la porte */
.door-frame {
  position: absolute;
  inset: 0;
  margin: auto;
  padding: 10px;
  border-radius: 18px;
  background: radial-gradient(circle at top, #00ffa6 0, #02171c 35%, #000000 100%);
  box-shadow:
    0 0 18px rgba(0, 255, 166, 0.4),
    0 0 60px rgba(0, 215, 194, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Porte quasi réelle, couleurs Lyvero */
.door {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  transform-origin: left center;
  transform-style: preserve-3d;
  background: linear-gradient(
    180deg,
    #031d22 0%,
    #021a1f 35%,
    #020f14 65%,
    #03181f 100%
  );
  box-shadow:
    inset 0 0 0 1px rgba(0, 255, 166, 0.2),
    0 0 24px rgba(0, 255, 166, 0.25);
  position: relative;
  overflow: hidden;
}

/* Panneau + légère structure */
.door-panel {
  position: absolute;
  inset: 10%;
  border-radius: 8px;
  border: 1px solid rgba(0, 255, 166, 0.18);
  box-shadow:
    inset 0 0 12px rgba(0, 255, 166, 0.15),
    0 0 8px rgba(0, 0, 0, 0.8);
  background: radial-gradient(circle at top, rgba(0, 255, 166, 0.12), transparent 60%);
}

/* Poignée */
.door-handle {
  position: absolute;
  right: 13%;
  top: 50%;
  width: 42px;
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(90deg, #00ffa6, #00d7c2);
  box-shadow:
    0 0 10px rgba(0, 255, 166, 0.8),
    0 0 22px rgba(0, 215, 194, 0.6);
  transform-origin: right center;
}

/* Animation combinée : poignée → porte */
.door--anim .door-handle {
  animation: handleDown 0.35s ease-out forwards;
}

.door--anim {
  animation: doorOpen 0.9s ease-out forwards 0.25s;
}

/* Globe derrière la porte (vu quand elle s’ouvre) */
.door-globe {
  position: absolute;
  inset: auto 0 8px 0;
  display: flex;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  animation: globeAppear 1s ease forwards 0.8s;
}
.real-globe {
  width: 150px;
  height: 150px;
  pointer-events: none;
  opacity: 0;
  animation: realGlobeAppear 1s ease forwards 0.9s;
}

@keyframes realGlobeAppear {
  from { opacity: 0; transform: translateY(10px) scale(0.9); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}


/* Message final discret */
.final-message {
  font-size: 12px;
  text-align: center;
  color: #e2fdf7;
  opacity: 0;
  letter-spacing: 0.03em;
  line-height: 1.5;
  text-shadow: 0 0 6px rgba(0, 255, 166, 0.5);
  animation: messageFade 1.2s ease forwards 1.4s;
}

/* Animations */

/* Poignée qui se baisse */
@keyframes handleDown {
  0% {
    transform: rotateX(0deg);
  }
  100% {
    transform: rotateX(25deg);
  }
}

/* Porte qui s’ouvre vers l’intérieur */
@keyframes doorOpen {
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(-88deg);
  }
}

/* Caméra qui avance légèrement puis fade */
@keyframes cameraEnter {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.35);
  }
}

/* Matrix qui apparaît */
@keyframes matrixFade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0.4;
  }
}

/* Matrix qui “descend” lentement */
@keyframes matrixMove {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(220px);
  }
}

/* Globe qui apparaît */
@keyframes globeAppear {
  0% {
    opacity: 0;
    transform: translateY(18px) scale(0.92);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Rotation lente du “noyau” du globe */
@keyframes globeSpin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Message discret qui apparaît en douceur */
@keyframes messageFade {
  0% {
    opacity: 0;
    transform: translateY(8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 480px) {
  .beta-door-wrapper {
    width: 190px;
    height: 320px;
  }

  .globe-placeholder {
    width: 120px;
    height: 120px;
  }

  .final-message {
    font-size: 11px;
    padding: 0 8px;
  }
}
</style>