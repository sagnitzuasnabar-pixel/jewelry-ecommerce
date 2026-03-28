const cartItemsContainer = document.getElementById('cart-items-container');
const subtotalEl         = document.getElementById('subtotal');
const totalEl            = document.getElementById('total');
const cartCountEl        = document.querySelector('.cart-count');
const btnPay             = document.getElementById('btn-pay');
const paymentOverlay     = document.getElementById('payment-overlay');
const btnDone            = document.getElementById('btn-done');

const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

const totalProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0);
cartCountEl.textContent = `${totalProductos} Producto${totalProductos !== 1 ? 's' : ''} en el carrito`;

let subtotal = 0;

carrito.forEach(item => {
    const totalItem = item.precio * item.cantidad;
    subtotal += totalItem;

    const fila = document.createElement('div');
    fila.classList.add('cart-item-row');
    fila.innerHTML = `
        <div class="item-producto">
            <img src="${item.imagen}" alt="${item.nombre}">
            <span>${item.nombre}</span>
        </div>
        <span class="item-envio">Hasta 7 días hábiles</span>
        <span class="item-precio">S/ ${item.precio.toFixed(2)}</span>
        <span class="item-cantidad">${item.cantidad}</span>
        <span class="item-total">S/ ${totalItem.toFixed(2)}</span>
    `;

    cartItemsContainer.appendChild(fila);
});

subtotalEl.textContent = `S/ ${subtotal.toFixed(2)}`;
totalEl.textContent    = `S/ ${subtotal.toFixed(2)}`;

btnPay.addEventListener('click', () => {
    paymentOverlay.style.display = 'flex';
});

btnDone.addEventListener('click', () => {
    localStorage.removeItem('carrito');
    window.location.href = '../../index.html';
});