document.addEventListener('DOMContentLoaded', () => {
    // Common Elements
    const encryptBtn = document.getElementById('encrypt-btn');
    const decryptBtn = document.getElementById('decrypt-btn');
    const encryptorAlgo = document.getElementById('encryptor-algo');
    const encryptorOutput = document.getElementById('encryptor-output');

    // AES Elements
    const aesFields = document.getElementById('aes-fields');
    const aesInput = document.getElementById('aes-input');
    const aesKey = document.getElementById('aes-key');

    // RSA Elements
    const rsaFields = document.getElementById('rsa-fields');
    const generateRsaKeysBtn = document.getElementById('generate-rsa-keys-btn');
    const rsaPublicKeyOut = document.getElementById('rsa-public-key');
    const rsaPrivateKeyOut = document.getElementById('rsa-private-key');
    const rsaInput = document.getElementById('rsa-input');

    let rsaKeyPair = null;

    // --- UI LOGIC ---
    function toggleFields() {
        const selectedAlgo = encryptorAlgo.value;
        if (selectedAlgo === 'AES-GCM') {
            aesFields.style.display = 'block';
            rsaFields.style.display = 'none';
        } else {
            aesFields.style.display = 'none';
            rsaFields.style.display = 'block';
        }
        encryptorOutput.textContent = '';
    }

    encryptorAlgo.addEventListener('change', toggleFields);

    // --- HELPER FUNCTIONS ---
    function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    function base64ToArrayBuffer(base64) {
        const binary_string = window.atob(base64);
        const len = binary_string.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }


    // --- RSA LOGIC ---
    async function generateRsaKeys() {
        try {
            encryptorOutput.textContent = 'Generating RSA key pair (2048-bit)...';
            rsaKeyPair = await crypto.subtle.generateKey(
                {
                    name: 'RSA-OAEP',
                    modulusLength: 2048,
                    publicExponent: new Uint8Array([1, 0, 1]),
                    hash: 'SHA-256',
                },
                true, // extractable
                ['encrypt', 'decrypt']
            );

            const publicKey = await crypto.subtle.exportKey('spki', rsaKeyPair.publicKey);
            const privateKey = await crypto.subtle.exportKey('pkcs8', rsaKeyPair.privateKey);

            rsaPublicKeyOut.value = `-----BEGIN PUBLIC KEY-----
${arrayBufferToBase64(publicKey)}
-----END PUBLIC KEY-----`;
            rsaPrivateKeyOut.value = `-----BEGIN PRIVATE KEY-----
${arrayBufferToBase64(privateKey)}
-----END PRIVATE KEY-----`;
            encryptorOutput.textContent = 'RSA key pair generated successfully.';
        } catch (e) {
            encryptorOutput.textContent = `Error generating keys: ${e.message}`;
        }
    }

    async function rsaEncrypt(plaintext, publicKey) {
        if (!publicKey) {
            encryptorOutput.textContent = 'Please generate an RSA key pair first.';
            return;
        }
        try {
            const encoded = new TextEncoder().encode(plaintext);
            const encrypted = await crypto.subtle.encrypt(
                { name: 'RSA-OAEP' },
                publicKey,
                encoded
            );
            encryptorOutput.textContent = arrayBufferToBase64(encrypted);
        } catch (e) {
            encryptorOutput.textContent = `Error encrypting: ${e.message}`;
        }
    }

    async function rsaDecrypt(ciphertext, privateKey) {
        if (!privateKey) {
            encryptorOutput.textContent = 'Please generate an RSA key pair first.';
            return;
        }
        try {
            const buffer = base64ToArrayBuffer(ciphertext);
            const decrypted = await crypto.subtle.decrypt(
                { name: 'RSA-OAEP' },
                privateKey,
                buffer
            );
            encryptorOutput.textContent = new TextDecoder().decode(decrypted);
        } catch (e) {
            encryptorOutput.textContent = `Error decrypting: ${e.message}. Ensure the ciphertext is correct and was encrypted with the corresponding public key.`;
        }
    }

    generateRsaKeysBtn.addEventListener('click', generateRsaKeys);


    // --- AES LOGIC ---
    async function aesEncrypt(plaintext, secretKey) {
        try {
            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                new TextEncoder().encode(secretKey),
                { name: 'PBKDF2' },
                false,
                ['deriveBits', 'deriveKey']
            );
            const key = await crypto.subtle.deriveKey(
                { name: 'PBKDF2', salt: new Uint8Array(16), iterations: 100000, hash: 'SHA-256' },
                keyMaterial,
                { name: 'AES-GCM', length: 256 },
                true,
                ['encrypt', 'decrypt']
            );
            const iv = crypto.getRandomValues(new Uint8Array(12));
            const encrypted = await crypto.subtle.encrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                new TextEncoder().encode(plaintext)
            );
            const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
            const encryptedHex = arrayBufferToBase64(encrypted);
            encryptorOutput.textContent = `iv:${ivHex}\nciphertext:${encryptedHex}`;
        } catch (e) {
            encryptorOutput.textContent = `Error: ${e.message}`;
        }
    }

    async function aesDecrypt(data, secretKey) {
        try {
            const parts = data.match(/iv:(.*?)\nciphertext:(.*)/s);
            if(!parts) {
                encryptorOutput.textContent = 'Invalid input format. Expected "iv:..\nciphertext:..."';
                return;
            }
            const ivHex = parts[1];
            const ciphertext = parts[2];

            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                new TextEncoder().encode(secretKey),
                { name: 'PBKDF2' },
                false,
                ['deriveBits', 'deriveKey']
            );
            const key = await crypto.subtle.deriveKey(
                { name: 'PBKDF2', salt: new Uint8Array(16), iterations: 100000, hash: 'SHA-256' },
                keyMaterial,
                { name: 'AES-GCM', length: 256 },
                true,
                ['encrypt', 'decrypt']
            );
            const iv = new Uint8Array(ivHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
            const encrypted = base64ToArrayBuffer(ciphertext);
            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                encrypted
            );
            encryptorOutput.textContent = new TextDecoder().decode(decrypted);
        } catch (e) {
            encryptorOutput.textContent = `Error: ${e.message}. Ensure the key and ciphertext are correct.`;
        }
    }

    // --- MAIN EVENT LISTENERS ---
    encryptBtn.addEventListener('click', () => {
        const algo = encryptorAlgo.value;
        if (algo === 'AES-GCM') {
            aesEncrypt(aesInput.value, aesKey.value);
        } else { // RSA-OAEP
            rsaEncrypt(rsaInput.value, rsaKeyPair ? rsaKeyPair.publicKey : null);
        }
    });

    decryptBtn.addEventListener('click', () => {
        const algo = encryptorAlgo.value;
        if (algo === 'AES-GCM') {
            aesDecrypt(aesInput.value, aesKey.value);
        } else { // RSA-OAEP
            rsaDecrypt(rsaInput.value, rsaKeyPair ? rsaKeyPair.privateKey : null);
        }
    });

    // Initialize UI
    toggleFields();
});