import React, { useMemo } from 'react'
// CSS modules removed - using unified Tailwind design system

interface SubContainerProps {
  children: React.ReactNode
  isresponsive?: string
  className?: string
}

const SubContainer: React.FC<SubContainerProps> = React.memo(
  ({ children, isresponsive, className }) => {
    // クラス名とdata属性をメモ化
    const containerProps = useMemo(
      () => ({
        className: ['responsive-container', className]
          .filter(Boolean)
          .join(' '),
        'data-responsive': isresponsive,
      }),
      [className, isresponsive],
    )

    return <div {...containerProps}>{children}</div>
  }
)

SubContainer.displayName = 'SubContainer'

export default SubContainer
