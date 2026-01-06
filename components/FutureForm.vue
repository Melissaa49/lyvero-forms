<template>
  <div class="ff-wrap">

    <!-- 0 — INTRO -->
    <div v-if="step === 0" class="ff-intro">
      <div class="ff-intro-globe-wrap">
        <DeckGlobe class="ff-intro-globe" />
      </div>

      <h1 class="ff-intro-title">Bienvenue dans la communauté Lyvero</h1>
      <p class="ff-intro-sub">
        Ici, les réseaux ne volent pas votre attention.<br />
        Ils élèvent vos connaissances.
      </p>

      <button class="ff-btn-primary" @click="step = 1">
        Commencer
      </button>
    </div>

    <!-- FORMULAIRE -->
    <div v-else class="ff-card">
      <header class="ff-head">
        <span class="ff-pill">Bêta privée Lyvero</span>
        <h1 class="ff-title">Construisons ensemble un réseau utile</h1>

        <div class="ff-progress">
          <div class="ff-progress-bar">
            <div class="ff-progress-bar-fill" :style="{ width: progress + '%' }" />
          </div>
          <span class="ff-progress-label">Étape {{ step }} / {{ totalSteps }}</span>
        </div>
      </header>

      <transition name="ff-slidefade" mode="out-in">
        <div :key="step" class="ff-step">

          <!-- 1 — PAYS -->
          <div v-if="step === 1">
            <h2>Dans quel pays vivez-vous ?</h2>
            <input v-model.trim="country" class="ff-input" />
            <button class="ff-btn-primary" :disabled="!country" @click="next">Continuer</button>
          </div>

          <!-- 2 — LANGUE -->
          <div v-else-if="step === 2">
            <h2>Quelle est votre langue maternelle ?</h2>
            <input v-model.trim="language" class="ff-input" />
            <button class="ff-btn-primary" :disabled="!language" @click="next">Continuer</button>
          </div>

          <!-- 3 — CRÉATEURS ÉTRANGERS -->
          <div v-else-if="step === 3">
            <h2>Regardez-vous des créateurs étrangers ?</h2>

            <div class="ff-choices ff-choices--inline">
              <button class="ff-choice" :class="{ 'ff-choice--active': foreignCreators === 'oui' }"
                @click="foreignCreators = 'oui'">Oui</button>

              <button class="ff-choice" :class="{ 'ff-choice--active': foreignCreators === 'rarement' }"
                @click="foreignCreators = 'rarement'">Rarement</button>

              <button class="ff-choice" :class="{ 'ff-choice--active': foreignCreators === 'non' }"
                @click="foreignCreators = 'non'">Non</button>
            </div>

            <button class="ff-btn-primary" :disabled="!foreignCreators" @click="next">
              Continuer
            </button>
          </div>

          <!-- 4 — FREINS (si rarement / non) -->
          <div v-else-if="step === 4 && (foreignCreators === 'rarement' || foreignCreators === 'non')">
            <h2>Qu’est-ce qui vous freine ?</h2>

            <div class="ff-choices">
              <button class="ff-choice"
                :class="{ 'ff-choice--active': reasonForeignChoice === 'langue' }"
                @click="reasonForeignChoice = 'langue'">
                La langue
              </button>

              <button class="ff-choice"
                :class="{ 'ff-choice--active': reasonForeignChoice === 'complexite' }"
                @click="reasonForeignChoice = 'complexite'">
                Trop complexe
              </button>

              <button class="ff-choice"
                :class="{ 'ff-choice--active': reasonForeignChoice === 'offre' }"
                @click="reasonForeignChoice = 'offre'">
                Manque de créateurs
              </button>

              <button class="ff-choice"
                :class="{ 'ff-choice--active': reasonForeignChoice === 'interet' }"
                @click="reasonForeignChoice = 'interet'">
                Pas intéressé
              </button>
            </div>

            <textarea
              v-model.trim="reasonForeignComment"
              class="ff-textarea"
              placeholder="Vous pouvez préciser (facultatif)"
            />

            <button class="ff-btn-primary" :disabled="!reasonForeignChoice" @click="next">
              Continuer
            </button>
          </div>

          <!-- 4bis — SI OUI -->
          <div v-else-if="step === 4 && foreignCreators === 'oui'">
            <h2>Aimeriez-vous les comprendre instantanément ?</h2>

            <div class="ff-choices ff-choices--inline">
              <button class="ff-choice"
                :class="{ 'ff-choice--active': wish === 'oui' }"
                @click="wish = 'oui'">Oui</button>

              <button class="ff-choice"
                :class="{ 'ff-choice--active': wish === 'non' }"
                @click="wish = 'non'">Non</button>
            </div>

            <button class="ff-btn-primary" :disabled="!wish" @click="next">
  Continuer
