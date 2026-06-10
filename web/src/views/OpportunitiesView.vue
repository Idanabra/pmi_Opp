<template>
  <!-- Toast shelf -->
  <div class="toast-shelf">
    <TransitionGroup name="toast">
      <div
        v-for="t in toasts"
        :key="t.id"
        :class="['toast', t.type]"
      >
        <span class="toast-icon">{{ TOAST_ICONS[t.type] }}</span>
        <div class="toast-body">
          <div class="toast-title">{{ t.title }}</div>
          <div v-if="t.msg" class="toast-msg">{{ t.msg }}</div>
        </div>
        <button class="toast-close" @click="removeToast(t.id)">&times;</button>
      </div>
    </TransitionGroup>
  </div>

  <!-- Settings Dialog -->
  <div
    class="dialog-overlay"
    :class="{ open: settingsOpen }"
    @click.self="closeSettings"
  >
    <div class="dialog" role="dialog" aria-modal="true" aria-labelledby="dlgTitle">
      <div class="dialog-header">
        <div class="dialog-title" id="dlgTitle">
          <svg viewBox="0 0 24 24" style="width:1.125rem;height:1.125rem;fill:#0070F2;flex-shrink:0;">
            <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.92c.04-.34.07-.68.07-1.08s-.03-.75-.07-1.08l2.3-1.8c.22-.17.27-.46.13-.7l-2.18-3.78a.5.5 0 0 0-.61-.22l-2.72 1.1c-.56-.43-1.16-.79-1.84-1.07l-.41-2.9A.488.488 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.41 2.9c-.68.28-1.28.65-1.84 1.07l-2.72-1.1a.488.488 0 0 0-.61.22L1.74 9.29c-.14.24-.08.53.13.7l2.3 1.8c-.04.33-.07.67-.07 1.01s.03.75.07 1.08L1.87 15.7c-.22.17-.27.46-.13.7l2.18 3.78c.12.23.41.31.61.22l2.72-1.1c.56.43 1.16.79 1.84 1.07l.41 2.9c.04.24.25.43.5.43h4c.25 0 .46-.19.5-.43l.41-2.9c.68-.28 1.28-.64 1.84-1.07l2.72 1.1c.2.09.49.01.61-.22l2.18-3.78c.13-.24.07-.53-.13-.7l-2.3-1.8z"/>
          </svg>
          API Settings
        </div>
        <button class="dialog-close" @click="closeSettings" aria-label="Close">&times;</button>
      </div>

      <div class="dialog-body">
        <div class="dialog-section-title">Current User</div>
        <div class="dialog-fields">
          <div class="field">
            <label class="field-label" for="dlgMyUserId">My Technical User ID</label>
            <input
              class="field-input"
              id="dlgMyUserId"
              ref="myUserIdInput"
              type="text"
              v-model="dlgMyUserId"
              placeholder="e.g. fa0ea81a-2937-11f0-9845-..."
              autocomplete="off"
              spellcheck="false"
            />
            <div class="field-hint">Your SAP technical UUID — used as task owner &amp; organizer</div>
          </div>
        </div>
      </div>

      <div class="dialog-footer">
        <div class="dialog-footer-left"></div>
        <div class="dialog-footer-right">
          <button class="btn btn-ghost" @click="closeSettings">Cancel</button>
          <button class="btn btn-primary" @click="applySettings">
            <svg viewBox="0 0 24 24"><path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>
            Save &amp; Apply
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Page wrapper -->
  <div class="page">

    <!-- Contact Bar -->
    <div class="contact-bar">
      <span class="contact-bar-label">ID:</span>
      <span style="font-size:.875rem;color:#32363A;min-width:80px;">{{ accountDisplayId || '—' }}</span>
      <span style="width:1px;height:1.25rem;background:#D9D9D9;flex-shrink:0;"></span>
      <label class="contact-bar-label" for="globalContact">Primary contact</label>
      <select
        class="contact-select-global"
        id="globalContact"
        v-model="selectedContactId"
      >
        <option v-if="!contacts.length && loadingContacts" value="">— loading contacts… —</option>
        <option v-else-if="!contacts.length" value="">— no contacts found —</option>
        <option v-else value="">— select contact —</option>
        <option
          v-for="c in contacts"
          :key="c.id || c.contactPersonId"
          :value="c.id || c.contactPersonId"
          :data-name="c.contactFormattedName"
        >{{ c.contactFormattedName }}</option>
      </select>
    </div>

    <!-- Table Card -->
    <div class="table-card">

      <!-- Toolbar -->
      <div class="table-toolbar">
        <div class="toolbar-left">
          <span class="toolbar-title">Opportunities</span>
          <span v-if="opportunities.length" class="record-badge">{{ opportunities.length }}</span>
        </div>
        <div class="toolbar-right">
          <button class="btn btn-primary" id="saveBtn" :disabled="saving" @click="saveAndCreateTasks">
            <svg viewBox="0 0 24 24"><path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>
            Save
          </button>
          <button
            v-if="hasAnyNote"
            class="btn btn-ghost"
            style="padding:.4375rem .5rem;"
            title="Clear notes"
            aria-label="Clear notes"
            @click="clearAllNotes"
          >
            <svg viewBox="0 0 24 24" style="width:1rem;height:1rem;fill:currentColor;">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
          <button
            class="btn btn-ghost"
            style="padding:.4375rem .5rem;"
            title="Refresh"
            aria-label="Refresh"
            @click="loadAll"
          >
            <svg viewBox="0 0 24 24" style="width:1rem;height:1rem;fill:currentColor;">
              <path d="M17.65 6.35A7.96 7.96 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
          </button>
          <button
            class="btn btn-ghost"
            style="padding:.4375rem .5rem;position:relative;"
            title="API Settings"
            aria-label="Settings"
            @click="openSettings"
          >
            <svg viewBox="0 0 24 24" style="width:1rem;height:1rem;fill:currentColor;">
              <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.92c.04-.34.07-.68.07-1.08s-.03-.75-.07-1.08l2.3-1.8c.22-.17.27-.46.13-.7l-2.18-3.78a.5.5 0 0 0-.61-.22l-2.72 1.1c-.56-.43-1.16-.79-1.84-1.07l-.41-2.9A.488.488 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.41 2.9c-.68.28-1.28.65-1.84 1.07l-2.72-1.1a.488.488 0 0 0-.61.22L1.74 9.29c-.14.24-.08.53.13.7l2.3 1.8c-.04.33-.07.67-.07 1.01s.03.75.07 1.08L1.87 15.7c-.22.17-.27.46-.13.7l2.18 3.78c.12.23.41.31.61.22l2.72-1.1c.56.43 1.16.79 1.84 1.07l.41 2.9c.04.24.25.43.5.43h4c.25 0 .46-.19.5-.43l.41-2.9c.68-.28 1.28-.64 1.84-1.07l2.72 1.1c.2.09.49.01.61-.22l2.18-3.78c.13-.24.07-.53-.13-.7l-2.3-1.8z"/>
            </svg>
            <span
              v-if="!myUserId"
              style="position:absolute;top:.2rem;right:.2rem;width:.45rem;height:.45rem;border-radius:50%;background:#E9730C;"
            ></span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="state-box show">
        <div class="spinner"></div>
        <div class="state-sub">Loading opportunities…</div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && opportunities.length === 0 && hasLoaded" class="state-box show">
        <div class="state-icon">&#128203;</div>
        <div class="state-title">No Opportunities Found</div>
        <div class="state-sub">No opportunities are linked to this account.</div>
      </div>

      <!-- Initial State -->
      <div v-else-if="!loading && !hasLoaded" class="state-box show">
        <div class="state-icon">&#128269;</div>
        <div class="state-title">Ready to Load</div>
        <div class="state-sub">Configure the API connection and click <strong>Load Opportunities</strong>.</div>
      </div>

      <!-- Table -->
      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th style="width:120px;">Opp ID</th>
              <th style="width:220px;">Opportunity name</th>
              <th style="width:190px;">Sales phase</th>
              <th style="width:260px;">Last Note</th>
              <th style="width:46px;text-align:center;">Task</th>
              <th>Note</th>
              <th style="width:46px;text-align:center;">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="opp in opportunities" :key="getOppId(opp)" :data-opp-id="getOppId(opp)">
              <!-- Opp ID -->
              <td>
                <span
                  class="cell-id"
                  style="cursor:pointer;"
                  @click="openOpportunity(getOppId(opp))"
                >{{ getOppDisplayId(opp) }}</span>
              </td>
              <!-- Name -->
              <td><span class="cell-name">{{ opp.name || opp.subject || opp.Name || '—' }}</span></td>
              <!-- Phase -->
              <td>{{ opp.salesPhaseDescription || '—' }}</td>
              <!-- Last Note -->
              <td :id="'lastnote-' + getOppId(opp)">
                <div v-if="lastNotes[getOppId(opp)]" class="last-note-cell" :title="lastNotes[getOppId(opp)].text">
                  <div class="last-note-text">{{ lastNotes[getOppId(opp)].text }}</div>
                  <div v-if="lastNotes[getOppId(opp)].date" class="last-note-date">
                    {{ formatDate(lastNotes[getOppId(opp)].date) }}
                  </div>
                </div>
                <span v-else class="last-note-empty">—</span>
              </td>
              <!-- Task Toggle -->
              <td style="text-align:center;">
                <label class="toggle-switch sm" :aria-label="'Create task for ' + (opp.name || getOppId(opp))" title="Create task on save">
                  <input type="checkbox" v-model="taskToggles[getOppId(opp)]" />
                  <span class="toggle-track"><span class="toggle-thumb"></span></span>
                </label>
              </td>
              <!-- Note Input -->
              <td>
                <div class="note-wrap">
                  <textarea
                    class="note-input"
                    :class="{ 'has-value': noteValues[getOppId(opp)]?.trim().length > 0 }"
                    :id="'note-' + getOppId(opp)"
                    :data-opp-id="getOppId(opp)"
                    placeholder="Enter note…"
                    autocomplete="off"
                    rows="3"
                    :value="noteValues[getOppId(opp)] || ''"
                    @input="onNoteInput($event, getOppId(opp))"
                  ></textarea>
                  <button
                    class="mic-btn"
                    :class="{ recording: activeMicId === getOppId(opp) }"
                    :id="'mic-' + getOppId(opp)"
                    @click="toggleMic(getOppId(opp))"
                    title="Voice input"
                    aria-label="Start voice input"
                  >
                    <svg viewBox="0 0 24 24">
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1 1.93c-3.94-.49-7-3.85-7-7.93h2c0 3.31 2.69 6 6 6s6-2.69 6-6h2c0 4.08-3.06 7.44-7 7.93V22h-2v-4.07z"/>
                    </svg>
                  </button>
                </div>
              </td>
              <!-- Status Dot -->
              <td style="text-align:center;">
                <span
                  class="status-dot"
                  :class="rowStatuses[getOppId(opp)] || ''"
                  :title="rowStatuses[getOppId(opp)] || ''"
                ></span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div><!-- /table-card -->

  </div><!-- /page -->
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import {
  getAccountId,
  fetchOpportunities,
  fetchContacts,
  fetchAccountInfo,
  fetchCurrentUser,
  fetchHyperNotes,
  postNote,
  postTask
} from '../services/sapApi'

