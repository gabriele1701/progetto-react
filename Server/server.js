// server/server.js

// 1. Importa le librerie
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
// Importa il pacchetto di Google AI
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { pythonPrompt } = require('../src/prompts/python_prompt.cjs');
const { javascriptPrompt } = require('../src/prompts/javascript_prompt.cjs');
const { setupRag, searchSimilarDocs } = require('./rag-setup.js');

// 2. Inizializza l'applicazione e il client AI
const app = express();
const PORT = process.env.PORT || 3001;
// Inizializza il client con la chiave API dal file .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 3. Configura i Middleware
app.use(cors());
app.use(express.json());

// 4. Avvia il setup del RAG
setupRag();

// 4. Crea la rotta per la chat (una rotta POST)
app.post('/api/chat', async (req, res) => {
  try {
    // Ricevi il messaggio e l'ID del bot dal corpo della richiesta
    const { message: userMessage, botId } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: 'Messaggio non fornito' });
    }

    let finalMessage = userMessage;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Se il bot è 'python-expert', aggiungi il prompt specifico
    if (botId === 'python-expert') {
      // Sostituisci il segnaposto nel prompt con il messaggio effettivo dell'utente
      finalMessage = pythonPrompt.replace(
        "[L'utente inserisce qui la sua richiesta in linguaggio naturale o il suo pezzo di codice]",
        userMessage
      );
    } else if (botId === 'javascript-expert') {
      // --- LOGICA MULTI-QUERY (TEMPORANEAMENTE DISABILITATA) ---
      /*
      // --- FASE 1: Multi-Query Generation ---
      console.log(`Query originale dell'utente: "${userMessage}"`);
      const multiQueryPrompt = `Sei un assistente AI esperto nella riformulazione di query per sistemi di ricerca vettoriale. Data una domanda di un utente, genera 4 query di ricerca alternative e concise che un programmatore potrebbe usare. Pensa a sinonimi, termini tecnici e modi diversi di formulare il problema. Restituisci solo le 4 query, una per riga, senza numerazione o altro testo.

Domanda Utente: "${userMessage}"

4 Query Alternative:`;
      
      const transformationResult = await model.generateContent(multiQueryPrompt);
      const queriesText = (await transformationResult.response).text().trim();
      const generatedQueries = queriesText.split('\n').filter(q => q); // Divide per riga e rimuove righe vuote
      console.log(`Query generate per la ricerca:`, generatedQueries);

      // --- FASE 2: Ricerca Massicciamente Parallela ---
      const allQueries = [userMessage, ...generatedQueries]; // Include anche la domanda originale
      console.log(`Esecuzione ricerca parallela con ${allQueries.length} query...`);
      
      const searchPromises = allQueries.map(query => searchSimilarDocs(query, 3)); // Cerca 3 documenti per ogni query
      const searchResults = await Promise.all(searchPromises);
      
      const allDocs = searchResults.flat(); // Appiattisce l'array di array di documenti
      console.log(`Trovati ${allDocs.length} documenti totali (prima della deduplicazione).`);

      // Unisci i risultati e rimuovi i duplicati
      const uniqueDocsMap = new Map();
      allDocs.forEach(doc => {
        uniqueDocsMap.set(doc.pageContent, doc); // Usa il contenuto come chiave per i duplicati
      });
      const uniqueDocs = Array.from(uniqueDocsMap.values());
      console.log(`Totale documenti unici trovati: ${uniqueDocs.length}`);
      
      const context = uniqueDocs
        .slice(0, 10) // Limita il contesto finale a 10 documenti per non superare i limiti
        .map((doc, index) => `--- Documento Rilevante ${index + 1} (da ${doc.metadata.source}) ---\n${doc.pageContent}`)
        .join('\n\n');

      // --- FASE 3: Generazione della risposta ---
      finalMessage = javascriptPrompt
        .replace('[CONTEXTO]', context)
        .replace('[DOMANDA_UTENTE]', userMessage);
        
      console.log("Prompt RAG inviato al modello (primi 500 caratteri):", finalMessage.substring(0, 500) + '...');
      */

      // --- LOGICA DI RICERCA SINGOLA (VELOCE) ---
      console.log(`Eseguo ricerca singola per: "${userMessage}"`);
      const contextDocs = await searchSimilarDocs(userMessage, 5); // Cerca i 5 documenti più pertinenti

      if (contextDocs.length === 0) {
          finalMessage = "Non ho trovato informazioni pertinenti per rispondere alla tua domanda.";
      } else {
          const context = contextDocs
              .map((doc, index) => `--- Documento Rilevante ${index + 1} (da ${doc.metadata.source}) ---\n${doc.pageContent}`)
              .join('\n\n');
          
          finalMessage = javascriptPrompt
              .replace('[CONTEXTO]', context)
              .replace('[DOMANDA_UTENTE]', userMessage);
      }
      
      console.log("Prompt RAG inviato al modello (primi 500 caratteri):", finalMessage.substring(0, 500) + '...');
    }

    // Genera la risposta usando il messaggio finale (con o senza prompt)
    const result = await model.generateContent(finalMessage);
    const response = await result.response;
    const text = response.text();

    // Invia la risposta del bot al frontend
    res.json({ reply: text });

  } catch (error) {
    console.error("Errore nella chiamata all'API di Gemini:", error);
    res.status(500).json({ error: "Qualcosa è andato storto con il server." });
  }
});

// 5. Metti il server in ascolto
app.listen(PORT, () => {
  console.log(`🚀 Server in ascolto sulla porta http://localhost:${PORT}`);
});