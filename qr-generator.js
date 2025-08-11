document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('qr-generate-btn');
    const qrInput = document.getElementById('qr-input');
    const qrCodeContainer = document.getElementById('qr-code');

    function generateQrCode() {
        const text = qrInput.value;
        if (!text) {
            alert('Please enter some text.');
            return;
        }
        qrCodeContainer.innerHTML = '';
        new QRCode(qrCodeContainer, {
            text: text,
            width: 256,
            height: 256,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    }

    generateBtn.addEventListener('click', generateQrCode);
});