// ── Types ────────────────────────────────────────────────────────────────────
interface ToastItem {
  id: number
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  msg?: string
}

// ── Constants ────────────────────────────────────────────────────────────────
const TOAST_ICONS: Record<string, string> = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
  warning: '⚠️'
}

const LS_KEY = 'sap_opp_notes_cfg'

// ── State ────────────────────────────────────────────────────────────────────
const opportunities = ref<any[]>([])
const contacts = ref<any[]>([])
const loadingContacts = ref(false)
const accountOwner = ref<{ name: string; id: string } | null>(null)
const accountDisplayId = ref('')
const currentUser = ref<{ id: string; name: string } | null>(null)

const loading = ref(false)
const hasLoaded = ref(false)
const saving = ref(false)

const selectedContactId = ref('')
const noteValues = reactive<Record<string, string>>({})
const taskToggles = reactive<Record<string, boolean>>({})
const rowStatuses = reactive<Record<string, string>>({})
const lastNotes = reactive<Record<string, { text: string; date: string | null }>>({})

// Settings
const myUserId = ref('')
const settingsOpen = ref(false)
const dlgMyUserId = ref('')
const myUserIdInput = ref<HTMLInputElement | null>(null)

// Toast
const toasts = ref<ToastItem[]>([])
let toastCounter = 0

