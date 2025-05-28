import { useState } from 'react'

export default function BillAnalyzer() {
  const [fileName, setFileName] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFileName(file.name)
    }
  }

  return (
    <div>
      <p>Carica la tua bolletta per analizzarla automaticamente</p>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      {fileName && <p>Hai selezionato: {fileName}</p>}
    </div>
  )
}
