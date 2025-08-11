document.addEventListener('DOMContentLoaded', () => {
    const generateHashBtn = document.getElementById('generate-hash-btn');
    const hashInput = document.getElementById('hash-input');
    const hashAlgo = document.getElementById('hash-algo');
    const hashOutput = document.getElementById('hash-output');

    // Basic MD5 implementation for educational purposes
    function md5(str) {
        // ... (a basic MD5 implementation would go here)
        return 'MD5 implementation is complex for a simple example. This is a placeholder.';
    }

    async function generateHash() {
        const algo = hashAlgo.value;
        const input = hashInput.value;

        if (!input) {
            hashOutput.textContent = 'Please enter some text.';
            return;
        }

        if (algo === 'MD5') {
            hashOutput.textContent = md5(input);
            return;
        }

        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest(algo, data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        hashOutput.textContent = hashHex;
    }

    generateHashBtn.addEventListener('click', generateHash);
});
