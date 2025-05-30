const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
const multer = require('multer');

const app = express();
const port = process.env.PORT || 3000;

// Configurazione AWS
AWS.config.update({
  region: process.env.AWS_REGION || 'eu-west-1'
});

const textract = new AWS.Textract();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Estrattore bollette italiane
class UniversalBillExtractor {
  extractAllFields(text) {
    const data = {
      cliente: {
        tipoCliente: this.extractCustomerType(text),
        nomeCliente: this.extractCustomerName(text),
        indirizzoCliente: this.extractCustomerAddress(text),
        codiceCliente: this.extractCustomerCode(text),
        codiceFiscale: this.extractFiscalCode(text),
        partitaIVA: this.extractVATNumber(text),
        pod: this.extractPOD(text)
      },
      identificativiFornitura: {
        tipoFornitura: this.extractSupplyType(text),
        indirizzoFornitura: this.extractSupplyAddress(text),
        contatore: this.extractMeter(text),
        codiceDistributore: this.extractDistributorCode(text),
        remi: this.extractREMI(text),
        tipoTariffa: this.extractTariffType(text),
        potenzaImpegnata: this.extractPowerCommitted(text)
      },
      informazioniFornitore: {
        nomeFornitore: this.extractSupplier(text),
        codiceFornitore: this.extractSupplierCode(text),
        indirizzoFornitore: this.extractSupplierAddress(text),
        servizioClienti: this.extractCustomerService(text),
        servizioTecnico: this.extractTechnicalService(text)
      },
      consumiLetture: {
        letturaPreced: this.extractPreviousReading(text),
        letturaAttuale: this.extractCurrentReading(text),
        consumoTotale: this.extractConsumption(text),
        consumoStimato: this.extractEstimatedConsumption(text),
        consumoF1: this.extractF1Consumption(text),
        consumoF2: this.extractF2Consumption(text),
        consumoF3: this.extractF3Consumption(text),
        energiaReattiva: this.extractReactiveEnergy(text)
      },
      costiTariffe: {
        costoEnergia: this.extractEnergyCost(text),
        costoTrasporto: this.extractTransportCost(text),
        oneriSistema: this.extractSystemCharges(text),
        imposte: this.extractTaxes(text),
        prezzoUnitario: this.extractUnitPrice(text),
        importoTotale: this.extractTotalAmount(text)
      },
      datiBolletta: {
        dataBolletta: this.extractBillDate(text),
        dataScadenza: this.extractDueDate(text),
        inizioPeriodo: this.extractPeriodStart(text),
        finePeriodo: this.extractPeriodEnd(text)
      },
      altriDati: {
        numeroContratto: this.extractContractNumber(text)
      }
    };

    data.qualityScore = this.calculateQualityScore(data);
    return data;
  }

