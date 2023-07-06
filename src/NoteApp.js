import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import './App.css'; // Import the CSS file for styling

const NoteApp = ({ notes, addNote, editNote, deleteNote }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editNoteId, setEditNoteId] = useState(null);
    const [sortAscending, setSortAscending] = useState(true);
    const [boxColor, setBoxColor] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState('');

    const handleAddNote = () => {
        if (title.trim() === '') {
            setError('Please enter a title');
            return;
        }

        if (content.trim() === '') {
            setError('Please enter some content');
            return;
        }

        const newNote = {
            id: Date.now(),
            title,
            content,
        };

        addNote(newNote);
        setTitle('');
        setContent('');
        handleCloseModal();
        setError('');
    };

    const handleClick = () => {
        setIsModalOpen(true)
    }
    const handleCancel = () => {
        setIsModalOpen(false)
    }

    const handleEditNote = (note) => {
        setEditMode(true);
        setEditNoteId(note.id);
        setTitle(note.title);
        setContent(note.content);
        setIsModalOpen(true)
    };

    const handleUpdateNote = () => {
        if (title.trim() === '') {
            setError('Please enter a title');
            return;
        }

        if (content.trim() === '') {
            setError('Please enter some content');
            return;
        }

        if (editNoteId) {
            const updatedNote = {
                id: editNoteId,
                title,
                content,
            };

            editNote(updatedNote);
            setEditMode(false);
            setEditNoteId(null);
            setTitle('');
            setContent('');
            setError('');
            setIsModalOpen(false)
        }
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setEditNoteId(null);
        setTitle('');
        setContent('');
    };

    const handleDeleteNote = (noteId) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            deleteNote(noteId);
        }
    };

    const handleToggleSort = () => {
        setSortAscending(!sortAscending);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTitle('');
        setContent('');
    };


    const sortedNotes = [...notes].sort((a, b) => {
        if (sortAscending) {
            return a.title.localeCompare(b.title);
        } else {
            return b.title.localeCompare(a.title);
        }
    });

    const getBoxStyle = (date) => {
        const currentDate = new Date();
        const givenDate = new Date(date);

        if (currentDate.toDateString() === givenDate.toDateString()) {
            return { backgroundColor: 'red' };
        } else if (givenDate > currentDate) {
            return { backgroundColor: 'blue' };
        } else {
            return { backgroundColor: 'gray' };
        }
    };


    return (
        <div className="note-app">
            <div className='U_flex'>
                <h1 className="note-app-title">Note App</h1>
                <div className="note-actions">
                    <button className="note-toggle-button" onClick={handleToggleSort}>
                        {sortAscending ? 'Sort Descending' : 'Sort Ascending'}
                    </button>
                </div>
            </div>
            <button onClick={handleClick} >click to add new record</button>
            {
                isModalOpen && (
                    <div className='modal'>
                        <div className='modal-content'>
                            <div className='modal-body'>
                                <div className="note-form">
                                    <input
                                        type="text"
                                        className="note-input"
                                        placeholder="Title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                    <textarea
                                        className="note-input"
                                        placeholder="Content"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                    />
                                    {editMode ? (
                                        <div>
                                            <button className="note-button" onClick={handleUpdateNote}>
                                                Update
                                            </button>
                                            <button className="note-button" onClick={handleCancelEdit}>
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <button className="note-button" onClick={handleAddNote}>
                                                Save
                                            </button>
                                            <button className="note-button" onClick={handleCancel}>
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                    {error && <p className="error-message">{error}</p>}
                                </div>

                            </div>
                        </div>
                    </div>
                )
            }


            <div className="note-list">
                {sortedNotes.map((note) => (
                    <div className="note" key={note.id}>
                        <h3 className="note-title">{note.title}</h3>
                        <p className="note-content">{note.content}</p>
                        <div className="note-actions">
                            <button
                                className="note-action-button edit-button"
                                onClick={() => handleEditNote(note)}
                            >
                                Edit
                            </button>
                            <button
                                className="note-action-button delete-button"
                                onClick={() => handleDeleteNote(note.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="color-box" style={getBoxStyle('2023-07-05')}></div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    notes: state.notes,
});

const mapDispatchToProps = (dispatch) => ({
    addNote: (note) => dispatch({ type: 'ADD_NOTE', payload: note }),
    editNote: (note) => dispatch({ type: 'EDIT_NOTE', payload: note }),
    deleteNote: (noteId) => dispatch({ type: 'DELETE_NOTE', payload: noteId }),
});

export default connect(mapStateToProps, mapDispatchToProps)(NoteApp);
