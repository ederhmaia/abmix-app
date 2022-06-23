import * as React from 'react'

const ShouldRender = ({ if: condition, children }) => {
  return <>{!!condition ? children : null}</>
}

export default ShouldRender