</button> 

          </div>

          <!-- 5 — POURQUOI PAS -->
          <div v-else-if="step === 5 && wish === 'non'">
            <h2>Pourquoi ce n’est pas une priorité ?</h2>

            <textarea
              v-model.trim="reasonWish"
              class="ff-textarea"
              placeholder="Expliquez en quelques mots…"
            />

            <button class="ff-btn-primary" @click="next">
              Continuer
            </button>
          </div>

          <!-- 6 — RÉSEAU -->
          <div v-else-if="step === 6">
            <h2>Quel réseau utilisez-vous le plus ?</h2>

            <div class="ff-choices">
              <button class="ff-choice"
                :class="{ 'ff-choice--active': favorite === 'TikTok' }"
                @click="favorite = 'TikTok'">TikTok</button>

              <button class="ff-choice"
                :class="{ 'ff-choice--active': favorite === 'Instagram' }"
                @click="favorite = 'Instagram'">Instagram</button>

              <button class="ff-choice"
                :class="{ 'ff-choice--active': favorite === 'YouTube' }"
                @click="favorite = 'YouTube'">YouTube</button>

              <button class="ff-choice"
                :class="{ 'ff-choice--active': favorite === 'Facebook' }"
                @click="favorite = 'Facebook'">Facebook</button>
            </div>

            <textarea v-model.trim="favoriteWhy" class="ff-textarea" />

            <button class="ff-btn-primary" :disabled="!favorite" @click="next">
              Continuer
            </button>
          </div>

          <!-- 7 — MANQUES -->
          <div v-else-if="step === 7">
            <h2>Qu’est-ce qui manque le plus aux réseaux ?</h2>

            <div class="ff-choices">
              <button class="ff-choice"
                :class="{ 'ff-choice--active': problem.includes('toxicite') }"
                @click="toggle(problem, 'toxicite')">
                Moins de toxicité
              </button>

              <button class="ff-choice"
                :class="{ 'ff-choice--active': problem.includes('visibilite') }"
                @click="toggle(problem, 'visibilite')">
                Meilleure visibilité
              </button>
            </div>

            <textarea v-model.trim="problemOther" class="ff-textarea" />

            <button class="ff-btn-primary" @click="next">
              Continuer
            </button>
          </div>

          <!-- 8 — BOOSTS -->
          <div v-else-if="step === 8">
            <h2>Avez-vous déjà utilisé des boosts ?</h2>

            <div class="ff-choices">
              <button class="ff-choice"
                :class="{ 'ff-choice--active': boost.includes('tiktok') }"
                @click="toggle(boost, 'tiktok')">TikTok</button>

              <button class="ff-choice"
                :class="{ 'ff-choice--active': boost.includes('instagram') }"
                @click="toggle(boost, 'instagram')">Instagram</button>
            </div>

            <textarea v-model.trim="boostWhy" class="ff-textarea" />

            <button class="ff-btn-primary" @click="next">
              Continuer
            </button>
          </div>

          <!-- 9 — OBJECTIF -->
          <div v-else-if="step === 9">
            <h2>Quel est votre objectif principal ?</h2>

            <div class="ff-choices">
              <button class="ff-choice"
                :class="{ 'ff-choice--active': goal === 'apprendre' }"
                @click="goal = 'apprendre'">Apprendre</button>

              <button class="ff-choice"
                :class="{ 'ff-choice--active': goal === 'creer' }"
                @click="goal = 'creer'">Créer du contenu</button>

              <button class="ff-choice"
                :class="{ 'ff-choice--active': goal === 'vendre' }"
                @click="goal = 'vendre'">Vendre</button>
            </div>

            <textarea v-model.trim="selfQuote" class="ff-textarea" />

            <button class="ff-btn-primary" :disabled="!goal" @click="next">
              Continuer
            </button>
          </div>

          <!-- 10 — BÊTA -->
          <div v-else-if="step === 10">
            <h2>Souhaitez-vous rejoindre la bêta privée ?</h2>

            <div class="ff-choices ff-choices--inline">
              <button class="ff-choice"
                :class="{ 'ff-choice--active': beta === 'oui' }"
                @click="beta = 'oui'">Oui</button>

              <button class="ff-choice"
                :class="{ 'ff-choice--active': beta === 'non' }"
                @click="beta = 'non'">Non</button>
            </div>

            <button class="ff-btn-primary" :disabled="!beta" @click="next">
              Continuer
            </button>
          </div>

          <!-- 11 — EMAIL / FIN -->
          <div v-else-if="step === 11 && beta === 'oui'">
            <h2>Où pouvons-nous vous écrire ?</h2>
            <input
  v-model.trim="email"
  class="ff-input"
  type="email"
  inputmode="email"
  autocapitalize="none"
  autocomplete="email"
  autocorrect="off"
  spellcheck="false"
