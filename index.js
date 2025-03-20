const fs = require('fs');

// Função para remover acentos
const removeAccents = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// Lista de palavras irrelevantes a serem removidas
const stopWords = new Set(["de", "o", "a", "kg", "l", "litro", "quilo", "tipo"]);

// Função para normalizar o nome do produto
function normalizeTitle(title) {
    return removeAccents(title.toLowerCase())
        .replace(/\b1\s?l\b/g, '1l') // Normaliza "1 L" ou "1L" para "1l"
        .replace(/\b1\s?litro\b/g, '1l') // Normaliza "1 litro" para "1l"
        .replace(/\b1\s?quilo\b/g, '1kg') // Normaliza "1 quilo" para "1kg"
        .replace(/semi-?\s?desnatado/g, 'semidesnatado') // Normaliza "Semi-Desnatado" e "Semi Desnatado"
        .replace(/seme\s?desnatado/g, 'semidesnatado') // Normaliza "Seme Desnatado" e "Seme-Desnatado"
        .replace(/\s+/g, ' ') // Remove espaços extras
        .trim() // Remove espaços no início e no fim
        .split(" ") // Divide em palavras
        .filter(word => !stopWords.has(word)) // Remove palavras irrelevantes
        .sort() // Ordena as palavras para evitar variações na ordem
        .join(" "); // Junta novamente em uma string
}

// Função principal para categorizar os produtos
function categorizeProducts(products) {
    const categories = {};

    products.forEach(product => {
        const normalized = normalizeTitle(product.title);

        if (!categories[normalized]) {
            categories[normalized] = {
                category: product.title, // Mantém o título original como categoria
                count: 0,
                products: []
            };
        }

        categories[normalized].count++;
        categories[normalized].products.push({
            title: product.title,
            supermarket: product.supermarket
        });
    });

    return Object.values(categories);
}

// Lê o arquivo data01.json e processa os produtos
fs.readFile('data01.json', 'utf8', (err, data) => {
    if (err) {
        console.error("Erro ao ler o arquivo:", err);
        return;
    }

    const products = JSON.parse(data);
    const categorizedProducts = categorizeProducts(products);

    console.log(JSON.stringify(categorizedProducts, null, 2));
});
