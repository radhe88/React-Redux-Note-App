import { createStore } from 'redux';

// Define the initial state
const initialState = {
    notes: [],
};

// Load state from local storage
const storedState = localStorage.getItem('noteApp');
const persistedState = storedState ? JSON.parse(storedState) : initialState;

// Define the reducer
function rootReducer(state = persistedState, action) {
    switch (action.type) {
        case 'ADD_NOTE':
            const newNotes = [...state.notes, action.payload];
            saveStateToLocalStorage({ notes: newNotes });
            return {
                ...state,
                notes: newNotes,
            };
        case 'EDIT_NOTE':
            const updatedNotes = state.notes.map((note) =>
                note.id === action.payload.id ? action.payload : note
            );
            saveStateToLocalStorage({ notes: updatedNotes });
            return {
                ...state,
                notes: updatedNotes,
            };
        case 'DELETE_NOTE':
            const filteredNotes = state.notes.filter((note) => note.id !== action.payload);
            saveStateToLocalStorage({ notes: filteredNotes });
            return {
                ...state,
                notes: filteredNotes,
            };
        default:
            return state;
    }
}

// Create the store
const store = createStore(rootReducer);

// Save state to local storage
function saveStateToLocalStorage(state) {
    localStorage.setItem('noteApp', JSON.stringify(state));
}

export default store;
