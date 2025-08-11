document.addEventListener('DOMContentLoaded', () => {
    const generateKeysBtn = document.getElementById('sig-generate-keys-btn');
    const signBtn = document.getElementById('sig-sign-btn');
    const verifyBtn = document.getElementById('sig-verify-btn');
    const publicKeyOut = document.getElementById('sig-public-key');
    const privateKeyOut = document.getElementById('sig-private-key');
    const messageInput = document.getElementById('sig-input');
    const signatureOut = document.getElementById('sig-signature');
    const output = document.getElementById('sig-output');

    let keyPair = null;

    async function generateKeys() {
        try {
            output.textContent = 'Generating RSA-PSS key pair...';
            keyPair = await crypto.subtle.generateKey(
                {
                    name: 'RSA-PSS',
                    modulusLength: 2048,
                    publicExponent: new Uint8Array([1, 0, 1]),
                    hash: 'SHA-256',
                },
                true,
                ['sign', 'verify']
            );
            const publicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);
            const privateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

            publicKeyOut.value = `-----BEGIN PUBLIC KEY-----\n${arrayBufferToBase64(publicKey)}\n-----END PUBLIC KEY-----`;
            privateKeyOut.value = `-----BEGIN PRIVATE KEY-----\n${arrayBufferToBase64(privateKey)}\n-----END PRIVATE KEY-----`;
            output.textContent = 'Keys generated successfully.';
        } catch (e) {
            output.textContent = `Error: ${e.message}`;
        }
    }

    async function signMessage() {
        if (!keyPair) {
            output.textContent = 'Please generate keys first.';
            return;
        }
        try {
            const encoded = new TextEncoder().encode(messageInput.value);
            const signature = await crypto.subtle.sign(
                { name: 'RSA-PSS', saltLength: 32 },
                keyPair.privateKey,
                encoded
            );
            signatureOut.value = arrayBufferToBase64(signature);
            output.textContent = 'Message signed successfully.';
        } catch (e) {
            output.textContent = `Error: ${e.message}`;
        }
    }

    async function verifySignature() {
        if (!keyPair) {
            output.textContent = 'Please generate keys first.';
            return;
        }
        try {
            const encoded = new TextEncoder().encode(messageInput.value);
            const signature = base64ToArrayBuffer(signatureOut.value);
            const isValid = await crypto.subtle.verify(
                { name: 'RSA-PSS', saltLength: 32 },
                keyPair.publicKey,
                signature,
                encoded
            );
            output.textContent = isValid ? 'Signature is valid.' : 'Signature is NOT valid.';
        } catch (e) {
            output.textContent = `Error: ${e.message}`;
        }
    }

    generateKeysBtn.addEventListener('click', generateKeys);
    signBtn.addEventListener('click', signMessage);
    verifyBtn.addEventListener('click', verifySignature);

    // Helper functions from encryptor.js - consider moving to a shared file
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
});
