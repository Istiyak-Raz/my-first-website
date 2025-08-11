document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('dh-generate-btn');
    const exchangeBtn = document.getElementById('dh-exchange-btn');
    const output = document.getElementById('dh-output');
    const visualization = document.getElementById('dh-visualization');

    let p, g, a, b;

    function generateParams() {
        // For simplicity, using pre-defined, small, unsafe numbers for visualization
        p = 23; // A prime number
        g = 5;  // A primitive root modulo p

        a = Math.floor(Math.random() * 10) + 2; // Alice's private number
        b = Math.floor(Math.random() * 10) + 2; // Bob's private number

        document.getElementById('alice-private').textContent = a;
        document.getElementById('bob-private').textContent = b;

        output.textContent = `Public Parameters:\nPrime (p): ${p}\nGenerator (g): ${g}`;
        visualization.innerHTML = '';
        document.getElementById('alice-public').textContent = '';
        document.getElementById('bob-public').textContent = '';
        document.getElementById('alice-secret').textContent = '';
        document.getElementById('bob-secret').textContent = '';
    }

    function exchange() {
        if (!p || !g) {
            output.textContent = 'Please generate public parameters first.';
            return;
        }

        const A = BigInt(g) ** BigInt(a) % BigInt(p);
        const B = BigInt(g) ** BigInt(b) % BigInt(p);

        document.getElementById('alice-public').textContent = A.toString();
        document.getElementById('bob-public').textContent = B.toString();

        const sA = B ** BigInt(a) % BigInt(p);
        const sB = A ** BigInt(b) % BigInt(p);

        document.getElementById('alice-secret').textContent = sA.toString();
        document.getElementById('bob-secret').textContent = sB.toString();

        output.textContent = `Shared Secret: ${sA.toString()}`;
        
        // Simple visualization
        visualization.innerHTML = `
            <div class="arrow">Alice sends ${A} to Bob</div>
            <div class="arrow">Bob sends ${B} to Alice</div>
        `;
    }

    generateBtn.addEventListener('click', generateParams);
    exchangeBtn.addEventListener('click', exchange);
});
