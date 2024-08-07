const searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener('click', async () => {
    const inputValue = document.getElementById("search-inp").value;
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = '';

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${inputValue}`);
        const data = await response.json();

        if (response.ok) {
            data.forEach(enter => {
                const word = enter.word;
                const meanings = enter.meanings.map(meaning => `
                    <div class="mt-4">
                        <h2 class="text-xl font-bold">${word}</h2>
                        <p class="italic">${meaning.partOfSpeech}</p>
                        <p>${meaning.synonyms}</p>
                        <p>${meaning.antonyms}</p>
                        ${meaning.definitions.map(def => `
                                <p>${def.definition}</p>
                            `).join('')}
                    </div>
                `).join('');

                resultDiv.innerHTML += meanings;
            });
        } else {
            resultDiv.innerHTML = `<p class="text-500">Word not found. Please try again.</p>`
        }
    } catch (error) {
        console.error(error);
        resultDiv.innerHTML = `<p class="text-red-500">An error occurred. Please try again later.</p>`;
    }
});