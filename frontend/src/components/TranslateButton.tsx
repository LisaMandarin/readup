import { useState, useEffect } from "react";
import {
  Button,
  Select,
  Modal,
  Typography,
  message,
  Space,
  Spin,
  Card,
  Tooltip,
} from "antd";
import { TranslationOutlined, SwapOutlined, CopyOutlined } from "@ant-design/icons";
import {
  getLanguages,
  translateText,
  type Language,
  type TranslateResponse,
} from "../api/translate";

const { Text, Paragraph } = Typography;

interface TranslateButtonProps {
  passage: string;
  selectedText?: string;
}

export default function TranslateButton({
  passage,
  selectedText,
}: TranslateButtonProps) {
  const [open, setOpen] = useState(false);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loadingLangs, setLoadingLangs] = useState(false);
  const [targetLang, setTargetLang] = useState("es");
  const [translating, setTranslating] = useState(false);
  const [result, setResult] = useState<TranslateResponse | null>(null);

  // The text we'll translate: selected text or the full passage
  const textToTranslate = selectedText?.trim() || passage.trim();

  // Fetch languages when modal opens
  useEffect(() => {
    if (open && languages.length === 0) {
      setLoadingLangs(true);
      getLanguages()
        .then((res) => setLanguages(res.data))
        .catch(() => message.error("Failed to load languages"))
        .finally(() => setLoadingLangs(false));
    }
  }, [open, languages.length]);

  const handleTranslate = async () => {
    if (!textToTranslate) {
      message.warning("No text to translate. Enter a passage first.");
      return;
    }

    setTranslating(true);
    setResult(null);

    try {
      const { data } = await translateText({
        text: textToTranslate,
        source_language: "auto",
        target_language: targetLang,
      });
      setResult(data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      const detail = error.response?.data?.detail;
      message.error(
        typeof detail === "string" ? detail : "Translation failed"
      );
    } finally {
      setTranslating(false);
    }
  };

  const handleCopy = () => {
    if (result?.translated_text) {
      navigator.clipboard.writeText(result.translated_text);
      message.success("Copied to clipboard!");
    }
  };

  const handleOpen = () => {
    if (!textToTranslate) {
      message.warning("Enter or select some text first.");
      return;
    }
    setResult(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setResult(null);
  };

  // Find language name by code
  const getLangName = (code: string) =>
    languages.find((l) => l.code === code)?.name || code;

  return (
    <>
      <Tooltip title="Translate passage or selected text">
        <Button
          icon={<TranslationOutlined />}
          onClick={handleOpen}
          type="primary"
          size="large"
          disabled={!textToTranslate}
        >
          Translate
        </Button>
      </Tooltip>

      <Modal
        title={
          <Space>
            <TranslationOutlined />
            <span>Translate Text</span>
          </Space>
        }
        open={open}
        onCancel={handleClose}
        footer={null}
        width={640}
        destroyOnClose
      >
        {/* Source text preview */}
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {selectedText ? "Selected text" : "Full passage"} •{" "}
            {textToTranslate.length} characters
          </Text>
          <Card
            size="small"
            style={{
              marginTop: 4,
              maxHeight: 120,
              overflow: "auto",
              background: "#fafafa",
            }}
          >
            <Paragraph
              style={{ marginBottom: 0, whiteSpace: "pre-wrap" }}
              ellipsis={{ rows: 4, expandable: true, symbol: "more" }}
            >
              {textToTranslate}
            </Paragraph>
          </Card>
        </div>

        {/* Language selector + Translate button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <Text style={{ whiteSpace: "nowrap" }}>Auto-detect</Text>

          <SwapOutlined style={{ fontSize: 18, color: "#999" }} />

          {loadingLangs ? (
            <Spin size="small" />
          ) : (
            <Select
              value={targetLang}
              onChange={setTargetLang}
              style={{ width: 200 }}
              showSearch
              optionFilterProp="label"
              options={languages.map((lang) => ({
                value: lang.code,
                label: lang.name,
              }))}
              placeholder="Target language"
            />
          )}

          <Button
            type="primary"
            onClick={handleTranslate}
            loading={translating}
          >
            Translate
          </Button>
        </div>

        {/* Translation result */}
        {translating && (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <Spin size="large" />
            <Paragraph type="secondary" style={{ marginTop: 12 }}>
              Translating...
            </Paragraph>
          </div>
        )}

        {result && !translating && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <Text type="secondary" style={{ fontSize: 12 }}>
                Translated to {getLangName(result.target_language)}
              </Text>
              <Tooltip title="Copy translation">
                <Button
                  icon={<CopyOutlined />}
                  size="small"
                  type="text"
                  onClick={handleCopy}
                />
              </Tooltip>
            </div>
            <Card
              size="small"
              style={{
                background: "#f0f5ff",
                borderColor: "#adc6ff",
                maxHeight: 200,
                overflow: "auto",
              }}
            >
              <Paragraph
                style={{
                  marginBottom: 0,
                  whiteSpace: "pre-wrap",
                  fontSize: 15,
                }}
              >
                {result.translated_text}
              </Paragraph>
            </Card>
          </div>
        )}
      </Modal>
    </>
  );
}