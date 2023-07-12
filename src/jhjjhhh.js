import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import './App.css'; // Import the CSS file for styling
import { GoFilter } from 'react-icons/go';
import { MdModeEdit, MdDeleteForever } from 'react-icons/md';
import 'quill/dist/quill.snow.css';
import ReactQuill, { Quill } from 'react-quill';
import InfiniteScroll from 'react-infinite-scroll-component';

const NoteApp = ({ notes, addNote, editNote, deleteNote }) => {

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editNoteId, setEditNoteId] = useState(null);
    const [sortAscending, setSortAscending] = useState(true);
    const [sortDescending, setDescending] = useState(true);
    const [searchValue, setsearchValue] = useState('');
    const [error, setError] = useState('');
    const [isopenModal, setisopenModal] = useState('');
    const [setcurrentItem] = useState()
    const [dataSource, setdataSource] = useState(Array.from({ length: 10 }))
    const [hasMore, sethasMore] = useState(true);



    useEffect(() => {
        for (let i = 1; i <= 100; i++) {
            const updatedNote = {
                id: new Date().getTime(),
                title: `title ${i}`,
                content: `content ${i}`,

            };
            // addNote(updatedNote);
        }
    }, [])

    const handleAddNote = () => {
        if (title.trim() === '') {
            setError('Please enter a title');
            return;
        }

        if (content.trim() === '') {
            setError('Please enter some content');
            return;
        }

        const newNote = { //add local storage
            id: new Date().getTime(),
            title,
            content: content.trim(), //update to state HTML content
            // searchValue,
        };

        addNote(newNote);
        setTitle('');
        setContent('');
        handleCloseModal();
        setError('');
        setsearchValue('');
    };

    const handleEditNote = (note) => {
        setEditMode(true);
        setEditNoteId(note.id);
        setTitle(note.title);
        setContent(note.content);
        setisopenModal(true)
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
                content: content.trim(),
                searchValue,
            };

            editNote(updatedNote);
            setEditMode(false);
            setEditNoteId(null);
            setTitle('');
            setContent('');
            setError('');
            setsearchValue('');
            setisopenModal(false);
        }
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setEditNoteId(null);
        setTitle('');
        setContent('');
    };

    const handleDeleteNote = (noteId) => {
        if (window.confirm('Are you sure you want to delete this note ?')) {
            deleteNote(noteId);
        }
    };

    const handleToggleSort = () => {
        setSortAscending(!sortAscending);
        setDescending(!sortDescending)
    };

    const handleCloseModal = () => {
        setTitle('');
        setContent('');
        setisopenModal(false);
    };

    const currentItem = [...notes]
        .filter((note) => note.title.includes(searchValue))
        .sort((a, b) => {
            if (sortAscending) {
                return (a.title) - (b.title);
            } else {
                return b.title.localeCompare(a.title);
            }
        })
    useEffect(() => {
        // setdataSource(currentItem);
    }, [currentItem])

    const getBoxStyle = (date) => {
        const currentDate = new Date();
        const givenDate = new Date(date);
        if (currentDate.toDateString() === givenDate.toDateString()) {
            return { backgroundColor: ' #0e7bff' };
        } else if (givenDate > currentDate) {
            return { backgroundColor: 'rgba(0,122,255,.35)' };
        } else {
            return { backgroundColor: 'gray' };
        }
    };
    const handelSearchValue = (e) => {
        setsearchValue(e.target.value);
    }

    const handleClick = () => {
        setisopenModal(true);
    }
    const handleCancel = () => {
        setisopenModal(false)
    }

    //code of bold,itaic,
    const quillRef = useRef(null);
    useEffect(() => {
        if (quillRef.current) {
            const quill = new Quill(quillRef.current, {
                theme: 'snow',
                modules: [
                    [{ Header: [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                ],
            });
            quill.on('text-chnage', (delta) => {
                console.log('text changed', delta);
            })
        }
    }, []);

    return (
        <>
            <div className='mainContent'>
                <div className='Container'>
                    <div className="note-app">
                        <div className='U_flex'>
                            <h1 className="note-app-title">Note App</h1>
                            <input type="text"
                                className='search'
                                value={searchValue}
                                onChange={handelSearchValue}
                                placeholder='enter search title'
                            />
                            <div className="note-actions ">
                                <div className='filter-icon'>
                                    <GoFilter className='dropbtn' />
                                    <div className="dropdown-content note-toggle-button">
                                        <a href="#" onClick={() => handleToggleSort()}>Ascending</a>
                                        <a href="#" onClick={() => handleToggleSort()}>Descending</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {isopenModal && (
                            <div className='modal'>
                                <div className="note-form">
                                    <div className='discription'>
                                        <form autoComplete='off'>
                                            <div className='u_content-header'>
                                                <h5>Create Task</h5>
                                            </div>
                                            <div className='u_col-4 u_mb-20'>
                                                <div className='u_input'>
                                                    <input
                                                        type="text"
                                                        placeholder="Title"
                                                        value={title}
                                                        onChange={(e) => setTitle(e.target.value)}
                                                    />
                                                    <label>
                                                        Ticket Title
                                                        <span>*</span>
                                                    </label>
                                                </div>
                                                <div className='u_row u_mb-20'>
                                                    <div className='u_input u_ticket-edtor u_input-textarea'>
                                                        <ReactQuill
                                                            className='note-input'
                                                            placeholder='content'
                                                            value={content}
                                                            onChange={setContent}
                                                            row={10}
                                                        />
                                                        <label>
                                                            Ticket Content
                                                            <span>*</span>
                                                        </label>
                                                    </div>
                                                    {error && <p className="error-message">{error}</p>}
                                                </div>
                                            </div>
                                            <div className='pagination'>
                                            </div>
                                            {editMode ? (
                                                <div className='u_flexButton'>
                                                    <button className="u_btn u_text-c u_btn__smallBtn u_btn__blue" onClick={handleUpdateNote}>
                                                        Update
                                                    </button>

                                                    <button className="u_btn u_text-c u_btn__smallBtn  u_ml-10 u_btn__white" onClick={handleCancelEdit}>
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className='u_flexButton'>
                                                    <button className="u_btn u_text-c u_btn__smallBtn  u_btn__blue" onClick={handleAddNote}>
                                                        save
                                                    </button>
                                                    <button className="u_btn u_text-c u_btn__smallBtn u_ml-10 u_btn__white" onClick={handleCancel}>
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="note-list">
                            {currentItem.map((note, i) => (
                                <div className="note" key={i} style={getBoxStyle(note?.id)}>
                                    <h3 className="note-title">{note.title}</h3>
                                    <p className='name-content' dangerouslySetInnerHTML={{ __html: note.content }}></p>
                                    <div className="note-actions note-contain">
                                        <button
                                            className="note-action-button edit-button"
                                            onClick={() => handleEditNote(note)}
                                        >
                                            <MdModeEdit />
                                        </button>
                                        <button
                                            className="note-action-button delete-button"
                                            onClick={() => handleDeleteNote(note.id)}
                                        >
                                            <MdDeleteForever />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='adddetail'>
                            <button onClick={handleClick}>+</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
//mapstatetoprops ni evry time state chnage thai data save thai state ma ane reatun ma object ape..
const mapStateToProps = (state) => ({  //provide the store data to your component, called evry time store state chaanges should retrun object data
    notes: state.notes,
});
// /If your mapDispatchToProps is declared as a function taking one parameter, it will be given the dispatch of your store.
//mapdispatchtoprops te ek function che..tene ek var create krine called karvama ave che ane recive dispatch karshe..will return of object
const mapDispatchToProps = (dispatch) => ({ // provide the action creators as props to your component. fucntion athva object hoi shake..
    addNote: (note) => dispatch({ type: 'ADD_NOTE', payload: note }),
    editNote: (note) => dispatch({ type: 'EDIT_NOTE', payload: note }),
    deleteNote: (noteId) => dispatch({ type: 'DELETE_NOTE', payload: noteId }),
});

export default connect(mapStateToProps, mapDispatchToProps)(NoteApp);
