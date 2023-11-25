import React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Tooltip } from 'react-tooltip'

type TooltipWithCopyButtonProps = {
  id: string
  value: string
  children: React.ReactNode
}

const TooltipWithCopyButton = ({
  id,
  value,
  children,
}: TooltipWithCopyButtonProps) => {
  const copyId = `${id}-copied`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value)
  }

  const handleCopyClick = () => {
    copyToClipboard()
  }

  return (
    <span
      data-tooltip-id={id}
      data-tooltip-content={value}
      style={{ cursor: 'pointer' }}
    >
      <CopyToClipboard text={id} onCopy={copyToClipboard}>
        <span
          onClick={handleCopyClick}
          data-tooltip-id={copyId}
          data-tooltip-content="Copied!"
        >
          {children}
          <Tooltip id={copyId} openOnClick place="bottom" delayHide={2000} />
        </span>
      </CopyToClipboard>
      <Tooltip id={id} place="top" />
    </span>
  )
}

export default TooltipWithCopyButton
