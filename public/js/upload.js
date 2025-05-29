document.addEventListener('DOMContentLoaded', function() {
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.querySelector('input[type="file"]');
  const uploadForm = document.getElementById('upload-form');
  const resultContainer = document.getElementById('result-container');
  const uploadProgress = document.getElementById('upload-progress');
  const uploadSuccess = document.getElementById('upload-success');
  const loadingAnalysis = document.getElementById('loading-analysis');
  const progressBar = document.getElementById('progress-bar');
  const progressPercentage = document.getElementById('progress-percentage');
  const startAnalysisBtn = document.getElementById('start-analysis-btn');
  const demoBtn = document.getElementById('demo-btn');
  
  // Gestione drag & drop solo se gli elementi esistono
  if (dropZone) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, preventDefaults, false);
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, unhighlight, false);
    });
    
    dropZone.addEventListener('drop', handleDrop, false);
  }
  
  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  function highlight() {
    if (dropZone && dropZone.classList) {
      dropZone.classList.add('border-emerald-500', 'bg-emerald-50');
    }
  }
  
  function unhighlight() {
    if (dropZone && dropZone.classList) {
      dropZone.classList.remove('border-emerald-500', 'bg-emerald-50');
    }
  }
  
  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length) {
      fileInput.files = files;
      const fileName = files[0].name;
      updateFileNameDisplay(fileName);
    }
  }
  
  if (fileInput) {
    fileInput.addEventListener('change', function() {
      if (fileInput.files.length) {
        const fileName = fileInput.files[0].name;
        updateFileNameDisplay(fileName);
      }
    });
  }
  
  function updateFileNameDisplay(fileName) {
    const fileNameDisplay = document.getElementById('file-name-display');
    if (fileNameDisplay) {
      fileNameDisplay.textContent = fileName;
      if (fileNameDisplay.classList) {
        fileNameDisplay.classList.remove('hidden');
      }
    }
  }
  
  if (uploadForm) {
    uploadForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!fileInput.files.length) {
      alert('Seleziona un file da caricare');
      return;
    }
    
    // Reset stati
    hideAllStates();
    if (uploadProgress && uploadProgress.classList) {
      uploadProgress.classList.remove('hidden');
      // Simula progresso upload
      animateProgress();
    }
    
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    
    try {
      const response = await fetch('/api/bolletta', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      // Completa la barra di progresso
      if (progressBar) progressBar.style.width = '100%';
      if (progressPercentage) progressPercentage.textContent = '100%';
      
      setTimeout(() => {
        if (uploadProgress && uploadProgress.classList) uploadProgress.classList.add('hidden');
        
        if (data.success) {
          // Mostra messaggio di successo upload
          if (uploadSuccess && uploadSuccess.classList) uploadSuccess.classList.remove('hidden');
        } else {
          displayError(data.message || 'Errore durante l\'elaborazione del file');
        }
      }, 500);
      
    } catch (error) {
      console.error('Errore:', error);
      if (uploadProgress && uploadProgress.classList) uploadProgress.classList.add('hidden');
      displayError('Errore di connessione al server');
    }
    });
  }
  
  // Gestisci click su "Avvia Analisi AI"
  if (startAnalysisBtn) {
    startAnalysisBtn.addEventListener('click', async function() {
      if (uploadSuccess && uploadSuccess.classList) uploadSuccess.classList.add('hidden');
      if (loadingAnalysis && loadingAnalysis.classList) loadingAnalysis.classList.remove('hidden');
      
      // Informa che l'analisi sarà disponibile su AWS
      setTimeout(() => {
        if (loadingAnalysis && loadingAnalysis.classList) loadingAnalysis.classList.add('hidden');
        displayError('L\'analisi AI sarà disponibile dopo la migrazione su AWS con Textract.');
      }, 2000);
    });
  }
  
  // Gestisci click su "Prova con una bolletta di esempio"
  if (demoBtn) {
    demoBtn.addEventListener('click', function() {
      hideAllStates();
      showDemoAnalysis();
    });
  }
  
  function showDemoAnalysis() {
    const demoData = {
      extractedData: {
        // Cliente (7 campi)
        customerName: "Mario Rossi",
        customerAddress: "Via Roma 45, 20100 Milano (MI)",
        customerCode: "1234567890",
        vatNumber: "12345678901",
        fiscalCode: "RSSMRA80A01F205X",
        contractNumber: "CON123456789",
        pod: "IT001E12345678901234567",

        // Identificativi Fornitura (7 campi)
        supplyType: "ENERGIA ELETTRICA",
        supplyAddress: "Via Roma 45, 20100 Milano (MI)",
        meter: "E12345678",
        distributorCode: "E-DISTRIBUZIONE",
        remi: "REMI123456",
        tariffType: "Mercato Libero - Monorario",
        powerCommitted: "3,0 kW",

        // Informazioni Fornitore (5 campi)
        supplierName: "ENEL Energia S.p.A.",
        supplierCode: "ENEL001",
        supplierAddress: "Viale Regina Margherita 125, 00198 Roma",
        customerService: "800.900.800",
        technicalService: "803.500",

        // Consumi e Letture (8 campi)
        previousReading: "12450 kWh",
        currentReading: "12730 kWh",
        consumption: "280 kWh",
        estimatedConsumption: false,
        f1Consumption: "120 kWh",
        f2Consumption: "100 kWh",
        f3Consumption: "60 kWh",
        reactiveEnergy: "15 kvarh",

        // Costi e Tariffe (6 campi)
        energyCost: "65,80 €",
        transportCost: "18,20 €",
        systemCharges: "12,45 €",
        taxes: "15,30 €",
        unitPrice: "0,235 €/kWh",
        totalAmount: "96,45 €",

        // Date e Periodi (4 campi)
        billDate: "15/01/2025",
        dueDate: "15/02/2025",
        periodStart: "15/12/2024",
        periodEnd: "15/01/2025"
      },
      recommendations: [
        {
          id: 1,
          supplierName: "Edison Energia",
          offerName: "Web Luce",
          estimatedMonthlyCost: 77.45,
          currentCost: 142.80,
          savingsPercent: 46,
          contractType: "fisso",
          pricePerKwh: "0.089 €/kWh",
          monthlyFee: "8.50 €/mese",
          features: [
            "Prezzo fisso per 24 mesi",
            "Energia 100% verde certificata",
            "Bolletta digitale gratuita",
            "Attivazione online gratuita"
          ],
          bestOffer: true
        },
        {
          id: 2,
          supplierName: "Sorgenia",
          offerName: "Next Energy Sunlight",
          estimatedMonthlyCost: 82.30,
          currentCost: 142.80,
          savingsPercent: 42,
          contractType: "variabile",
          pricePerKwh: "0.095 €/kWh",
          monthlyFee: "9.90 €/mese",
          features: [
            "Energia da fonti rinnovabili",
            "App mobile con monitoraggio consumi",
            "Servizio clienti dedicato",
            "Sconto benvenuto primo anno"
          ]
        },
        {
          id: 3,
          supplierName: "Eni Plenitude",
          offerName: "Link Luce",
          estimatedMonthlyCost: 85.60,
          currentCost: 142.80,
          savingsPercent: 40,
          contractType: "fisso",
          pricePerKwh: "0.098 €/kWh",
          monthlyFee: "8.90 €/mese",
          features: [
            "Sconto fedeltà multi-servizio",
            "Prezzo bloccato 12 mesi",
            "Punti Payback su ogni bolletta",
            "Assistenza telefonica gratuita"
          ]
        },
        {
          id: 4,
          supplierName: "A2A Energia",
          offerName: "Click Luce",
          estimatedMonthlyCost: 88.15,
          currentCost: 142.80,
          savingsPercent: 38,
          contractType: "fisso",
          pricePerKwh: "0.102 €/kWh",
          monthlyFee: "7.50 €/mese",
          features: [
            "Tariffa web conveniente",
            "Energia verde lombarda",
            "Gestione online completa",
            "Primo mese gratuito"
          ]
        },
        {
          id: 5,
          supplierName: "Illumia",
          offerName: "Luce Casa Web",
          estimatedMonthlyCost: 91.20,
          currentCost: 142.80,
          savingsPercent: 36,
          contractType: "fisso",
          pricePerKwh: "0.105 €/kWh",
          monthlyFee: "8.00 €/mese",
          features: [
            "Prezzo fisso 24 mesi",
            "Energia certificata verde",
            "Area clienti digitale",
            "Nessun costo di attivazione"
          ]
        }
      ],
      qualityReport: {
        score: 95,
        totalFields: 38,
        extractedFields: 36,
        missingFields: ['supplierAddress', 'reactiveEnergy']
      },
      estimatedSavings: {
        currentAnnualCost: 1157.40,
        bestAnnualCost: 985.80,
        annualSavings: 171.60,
        savingsPercentage: 15
      }
    };
    
    displayBillAnalysis(demoData);
  }
  
  function hideAllStates() {
    if (uploadProgress && uploadProgress.classList) uploadProgress.classList.add('hidden');
    if (uploadSuccess && uploadSuccess.classList) uploadSuccess.classList.add('hidden');  
    if (loadingAnalysis && loadingAnalysis.classList) loadingAnalysis.classList.add('hidden');
    if (resultContainer) resultContainer.innerHTML = '';
  }
  
  function animateProgress() {
    if (!progressBar || !progressPercentage) return;
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 90) progress = 90;
      
      progressBar.style.width = progress + '%';
      progressPercentage.textContent = Math.round(progress) + '%';
      
      if (progress >= 90) {
        clearInterval(interval);
      }
    }, 200);
  }
  
  function displayResults(data) {
    if (data.data) {
      // Usa la nuova visualizzazione strutturata per i 38 campi
      displayBillAnalysis(data.data);
    } else if (data.analysisResult) {
      // Fallback per il formato precedente
      const result = data.analysisResult;
      const extractedData = result.extractedData;
      const quality = result.qualityReport;
      
      let qualityClass = 'bg-red-100 text-red-800';
      if (quality.score >= 80) {
        qualityClass = 'bg-emerald-100 text-emerald-800';
      } else if (quality.score >= 50) {
        qualityClass = 'bg-yellow-100 text-yellow-800';
      }
      
      resultContainer.innerHTML = `
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-slate-800">Risultati Estrazione</h3>
            <span class="px-3 py-1 rounded-full text-sm font-medium ${qualityClass}">
              Affidabilità: ${quality.score}%
            </span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 rounded-lg bg-slate-50">
              <p class="text-sm font-medium text-slate-500 mb-1">Fornitore</p>
              <p class="font-semibold">${extractedData.provider || 'Non rilevato'}</p>
            </div>
            
            <div class="p-4 rounded-lg bg-slate-50">
              <p class="text-sm font-medium text-slate-500 mb-1">Numero Fattura</p>
              <p class="font-semibold">${extractedData.invoiceNumber || 'Non rilevato'}</p>
            </div>
            
            <div class="p-4 rounded-lg bg-slate-50">
              <p class="text-sm font-medium text-slate-500 mb-1">Data Fattura</p>
              <p class="font-semibold">${extractedData.date || 'Non rilevato'}</p>
            </div>
            
            <div class="p-4 rounded-lg bg-slate-50">
              <p class="text-sm font-medium text-slate-500 mb-1">Importo Totale</p>
              <p class="font-semibold">${extractedData.totalAmount ? `€ ${extractedData.totalAmount.toFixed(2)}` : 'Non rilevato'}</p>
            </div>
            
            <div class="p-4 rounded-lg bg-slate-50">
              <p class="text-sm font-medium text-slate-500 mb-1">Consumo</p>
              <p class="font-semibold">${extractedData.consumptionKWh ? `${extractedData.consumptionKWh} kWh` : 'Non rilevato'}</p>
            </div>
            
            <div class="p-4 rounded-lg bg-slate-50">
              <p class="text-sm font-medium text-slate-500 mb-1">Periodo</p>
              <p class="font-semibold">${extractedData.billingPeriod.from && extractedData.billingPeriod.to ? 
                `${extractedData.billingPeriod.from} - ${extractedData.billingPeriod.to}` : 'Non rilevato'}</p>
            </div>
          </div>
          
          ${quality.missingFields.length > 0 ? `
            <div class="mb-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <p class="font-medium text-yellow-800 mb-2">Campi non rilevati:</p>
              <ul class="list-disc pl-5 text-yellow-700">
                ${quality.missingFields.map(field => `<li>${field}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          
          <div class="flex gap-4 justify-end">
            <button id="edit-data-btn" class="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
              Modifica Dati
            </button>
            <button id="confirm-data-btn" class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              Conferma Analisi
            </button>
          </div>
        </div>
      `;
    }
  }
  
  function displayError(message) {
    if (!resultContainer) return;
    
    resultContainer.innerHTML = `
      <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-red-800 font-medium">${message}</p>
        </div>
      </div>
    `;
  }
});