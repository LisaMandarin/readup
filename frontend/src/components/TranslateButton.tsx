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
  Divider,
} from "antd";
import {
  TranslationOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import {
  getLanguages,
  translateText,
  type Language,
  type TranslateResponse,
  type TargetLanguage,
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
  const [targetLang, setTargetLang] = useState<TargetLanguage>("spanish");
  const [translating, setTranslating] = useState(false);
  const [result, setResult] = useState<TranslateResponse | null>(null);

  const textToTranslate = selectedText?.trim() || passage.trim();

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
        passage: textToTranslate,
        targetLanguage: targetLang,
      });
      setResult(data);
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { detail?: unknown } };
      };

      console.error("Translate error:", error.response?.data || err);

      const detail = error.response?.data?.detail;

      if (typeof detail === "string") {
        message.error(detail);
      } else {
        message.error("Translation failed");
      }
    } finally {
      setTranslating(false);
    }
  };

  const handleCopy = () => {
    if (!result?.translations?.length) return;

    const joined = result.translations
      .map((item) => item.translation)
      .join(" ");

    navigator.clipboard.writeText(joined);
    message.success("Copied to clipboard!");
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
        width={750}
        destroyOnClose
      >
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

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          {loadingLangs ? (
            <Spin size="small" />
          ) : (
            <Select
              value={targetLang}
              onChange={(value) => setTargetLang(value as TargetLanguage)}
              style={{ width: 220 }}
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
                marginBottom: 8,
              }}
            >
              <Text type="secondary" style={{ fontSize: 12 }}>
                Translated to {getLangName(result.session.targetLanguage)}
              </Text>
              <Tooltip title="Copy full translation">
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
                maxHeight: 350,
                overflow: "auto",
              }}
            >
              {result.translations.map((item) => (
                <div key={item.uid} style={{ marginBottom: 20 }}>
                  <Paragraph
                    style={{
                      marginBottom: 4,
                      color: "#666",
                      fontSize: 13,
                    }}
                  >
                    {item.sentence}
                  </Paragraph>

                  <Paragraph
                    style={{
                      marginBottom: 8,
                      whiteSpace: "pre-wrap",
                      fontSize: 15,
                      fontWeight: 500,
                    }}
                  >
                    {item.translation}
                  </Paragraph>

                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Lemma: {item.lemma.join(", ")}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    POS: {item.pos.join(", ")}
                  </Text>

                  <Divider style={{ margin: "12px 0" }} />
                </div>
              ))}
            </Card>
          </div>
        )}
      </Modal>
    </>
  );
}