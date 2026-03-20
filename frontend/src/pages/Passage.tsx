import { Button, Input, Space, Typography } from 'antd'

const { Title } = Typography

type Props = {
  passage: string
  onPassageChange: (value: string) => void
  onClear: () => void
}

export default function Passage(props: Props) {
  const { passage, onPassageChange, onClear } = props

  return (
    <div className="flex flex-1 px-6 py-16">
      <div className="w-full max-w-3xl rounded-3xl border px-6 py-8 shadow-sm md:px-8">
        <Title
          level={1}
          className="!mb-2"
          style={{ color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}
        >
          Read Up
        </Title>

        <p
          className="mb-2"
          style={{ color: 'var(--text-main)', fontFamily: 'var(--font-body)' }}
        >
          Turn any text into an interactive learning experience — translate,
          explore vocabulary, and truly understand what you read.
        </p>

        <p
          className="mb-6"
          style={{ color: 'var(--text-main)', fontFamily: 'var(--font-body)' }}
        >
          🎯 Paste a passage below to translate.
        </p>

        <Input.TextArea
          rows={5}
          value={passage}
          onChange={(event) => onPassageChange(event.target.value)}
          placeholder="Enter passage here..."
          style={{
            background: 'var(--bg-main)',
            color: 'var(--text-main)',
            borderColor: 'var(--card-border)',
            fontFamily: 'var(--font-body)',
          }}
        />

        <Space className="mt-6">
          <Button type="primary">Translate</Button>
          <Button onClick={onClear}>Clear</Button>
        </Space>
      </div>
    </div>
  )
}