/>

            <button class="ff-btn-primary" :disabled="!isValidEmail" @click="submit">
              Valider
            </button>
          </div>

          <div v-else-if="step === 11 && beta === 'non'">
            <h2>Merci 🙌</h2>
            <button class="ff-btn-primary" @click="submit">
              Terminer
            </button>
          </div>

        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import DeckGlobe from './DeckGlobe.vue'
import emailjs from '@emailjs/browser'
import { useRuntimeConfig } from 'nuxt/app'

const cfg = useRuntimeConfig()
emailjs.init(cfg.public.EMAILJS_PUBLIC)

const emit = defineEmits(['complete'])

const step = ref(0)
const totalSteps = 11

const country = ref('')
const language = ref('')
const foreignCreators = ref('')

const reasonForeignChoice = ref('')
const reasonForeignComment = ref('')

const wish = ref('')
const reasonWish = ref('')

const favorite = ref('')
const favoriteWhy = ref('')

const problem = ref<string[]>([])
const problemOther = ref('')

const boost = ref<string[]>([])
const boostWhy = ref('')

const goal = ref('')
const selfQuote = ref('')

const beta = ref('')
const email = ref('')

const progress = computed(() =>
  step.value === 0 ? 0 : (step.value / totalSteps) * 100
)

/**
 * Navigation intelligente (corrige le blocage)
 * - Step 4 sert à 2 écrans différents (freins OU wish)
 * - Step 5 n’existe QUE si wish === 'non'
 */
function next() {
  // Sécurité
  if (step.value >= totalSteps) return

  // STEP 3 -> STEP 4 (ok, c’est un step "pivot")
  if (step.value === 3) {
    step.value = 4
    return
  }

  // STEP 4 : cas "rarement / non" -> on saute directement à 6
  if (step.value === 4 && (foreignCreators.value === 'rarement' || foreignCreators.value === 'non')) {
    step.value = 6
    return
  }

  // STEP 4 : cas "oui" -> dépend de wish
  if (step.value === 4 && foreignCreators.value === 'oui') {
    if (wish.value === 'non') step.value = 5
    else if (wish.value === 'oui') step.value = 6
    else return // wish pas encore choisi
    return
  }

  // STEP 5 (pourquoi pas) -> STEP 6
  if (step.value === 5) {
    step.value = 6
    return
  }

  // Par défaut : avancer normalement
  step.value++
}

