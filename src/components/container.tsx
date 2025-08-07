import React from 'react'

interface ContainerProps {
  children: React.ReactNode
}

const Container: React.FC<ContainerProps> = React.memo(({ children }) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-10 rounded-lg md:px-0 min-[1500px]:ml-64 min-[1500px]:mx-0">
      {children}
    </div>
  )
})

Container.displayName = 'Container'

export default Container
