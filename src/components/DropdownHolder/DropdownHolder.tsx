import Dropdown, { Option } from 'react-dropdown'

import { useAppContext } from '../../state/context'
import { TransferTypes } from '../../types/transactionInfo'
import './DropdownHolder.css'

interface DropdownHolderProps {
  // Optionally, you can add some props for the component
}

const DropdownHolder: React.FC<DropdownHolderProps> = (props) => {
  const { transactionInfo, setTransactionInfo } = useAppContext()

  const dropDownOpts = [
    { value: TransferTypes.private, label: 'Private' },
    { value: TransferTypes.public, label: 'Public' },
    { value: TransferTypes.privateToPublic, label: 'Private To Public' },
    { value: TransferTypes.publicToPrivate, label: 'Public To Private' },
  ]

  const onChange = (option: Option) => {
    setTransactionInfo({
      ...transactionInfo,
      transferType: option.value as TransferTypes,
    })
  }

  return (
    <div className="dropdown-holder">
      <div className="empty"></div>
      <div className="dropdown">
        <span>Transfer Type</span>
        <Dropdown
          options={dropDownOpts}
          onChange={onChange}
          value={dropDownOpts[0]}
          placeholder="Select transfer type"
        />
      </div>
    </div>
  )
}

export default DropdownHolder
