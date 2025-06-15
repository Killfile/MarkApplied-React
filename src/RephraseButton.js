import React, { useState } from 'react';

const RephraseButton = ({ url, onUpdate }) => {
    const [showPrompt, setShowPrompt] = useState(false);
    const [promptText, setPromptText] = useState("Here is a job description I'm interested in. Please craft a concise professional summary that highlights my expertise while aligning with the role's responsibilities and qualifications. Incorporate leadership experience, technical skills, and any industry-specific nuances as needed. Any reference to years of experience should specify my actual years (20 in software; 10 in leadership) rather than the amount or comparison required in the job description. All sentences should be structured as if they start with 'I am' or 'I am a' but should not actually include those words.");
    const [buttonText, setButtonText] = useState("Rephrase");
    const [showExplanationModal, setShowExplanationModal] = useState(false);
    const [explanation, setExplanation] = useState('');

    const handleRephrase = async () => {
        setButtonText("Rephrasing...");
        const body_json = promptText ? { custom_instructions: promptText } : {};
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body_json),
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const result = await response.json();
            console.log('Server Response:', result);
            // Assuming the result is the updated description text
            onUpdate(result.summary);
            setExplanation(result.additional_suggestions);
            setShowExplanationModal(true);
        } catch (error) {
            console.error('Error rephrasing:', error);
            // Handle error, maybe show a message to the user
        }
        setButtonText("Rephrase");
    };

    function bulletedListFromArray(array) {
        return array.map((item, index) => <li key={index}>{item}</li>);
    }

    return (
        <div className="rephrase-container">
            <div className="rephrase-button-group">
                <button className="material-button" onClick={handleRephrase}>{buttonText}</button>
                <button className="material-button" onClick={() => setShowPrompt(!showPrompt)}>
                    {showPrompt ? '▲' : '▼'}
                </button>
                <button className="material-button" onClick={() => setShowExplanationModal(true)}>
                    <span>?</span>
                </button>
            </div>
            {showPrompt && (
                <div>
                    <textarea
                        className="text-input"
                        rows="4"
                        value={promptText}
                        onChange={(e) => setPromptText(e.target.value)}
                        placeholder="Enter custom rephrase instructions here..."
                    />
                </div>
            )}
            {showExplanationModal && (
            <div className="modal">
                <div className="modal-content">
                    <span className="close-button" onClick={() => setShowExplanationModal(false)}>&times;</span>
                    <h2>Rephrased</h2>

                        <div className="score-components">
                            <h3>Suggestions:</h3>
                            <ul>
                                {bulletedListFromArray(explanation)}
                            </ul>
                        </div>
            
                   
                    
                </div>
            </div>
        )}
        </div>
        

        
    );
};

export default RephraseButton;