document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('historical-cipher-input');
    const algoSelect = document.getElementById('historical-cipher-algo');
    const keyInput = document.getElementById('historical-cipher-key');
    const encryptBtn = document.getElementById('historical-cipher-encrypt-btn');
    const decryptBtn = document.getElementById('historical-cipher-decrypt-btn');
    const output = document.getElementById('historical-cipher-output');

    // Caesar Cipher
    function caesar(text, shift, encrypt = true) {
        let result = '';
        shift = encrypt ? shift : (26 - shift) % 26;
        for (let i = 0; i < text.length; i++) {
            let char = text[i];
            if (char.match(/[a-z]/i)) {
                let code = text.charCodeAt(i);
                if ((code >= 65) && (code <= 90)) {
                    char = String.fromCharCode(((code - 65 + shift) % 26) + 65);
                } else if ((code >= 97) && (code <= 122)) {
                    char = String.fromCharCode(((code - 97 + shift) % 26) + 97);
                }
            }
            result += char;
        }
        return result;
    }

    // Vigenère Cipher
    function vigenere(text, keyword, encrypt = true) {
        let result = '';
        keyword = keyword.toLowerCase().replace(/[^a-z]/g, '');
        if (!keyword) return text;

        for (let i = 0, j = 0; i < text.length; i++) {
            let char = text[i];
            if (char.match(/[a-z]/i)) {
                let charCode = text.charCodeAt(i);
                let keyChar = keyword.charCodeAt(j % keyword.length) - 97;
                let shiftedChar;

                if (encrypt) {
                    shiftedChar = ((charCode - (charCode >= 65 && charCode <= 90 ? 65 : 97) + keyChar) % 26);
                } else {
                    shiftedChar = ((charCode - (charCode >= 65 && charCode <= 90 ? 65 : 97) - keyChar + 26) % 26);
                }

                shiftedChar += (charCode >= 65 && charCode <= 90 ? 65 : 97);
                result += String.fromCharCode(shiftedChar);
                j++;
            } else {
                result += char;
            }
        }
        return result;
    }

    encryptBtn.addEventListener('click', () => {
        const algo = algoSelect.value;
        const text = input.value;
        const key = keyInput.value;
        let result = '';

        if (algo === 'caesar') {
            const shift = parseInt(key, 10);
            if (isNaN(shift)) {
                output.textContent = 'Please enter a valid number for Caesar cipher shift.';
                return;
            }
            result = caesar(text, shift, true);
        } else if (algo === 'vigenere') {
            result = vigenere(text, key, true);
        }
        output.textContent = result;
    });

    decryptBtn.addEventListener('click', () => {
        const algo = algoSelect.value;
        const text = input.value;
        const key = keyInput.value;
        let result = '';

        if (algo === 'caesar') {
            const shift = parseInt(key, 10);
            if (isNaN(shift)) {
                output.textContent = 'Please enter a valid number for Caesar cipher shift.';
                return;
            }
            result = caesar(text, shift, false);
        } else if (algo === 'vigenere') {
            result = vigenere(text, key, false);
        }
        output.textContent = result;
    });
});
