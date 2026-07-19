import React from 'react'

interface ContainerProps {
  children: React.ReactNode
}

const Container: React.FC<ContainerProps> = React.memo(({ children }) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 rounded-lg">
      {children}
    </div>
  )
})

Container.displayName = 'Container'

export default Container
