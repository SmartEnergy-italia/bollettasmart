// Gestione visualizzazione risultati analisi bolletta

function displayBillAnalysis(data) {
  const resultsContainer = document.getElementById('result-container');
  if (!resultsContainer) return;

  const extractedData = data.extractedData;
  const recommendations = data.recommendations || [];
  const qualityReport = data.qualityReport;
  const estimatedSavings = data.estimatedSavings;

  resultsContainer.innerHTML = `
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-bold text-gray-900">Risultati Analisi Bolletta</h3>
        <div class="flex items-center space-x-2">
          <div class="w-3 h-3 rounded-full ${qualityReport.score >= 80 ? 'bg-green-500' : qualityReport.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}"></div>
          <span class="text-sm font-medium text-gray-600">Qualità estrazione: ${qualityReport.score}%</span>
        </div>
      </div>

      <!-- Dati Cliente -->
      <div class="mb-8">
        <h4 class="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-emerald-200 pb-2">
          👤 Dati Cliente
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${createFieldCard('Nome Cliente', extractedData.customerName)}
          ${createFieldCard('Indirizzo', extractedData.customerAddress)}
          ${createFieldCard('Codice Cliente', extractedData.customerCode)}
          ${createFieldCard('Partita IVA', extractedData.vatNumber)}
          ${createFieldCard('Codice Fiscale', extractedData.fiscalCode)}
          ${createFieldCard('Numero Contratto', extractedData.contractNumber)}
          ${createFieldCard('POD', extractedData.pod)}
        </div>
      </div>

      <!-- Identificativi Fornitura -->
      <div class="mb-8">
        <h4 class="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-blue-200 pb-2">
          🔌 Identificativi Fornitura
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${createFieldCard('Tipo Fornitura', extractedData.supplyType)}
          ${createFieldCard('Indirizzo Fornitura', extractedData.supplyAddress)}
          ${createFieldCard('Contatore', extractedData.meter)}
          ${createFieldCard('Codice Distributore', extractedData.distributorCode)}
          ${createFieldCard('REMI', extractedData.remi)}
          ${createFieldCard('Tipo Tariffa', extractedData.tariffType)}
          ${createFieldCard('Potenza Impegnata', extractedData.powerCommitted)}
        </div>
      </div>

      <!-- Informazioni Fornitore -->
      <div class="mb-8">
        <h4 class="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-purple-200 pb-2">
          🏢 Informazioni Fornitore
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${createFieldCard('Nome Fornitore', extractedData.supplierName)}
          ${createFieldCard('Codice Fornitore', extractedData.supplierCode)}
          ${createFieldCard('Indirizzo Fornitore', extractedData.supplierAddress)}
          ${createFieldCard('Servizio Clienti', extractedData.customerService)}
          ${createFieldCard('Servizio Tecnico', extractedData.technicalService)}
        </div>
      </div>

      <!-- Consumi e Letture -->
      <div class="mb-8">
        <h4 class="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-orange-200 pb-2">
          ⚡ Consumi e Letture
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          ${createFieldCard('Lettura Precedente', extractedData.previousReading)}
          ${createFieldCard('Lettura Attuale', extractedData.currentReading)}
          ${createFieldCard('Consumo Totale', extractedData.consumption, 'highlight')}
          ${createFieldCard('Consumo Stimato', extractedData.estimatedConsumption ? 'Sì' : 'No')}
          ${createFieldCard('Consumo F1', extractedData.f1Consumption)}
          ${createFieldCard('Consumo F2', extractedData.f2Consumption)}
          ${createFieldCard('Consumo F3', extractedData.f3Consumption)}
          ${createFieldCard('Energia Reattiva', extractedData.reactiveEnergy)}
        </div>
      </div>

      <!-- Costi e Tariffe -->
      <div class="mb-8">
        <h4 class="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-green-200 pb-2">
          💰 Costi e Tariffe
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${createFieldCard('Costo Energia', extractedData.energyCost)}
          ${createFieldCard('Costo Trasporto', extractedData.transportCost)}
          ${createFieldCard('Oneri di Sistema', extractedData.systemCharges)}
          ${createFieldCard('Imposte', extractedData.taxes)}
          ${createFieldCard('Prezzo Unitario', extractedData.unitPrice)}
          ${createFieldCard('Totale da Pagare', extractedData.totalAmount, 'highlight-large')}
        </div>
      </div>

      <!-- Date e Periodi -->
      <div class="mb-8">
        <h4 class="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-red-200 pb-2">
          📅 Date e Periodi
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          ${createFieldCard('Data Fattura', extractedData.billDate)}
          ${createFieldCard('Data Scadenza', extractedData.dueDate)}
          ${createFieldCard('Inizio Periodo', extractedData.periodStart)}
          ${createFieldCard('Fine Periodo', extractedData.periodEnd)}
        </div>
      </div>

      <!-- Raccomandazioni -->
      ${recommendations.length > 0 ? `
        <div class="mb-8">
          <div class="text-center mb-8">
            <h4 class="text-3xl font-bold text-slate-800 mb-4">Offerte Migliori per Te</h4>
            <p class="text-slate-600 text-lg mb-8">Confronta e risparmia sulla tua bolletta energetica</p>
            
            <!-- Sezione Confronto Risparmio -->
            <div class="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl p-8 mb-8 text-white">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div class="text-center">
                  <p class="text-emerald-100 text-sm uppercase tracking-wider mb-2">Attualmente paghi</p>
                  <p class="text-3xl font-bold">€${parseFloat(extractedData.totalAmount?.replace('€', '').replace(',', '.') || '96.45').toFixed(2)}</p>
                  <p class="text-emerald-100 text-sm">al mese</p>
                </div>
                <div class="text-center flex flex-col items-center justify-center">
                  <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                  <p class="text-white font-bold text-sm tracking-wider">RISPARMIA</p>
                </div>
                <div class="text-center">
                  <p class="text-emerald-100 text-sm uppercase tracking-wider mb-2">Potresti pagare</p>
                  <p class="text-3xl font-bold">€${recommendations[0]?.estimatedMonthlyCost || 82.15}</p>
                  <p class="text-emerald-100 text-sm">al mese</p>
                </div>
              </div>
              <div class="text-center mt-8 mb-8 p-6 bg-white rounded-xl shadow-lg mx-auto max-w-md">
                <p class="text-2xl font-bold mb-2 text-emerald-700">Risparmio: €${(parseFloat(extractedData.totalAmount?.replace('€', '').replace(',', '.') || '96.45') - (recommendations[0]?.estimatedMonthlyCost || 82.15)).toFixed(2)}/mese</p>
                <p class="text-xl text-emerald-600 font-semibold">€${((parseFloat(extractedData.totalAmount?.replace('€', '').replace(',', '.') || '96.45') - (recommendations[0]?.estimatedMonthlyCost || 82.15)) * 12).toFixed(0)} all'anno!</p>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${recommendations.map((rec, index) => createRecommendationCard(rec, parseFloat(extractedData.totalAmount?.replace('€', '').replace(',', '.') || '96.45'), index === 0)).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

function createFieldCard(label, value, style = '') {
  const displayValue = value && value !== 'N/D' ? value : '<span class="text-slate-400">N/D</span>';
  
  let cardClass = 'bg-white border border-slate-200 rounded-lg p-4 shadow-sm';
  let valueClass = 'font-semibold text-slate-800';
  
  if (style === 'highlight') {
    cardClass = 'bg-emerald-50 border border-emerald-200 rounded-lg p-4 shadow-sm';
    valueClass = 'font-bold text-emerald-700';
  } else if (style === 'highlight-large') {
    cardClass = 'bg-green-50 border-2 border-green-200 rounded-lg p-4 shadow-md';
    valueClass = 'font-bold text-green-800 text-lg';
  }
  
  return `
    <div class="${cardClass}">
      <div class="text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">${label}</div>
      <div class="${valueClass}">${displayValue}</div>
    </div>
  `;
}

function createRecommendationCard(recommendation, currentCost, isFirst = false) {
  const savings = recommendation.currentCost - recommendation.estimatedMonthlyCost;
  const savingsPercent = recommendation.savingsPercent || Math.round((savings / recommendation.currentCost) * 100);
  
  // Sfondi differenti per ogni fornitore
  const supplierBackgrounds = {
    'Edison': 'bg-gradient-to-br from-blue-50 to-blue-100',
    'Sorgenia': 'bg-gradient-to-br from-green-50 to-emerald-100', 
    'Eni Plenitude': 'bg-gradient-to-br from-yellow-50 to-orange-100',
    'A2A': 'bg-gradient-to-br from-purple-50 to-purple-100',
    'Illumia': 'bg-gradient-to-br from-pink-50 to-pink-100'
  };
  
  const supplierBorders = {
    'Edison': 'border-blue-200',
    'Sorgenia': 'border-emerald-200',
    'Eni Plenitude': 'border-orange-200', 
    'A2A': 'border-purple-200',
    'Illumia': 'border-pink-200'
  };
  
  const supplierBackground = supplierBackgrounds[recommendation.supplierName] || 'bg-gradient-to-br from-slate-50 to-slate-100';
  const supplierBorder = supplierBorders[recommendation.supplierName] || 'border-slate-200';
  
  const cardStyle = recommendation.bestOffer || isFirst 
    ? `${supplierBackground} border-2 border-emerald-500 relative shadow-lg hover:shadow-xl` 
    : `${supplierBackground} border ${supplierBorder} hover:shadow-lg`;
    
  const bestDeal = recommendation.bestOffer || isFirst ? `
    <div class="absolute -top-4 left-6 bg-emerald-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
      MIGLIORE OFFERTA
    </div>
  ` : '';
  
  return `
    <div class="${cardStyle} rounded-xl p-6 transition-all hover:-translate-y-1">
      ${bestDeal}
      
      <div class="text-center mb-4 ${recommendation.bestOffer || isFirst ? 'mt-2' : ''}">
        <h3 class="text-xl font-bold text-slate-800 mb-1">${recommendation.supplierName}</h3>
        <p class="text-slate-600 mb-3">${recommendation.offerName}</p>
        <span class="inline-block px-3 py-1 text-xs font-medium rounded-full ${recommendation.contractType === 'fisso' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}">
          ${recommendation.contractType === 'fisso' ? 'Prezzo Fisso' : 'Prezzo Variabile'}
        </span>
      </div>
      
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="bg-blue-50 p-3 rounded-lg text-center">
          <p class="text-xs text-slate-600 mb-1">Prezzo Energia</p>
          <p class="font-bold text-blue-700">${recommendation.pricePerKwh}</p>
        </div>
        <div class="bg-purple-50 p-3 rounded-lg text-center">
          <p class="text-xs text-slate-600 mb-1">Quota Fissa</p>
          <p class="font-bold text-purple-700">${recommendation.monthlyFee}</p>
        </div>
      </div>
      
      <div class="text-center mb-4 p-4 rounded-lg ${recommendation.bestOffer || isFirst ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50'}">
        <div class="text-3xl font-bold ${recommendation.bestOffer || isFirst ? 'text-emerald-600' : 'text-slate-700'} mb-1">
          €${recommendation.estimatedMonthlyCost}/mese
        </div>
        <div class="text-sm ${recommendation.bestOffer || isFirst ? 'text-emerald-700' : 'text-slate-600'} font-medium">
          Risparmi €${savings.toFixed(2)}/mese (-${savingsPercent}%)
        </div>
        <div class="text-xs ${recommendation.bestOffer || isFirst ? 'text-emerald-600' : 'text-slate-500'} mt-1">
          €${(savings * 12).toFixed(0)} di risparmio annuo
        </div>
      </div>
      
      <div class="space-y-2 mb-6">
        ${recommendation.features.map(feature => `
          <div class="flex items-center text-sm">
            <span class="text-emerald-500 mr-2">✓</span>
            <span class="text-slate-700">${feature}</span>
          </div>
        `).join('')}
      </div>
      
      <button class="w-full py-3 px-4 rounded-lg font-semibold transition-all ${recommendation.bestOffer || isFirst ? 
        'bg-gradient-to-r from-emerald-500 to-blue-500 hover:shadow-lg text-white' : 
        'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300'
      }">
        ${recommendation.bestOffer || isFirst ? 'Scegli questa offerta' : 'Scopri di più'}
      </button>
    </div>
  `;
}

function displayError(message) {
  const resultsContainer = document.getElementById('result-container');
  if (!resultsContainer) return;

  resultsContainer.innerHTML = `
    <div class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center">
        <div class="w-6 h-6 text-red-500 mr-3">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <div>
          <h3 class="text-sm font-medium text-red-800">Errore nell'analisi</h3>
          <p class="text-sm text-red-700 mt-1">${message}</p>
        </div>
      </div>
    </div>
  `;
}