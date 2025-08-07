import React, { useMemo } from 'react'
// CSS modules removed - using unified Tailwind design system

interface SubContainerProps {
  children: React.ReactNode
  isresponsive?: string
}

const SubContainer: React.FC<SubContainerProps> = React.memo(
  ({ children, isresponsive }) => {
    // クラス名とdata属性をメモ化
    const containerProps = useMemo(
      () => ({
        className: 'responsive-container',
        'data-responsive': isresponsive,
      }),
      [isresponsive]
    )

    return <div {...containerProps}>{children}</div>
  }
)

SubContainer.displayName = 'SubContainer'

export default SubContainer
