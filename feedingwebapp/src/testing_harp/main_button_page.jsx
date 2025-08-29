import React, { useEffect, useState, useRef } from 'react'
import { useROS, createROSTopic, createROSMessage } from '../ros/ros_helpers.js'
import ControlButton from './ControlButton.jsx'
import './styles.css'
import Survey from './SoA_Survey.jsx'

export default function ROSButtons() {
  const topicRef = useRef(null)
  const [setIsHeld] = useState(false)
  const { isConnected, ros } = useROS()
  const [mode, setMode] = useState('customize')
  const [showSurvey, setShowSurvey] = useState(false)

  const initialPositions = {
    forward: { x: 200, y: 100 },
    backward: { x: 200, y: 150 },
    left: { x: 140, y: 125 },
    right: { x: 260, y: 125 },
    up: { x: 200, y: 50 },
    down: { x: 200, y: 200 },
    close: { x: 50, y: 120 },
    roll_left: { x: 400, y: 100 },
    roll_right: { x: 465, y: 100 },
    pitch_up: { x: 430, y: 50 },
    pitch_down: { x: 430, y: 150 },
    yaw_left: { x: 400, y: 200 },
    yaw_right: { x: 465, y: 200 }
  }

  const [positions, setPositions] = useState(initialPositions)
  const dragItem = useRef(null)
  const offset = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (isConnected && ros) {
      topicRef.current = createROSTopic(ros, '/moveForwardButton', 'std_msgs/String')
    }
  }, [isConnected, ros])

  const move = (direction) => {
    console.log('move')
    setIsHeld(true)
    if (topicRef.current) {
      topicRef.current.publish(createROSMessage({ data: direction }))
    }
  }

  const stop = () => {
    console.log('stop')
    setIsHeld(false)
    if (topicRef.current) {
      topicRef.current.publish(createROSMessage({ data: '' }))
    }
  }

  // this function will be called when the survey is completed
  const handleSurveyComplete = (answer) => {
    console.log('Survey submitted with answer:', answer)
    // send data to ros topic here
    setShowSurvey(false)
  }

  const toggleMode = () => {
    setMode((prev) => (prev === 'customize' ? 'task' : 'customize'))
  }

  const handleMouseDown = (e, key) => {
    if (mode !== 'customize') return
    dragItem.current = key
    offset.current = {
      x: e.clientX - positions[key].x,
      y: e.clientY - positions[key].y
    }
  }

  const handleMouseMove = (e) => {
    if (mode !== 'customize' || !dragItem.current) return

    const key = dragItem.current
    const newX = e.clientX - offset.current.x
    const newY = e.clientY - offset.current.y

    setPositions((prev) => ({
      ...prev,
      [key]: { x: newX, y: newY }
    }))
  }

  const handleMouseUp = () => {
    dragItem.current = null
  }

  const renderDraggableButton = (key, label, direction, className, ariaLabel) => (
    <div
      key={key}
      onMouseDown={(e) => handleMouseDown(e, key)}
      style={{
        position: 'absolute',
        top: positions[key].y,
        left: positions[key].x,
        cursor: mode === 'customize' ? 'grab' : 'pointer',
        zIndex: 1000
      }}
    >
      <ControlButton direction={direction} onPress={move} onRelease={stop} className={className} ariaLabel={ariaLabel}>
        {label}
      </ControlButton>
    </div>
  )

  return (
    <div className='controls' onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      {showSurvey && <Survey onSurveyComplete={handleSurveyComplete} />}
      {!showSurvey && (
        <div style={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: 9999 }}>
          <button onClick={() => setShowSurvey(true)}>Show Survey</button>
        </div>
      )}

      {renderDraggableButton('close', 'Grip', 'close', 'close-gripper', 'Close Gripper')}
      {renderDraggableButton('forward', '↑', 'forward', 'forward', 'Move Forward')}
      {renderDraggableButton('backward', '↓', 'backward', 'backward', 'Move Backward')}
      {renderDraggableButton('left', '←', 'left', 'left', 'Move Left')}
      {renderDraggableButton('right', '→', 'right', 'right', 'Move Right')}
      {renderDraggableButton('up', 'Up', 'up', 'move-up', 'Move Up')}
      {renderDraggableButton('down', 'Down', 'down', 'move-down', 'Move Down')}
      {renderDraggableButton('roll_left', 'Roll ⟲', 'roll_left', 'roll-left', 'Roll Left')}
      {renderDraggableButton('roll_right', 'Roll ⟳', 'roll_right', 'roll-right', 'Roll Right')}
      {renderDraggableButton('pitch_up', 'Pitch ↑', 'pitch_up', 'pitch-up', 'Pitch Up')}
      {renderDraggableButton('pitch_down', 'Pitch ↓', 'pitch_down', 'pitch-down', 'Pitch Down')}
      {renderDraggableButton('yaw_left', 'Yaw ←', 'yaw_left', 'yaw-left', 'Yaw Left')}
      {renderDraggableButton('yaw_right', 'Yaw →', 'yaw_right', 'yaw-right', 'Yaw Right')}

      <button className='toggle-button' onClick={toggleMode}>
        {mode === 'customize' ? 'Customize' : 'Task'} Mode
      </button>
    </div>
  )
}
