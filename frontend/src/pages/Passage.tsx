import { useState } from "react";
import { Button, Card, Input, Space } from "antd";
import Comprehension from "../components/Comprehension";
import type { TargetLanguage } from "../components/targetLanguages";

type Props = {
  passage: string;
  targetLanguage: TargetLanguage | "";
  onPassageChange: (value: string) => void;
  onTranslate: () => void;
  onClear: () => void;
};

export default function Passage(props: Props) {
  const { passage, targetLanguage, onPassageChange, onTranslate, onClear } =
    props;
  const [isComprehensionOpen, setIsComprehensionOpen] = useState(false);
  const hasPassage = passage.trim().length > 0;
  const isTranslateDisabled = !hasPassage || targetLanguage.length === 0;
  const needsTargetLanguage = hasPassage && targetLanguage.length === 0;

  const resetComprehension = () => {
    setIsComprehensionOpen(false);
  };

  const handlePassageChange = (value: string) => {
    if (value.trim().length === 0) {
      resetComprehension();
    }

    onPassageChange(value);
  };

  const handleClear = () => {
    resetComprehension();
    onClear();
  };

  return (
    <Card
      className="mt-4"
      style={{
        background: "var(--card-bg)",
      }}
    >
      <Input.TextArea
        rows={5}
        value={passage}
        onChange={(event) => handlePassageChange(event.target.value)}
        placeholder="Enter the passage you want to translate"
      />

      <Space className="mt-4">
        <Button
          type="primary"
          onClick={onTranslate}
          disabled={isTranslateDisabled}
        >
          Translation
        </Button>
        <Button onClick={handleClear}>Clear</Button>
      </Space>
      {needsTargetLanguage && (
        <p className="mt-3 mb-0 text-sm text-amber-700">
          Select a target language in Settings to enable translation.
        </p>
      )}
      {!isComprehensionOpen && (
        <Button
          className="mt-4 comprehension-button"
          type="primary"
          size="large"
          block
          disabled={!hasPassage}
          onClick={() => setIsComprehensionOpen(true)}
        >
          Test My Comprehension
        </Button>
      )}

      {hasPassage && isComprehensionOpen && (
        <Comprehension onClose={resetComprehension} />
      )}
    </Card>
  );
}
