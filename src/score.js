import React, { useState } from 'react';

const Score = ({ id }) => {
    const [score, setScore] = useState('??');
    const [explanation, setExplanation] = useState('');
    const [scoreComponents, setScoreComponents] = useState(null); // New state for score components
    const [showExplanationModal, setShowExplanationModal] = useState(false);
    const [assessment, setAssessment] = useState(null); // New state for score components
    const fetchScore = async () => {
        try {
            setScore("...")
            const response = await fetch(`http://localhost:5000/rate_resume/${id}`);
            if (response.ok) {
                const data = await response.json();
                const leadership_weight = .5
                const technical_weight = .25
                const soft_skills_weight =.25
                const computed_score = data.score_components.leadership_experience * leadership_weight + data.score_components.technical_skills * technical_weight+ data.score_components.soft_skills * soft_skills_weight
                setScore(computed_score.toFixed(0));
                setExplanation(data.explanation);
                setScoreComponents(data.score_components); // Store score components
                setAssessment(data.job_description_assessment);
                console.log(`Leadership: {data.score_components.leadership_experience}, Technical: {data.score_components.technical_skills}, Soft Skills: {data.score_components.soft_skills}`)
                console.log(`Score: ${computed_score}`)
            } else {
                console.error('Failed to fetch score:', response.statusText);
                setScore('Error');
            }
        } catch (error) {
            console.error('Error fetching score:', error);
            setScore('Error');
        }
    };

    function bulletedListFromArray(array) {
        return array.map((item, index) => <li key={index}>{item}</li>);
    }

    return (
        <div>
            <div className="score-button-group">
                <button className="material-button" onClick={fetchScore}>Score</button>
                <button className="material-button" onClick={() => setShowExplanationModal(true)}>
                    <span>{score}</span>
                </button>

            </div>

            {showExplanationModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={() => setShowExplanationModal(false)}>&times;</span>
                        <h2>Resume Assessment: {score}</h2>
                        {assessment && (
                        <div className="score-components">
                            <h3>Analysis</h3>
                            <h4>Critical Hard Skills</h4>
                            <ul>
                                {bulletedListFromArray(assessment.most_important_hard_skills)}
                            </ul>
                            <h4>Critical Soft Skills</h4>
                            <ul>
                                {bulletedListFromArray(assessment.most_important_soft_skills)}
                            </ul>
                            <h4>Most Relevant Experience</h4>
                            <ul>
                                {bulletedListFromArray(assessment.most_relevant_experience)}
                            </ul>
                        </div>
                        )}
                        {scoreComponents && (
                            <div className="score-components">
                                <h3>Component Scores:</h3>
                                <p>Leadership Experience: {scoreComponents.leadership_experience}</p>
                                <p>Technical Skills: {scoreComponents.technical_skills}</p>
                                <p>Soft Skills: {scoreComponents.soft_skills}</p>
                            </div>
                        )}
                        <h3>Explanation:</h3>
                        <ul>
                            {bulletedListFromArray(explanation)}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Score;