import React, { useState } from 'react'
import './SoA_Survey.css'
import PropTypes from 'prop-types' //

export default function Survey({ onSurveyComplete }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer)
  }

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      onSurveyComplete(selectedAnswer)
    }
  }

  const scaleLabels = {
    1: 'Strongly Disagree',
    2: 'Disagree',
    3: 'Neutral',
    4: 'Agree',
    5: 'Strongly Agree'
  }

  return (
    <div className='survey-container'>
      <h3>I felt as if I was controlling the movement of the robot arm.</h3>
      <div className='scale-buttons'>
        {[1, 2, 3, 4, 5].map((value) => (
          <div key={value} className='scale-option'>
            <button className={`scale-button ${selectedAnswer === value ? 'selected' : ''}`} onClick={() => handleAnswer(value)}>
              {value}
            </button>
            <span className='scale-label'>{scaleLabels[value]}</span>
          </div>
        ))}
      </div>
      <button onClick={handleSubmit} className='submit-button'>
        Submit
      </button>
    </div>
  )
}

// add propTypes to fix warnings
Survey.propTypes = {
  onSurveyComplete: PropTypes.func.isRequired
}