// Voice input
let activeRecognition: any = null
const activeMicId = ref<string | null>(null)

// ── Computed ─────────────────────────────────────────────────────────────────
const hasAnyNote = computed(() => {
  return Object.values(noteValues).some(v => v.trim().length > 0)
})

const selectedContactName = computed(() => {
  if (!selectedContactId.value) return ''
  const c = contacts.value.find(
    (c: any) => (c.id || c.contactPersonId) === selectedContactId.value
  )
  return c?.contactFormattedName || ''
})

// ── Config Persistence ───────────────────────────────────────────────────────
function loadStoredConfig() {
  try {
    const cfg = JSON.parse(localStorage.getItem(LS_KEY) || '{}')
    myUserId.value = cfg.myUserId || ''
  } catch (_) {}
}

function persistConfig() {
  try {
    const existing = JSON.parse(localStorage.getItem(LS_KEY) || '{}')
    existing.myUserId = myUserId.value
    localStorage.setItem(LS_KEY, JSON.stringify(existing))
  } catch (_) {}
}

// ── Settings Dialog ──────────────────────────────────────────────────────────
function openSettings() {
  dlgMyUserId.value = myUserId.value
  settingsOpen.value = true
  document.body.style.overflow = 'hidden'
  nextTick(() => {
    myUserIdInput.value?.focus()
  })
}

function closeSettings() {
  settingsOpen.value = false
  document.body.style.overflow = ''
}

function applySettings() {
  myUserId.value = dlgMyUserId.value.trim()
  persistConfig()
  closeSettings()
  toast('success', 'Settings Saved', 'API configuration updated and stored.')
  if (getAccountId()) loadAll()
}

// ── Toast ────────────────────────────────────────────────────────────────────
function toast(
  type: 'success' | 'error' | 'info' | 'warning',
  title: string,
  msg?: string,
  ms = 4500
) {
  const id = ++toastCounter
  toasts.value.unshift({ id, type, title, msg })
  if (ms > 0) setTimeout(() => removeToast(id), ms)
}

