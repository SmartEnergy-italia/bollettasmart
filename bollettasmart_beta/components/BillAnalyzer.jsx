import { useState } from 'react';
import { Card, Form, Button, Spinner, Alert, Table } from 'react-bootstrap';

function BillAnalyzer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    setLoading(true);
    setResults(null);
    setError(null);
    
    try {
      // Simulazione dell'analisi della bolletta
      // In futuro, qui verrà inserita l'integrazione con AWS Textract
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Dati simulati dell'analisi
      const mockResults = {
        fields: {
          "Importo totale": "€ 127,45",
          "Data scadenza": "15/06/2023",
          "Numero cliente": "123456789",
          "Periodo fatturazione": "Mar 2023 - Apr 2023",
          "Consumi": "450 kWh"
        },
        text: "FATTURA ENERGETICA\n\nNumero cliente: 123456789\nData emissione: 15/04/2023\nPeriodo fatturazione: Mar 2023 - Apr 2023\n\nConsumi: 450 kWh\nImporto energia: € 112,50\nIVA 13%: € 14,95\n\nImporto totale: € 127,45\n\nData scadenza: 15/06/2023"
      };
      
      setResults(mockResults);
    } catch (err) {
      console.error('Errore durante l\'analisi:', err);
      setError('Si è verificato un errore durante l\'analisi della bolletta.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bill-analyzer">
      <Card className="shadow-sm">
        <Card.Header as="h5" className="bg-white">Analisi Bollette</Card.Header>
        <Card.Body>
          <Card.Text>
            Carica una bolletta (immagine o PDF) per estrarre automaticamente le informazioni principali.
          </Card.Text>
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Seleziona un file</Form.Label>
              <Form.Control 
                type="file" 
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf"
              />
              <Form.Text muted>
                Formati supportati: JPEG, PNG, PDF (max 10MB)
              </Form.Text>
            </Form.Group>
            
            <Button 
              variant="primary" 
              type="submit" 
              disabled={!file || loading}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Analisi in corso...
                </>
              ) : 'Analizza Bolletta'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
      
      {error && (
        <Alert variant="danger" className="mt-4">
          {error}
        </Alert>
      )}
      
      {results && (
        <Card className="results shadow-sm">
          <Card.Header as="h5" className="bg-white">Risultati dell'Analisi</Card.Header>
          <Card.Body>
            <h6>Campi estratti</h6>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Campo</th>
                  <th>Valore</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(results.fields).map(([key, value]) => (
                  <tr key={key}>
                    <td><strong>{key}</strong></td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            
            <h6 className="mt-4">Testo estratto</h6>
            <pre className="bg-light p-3 rounded">
              {results.text}
            </pre>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default BillAnalyzer;