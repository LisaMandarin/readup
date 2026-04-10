import { CloseOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Button, Input, Rate, Space } from "antd";

type Props = {
  onClose: () => void;
};

export default function Comprehension(props: Props) {
  const { onClose } = props;
  const [summary, setSummary] = useState("");
  const [showRating, setShowRating] = useState(false);
  const hasSummary = summary.trim().length > 0;

  return (
    <>
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          aria-label="Close comprehension section"
          className="comprehension-toggle-button"
          onClick={onClose}
        >
          <CloseOutlined aria-hidden="true" />
        </button>
      </div>

      <Input.TextArea
        className="mt-3"
        rows={5}
        value={summary}
        onChange={(event) => setSummary(event.target.value)}
        placeholder="Write the summary of the passage"
      />

      <Space className="mt-4">
        <Button
          type="primary"
          disabled={!hasSummary}
          onClick={() => setShowRating(true)}
        >
          Rate My Summary
        </Button>
        <Button
          onClick={() => {
            setSummary("");
            setShowRating(false);
          }}
        >
          Clear
        </Button>
      </Space>

      {showRating && (
        <>
          <div className="mt-4 px-4">
            <Rate count={5} />
          </div>
          <p className="px-4">
            Here is the advice from ReadUp expert. Here is the advice from
            ReadUp expert. Here is the advice from ReadUp expert. Here is the
            advice from ReadUp expert. Here is the advice from ReadUp expert.
          </p>
        </>
      )}
    </>
  );
}