function removeToast(id: number) {
  const idx = toasts.value.findIndex(t => t.id === id)
  if (idx !== -1) toasts.value.splice(idx, 1)
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function getOppId(opp: any): string {
  return opp.id || opp.objectID || opp.OpportunityID || ''
}

function getOppDisplayId(opp: any): string {
  const id = getOppId(opp)
  return opp.displayId || opp.externalID || opp.ID || id
}

function formatDate(val: string | null): string {
  if (!val) return ''
  const d = new Date(val)
  if (isNaN(d.getTime())) return String(val)
  return (
    d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' +
    d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  )
}

function extractLastNote(opp: any): { text: string; date: string | null } | null {
  const raw = opp.hyperNotes?.value ?? opp.hyperNotes ?? []
  if (!Array.isArray(raw) || raw.length === 0) return null
  const best = raw.reduce((max: any, n: any) => {
    const t = new Date(n.adminData?.updatedOn ?? n.adminData?.createdOn ?? 0).getTime()
    const m = new Date(max.adminData?.updatedOn ?? max.adminData?.createdOn ?? 0).getTime()
    return t > m ? n : max
  }, raw[0])
  const text = best?.plainContent ?? null
  const date = best?.adminData?.updatedOn ?? best?.adminData?.createdOn ?? null
  return text ? { text, date } : null
}

// ── Load All ─────────────────────────────────────────────────────────────────
async function loadAll() {
  const accountId = getAccountId()
  if (!accountId) {
    openSettings()
    return
  }

  loading.value = true
  hasLoaded.value = false
  Object.keys(rowStatuses).forEach(k => delete rowStatuses[k])
  Object.keys(noteValues).forEach(k => delete noteValues[k])
  Object.keys(taskToggles).forEach(k => delete taskToggles[k])
  Object.keys(lastNotes).forEach(k => delete lastNotes[k])
  opportunities.value = []

  try {
    // Load opportunities first (required)
    const items = await fetchOpportunities(accountId)
    opportunities.value = items

    // Initialize per-row state
    items.forEach((opp: any) => {
      const id = getOppId(opp)
      taskToggles[id] = false  // default OFF
      noteValues[id] = ''
      // Seed last note from inline hyperNotes if present
      const ln = extractLastNote(opp)
      if (ln) lastNotes[id] = ln
    })

    hasLoaded.value = true

    // Load supporting data non-blocking
    loadContactsAsync(accountId)
    loadAccountInfoAsync(accountId)
    loadCurrentUserAsync()

    // Load notes async after render
    if (items.length > 0) {
      loadNotesAsync(items)
    }
  } catch (err: any) {
    hasLoaded.value = true
    toast('error', 'Failed to load opportunities', err.message, 7000)
  } finally {
    loading.value = false
  }
}

async function loadContactsAsync(accountId: string) {
  loadingContacts.value = true
  try {
    const data = await fetchContacts(accountId)
    contacts.value = data
  } catch (err: any) {
    console.warn('[Contacts] failed:', err.message)
    contacts.value = []
  } finally {
    loadingContacts.value = false
  }
}

async function loadAccountInfoAsync(accountId: string) {
  try {
    const data = await fetchAccountInfo(accountId)
    accountDisplayId.value = data.displayId
    accountOwner.value = data.owner
  } catch (err: any) {
    console.warn('[Account info] failed:', err.message)
  }
}

async function loadCurrentUserAsync() {
  // Prefer explicitly configured user ID
  if (myUserId.value) {
    currentUser.value = { id: myUserId.value, name: '' }
    // Try to get name from BFF /current-user (which proxies /users/me)
    try {
      const data = await fetchCurrentUser()
      currentUser.value = {
        id: myUserId.value,
        name: data?.displayName || data?.formattedName || data?.name || ''
      }
    } catch (_) {
      // name not critical
    }
    return
  }
  try {
    const data = await fetchCurrentUser()
    currentUser.value = {
      id: data?.id || data?.userId || data?.technicalId || '',
      name: data?.displayName || data?.formattedName || data?.name || ''
    }
  } catch (err: any) {
    console.warn('[CurrentUser] failed:', err.message)
    currentUser.value = { id: '', name: '' }
  }
}

// ── Notes Async ───────────────────────────────────────────────────────────────
async function loadNotesAsync(items: any[]) {
  const BATCH = 5
  for (let i = 0; i < items.length; i += BATCH) {
    await Promise.all(
      items.slice(i, i + BATCH).map(async (opp: any) => {
        const id = getOppId(opp)
        if (!id) return
        try {
          const notes = await fetchHyperNotes(id)
          if (!notes.length) return
          const best = notes.reduce((max: any, n: any) => {
            const t = new Date(n.adminData?.updatedOn ?? n.adminData?.createdOn ?? 0).getTime()
            const m = new Date(max.adminData?.updatedOn ?? max.adminData?.createdOn ?? 0).getTime()
            return t > m ? n : max
          }, notes[0])
          const text = best?.plainContent ?? null
          const date = best?.adminData?.updatedOn ?? best?.adminData?.createdOn ?? null
          if (text) lastNotes[id] = { text, date }
        } catch (_) {}
      })
    )
  }
}

// ── Note Input ────────────────────────────────────────────────────────────────
function onNoteInput(event: Event, oppId: string) {
  const target = event.target as HTMLTextAreaElement
  noteValues[oppId] = target.value
  if (target.value.trim().length > 0) {
    rowStatuses[oppId] = 'pending'
  } else {
    delete rowStatuses[oppId]
  }
}

function clearAllNotes() {
  opportunities.value.forEach((opp: any) => {
    const id = getOppId(opp)
    noteValues[id] = ''
    delete rowStatuses[id]
  })
}

// ── Voice Input ───────────────────────────────────────────────────────────────
function toggleMic(oppId: string) {
  const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  if (!SR) {
    toast('warning', 'Not Supported', 'Voice input requires Chrome or Edge browser.')
    return
  }

  if (activeRecognition) {
    activeRecognition.stop()
    if (activeMicId.value === oppId) {
      activeMicId.value = null
      activeRecognition = null
      return
    }
  }

  const recognition = new SR()
  recognition.lang = navigator.language || 'en-US'
  recognition.interimResults = true
  recognition.continuous = true

  activeRecognition = recognition
  activeMicId.value = oppId

  let baseText = (noteValues[oppId] || '').trimEnd()

  recognition.onresult = (event: any) => {
    let interim = ''
    let final = ''
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const t = event.results[i][0].transcript
      if (event.results[i].isFinal) final += t
      else interim += t
    }
    if (final) {
      baseText = (baseText + (baseText ? ' ' : '') + final.trim()).trimEnd()
    }
    const newVal = baseText + (interim ? (baseText ? ' ' : '') + interim : '')
    noteValues[oppId] = newVal
    if (newVal.trim().length > 0) {
      rowStatuses[oppId] = 'pending'
    }
  }

  recognition.onerror = (e: any) => {
    console.warn('Speech error:', e.error)
    if (activeMicId.value === oppId) {
      activeMicId.value = null
      activeRecognition = null
    }
  }

  recognition.onend = () => {
    if (activeMicId.value === oppId) {
      activeMicId.value = null
      activeRecognition = null
    }
  }

  recognition.start()
}

