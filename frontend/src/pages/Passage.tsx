import { Button, Card, Input, Space } from 'antd'

type Props = {
  passage: string
  onPassageChange: (value: string) => void
  onClear: () => void
}

export default function Passage(props: Props) {
  const { passage, onPassageChange, onClear } = props

  return (
    <Card
      className='mt-4'
      style={{
        background: 'var(--card-bg)',
      }}
    >
      <Input.TextArea
        rows={5}
        value={passage}
        onChange={(event) => onPassageChange(event.target.value)}
        placeholder='Enter the passage you want to translate'
      />

      <Space className='mt-4'>
        <Button type='primary'>Translation</Button>
        <Button onClick={onClear}>Clear</Button>
      </Space>
    </Card>
  )
}
