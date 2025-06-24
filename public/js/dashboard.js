// Dashboard JavaScript functions

function openNotesModal(leadId, leadName, leadNotes) {
  const app = Alpine.store || document.querySelector('[x-data]').__x.$data;
  app.currentLead = leadId;
  app.currentLeadName = leadName;
  app.notes = leadNotes || [];
  app.showNoteModal = true;
  app.newNote = '';
  app.editNoteId = null;
}

function deleteNote(index) {
  if (confirm('Opravdu smazat tuto poznámku?')) {
    const app = document.querySelector('[x-data]').__x.$data;
    fetch(`/dashboard/delete-note/${app.currentLead}/${index}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        app.notes.splice(index, 1);
      } else {
        alert('Chyba při mazání poznámky');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Chyba při mazání poznámky');
    });
  }
}

function saveNote() {
  const app = document.querySelector('[x-data]').__x.$data;
  if (!app.newNote.trim()) return;

  const isEdit = app.editNoteId !== null;
  const url = isEdit 
    ? `/dashboard/update-note/${app.currentLead}/${app.editNoteId}`
    : `/dashboard/add-note/${app.currentLead}`;
  
  const method = isEdit ? 'PUT' : 'POST';

  fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: app.newNote.trim() })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      if (isEdit) {
        app.notes[app.editNoteId].text = app.newNote.trim();
        app.notes[app.editNoteId].updatedAt = new Date().toISOString();
      } else {
        app.notes.push({
          text: app.newNote.trim(),
          createdAt: new Date().toISOString(),
          createdBy: window.currentUser || 'Neznámý'
        });
      }
      app.newNote = '';
      app.editNoteId = null;
    } else {
      alert('Chyba při ukládání poznámky');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Chyba při ukládání poznámky');
  });
}

function cancelEdit() {
  const app = document.querySelector('[x-data]').__x.$data;
  app.editNoteId = null;
  app.newNote = '';
}