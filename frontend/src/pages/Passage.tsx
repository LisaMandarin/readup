import { useState, useRef } from 'react'
import { Input, Button } from 'antd'
import { ClearOutlined } from '@ant-design/icons'
import TranslateButton from '../components/TranslateButton'
import type { TextAreaRef } from 'antd/es/input/TextArea'

const { TextArea } = Input

interface PassageProps {
  passage: string
  onPassageChange: (value: string) => void
  onClear: () => void
  translating?: boolean
}

export default function Passage({
  passage,
  onPassageChange,
  onClear,
  translating = false,
}: PassageProps) {
  const [selectedText, setSelectedText] = useState('')
  const textAreaRef = useRef<TextAreaRef>(null)

  const handleSelect = () => {
    const textarea = textAreaRef.current?.resizableTextArea?.textArea
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd

      if (start !== end) {
        setSelectedText(passage.substring(start, end))
      } else {
        setSelectedText('')
      }
    }
  }

  return (
    <div className="mt-6">
      <TextArea
        ref={textAreaRef}
        value={passage}
        onChange={(e) => {
          onPassageChange(e.target.value)
          setSelectedText('')
        }}
        onSelect={handleSelect}
        placeholder="Paste or type your English passage here..."
        rows={8}
        style={{ fontSize: 16 }}
        showCount
        maxLength={5000}
      />

      {selectedText && (
        <p className="mt-2 text-sm text-blue-600">
          Selected: "
          {selectedText.length > 60
            ? `${selectedText.substring(0, 60)}...`
            : selectedText}
          "
        </p>
      )}

      <div className="mt-4 flex items-center gap-3 flex-wrap">
        <TranslateButton
          passage={passage}
          selectedText={selectedText}
        />

        <Button
          icon={<ClearOutlined />}
          onClick={() => {
            onClear()
            setSelectedText('')
          }}
          disabled={!passage}
          size="large"
          loading={translating}
        >
          Clear
        </Button>
      </div>
    </div>
  )
}