const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const openCartBtn = document.getElementById('open-cart');
const closeCartBtn = document.getElementById('close-cart');
const cartContainer = document.querySelector('.cart-container');
const cartItemCountEl = document.querySelector('.cart-item-count');

const FREE_SHIPPING_LIMIT = 230;

// ── LOCALSTORAGE ──────────────────────────────────────────────
function guardarCarrito() {
    const items = [];
    cartContainer.querySelectorAll('.cart-box').forEach(box => {
        items.push({
            nombre: box.querySelector('.cart-product-title').textContent,
            precio: parseFloat(box.querySelector('.cart-price').dataset.precio),
            imagen: box.querySelector('.cart-box-img').src,
            cantidad: parseInt(box.querySelector('.cart-qty-number').textContent)
        });
    });
    localStorage.setItem('carrito', JSON.stringify(items));
}

function cargarCarrito() {
    const guardado = JSON.parse(localStorage.getItem('carrito') || '[]');
    guardado.forEach(item => {
        agregarAlCarrito(item.nombre, item.precio, item.imagen, item.cantidad, true);
    });
}

// ── ABRIR / CERRAR ────────────────────────────────────────────
openCartBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
});

closeCartBtn.addEventListener('click', cerrarCarrito);
cartOverlay.addEventListener('click', cerrarCarrito);

function cerrarCarrito() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
}

// ── CONTADOR ──────────────────────────────────────────────────
function actualizarContadorTotal() {
    let total = 0;
    cartContainer.querySelectorAll('.cart-qty-number').forEach(el => {
        total += parseInt(el.textContent);
    });
    cartItemCountEl.textContent = total;
    document.querySelector('.cart-drawer-header h2').textContent = `Carrito ${total}`;
}

// ── TEXTO DE ENVÍO ────────────────────────────────────────────
function actualizarEnvio() {
    let total = 0;
    cartContainer.querySelectorAll('.cart-box').forEach(box => {
        const precio = parseFloat(box.querySelector('.cart-price').dataset.precio);
        const cantidad = parseInt(box.querySelector('.cart-qty-number').textContent);
        total += precio * cantidad;
    });

    const falta = FREE_SHIPPING_LIMIT - total;
    const msgEl = document.getElementById('shipping-msg');

    if (falta <= 0) {
        msgEl.innerHTML = `🎉 ¡Tienes <strong>Envío GRATIS!</strong>`;
    } else {
        msgEl.innerHTML = `¡Agrega <strong>S/. ${falta.toFixed(2)}</strong> para obtener un <strong>Envío GRATIS!</strong>`;
    }

    const subtotalEl = document.querySelector('.cart-subtotal-amount');
    if (subtotalEl) subtotalEl.textContent = `S/. ${total.toFixed(2)}`;

    return total;
}

// ── VISTA VACÍA / CON PRODUCTOS ───────────────────────────────
function actualizarVistaVacia() {
    const emptyMsg   = document.getElementById('empty-cart');
    const cartFooter = document.getElementById('cart-footer');
    const boxes      = cartContainer.querySelectorAll('.cart-box');

    if (boxes.length === 0) {
        emptyMsg.style.display   = 'block';
        cartFooter.style.display = 'none';
    } else {
        emptyMsg.style.display   = 'none';
        cartFooter.style.display = 'flex';
    }
}

// ── AGREGAR AL CARRITO ────────────────────────────────────────
function agregarAlCarrito(nombre, precio, imagen, cantidadInicial = 1, silencioso = false) {
    const items = cartContainer.querySelectorAll('.cart-product-title');
    for (let item of items) {
        if (item.textContent === nombre) {
            if (!silencioso) {
                cartDrawer.classList.add('open');
                cartOverlay.classList.add('open');
            }
            return;
        }
    }

    const cartBox = document.createElement('div');
    cartBox.classList.add('cart-box');
    cartBox.innerHTML = `
        <img class="cart-box-img" src="${imagen}" alt="${nombre}">
        <div class="cart-box-info">
            <p class="cart-product-title">${nombre}</p>
            <span class="cart-price" data-precio="${precio}">S/. ${precio.toFixed(2)}</span>
            <div class="cart-qty">
                <button class="cart-qty-btn" data-action="decrement" style="opacity:${cantidadInicial === 1 ? '0.3' : '1'}">−</button>
                <span class="cart-qty-number">${cantidadInicial}</span>
                <button class="cart-qty-btn" data-action="increment">+</button>
            </div>
        </div>
        <button class="cart-remove-btn" title="Eliminar">
            <img src="assets/delete_24dp_434343_FILL0_wght500_GRAD0_opsz24.svg"/>
        </button>
    `;

    cartContainer.appendChild(cartBox);

    cartBox.querySelector('.cart-remove-btn').addEventListener('click', () => {
        cartBox.remove();
        actualizarContadorTotal();
        actualizarEnvio();
        actualizarVistaVacia();
        guardarCarrito();
    });

    cartBox.querySelector('.cart-qty').addEventListener('click', (e) => {
        const btn = e.target.closest('.cart-qty-btn');
        if (!btn) return;

        const numEl = cartBox.querySelector('.cart-qty-number');
        let qty = parseInt(numEl.textContent);
        const decrementBtn = cartBox.querySelector('[data-action="decrement"]');

        if (btn.dataset.action === 'decrement' && qty > 1) qty--;
        else if (btn.dataset.action === 'increment') qty++;

        decrementBtn.style.opacity = qty === 1 ? '0.3' : '1';
        numEl.textContent = qty;

        actualizarContadorTotal();
        actualizarEnvio();
        guardarCarrito();
    });

    if (!silencioso) {
        actualizarContadorTotal();
        actualizarEnvio();
        actualizarVistaVacia();
        guardarCarrito();
        cartDrawer.classList.add('open');
        cartOverlay.classList.add('open');
    }
}

// ── CLICKS EN CARDS DE PRODUCTOS ─────────────────────────────
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.shopping-cart');
    if (!btn) return;

    const card = btn.closest('.product-card');
    if (!card) return;

    const nombre = card.querySelector('p').textContent;
    const precioTexto = card.querySelector('span.price')
        ? card.querySelector('span.price').textContent
        : card.querySelector('p:last-child').textContent;

    const precio = parseFloat(precioTexto.replace('S/.', '').trim());
    const imagen = card.querySelector('img').src;

    agregarAlCarrito(nombre, precio, imagen);
});
//Redirige a la parte de cart-summary.html
document.getElementById('btn-checkout').addEventListener('click', () => {
    window.location.href = './pages/cart-summary/cart-summary.html';
});
// ── INIT ──────────────────────────────────────────────────────
cargarCarrito();
actualizarContadorTotal();
actualizarEnvio();
actualizarVistaVacia();