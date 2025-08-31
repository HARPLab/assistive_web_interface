import React, { useEffect, useState, useRef } from 'react'
import { useROS, createROSTopic, createROSMessage } from '../ros/ros_helpers.js'
import TestROS from '../ros/TestROS'

// TO IGNORE FORMATTING ERRORS, RUN: npx prettier --write "src/testing_harp/SoA_Survey.jsx" "src/testing_harp/ControlButton.jsx" "src/testing_harp/main_button_page.jsx"
export default function SamyuktaTests() {
  const topicRef = useRef(null)
  const [isHeld, setIsHeld] = useState(false)
  let { isConnected, ros } = useROS()
  useEffect(() => {
    if (isConnected && ros) {
      topicRef.current = createROSTopic(ros, '/moveForwardButton', 'std_msgs/String')
    }
  }, [isConnected, ros]) // only run when connection changes

  const moveForward = ({ direction }) => {
    setIsHeld(true)
    if (topicRef.current) {
      topicRef.current.publish(createROSMessage({ data: { direction } }))
    }
  }

  const stopMove = () => {
    setIsHeld(false)
    if (topicRef.current) {
      topicRef.current.publish(createROSMessage({ data: '' }))
    }
  }

  return (
    <>
      <h1>Hello World.</h1>
      <button onMouseDown={moveForward('forward')} onMouseUp={stopMove}>
        Move Robot Forward Along X Axis
      </button>
    </>
  )
}