function toggle(arr: string[], value: string) {
  const i = arr.indexOf(value)
  i === -1 ? arr.push(value) : arr.splice(i, 1)
}

const isValidEmail = computed(() =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
)

async function submit() {
  try {
    await emailjs.send(
      cfg.public.EMAILJS_SERVICE,
      cfg.public.EMAILJS_TEMPLATE,
      {
        country: country.value,
        language: language.value,
        foreignCreators: foreignCreators.value,
        reasonForeignChoice: reasonForeignChoice.value,
        reasonForeignComment: reasonForeignComment.value,
        wish: wish.value,
        reasonWish: reasonWish.value,
        favorite: favorite.value,
        favoriteWhy: favoriteWhy.value,
        problem: problem.value.join(', '),
        problemOther: problemOther.value,
        boost: boost.value.join(', '),
        boostWhy: boostWhy.value,
        goal: goal.value,
        selfQuote: selfQuote.value,
        beta: beta.value,
        email: email.value || 'non fourni'
      }
    )
  } catch (e) {
    console.error('EmailJS error:', e)
  }
email.value = email.value.toLowerCase().trim()

  emit('complete')
}
</script>



<style scoped>
/* ========== GLOBAL WRAP ========== */
.ff-wrap {
  min-height: 100vh;
  padding: 22px 16px;
  background: radial-gradient(circle at top, #071d24 0%, #00080f 80%);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #eafff8;
}

/* ========== INTRO SCREEN ========== */
.ff-intro {
  text-align: center;
  max-width: 420px;
  width: 100%;
  padding: 20px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  animation: fadeIn 0.35s ease-out;
}

.ff-intro-globe-wrap {
  position: relative;
  width: 230px;
  aspect-ratio: 1 / 1;
  margin: 0 auto 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.ff-intro-globe-wrap::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 255, 200, 0.08), transparent 70%);
  border: 1px solid rgba(0, 255, 200, 0.15);
  animation: pulseGlow 1s infinite ease-in-out;
}

