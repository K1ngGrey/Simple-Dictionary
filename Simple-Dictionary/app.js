const searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener('click', async () => {
    const inputValue = document.getElementById("search-inp").value.trim();
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = '';

    if (!inputValue) {
        resultDiv.innerHTML = '<p class="text-red-500">Please enter a word to search for.</p>';
        return;
    }

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${inputValue}`);
        const data = await response.json();

        if (response.ok) {
            data.forEach(entry => {
                const word = entry.word;

                const uniquePhonetics = [];
                const seenAudios = new Set();
                for (const phonetic of entry.phonetics) {
                    if (phonetic.audio && !seenAudios.has(phonetic.audio)) {
                        uniquePhonetics.push(phonetic);
                        seenAudios.add(phonetic.audio);
                        if (uniquePhonetics.length === 2) break;
                    }
                }

                const phonetics = uniquePhonetics.map(phonetic => {
                    let phoneticText = phonetic.text ? ` (${phonetic.text})` : '';
                    let origin = '';
                    if (phonetic.audio.includes('us')) {
                        origin = 'US';
                    } else if (phonetic.audio.includes('uk')) {
                        origin = 'UK';
                    }
                    return `<div class="mt-2">
                        <p class="text-gray-600">Pronunciation ${phoneticText} ${origin ? `(${origin})` : ''}</p>
                        <audio controls src="${phonetic.audio}" class="mt-2"></audio>
                    </div>`;
                }).join('');

                const meanings = entry.meanings.map(meaning => `
                    <div class="mt-6">
                        <h2 class="text-2xl font-bold">${word}</h2>
                        <p class="italic text-gray-600">${meaning.partOfSpeech}</p>
                        <div>
                            <strong>Definitions:</strong>
                            ${meaning.definitions.map(def => `
                                <div class="ml-4 mt-2">
                                    <p>- ${def.definition}</p>
                                    ${def.example ? `<p class="text-sm text-gray-600">Example: ${def.example}</p>` : ''}
                                </div>
                            `).join('')}
                        </div>
                        ${meaning.synonyms.length ? `
                            <div class="mt-2">
                                <strong>Synonyms:</strong>
                                <p class="ml-4">${meaning.synonyms.join(', ')}</p>
                            </div>
                        ` : ''}
                        ${meaning.antonyms.length ? `
                            <div class="mt-2">
                                <strong>Antonyms:</strong>
                                <p class="ml-4">${meaning.antonyms.join(', ')}</p>
                            </div>
                        ` : ''}
                    </div>
                `).join('');

                resultDiv.innerHTML += `
                    <div class="mb-6">
                        <h2 class="text-2xl font-bold">${word}</h2>
                        ${phonetics}
                        ${meanings}
                    </div>
                `;
            });
        } else {
            resultDiv.innerHTML = `<p class="text-red-500">Word not found. Please try again.</p>`;
        }
    } catch (error) {
        console.error(error);
        resultDiv.innerHTML = `<p class="text-red-500">An error occurred. Please try again later.</p>`;
    }
});