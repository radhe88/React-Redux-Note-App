
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import './App.css'; // Import the CSS file for styling
import { GoFilter } from 'react-icons/go';
import { MdModeEdit, MdDeleteForever } from 'react-icons/md';
import 'quill/dist/quill.snow.css';
import ReactQuill, { Quill } from 'react-quill';


const NoteApp = ({ notes, addNote, editNote, deleteNote }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editNoteId, setEditNoteId] = useState(null);
    const [sortAscending, setSortAscending] = useState(true);
    const [sortDescending, setSortDescending] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [error, setError] = useState('');
    const [isopenModal, setisopenModal] = useState('');
    const [currentArray, setCurrentArray] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);


    const fetchMoreData = () => {
        setIsLoading(true);

        setTimeout(() => {
            const nextEndIndex = currentArray.length + 10;
            if (nextEndIndex >= notes.length) {
                setHasMore(false);
            }

            const newData = notes.slice(currentArray.length, nextEndIndex);
            setCurrentArray((prevData) => [...prevData, ...newData]);
            setIsLoading(false);
        }, 1500);
    };

    useEffect(() => {
        if (notes.length > 0) {
            const initialData = notes.slice(1, 10);
            setCurrentArray(initialData);
        }
    }, [notes]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


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
            id: new Date().getTime(),
            title,
            content: content.trim(),
        };

        addNote(newNote);
        setTitle('');
        setContent('');
        handleCloseModal();
        setError('');
        setSearchValue('');
    };

    const handleEditNote = (note) => {
        setEditMode(true);
        setEditNoteId(note.id);
        setTitle(note.title);
        setContent(note.content);
        setisopenModal(true);
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
            setSearchValue('');
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
        if (window.confirm('Are you sure you want to delete this note?')) {
            deleteNote(noteId);
        }
    };

    const handleToggleSort = () => {
        setSortAscending(!sortAscending);
        setSortDescending(!sortDescending);

        const sortedNotes = [...notes];
        sortedNotes.sort((a, b) => {
            if (sortAscending) {
                if (typeof a.title === 'number' && typeof b.title === 'number') {
                    return a.title - b.title; // Sort numbers in ascending order
                }
                if (typeof a.title === 'string' && typeof b.title === 'string') {
                    return a.title.localeCompare(b.title); // Sort strings in alphabetical order
                }
            } else {
                if (typeof a.title === 'number' && typeof b.title === 'number') {
                    return b.title - a.title; // Sort numbers in descending order
                }
                if (typeof a.title === 'string' && typeof b.title === 'string') {
                    return b.title.localeCompare(a.title); // Sort strings in reverse alphabetical order
                }
            }
            return 0;
        });

        setStartIndex(0);
        setEndIndex(10);
        setCurrentArray(sortedNotes.slice(0, 10));
        setHasMore(sortedNotes.length > 10);
    };

    const handleCloseModal = () => {
        setTitle('');
        setContent('');
        setisopenModal(false);
    };

    const handelsearchNote = (e) => {
        setSearchValue(e.target.value);
    };

    const filterNotes = notes.filter((note) =>
        note.title.toLowerCase().includes(searchValue.toLowerCase())
    );

    const getBoxStyle = (date) => {
        const currentDate = new Date();
        const givenDate = new Date(date);
        if (currentDate.toDateString() === givenDate.toDateString()) {
            return { backgroundColor: '#0e7bff' };
        } else if (givenDate > currentDate) {
            return { backgroundColor: 'rgba(0,122,255,.35)' };
        } else {
            return { backgroundColor: 'gray' };
        }
    };

    const handleClick = () => {
        setisopenModal(true);
    };

    const handleCancel = () => {
        setisopenModal(false);
    };

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
            quill.on('text-change', (delta) => {
                console.log('text changed', delta);
            });
        }
    }, []);

    // useEffect(() => {
    //     for (let i = 1; i <= 100; i++) {
    //         const updatedNote = {
    //             id: new Date().getTime() + 1,
    //             title: `title ${i}`,
    //             content: `content ${i}`,
    //         };
    //         // addNote(updatedNote);
    //     }
    // }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.scrollHeight
        ) {
            if (!isLoading && hasMore) {
                fetchMoreData();
            }
        }
    };


    return (
        <>
            <div className='mainContent'>
                <div className='Container'>
                    <div className='note-app'>
                        <div className='U_flex'>
                            <h1 className='note-app-title'>Note App</h1>
                            <input
                                type='text'
                                className='search'
                                value={searchValue}
                                onChange={handelsearchNote}
                                placeholder='Enter search title'
                            />
                            <div className='adddetail'>
                                <button onClick={handleClick}>+</button>
                            </div>
                            <div className='note-actions'>
                                <div className='filter-icon'>
                                    <GoFilter className='dropbtn' />
                                    <div className='dropdown-content note-toggle-button'>
                                        <a href='#' onClick={() => handleToggleSort()}>
                                            {sortAscending ? 'Ascending' : 'Descending'}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {isopenModal && (
                            <div className='modal'>
                                <div className='note-form'>
                                    <div className='discription'>
                                        <form autoComplete='off'>
                                            <div className='u_content-header'>
                                                <h5>Create Task</h5>
                                            </div>
                                            <div className='u_col-4 u_mb-20'>
                                                <div className='u_input'>
                                                    <input
                                                        type='text'
                                                        placeholder='Title'
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
                                                            placeholder='Content'
                                                            value={content}
                                                            onChange={setContent}
                                                            row={10}
                                                        />
                                                        <label>
                                                            Ticket Content
                                                            <span>*</span>
                                                        </label>
                                                    </div>
                                                    {error && <p className='error-message'>{error}</p>}
                                                </div>
                                            </div>
                                            <div className='pagination'></div>
                                            {editMode ? (
                                                <div className='u_flexButton'>
                                                    <button
                                                        className='u_btn u_text-c u_btn__smallBtn u_btn__blue'
                                                        onClick={handleUpdateNote}
                                                    >
                                                        Update
                                                    </button>

                                                    <button
                                                        className='u_btn u_text-c u_btn__smallBtn  u_ml-10 u_btn__white'
                                                        onClick={handleCancelEdit}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className='u_flexButton'>
                                                    <button
                                                        className='u_btn u_text-c u_btn__smallBtn  u_btn__blue'
                                                        onClick={handleAddNote}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className='u_btn u_text-c u_btn__smallBtn u_ml-10 u_btn__white'
                                                        onClick={handleCancel}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}
                        {
                            currentArray.length === 0 ? (
                                <div className="no-data">
                                    < img src='https://d33v4339jhl8k0.cloudfront.net/docs/assets/5923ee3b0428634b4a335ad3/images/6155931c0754e74465f15374/file-H8yxR163MF.png' alt="No Data" />
                                    <p>No data found</p>
                                </div>
                            ) :
                                currentArray.map((item, index) => {
                                    return (
                                        <div className='note' key={index} style={getBoxStyle(item?.id)}>
                                            <h3 className='note-title'>{item.title}</h3>
                                            <p
                                                className='name-content'
                                                dangerouslySetInnerHTML={{ __html: item.content }}
                                            ></p>
                                            <div className='note-actions note-contain'>
                                                <span>{index}</span>
                                                <button
                                                    className='note-action-button edit-button'
                                                    onClick={() => handleEditNote(item)}
                                                >
                                                    <MdModeEdit />
                                                </button>
                                                <button
                                                    className='note-action-button delete-button'
                                                    onClick={() => handleDeleteNote(item.id)}
                                                >
                                                    <MdDeleteForever />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                        {isLoading && (
                            <div className='loading-message'>Loading...</div>
                        )}
                    </div>
                </div>
            </div>
        </>
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
