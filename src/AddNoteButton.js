import React, { useState } from 'react';

const AddNoteButton = ({ openModal }) => {
    return (
        <button className="add-note-button" onClick={openModal}>
            +
        </button>
    );
};

export default AddNoteButton;
