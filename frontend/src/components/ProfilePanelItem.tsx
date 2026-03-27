import { CollapsiblePanelItem } from './CollapsiblePanel'

type ProfilePanelItemProps = {
  username?: string
  email?: string
}

export default function ProfilePanelItem(props: ProfilePanelItemProps) {
  const { username, email } = props

  return (
    <CollapsiblePanelItem
      title="Profile"
      description="View the current account details for this Read Up session."
    >
      <div className="space-y-1 text-sm">
        <p className="m-0">
          <span className="font-medium">Username:</span> {username ?? 'Unknown user'}
        </p>
        <p className="m-0 text-gray-600">{email}</p>
      </div>
    </CollapsiblePanelItem>
  )
}