// ── Open Opportunity ──────────────────────────────────────────────────────────
function openOpportunity(objectKey: string) {
  window.parent.postMessage(
    {
      operation: 'navigation',
      params: {
        objectKey,
        routingKey: 'guidedselling',
        viewType: 'details'
      }
    },
    '*'
  )
}

// ── Save & Create Tasks ───────────────────────────────────────────────────────
async function saveAndCreateTasks() {
  const toProcess: Array<{ oppId: string; note: string }> = []
  opportunities.value.forEach((opp: any) => {
    const id = getOppId(opp)
    const note = noteValues[id]?.trim()
    if (note) toProcess.push({ oppId: id, note })
  })

  if (toProcess.length === 0) {
    toast('warning', 'No Notes Entered', 'Please enter at least one note before saving.')
    return
  }

  if (!selectedContactId.value) {
    toast('warning', 'Contact Required', 'Please select a primary contact person before saving.')
    document.getElementById('globalContact')?.focus()
    return
  }

  saving.value = true
  let done = 0
  let errors = 0
  const total = toProcess.length

  for (const { oppId, note } of toProcess) {
    const opp = opportunities.value.find((o: any) => getOppId(o) === oppId) || {}
    const oppName = opp.name || opp.subject || oppId
    const oppDisplayId = getOppDisplayId(opp)
    const oppAccountId = opp.account?.id || opp.accountId || ''
    const createTask = taskToggles[oppId] === true

    const now = new Date()
    const dateStr =
      now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
      ' ' +
      now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    // Append contact name at end of note
    const contactName = selectedContactName.value
    const oppNoteContent = contactName ? `${note}\n${contactName}` : note

    try {
      // Always write the opportunity note
      const noteNow = new Date().toISOString()
      const uid = currentUser.value?.id || ''
      const uname = currentUser.value?.name || ''
      const noteBody: any = {
        hostObjectId: oppId,
        hostObjectType: '72',
        plainContent: oppNoteContent,
        htmlContent: oppNoteContent.replace(/\n/g, '<br>'),
        noteTypeCode: 'S029'
      }
      if (uid) {
        noteBody.adminData = {
          createdBy: uid, createdByName: uname, createdOn: noteNow,
          updatedBy: uid, updatedByName: uname, updatedOn: noteNow
        }
      }
      await postNote(noteBody)

      // Create task only if toggle is on
      if (createTask) {
        try {
          await postTask(buildTask({ oppId, oppDisplayId, oppName, oppAccountId, contactId: selectedContactId.value, note, dateStr }))
        } catch (taskErr: any) {
          const isContactErr =
            taskErr.message?.includes('task.900') ||
            taskErr.response?.data?.error?.includes('task.900') ||
            taskErr.response?.data?.details?.includes?.('task.900') ||
            taskErr.message?.toLowerCase().includes('does not exist in master data')
          if (isContactErr && selectedContactId.value) {
            try {
              await postTask(buildTask({ oppId, oppDisplayId, oppName, oppAccountId, contactId: '', note, dateStr }))
            } catch (retryErr: any) {
              console.warn(`Task retry failed for ${oppId}:`, retryErr.message)
              toast('warning', `Note saved — Task failed (${oppId})`, retryErr.message, 7000)
            }
          } else {
            console.warn(`Task creation failed for ${oppId}:`, taskErr.message)
            toast('warning', `Note saved — Task failed (${oppId})`, taskErr.message, 7000)
          }
        }
      }

      rowStatuses[oppId] = 'saved'
      noteValues[oppId] = ''
      done++
    } catch (err: any) {
      rowStatuses[oppId] = 'error'
      toast('error', `Save Failed — Opp ${oppId}`, err.message, 7000)
      errors++
      done++
    }
  }

  // Create account summary note
  if (done - errors > 0) {
    try {
      const accountId = getAccountId()
      const lines = opportunities.value
        .map((opp: any) => {
          const name = opp.name || opp.subject || opp.id || ''
          const id = getOppId(opp)
          const ln = lastNotes[id]
          if (!ln?.text) return null
          const dateLabel = ln.date ? ` (${formatDate(ln.date)})` : ''
          return `${name}${dateLabel}:\n${ln.text}`
        })
        .filter(Boolean) as string[]

      if (accountId && lines.length) {
        const plain = lines.join('\n\n')
        const html = '<p>' + lines.map(l => l.replace(/\n/g, '<br>')).join('</p><p>') + '</p>'
        const nowIso = new Date().toISOString()
        const uid = currentUser.value?.id || ''
        const uname = currentUser.value?.name || ''
        const body: any = {
          hostObjectId: accountId,
          hostObjectType: '159',
          plainContent: plain,
          htmlContent: html,
          noteTypeCode: 'S006',
          adminData: {
            createdBy: uid, createdByName: uname, createdOn: nowIso,
            updatedBy: uid, updatedByName: uname, updatedOn: nowIso
          }
        }
        await postNote(body)
      }
    } catch (acctNoteErr: any) {
      console.warn('[Account note] failed:', acctNoteErr.message)
      toast('warning', 'Account Note Failed', acctNoteErr.message, 7000)
    }
  }

  saving.value = false

  if (errors === 0) {
    toast('success', 'Saved', `${total} note${total !== 1 ? 's' : ''} saved and linked to their opportunities.`)
  } else {
    toast('warning', 'Partially Completed', `${total - errors} saved, ${errors} failed.`, 7000)
  }

  if (done - errors > 0) {
    setTimeout(() => loadAll(), 1500)
  }
}

