import React, { useEffect, useState, useRef } from 'react'
import { useROS, createROSTopic, createROSMessage } from '../ros/ros_helpers.js'
import ControlButton from './ControlButton.jsx'
import './styles.css'
import Survey from './SoA_Survey.jsx'

export default function ROSButtons() {
  const topicRef = useRef(null)
  const { isConnected, ros } = useROS()

  const [mode, setMode] = useState('task') // default to "task" mode
  const [showSurvey, setShowSurvey] = useState(false)
  const [heldDirection, setHeldDirection] = useState(null)

  useEffect(() => {
    if (isConnected && ros) {
      topicRef.current = createROSTopic(ros, '/moveForwardButton', 'std_msgs/String')
    }
  }, [isConnected, ros])

  const move = (direction) => {
    setHeldDirection(direction)
    if (topicRef.current) {
      topicRef.current.publish(createROSMessage({ data: direction }))
    }
  }

  const stop = () => {
    setHeldDirection(null)
    if (topicRef.current) {
      topicRef.current.publish(createROSMessage({ data: '' }))
    }
  }

  const handleSurveyComplete = (answer) => {
    console.log('survey submitted with answer:', answer)
    setShowSurvey(false)
  }

  const toggleMode = () => {
    setMode((prev) => (prev === 'customize' ? 'task' : 'customize'))
  }

  return (
    <div className='controls'>
      {showSurvey && <Survey onSurveyComplete={handleSurveyComplete} />}
      {!showSurvey && (
        <div style={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: 9999 }}>
          <button onClick={() => setShowSurvey(true)}>Show Survey</button>
        </div>
      )}

      <div className='controls-layout'>
        <button className='toggle-button' onClick={toggleMode}>
          {mode === 'customize' ? 'Customize' : 'Task'} Mode
        </button>

        <div className='buttons-container'>
          {/* movement Controls */}
          <div className='xy-controls'>
            <div className='xy-middle-row'>
              <ControlButton direction='forward' onPress={move} onRelease={stop} isHeld={heldDirection === 'forward'}>
                ↑
              </ControlButton>
            </div>
            <div className='xy-middle-row'>
              <ControlButton direction='left' onPress={move} onRelease={stop} isHeld={heldDirection === 'left'}>
                ←
              </ControlButton>
              <ControlButton direction='right' onPress={move} onRelease={stop} isHeld={heldDirection === 'right'}>
                →
              </ControlButton>
            </div>
            <div className='xy-middle-row'>
              <ControlButton direction='backward' onPress={move} onRelease={stop} isHeld={heldDirection === 'backward'}>
                ↓
              </ControlButton>
            </div>
          </div>

          {/* grip control */}
          <div className='z-controls'>
            <ControlButton direction='close' onPress={move} onRelease={stop} isHeld={heldDirection === 'close'} className='close-gripper'>
              Grip
            </ControlButton>
          </div>

          {/* rotation controls */}
          <div className='rotation-controls'>
            <div className='xy-middle-row'>
              <ControlButton direction='pitch_up' onPress={move} onRelease={stop} isHeld={heldDirection === 'pitch_up'}>
                Pitch ↑
              </ControlButton>
            </div>
            <div className='xy-middle-row'>
              <ControlButton direction='roll_left' onPress={move} onRelease={stop} isHeld={heldDirection === 'roll_left'}>
                Roll ⟲
              </ControlButton>
              <ControlButton direction='roll_right' onPress={move} onRelease={stop} isHeld={heldDirection === 'roll_right'}>
                Roll ⟳
              </ControlButton>
            </div>
            <div className='xy-middle-row'>
              <ControlButton direction='pitch_down' onPress={move} onRelease={stop} isHeld={heldDirection === 'pitch_down'}>
                Pitch ↓
              </ControlButton>
            </div>
            <div className='xy-middle-row'>
              <ControlButton direction='yaw_left' onPress={move} onRelease={stop} isHeld={heldDirection === 'yaw_left'}>
                Yaw ←
              </ControlButton>
              <ControlButton direction='yaw_right' onPress={move} onRelease={stop} isHeld={heldDirection === 'yaw_right'}>
                Yaw →
              </ControlButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