  extractCustomerType(text) {
    const patterns = [
      /tipo\s*cliente[\s:]*([^\n]+)/i,
      /tipologia[\s:]*([^\n]+)/i,
      /domestico|non domestico|business|residenziale/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1] || match[0].trim();
    }
    return "N/D";
  }

  extractCustomerName(text) {
    const patterns = [
      /intestatario[\s:]*([^\n]+)/i,
      /cliente[\s:]*([A-Za-zÀ-ÿ\s\.]+)/i,
      /denominazione[\s:]*([^\n]+)/i,
      /ragione\s*sociale[\s:]*([^\n]+)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const name = match[1].trim();
        if (name.length > 3 && !name.match(/\d{5,}/)) {
          return name;
        }
      }
    }
    return "N/D";
  }

  extractCustomerAddress(text) {
    const patterns = [
      /indirizzo[\s:]*([^\n]+)/i,
      /via[\s]+([^,\n]+)/i,
      /presso[\s:]*([^\n]+)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }
    return "N/D";
  }

  extractCustomerCode(text) {
    const patterns = [
      /codice\s*cliente[\s:]*([A-Z0-9]+)/i,
      /cod[\.\s]*cliente[\s:]*([A-Z0-9]+)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }
    return "N/D";
  }

  extractFiscalCode(text) {
    const patterns = [
      /codice\s*fiscale[\s:]*([A-Z0-9]{16})/i,
      /c[\.\s]*f[\.\s]*([A-Z0-9]{16})/i,
      /([A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z])/
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }
    return "N/D";
  }

  extractVATNumber(text) {
    const patterns = [
      /partita\s*iva[\s:]*([0-9]{11})/i,
      /p[\.\s]*iva[\s:]*([0-9]{11})/i,
      /([0-9]{11})/
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1].length === 11) return match[1].trim();
    }
    return "N/D";
  }

  extractPOD(text) {
    const patterns = [
      /pod[\s:]*([A-Z0-9]{14,16})/i,
      /punto\s*prelievo[\s:]*([A-Z0-9]+)/i,
      /(IT[0-9A-Z]{14})/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }
    return "N/D";
  }

  extractSupplier(text) {
    const suppliers = ['ENEL', 'Edison', 'A2A', 'Sorgenia', 'Eni', 'Acea', 'Hera', 'Iren'];
    
    for (const supplier of suppliers) {
      if (text.toUpperCase().includes(supplier.toUpperCase())) {
        return supplier;
      }
    }
    
    const patterns = [
      /fornitore[\s:]*([^\n]+)/i,
      /società[\s:]*([^\n]+)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }
    return "N/D";
  }

  extractSupplyType(text) {
    const patterns = [
      /elettricità|energia\s*elettrica/i,
      /gas\s*naturale|gas/i,
      /tipo\s*fornitura[\s:]*([^\n]+)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1] || match[0].trim();
    }
    return "N/D";
  }

  extractConsumption(text) {
    const patterns = [
      /consumo[\s:]*([0-9]+(?:[,.][0-9]+)?)\s*kwh/i,
      /([0-9]+(?:[,.][0-9]+)?)\s*kwh/i,
      /totale[\s:]*([0-9]+(?:[,.][0-9]+)?)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].replace(',', '.');
    }
    return "N/D";
  }

  extractTotalAmount(text) {
    const patterns = [
      /totale[\s:]*€\s*([0-9]+(?:[,.][0-9]+)?)/i,
      /importo[\s:]*€\s*([0-9]+(?:[,.][0-9]+)?)/i,
      /€\s*([0-9]+(?:[,.][0-9]+)?)/
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].replace(',', '.');
    }
    return "N/D";
  }

  // Metodi stub per campi non prioritari
  extractSupplyAddress(text) { return "N/D"; }
  extractMeter(text) { return "N/D"; }
  extractDistributorCode(text) { return "N/D"; }
  extractREMI(text) { return "N/D"; }
  extractTariffType(text) { return "N/D"; }
  extractPowerCommitted(text) { return "N/D"; }
  extractSupplierCode(text) { return "N/D"; }
  extractSupplierAddress(text) { return "N/D"; }
  extractCustomerService(text) { return "N/D"; }
  extractTechnicalService(text) { return "N/D"; }
  extractPreviousReading(text) { return "N/D"; }
  extractCurrentReading(text) { return "N/D"; }
  extractEstimatedConsumption(text) { return false; }
  extractF1Consumption(text) { return "N/D"; }
  extractF2Consumption(text) { return "N/D"; }
  extractF3Consumption(text) { return "N/D"; }
  extractReactiveEnergy(text) { return "N/D"; }
  extractEnergyCost(text) { return "N/D"; }
  extractTransportCost(text) { return "N/D"; }
  extractSystemCharges(text) { return "N/D"; }
  extractTaxes(text) { return "N/D"; }
  extractUnitPrice(text) { return "N/D"; }
  extractBillDate(text) { return "N/D"; }
  extractDueDate(text) { return "N/D"; }
  extractPeriodStart(text) { return "N/D"; }
  extractPeriodEnd(text) { return "N/D"; }
  extractContractNumber(text) { return "N/D"; }

  calculateQualityScore(data) {
    function countFields(obj) {
      let total = 0;
      let filled = 0;
      
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null) {
          const nested = countFields(value);
          total += nested.total;
          filled += nested.filled;
        } else {
          total++;
          if (value !== "N/D" && value !== null && value !== "") {
            filled++;
          }
        }
      }
      
      return { total, filled };
    }

    const counts = countFields(data);
    return Math.round((counts.filled / counts.total) * 100);
  }
}

// Routes
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'BollettaSmart Backend',
    timestamp: new Date().toISOString(),
    endpoints: ['/api/analyze-bill', '/api/analyze-bill-base64']
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'BollettaSmart API',
    version: '1.0.0',
    status: 'active',
    endpoints: {
      health: '/health',
      analyze: '/api/analyze-bill',
      analyzeBase64: '/api/analyze-bill-base64'
    }
  });
});

app.post('/api/analyze-bill', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Nessun file caricato'
      });
    }

    const params = {
      Document: {
        Bytes: req.file.buffer
      }
    };

    const result = await textract.detectDocumentText(params).promise();

    const extractedText = result.Blocks
      .filter(block => block.BlockType === 'LINE')
      .map(block => block.Text)
      .join('\n');

    const extractor = new UniversalBillExtractor();
    const extractedData = extractor.extractAllFields(extractedText);

    res.json({
      success: true,
      data: extractedData,
      fileName: req.file.originalname,
      extractedText: extractedText.substring(0, 500) + '...'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      details: "Errore nell'estrazione della bolletta"
    });
  }
});

app.post('/api/analyze-bill-base64', async (req, res) => {
  try {
    const { fileContent, fileName } = req.body;

    if (!fileContent) {
      return res.status(400).json({
        success: false,
        error: 'Contenuto file mancante'
      });
    }

    const fileBuffer = Buffer.from(fileContent, 'base64');

    const params = {
      Document: {
        Bytes: fileBuffer
      }
    };

    const result = await textract.detectDocumentText(params).promise();

    const extractedText = result.Blocks
      .filter(block => block.BlockType === 'LINE')
      .map(block => block.Text)
      .join('\n');

    const extractor = new UniversalBillExtractor();
    const extractedData = extractor.extractAllFields(extractedText);

    res.json({
      success: true,
      data: extractedData,
      fileName: fileName,
      extractedText: extractedText.substring(0, 500) + '...'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      details: "Errore nell'estrazione della bolletta"
    });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`BollettaSmart Backend running on port ${port}`);
});

module.exports = app;