function buildTask(params: {
  oppId: string
  oppDisplayId: string
  oppName: string
  oppAccountId: string
  contactId: string
  note: string
  dateStr: string
}): any {
  const { oppId, oppDisplayId, oppName, oppAccountId, contactId, note } = params
  const now = new Date()
  const due = new Date()
  due.setDate(due.getDate() + 3)
  const datePart = now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })

  const task: any = {
    description: `[${oppName}  ${datePart}]`,
    status: 'OPEN',
    taskCategory: '0002',
    startDateTime: now.toISOString(),
    dueDateTime: due.toISOString(),
    notes: [{ content: note }],
    relatedObjects: [
      {
        objectId: oppId,
        displayId: oppDisplayId,
        type: '72',
        role: 'PREDECESSOR'
      }
    ]
  }

  if (oppAccountId) task.account = { id: oppAccountId }
  if (contactId) task.primaryContact = { id: contactId }
  if (currentUser.value?.id) {
    task.owner = { id: currentUser.value.id }
    task.organizer = { id: currentUser.value.id }
  }

  return task
}

// ── Keyboard Shortcuts ────────────────────────────────────────────────────────
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeSettings()
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(() => {
  loadStoredConfig()
  document.addEventListener('keydown', handleKeydown)

  if (getAccountId()) {
    loadAll()
  } else {
    openSettings()
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  if (activeRecognition) {
    activeRecognition.stop()
    activeRecognition = null
  }
})
</script>

<style scoped>
/* ── Design tokens ──────────────────────────────────────────────────────────── */
:root {
  --sap-blue:        #0070F2;
  --sap-blue-dark:   #0040B0;
  --sap-blue-hover:  #0057D2;
  --sap-blue-light:  #EBF5FE;
  --sap-blue-border: #B5D8F7;
  --sap-shell-bg:    #354A5E;
  --sap-gray-50:     #FAFAFA;
  --sap-gray-100:    #F5F5F5;
  --sap-gray-200:    #EDEDED;
  --sap-gray-300:    #D9D9D9;
  --sap-gray-400:    #C2C2C2;
  --sap-gray-600:    #8C8C8C;
  --sap-gray-700:    #6A6D70;
  --sap-gray-800:    #32363A;
  --sap-green:       #107E3E;
  --sap-red:         #BB0000;
  --sap-orange:      #E9730C;
  --font: "72", "72full", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --radius: 0.25rem;
  --shadow: 0 1px 3px rgba(0,0,0,.08);
}

/* ── Toast Shelf ────────────────────────────────────────────────────────────── */
.toast-shelf {
  position: fixed;
  top: .75rem;
  right: 1.25rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: .5rem;
  pointer-events: none;
}
.toast {
  background: #fff;
  border: 1px solid #D9D9D9;
  border-radius: .375rem;
  padding: .75rem 1rem;
  box-shadow: 0 4px 16px rgba(0,0,0,.14);
  display: flex;
  align-items: flex-start;
  gap: .625rem;
  min-width: 280px;
  max-width: 380px;
  pointer-events: all;
}
.toast.success { border-left: 4px solid #107E3E; }
.toast.error   { border-left: 4px solid #BB0000; }
.toast.info    { border-left: 4px solid #0070F2; }
.toast.warning { border-left: 4px solid #E9730C; }
.toast-icon  { font-size: 1.1rem; flex-shrink: 0; margin-top: .05rem; }
.toast-body  { flex: 1; }
.toast-title { font-size: .875rem; font-weight: 600; color: #32363A; }
.toast-msg   { font-size: .8125rem; color: #6A6D70; margin-top: .125rem; }
.toast-close {
  background: none; border: none; cursor: pointer;
  color: #8C8C8C; font-size: 1.125rem; line-height: 1;
  padding: 0; flex-shrink: 0;
}
.toast-close:hover { color: #32363A; }
.toast-enter-active { animation: toastIn .25s ease-out; }
.toast-leave-active { animation: toastIn .2s ease-in reverse; }
@keyframes toastIn {
  from { transform: translateX(110%); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
}

/* ── Settings Dialog ────────────────────────────────────────────────────────── */
.dialog-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.45);
  z-index: 500;
  align-items: center;
  justify-content: center;
  animation: fadeOverlay .2s ease;
}
.dialog-overlay.open { display: flex; }
@keyframes fadeOverlay { from { opacity: 0; } to { opacity: 1; } }
.dialog {
  background: #fff;
  border-radius: .375rem;
  box-shadow: 0 8px 32px rgba(0,0,0,.22);
  width: 100%;
  max-width: 520px;
  margin: 1rem;
  display: flex;
  flex-direction: column;
  animation: dialogIn .2s ease;
  max-height: calc(100vh - 2rem);
  overflow: hidden;
}
@keyframes dialogIn {
  from { transform: translateY(-1rem) scale(.98); opacity: 0; }
  to   { transform: translateY(0) scale(1); opacity: 1; }
}
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem .875rem;
  border-bottom: 1px solid #EDEDED;
  flex-shrink: 0;
}
.dialog-title {
  display: flex;
  align-items: center;
  gap: .625rem;
  font-size: 1rem;
  font-weight: 700;
  color: #32363A;
}
.dialog-close {
  width: 2rem; height: 2rem; border-radius: 50%;
  border: none; background: transparent; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #8C8C8C; font-size: 1.25rem; line-height: 1;
  transition: background .15s;
}
.dialog-close:hover { background: #EDEDED; color: #32363A; }
.dialog-body { padding: 1.25rem; overflow-y: auto; flex: 1; }
.dialog-section-title {
  font-size: .6875rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .07em; color: #8C8C8C; margin-bottom: .75rem;
  padding-bottom: .375rem; border-bottom: 1px solid #EDEDED;
}
.dialog-fields { display: flex; flex-direction: column; gap: .875rem; }
.dialog-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding: .875rem 1.25rem; border-top: 1px solid #EDEDED;
  gap: .75rem; flex-shrink: 0;
}
.dialog-footer-left { display: flex; gap: .5rem; }
.dialog-footer-right { display: flex; gap: .5rem; }

/* ── Form Elements ──────────────────────────────────────────────────────────── */
.field { display: flex; flex-direction: column; gap: .3rem; }
.field-label {
  font-size: .75rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .05em; color: #6A6D70;
}
.field-hint { font-size: .75rem; color: #8C8C8C; margin-top: .25rem; }
.field-input {
  border: 1px solid #D9D9D9; border-radius: .25rem;
  padding: .4375rem .625rem; font-size: .875rem;
  font-family: "72", -apple-system, sans-serif; color: #32363A;
  background: #fff; outline: none; width: 100%;
  transition: border-color .15s, box-shadow .15s;
}
.field-input:hover { border-color: #C2C2C2; }
.field-input:focus { border-color: #0070F2; box-shadow: 0 0 0 2px rgba(0,112,242,.15); }

/* ── Buttons ────────────────────────────────────────────────────────────────── */
.btn {
  display: inline-flex; align-items: center; gap: .375rem;
  padding: .4375rem .875rem; border-radius: .25rem;
  font-size: .875rem; font-family: "72", -apple-system, sans-serif;
  font-weight: 600; cursor: pointer; border: 1px solid transparent;
  transition: background .15s, border-color .15s, box-shadow .15s;
  white-space: nowrap;
}
.btn:disabled { opacity: .45; cursor: not-allowed; pointer-events: none; }
.btn svg { width: .875rem; height: .875rem; fill: currentColor; flex-shrink: 0; }
.btn-primary { background: #0070F2; color: #fff; border-color: #0070F2; }
.btn-primary:hover { background: #0057D2; border-color: #0057D2; }
.btn-ghost { background: transparent; color: #6A6D70; border-color: #D9D9D9; }
.btn-ghost:hover { background: #EDEDED; border-color: #C2C2C2; }

/* ── Page ───────────────────────────────────────────────────────────────────── */
.page {
  max-width: 1440px;
  margin: 0 auto;
  padding: 1rem 1.25rem 2rem;
  font-family: "72", "72full", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: .875rem;
  color: #32363A;
  background: #F5F5F5;
  min-height: 100vh;
}

/* ── Contact Bar ────────────────────────────────────────────────────────────── */
.contact-bar {
  background: #FAFAFA;
  border: 1px solid #D9D9D9;
  border-radius: .25rem;
  box-shadow: 0 1px 3px rgba(0,0,0,.08);
  margin-bottom: .5rem;
  padding: .5rem 1rem;
  display: flex;
  align-items: center;
  gap: .75rem;
}
.contact-bar-label {
  font-size: .8125rem; font-weight: 600; color: #6A6D70; white-space: nowrap;
}
.contact-select-global {
  border: 1px solid #D9D9D9; border-radius: .25rem;
  padding: .375rem .625rem; font-size: .875rem;
  font-family: "72", -apple-system, sans-serif;
  color: #32363A; background: #fff; outline: none;
  min-width: 260px; cursor: pointer;
  transition: border-color .15s, box-shadow .15s;
}
.contact-select-global:hover { border-color: #C2C2C2; }
.contact-select-global:focus { border-color: #0070F2; box-shadow: 0 0 0 2px rgba(0,112,242,.15); }

/* ── Table Card ─────────────────────────────────────────────────────────────── */
.table-card { border: 1px solid #D9D9D9; border-radius: .25rem; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
.table-toolbar {
  background: #fff; padding: .625rem 1rem;
  display: flex; align-items: center; justify-content: space-between;
  border-bottom: 1px solid #EDEDED; gap: .75rem;
}
.toolbar-left { display: flex; align-items: center; gap: .5rem; }
.toolbar-title { font-size: .9375rem; font-weight: 700; color: #32363A; }
.record-badge {
  background: #EDEDED; color: #6A6D70; border-radius: 1rem;
  padding: .1rem .5rem; font-size: .75rem; font-weight: 600;
}
.toolbar-right { display: flex; align-items: center; gap: .5rem; }

/* Table */
.table-wrap { background: #fff; overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: .875rem; }
thead th {
  background: #354A5E; color: #fff; font-size: .75rem; font-weight: 600;
  padding: .5rem .625rem; text-align: left;
  border-bottom: 2px solid rgba(255,255,255,.15);
  white-space: nowrap; position: sticky; top: 0; z-index: 2;
}
thead th:first-child { border-left: 3px solid transparent; }
tbody tr { border-bottom: 1px solid #EDEDED; transition: background .1s; }
tbody tr:last-child { border-bottom: none; }
tbody tr:hover { background: #F0F7FF; }
tbody tr:hover td:first-child { border-left-color: #0070F2; }
td { padding: .4rem .625rem; vertical-align: middle; color: #32363A; }
td:first-child { border-left: 3px solid transparent; transition: border-color .1s; }

/* Cell styles */
.cell-id {
  font-family: "72", -apple-system, sans-serif;
  font-size: .875rem; color: #32363A; font-weight: 400;
  white-space: nowrap; text-decoration: underline;
}
.cell-name { font-weight: 600; }
.last-note-cell { max-width: 320px; color: #6A6D70; font-size: .8125rem; cursor: help; }
.last-note-text {
  overflow: hidden; text-overflow: ellipsis;
  display: -webkit-box; -webkit-line-clamp: 4;
  -webkit-box-orient: vertical; white-space: normal; max-width: 300px;
}
.last-note-date { font-size: .7rem; color: #4fa8d5; margin-top: .15rem; }
.last-note-empty { color: #C2C2C2; font-style: italic; font-size: .8125rem; }

/* Note input */
.note-wrap { display: flex; align-items: flex-start; gap: .375rem; }
.note-input {
  border: 1px solid #D9D9D9; border-radius: .25rem;
  padding: .375rem .625rem; font-size: .875rem; resize: none;
  font-family: "72", -apple-system, sans-serif; color: #32363A;
  background: #fff; outline: none; width: 100%; min-width: 200px;
  transition: border-color .15s, box-shadow .15s, background .15s;
}
.note-input:hover { border-color: #C2C2C2; }
.note-input:focus { border-color: #0070F2; box-shadow: 0 0 0 2px rgba(0,112,242,.15); }
.note-input.has-value { border-color: #0070F2; background: #EBF5FE; }

/* Mic button */
.mic-btn {
  flex-shrink: 0; width: 1.875rem; height: 1.875rem; border-radius: 50%;
  border: 1px solid #D9D9D9; background: #fff; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background .15s, border-color .15s; padding: 0; margin-top: .125rem;
}
.mic-btn svg { width: .875rem; height: .875rem; fill: #8C8C8C; }
.mic-btn:hover { background: #F5F5F5; border-color: #C2C2C2; }
.mic-btn.recording { background: #BB0000; border-color: #BB0000; animation: pulse .9s ease infinite; }
.mic-btn.recording svg { fill: #fff; }
@keyframes pulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(187,0,0,.4); }
  50% { box-shadow: 0 0 0 5px rgba(187,0,0,0); }
}

/* Status dot */
.status-dot {
  width: .625rem; height: .625rem; border-radius: 50%;
  display: inline-block; background: #D9D9D9;
}
.status-dot.pending { background: #E9730C; }
.status-dot.saved   { background: #107E3E; }
.status-dot.error   { background: #BB0000; }

/* Toggle switch */
.toggle-switch { display: inline-flex; cursor: pointer; flex-shrink: 0; }
.toggle-switch input { display: none; }
.toggle-track {
  width: 2.75rem; height: 1.5rem; background: #C2C2C2;
  border-radius: 1rem; position: relative; transition: background .2s;
}
.toggle-thumb {
  position: absolute; top: .2rem; left: .2rem;
  width: 1.1rem; height: 1.1rem; border-radius: 50%;
  background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.25); transition: left .2s;
}
.toggle-switch input:checked + .toggle-track { background: #0070F2; }
.toggle-switch input:checked + .toggle-track .toggle-thumb { left: 1.45rem; }
.toggle-switch.sm .toggle-track { width: 2rem; height: 1.1rem; }
.toggle-switch.sm .toggle-thumb { width: .75rem; height: .75rem; top: .175rem; left: .175rem; }
.toggle-switch.sm input:checked + .toggle-track .toggle-thumb { left: 1.05rem; }

/* State boxes */
.state-box {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 3.5rem 1rem; background: #fff;
  gap: .875rem; color: #8C8C8C;
}
.spinner {
  width: 2rem; height: 2rem; border: 3px solid #D9D9D9;
  border-top-color: #0070F2; border-radius: 50%;
  animation: spin .8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.state-icon { font-size: 2.5rem; opacity: .35; }
.state-title { font-size: 1rem; font-weight: 600; color: #32363A; }
.state-sub { font-size: .875rem; }
</style>
