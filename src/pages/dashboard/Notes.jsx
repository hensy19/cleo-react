import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit3, ChevronLeft, Notebook } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useNotifications } from '../../context/NotificationContext'
import './Notes.css'

export default function Notes() {
  const [notes, setNotes] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  
  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')

  const { showModal, showToast } = useNotifications()

  useEffect(() => {
    const stored = localStorage.getItem('userNotes')
    if (stored) {
      setNotes(JSON.parse(stored))
    }
  }, [])

  const openAddModal = () => {
    setEditingNote(null)
    setNoteTitle('')
    setNoteContent('')
    setIsModalOpen(true)
  }

  const openEditModal = (note) => {
    setEditingNote(note)
    setNoteTitle(note.title)
    setNoteContent(note.content)
    setIsModalOpen(true)
  }

  const handleSaveNote = () => {
    if (!noteTitle.trim() && !noteContent.trim()) return

    const now = new Date()
    const formattedDate = now.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    
    if (editingNote) {
      const updatedNotes = notes.map(n => 
        n.id === editingNote.id 
          ? { ...n, title: noteTitle, content: noteContent } 
          : n
      )
      setNotes(updatedNotes)
      localStorage.setItem('userNotes', JSON.stringify(updatedNotes))
      showToast('Note updated successfully!')
    } else {
      const newNote = {
        id: Date.now(),
        title: noteTitle || 'Untitled Note',
        content: noteContent,
        date: formattedDate
      }
      const updatedNotes = [newNote, ...notes]
      setNotes(updatedNotes)
      localStorage.setItem('userNotes', JSON.stringify(updatedNotes))
      showToast('Note saved successfully!')
    }
    
    setIsModalOpen(false)
  }

  const handleDeleteNote = (id) => {
    showModal({
      title: 'Delete Note',
      message: 'Are you sure you want to delete this note? This action cannot be undone.',
      type: 'danger',
      confirmText: 'Delete',
      onConfirm: () => {
        const updated = notes.filter(note => note.id !== id)
        setNotes(updated)
        localStorage.setItem('userNotes', JSON.stringify(updated))
        showToast('Note deleted successfully!')
      }
    })
  }

  return (
    <DashboardLayout>
      <div className="notes-page">
        <div className="notes-header-row">
          <div className="header-left">
            <button className="back-btn" onClick={() => window.history.back()}>
              <ChevronLeft size={20} />
              <span>My Notes</span>
            </button>
            <p>Track symptoms, feelings, and important observations.</p>
          </div>
          <button className="add-note-main-btn" onClick={openAddModal}>
            <Plus size={18} />
            Add Note
          </button>
        </div>

        <div className="notes-grid">
          {notes.map(note => (
            <div key={note.id} className="hifi-note-card">
              <div className="note-card-top">
                <span className="note-date-tag">{note.date}</span>
                <div className="note-card-actions">
                  <button className="icon-action-btn edit" onClick={() => openEditModal(note)}>
                    <Edit3 size={16} />
                  </button>
                  <button className="icon-action-btn delete" onClick={() => handleDeleteNote(note.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="note-card-body">
                <h3>{note.title}</h3>
                <p>{note.content}</p>
              </div>
            </div>
          ))}
          
          {notes.length === 0 && (
            <div className="notes-empty-placeholder" onClick={openAddModal}>
              <div className="placeholder-icon">
                <Notebook size={48} />
              </div>
              <h3>Start Your First Note</h3>
              <p>Click to add your symptoms or observations</p>
            </div>
          )}
        </div>

        <div className="note-taking-tips">
          <h3>Note Taking Tips</h3>
          <ul>
            <li>Track symptoms like cramps, headaches, or mood changes.</li>
            <li>Note any interventions or supplements you take.</li>
            <li>Record diet, exercise, or lifestyle changes to keep patterns in mind.</li>
            <li>Document conversations with your healthcare provider.</li>
          </ul>
        </div>

        {/* Modal Overlay */}
        {isModalOpen && (
          <div className="note-modal-overlay">
            <div className="note-modal-content">
              <div className="modal-header">
                <h3>{editingNote ? 'Edit Note' : 'Add New Note'}</h3>
                <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
              </div>
              <div className="modal-body">
                <div className="modal-field">
                  <label>Title</label>
                  <input 
                    type="text" 
                    placeholder="Enter note title..." 
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                  />
                </div>
                <div className="modal-field">
                  <label>Content</label>
                  <textarea 
                    placeholder="Write your observation here..." 
                    rows="8"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button className="modal-save-btn" onClick={handleSaveNote}>Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
