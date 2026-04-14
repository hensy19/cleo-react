import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit3, ChevronLeft, Notebook } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useNotifications } from '../../context/NotificationContext'
import { useLanguage } from '../../context/LanguageContext'
import './Notes.css'

export default function Notes() {
  const [notes, setNotes] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  
  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const { t } = useLanguage()
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
      showToast(t('noteUpdated'))
    } else {
      const newNote = {
        id: Date.now(),
        title: noteTitle || t('untitledNote'),
        content: noteContent,
        date: formattedDate
      }
      const updatedNotes = [newNote, ...notes]
      setNotes(updatedNotes)
      localStorage.setItem('userNotes', JSON.stringify(updatedNotes))
      showToast(t('noteSaved'))
    }
    
    setIsModalOpen(false)
  }

  const handleDeleteNote = (id) => {
    showModal({
      title: t('deleteNote'),
      message: `${t('deleteNoteConfirm')} ${t('permanentAction')}`,
      type: 'danger',
      confirmText: t('delete'),
      onConfirm: () => {
        const updated = notes.filter(note => note.id !== id)
        setNotes(updated)
        localStorage.setItem('userNotes', JSON.stringify(updated))
        showToast(t('noteDeleted'))
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
              <span>{t('myNotes')}</span>
            </button>
            <p>{t('trackSymptoms')}</p>
          </div>
          <button className="add-note-main-btn" onClick={openAddModal}>
            <Plus size={18} />
            {t('addNote')}
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
              <h3>{t('startFirstNote')}</h3>
              <p>{t('clickToAdd')}</p>
            </div>
          )}
        </div>

        <div className="note-taking-tips">
          <h3>{t('noteTips')}</h3>
          <ul>
            <li>{t('noteTip1')}</li>
            <li>{t('noteTip2')}</li>
            <li>{t('noteTip3')}</li>
            <li>{t('noteTip4')}</li>
          </ul>
        </div>

        {/* Modal Overlay */}
        {isModalOpen && (
          <div className="note-modal-overlay">
            <div className="note-modal-content">
              <div className="modal-header">
                <h3>{editingNote ? t('editNoteTitle') : t('addNewNote')}</h3>
                <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
              </div>
              <div className="modal-body">
                <div className="modal-field">
                  <label>{t('title')}</label>
                  <input 
                    type="text" 
                    placeholder={t('enterTitle')} 
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                  />
                </div>
                <div className="modal-field">
                  <label>{t('content')}</label>
                  <textarea 
                    placeholder={t('writeObservation')} 
                    rows="8"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button className="modal-save-btn" onClick={handleSaveNote}>{t('save')}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
