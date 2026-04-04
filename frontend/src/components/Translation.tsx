import { TranslationOutlined } from "@ant-design/icons";
import { Card } from "antd";

import targetLanguageNames from "./targetLanguageNames.json";
import type { TranslationRecord } from "../types";

type Props = {
  translations: TranslationRecord[];
};

export default function Translation(props: Props) {
  const { translations } = props;

  if (translations.length === 0) {
    return null;
  }

  const languageLabel =
    targetLanguageNames[translations[0].targetLanguage].targetLanguageName;

  return (
    <Card
      className="mt-4"
      title={`Translation (${languageLabel})`}
      style={{ background: "var(--card-bg)" }}
    >
      <div className="space-y-4">
        {translations.map((item) => (
          <div
            key={item.uid}
            className="rounded-lg border border-[var(--card-border)] bg-white/70 p-4"
          >
            <p className="m-0 text-sm leading-6 text-[var(--text-main)]">
              {item.sentence}
            </p>
            <div className="mt-3 flex items-start gap-3 rounded-md bg-[rgba(15,95,92,0.08)] px-3 py-3 text-slate-700">
              <TranslationOutlined className="mt-1 text-base text-[var(--accent)]" />
              <p className="m-0 text-sm leading-6">{item.translation}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