.ff-intro-globe {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

@keyframes pulseGlow {
  0% {
    opacity: 0.35;
    transform: scale(0.96);
  }
  50% {
    opacity: 0.95;
    transform: scale(1);
  }
  100% {
    opacity: 0.35;
    transform: scale(0.96);
  }
}

.ff-intro-title {
  font-size: 22px;
  font-weight: 600;
  margin: 4px 0 10px;
}

.ff-intro-sub {
  font-size: 14px;
  color: #aef3e0;
  line-height: 1.45;
  margin-bottom: 26px;
  max-width: 300px;
}

.ff-intro-btn {
  padding: 12px 26px;
}

/* ========== FORM CARD ========== */
.ff-card {
  background: rgba(4, 22, 28, 0.7);
  border: 1px solid rgba(0, 255, 180, 0.16);
  border-radius: 26px;
  padding: 28px 22px 36px;
  width: 100%;
  max-width: 420px;
  box-shadow:
    0 0 25px rgba(0, 255, 170, 0.12),
    inset 0 0 12px rgba(0, 255, 170, 0.08);
  backdrop-filter: blur(14px);
  animation: floatIn 0.45s ease-out;
  transform-origin: top center;
}

@keyframes floatIn {
  from {
    opacity: 0;
    transform: translateY(25px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ========== HEADER ========== */
.ff-head {
  margin-bottom: 22px;
}

.ff-pill {
  font-size: 12px;
  padding: 5px 12px;
  background: rgba(0, 255, 200, 0.15);
  border: 1px solid rgba(0, 255, 200, 0.35);
  border-radius: 999px;
  display: inline-block;
  margin-bottom: 8px;
}

.ff-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #00ffbf;
  text-shadow: 0 0 12px rgba(0, 255, 170, 0.45);
}

/* ========== PROGRESS BAR ========== */
.ff-progress {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ff-progress-bar {
  flex: 1;
  height: 5px;
  background: rgba(0, 255, 170, 0.15);
  border-radius: 999px;
  overflow: hidden;
  margin-right: 12px;
}

.ff-progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #00ffc0, #00ddff);
  border-radius: 999px;
  transition: width 0.35s ease;
}

.ff-progress-label {
  font-size: 13px;
  opacity: 0.8;
}

/* ========== TITLE OF STEP ========== */
h2 {
  font-size: 18px;
  margin: 12px 0 4px;
  color: #00ffc3;
}

/* Petit sous-texte (multi-sélection, etc.) */
.ff-hint {
  font-size: 12px;
  opacity: 0.7;
  margin-bottom: 8px;
}

/* ========== INPUTS ========== */
.ff-input {
  width: 100%;
  padding: 14px 16px;
  background: rgba(0, 40, 45, 0.85);
  border: 1px solid rgba(0, 255, 170, 0.35);
  border-radius: 14px;
  font-size: 15px;
  color: #eafff8;
  outline: none;
  transition: 0.25s;
}

.ff-input::placeholder {
  color: rgba(180, 230, 220, 0.7);
}

.ff-input:focus {
  border-color: #00ffd5;
  box-shadow: 0 0 10px rgba(0, 255, 180, 0.4);
}

/* ========== CHOICE BUTTONS ========== */
.ff-choices {
  display: grid;
  gap: 12px;
  margin-top: 10px;
}

.ff-choices--inline {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.ff-choice {
  padding: 12px 16px;
  border-radius: 14px;
  background: rgba(0, 255, 160, 0.09);
  border: 1px solid rgba(0, 255, 160, 0.25);
  color: #dffff6;
  font-size: 15px;
  transition: 0.18s ease;
  text-align: left;
}

.ff-choice:hover {
  background: rgba(0, 255, 190, 0.16);
  transform: translateY(-1px);
}

/* ÉTAT SÉLECTIONNÉ (multi + oui/non) */
.ff-choice--active {
  background: radial-gradient(circle at top, rgba(0, 255, 210, 0.35), rgba(0, 255, 160, 0.12));
  border-color: rgba(0, 255, 230, 0.85);
  box-shadow: 0 0 12px rgba(0, 255, 210, 0.45);
}

/* ========== PRIMARY BUTTON ========== */
.ff-btn-primary {
  margin-top: 12px;
  padding: 14px;
  background: linear-gradient(130deg, #00ffd5, #00aaff);
  border-radius: 16px;
  font-weight: 700;
  font-size: 15px;
  color: #001013;
  border: none;
  width: 100%;
  transition: 0.25s;
  box-shadow: 0 6px 22px rgba(0, 255, 210, 0.35);
}

.ff-btn-primary:hover:not(:disabled) {
  box-shadow: 0 8px 30px rgba(0, 255, 230, 0.55);
  transform: translateY(-2px);
}

.ff-btn-primary:disabled {
  opacity: 0.45;
  box-shadow: none;
}

/* ========== TEXTAREA ========== */
.ff-textarea {
  margin-top: 12px;
  padding: 12px 14px;
  min-height: 110px;
  background: rgba(0, 40, 45, 0.9);
  border: 1px solid rgba(0, 255, 170, 0.32);
  border-radius: 14px;
  font-size: 14px;
  color: #eafff8;
  outline: none;
  resize: vertical;
  transition: 0.25s;
}

.ff-textarea--small {
  min-height: 80px;
}

.ff-textarea::placeholder {
  color: rgba(175, 230, 220, 0.65);
}

.ff-textarea:focus {
  border-color: #00ffd5;
  box-shadow: 0 0 10px rgba(0, 255, 180, 0.4);
}

/* ========== STEP TRANSITION ========== */
.ff-step {
  animation: fadeStep 0.35s ease;
}

@keyframes fadeStep {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* SLIDE + FADE TRANSITION */
.ff-slidefade-enter-active,
.ff-slidefade-leave-active {
  transition: all 0.35s ease;
}

.ff-slidefade-enter-from {
  opacity: 0;
  transform: translateY(15px) scale(0.97);
}

.ff-slidefade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.97);
}
</style>

