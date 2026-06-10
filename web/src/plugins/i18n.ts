import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    app: {
      title: 'Opportunity Notes · SAP Sales Cloud'
    },
    opportunities: {
      title: 'Opportunities',
      noOpportunities: 'No Opportunities Found',
      noOpportunitiesDesc: 'No opportunities are linked to this account.',
      loading: 'Loading opportunities…',
      readyTitle: 'Ready to Load',
      readyDesc: 'Configure the API connection and click Load Opportunities.',
      columns: {
        id: 'Opp ID',
        name: 'Opportunity name',
        phase: 'Sales phase',
        lastNote: 'Last Note',
        task: 'Task',
        note: 'Note',
        status: 'Status'
      }
    },
    settings: {
      title: 'API Settings',
      myUserId: 'My Technical User ID',
      myUserIdHint: 'Your SAP technical UUID — used as task owner & organizer',
      save: 'Save & Apply',
      cancel: 'Cancel'
    },
    actions: {
      save: 'Save',
      clear: 'Clear notes',
      refresh: 'Refresh',
      settings: 'Settings'
    },
    contact: {
      id: 'ID:',
      primaryContact: 'Primary contact',
      loading: '— loading contacts… —',
      noContacts: '— no contacts found —',
      select: '— select contact —'
    },
    toast: {
      settingsSaved: 'Settings Saved',
      settingsSavedDesc: 'API configuration updated and stored.',
      noNotes: 'No Notes Entered',
      noNotesDesc: 'Please enter at least one note before saving.',
      contactRequired: 'Contact Required',
      contactRequiredDesc: 'Please select a primary contact person before saving.',
      saved: 'Saved',
      savedDesc: '{count} note saved and linked to their opportunities. | {count} notes saved and linked to their opportunities.',
      partialTitle: 'Partially Completed',
      voiceNotSupported: 'Not Supported',
      voiceNotSupportedDesc: 'Voice input requires Chrome or Edge browser.',
      accountNoteFailed: 'Account Note Failed'
    }
  }
}

export default createI18n({
  legacy: false,
  locale: 'en',
  messages
})
