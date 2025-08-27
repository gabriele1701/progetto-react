// Server/rag-setup.js

const fs = require('fs').promises;
const path = require('path');
const { MemoryVectorStore } = require('langchain/vectorstores/memory');
const { GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { Document } = require('langchain/document');
const { GithubRepoLoader } = require("@langchain/community/document_loaders/web/github");

// Percorso della cartella contenente i documenti locali
const docsPath = path.resolve(__dirname, '../documentazione');

// Inizializza il modello di embedding di Google
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,
  model: "embedding-001", // Modello specifico per creare embeddings
});

// Inizializza lo splitter per dividere i documenti in chunks
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 2000, // Dimensione di ogni pezzo di testo
  chunkOverlap: 400, // Sovrapposizione tra i pezzi per non perdere contesto
});

let vectorStore; // La variabile che conterrà il nostro database vettoriale

/**
 * Funzione principale per caricare, processare e indicizzare i documenti da tutte le fonti.
 * Questa funzione viene eseguita una sola volta all'avvio del server.
 */
async function setupRag() {
  try {
    console.log('Inizio processo RAG (solo sorgenti locali)...');
    let allDocs = [];

    // --- 1. Caricamento da GitHub (DISABILITATO) ---
    /*
    console.log('Caricamento documenti da GitHub (axios/axios)...');
    const githubLoader = new GithubRepoLoader(
        "https://github.com/axios/axios",
        {
            accessToken: process.env.GITHUB_API_KEY,
            branch: "main",
            recursive: true,
        }
    );
    let githubDocs = await githubLoader.load();
    console.log(`Caricati ${githubDocs.length} documenti totali da GitHub. Inizio filtraggio...`);

    // Definisci i percorsi e i file da ignorare
    const ignoredPaths = [
        'test/', 
        'examples/', 
        'dist/', 
        'sandbox/',
        '.github/',
        '.eslintrc.js',
        'karma.conf.js',
        'Gruntfile.js',
        'CHANGELOG.md' // Aggiunto per escludere il file di log delle modifiche
    ];

    // Filtra i documenti per tenere solo i file .js e .md E per escludere i percorsi ignorati
    const filteredGithubDocs = githubDocs.filter(doc => {
        const source = doc.metadata.source;
        const isAllowedType = source.endsWith('.js') || source.endsWith('.md');
        const isIgnored = ignoredPaths.some(ignoredPath => source.startsWith(ignoredPath));
        return isAllowedType && !isIgnored;
    });
    
    // Aggiungiamo metadati per identificare la fonte
    filteredGithubDocs.forEach(doc => doc.metadata.source = `github:${doc.metadata.source}`);
    allDocs.push(...filteredGithubDocs);
    console.log(`Filtrati e mantenuti ${filteredGithubDocs.length} documenti di alta qualità da GitHub.`);
    */

    // --- 2. Caricamento da cartella locale ---
    console.log('Caricamento documenti dalla cartella locale...');
    const fileNames = await fs.readdir(docsPath);
    const localDocs = await Promise.all(
      fileNames.map(async (fileName) => {
        const filePath = path.join(docsPath, fileName);
        const content = await fs.readFile(filePath, 'utf8');
        return new Document({
          pageContent: content,
          metadata: { source: `local:${fileName}` }, // Prefisso per distinguere la fonte
        });
      })
    );
    allDocs.push(...localDocs);
    console.log(`Trovati e caricati ${localDocs.length} documenti locali.`);
    
    // --- 3. Indicizzazione di tutti i documenti ---
    console.log(`Totale documenti da indicizzare: ${allDocs.length}`);
    const chunks = await textSplitter.splitDocuments(allDocs);
    console.log(`Documenti divisi in ${chunks.length} chunks.`);

    vectorStore = await MemoryVectorStore.fromDocuments(chunks, embeddings);
    console.log('✅ Vector Store multi-sorgente creato e pronto in memoria.');

  } catch (error) {
    console.error('❌ Errore durante il setup del RAG:', error);
  }
}

/**
 * Funzione per eseguire una ricerca di similarità nel Vector Store.
 * @param {string} query - La domanda dell'utente.
 * @param {number} k - Il numero di risultati pertinenti da restituire.
 * @returns {Promise<Array<Document>>} - Una lista di documenti/chunks pertinenti.
 */
async function searchSimilarDocs(query, k = 10) {
  if (!vectorStore) {
    console.warn('Il Vector Store non è inizializzato.');
    return [];
  }
  const results = await vectorStore.similaritySearch(query, k);
  return results;
}

// Esportiamo le due funzioni principali
module.exports = { setupRag, searchSimilarDocs };
