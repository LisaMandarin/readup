import { CloseOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Alert, Button, Input, Rate, Space } from "antd";
import { evaluateComprehensionRequest } from "../api/comprehension";

type Props = {
  passage: string;
  onClose: () => void;
};

export default function Comprehension(props: Props) {
  const { passage, onClose } = props;
  const [summary, setSummary] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [advice, setAdvice] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const hasSummary = summary.trim().length > 0;

  const handleRate = async () => {
    setIsLoading(true);
    setError("");

    try {
      const { data } = await evaluateComprehensionRequest(passage, summary);
      setScore(data.score);
      setAdvice(data.advice);
    } catch (err) {
      const message =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof err.response === "object" &&
        err.response !== null &&
        "data" in err.response &&
        typeof err.response.data === "object" &&
        err.response.data !== null &&
        "detail" in err.response.data &&
        typeof err.response.data.detail === "string"
          ? err.response.data.detail
          : err instanceof Error
            ? err.message
            : "Failed to evaluate summary";
      setScore(null);
      setAdvice("");
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSummary("");
    setScore(null);
    setAdvice("");
    setError("");
  };

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
          loading={isLoading}
          onClick={handleRate}
        >
          Rate My Summary
        </Button>
        <Button onClick={handleClear}>Clear</Button>
      </Space>

      {error && (
        <div className="mt-4 px-4">
          <Alert type="error" showIcon message={error} />
        </div>
      )}

      {score !== null && (
        <>
          <div className="mt-4 px-4">
            <Rate count={5} value={score} disabled />
          </div>
          <p className="px-4">
            {advice}
          </p>
        </>
      )}
    </>
  );
}
