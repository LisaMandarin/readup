import type { TargetLanguage } from '../components/targetLanguages'

export const lookupInstructions = [
  'Select the word or phrase in the original text.',
  'When the popup menu appears, choose what you want to look up.',
  'Click the Look Up button and wait for the results.',
]

export const chineseInstructions = [
  '在原文中選取你想查詢的單字或片語。',
  '當彈出選單出現時，選擇你要查詢的內容。',
  '點擊「Look Up」按鈕，等待結果顯示。',
]

export const spanishInstructions_es = [
  'Selecciona la palabra o frase en el texto original.',
  'Cuando aparezca el menú emergente, elige lo que quieres consultar.',
  'Haz clic en "Look Up" y espera a que aparezcan los resultados.',
]

export const frenchInstructions_fr = [
  'Sélectionnez le mot ou l’expression dans le texte original.',
  'Lorsque le menu contextuel apparaît, choisissez ce que vous souhaitez consulter.',
  'Cliquez sur « Look Up » et attendez que les résultats s’affichent.',
]

export const germanInstructions_de = [
  'Wählen Sie das Wort oder die Phrase im Originaltext aus.',
  'Wenn das Popup-Menü erscheint, wählen Sie aus, was Sie nachschlagen möchten.',
  'Klicken Sie auf „Look Up“ und warten Sie, bis die Ergebnisse angezeigt werden.',
]

export const portugueseInstructions_pt = [
  'Selecione a palavra ou frase no texto original.',
  'Quando o menu pop-up aparecer, escolha o que você quer consultar.',
  'Clique no botão "Look Up" e espere os resultados aparecerem.',
]

export const lookupInstructionsByLanguage: Record<TargetLanguage, string[]> = {
  chinese: chineseInstructions,
  spanish: spanishInstructions_es,
  french: frenchInstructions_fr,
  german: germanInstructions_de,
  portuguese: portugueseInstructions_pt,
}
