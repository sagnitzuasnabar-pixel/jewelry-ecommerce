let productos = [];

// Trae los productos del JSON
async function obtenerProductos() {
    try {
        const response = await fetch("product.json");
        if (!response.ok) throw new Error("Error al cargar productos: " + response.status);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

// Construye las cards y el carrusel con los productos
async function mostrarProductos() {
    productos = await obtenerProductos();

    if (!productos) return;

    const carousels = document.querySelectorAll('.carousel');

    carousels.forEach((carousel) => {

        const categoria = carousel.dataset.categoria;
        const track = carousel.querySelector('.carousel-track');
        const outer = carousel.querySelector('.carousel-outer');
        const btnPrev = carousel.querySelector('.btn-prev');
        const btnNext = carousel.querySelector('.btn-next');

        // Filtra productos por categoria
        const filtrados = productos.filter(p => {
            const categorias = Array.isArray(p.categoria)
                ? p.categoria
                : [p.categoria];

            return categorias.includes(categoria);
        });

        // Introduce los datos en el HTML
        filtrados.forEach(producto => {

            const article = document.createElement("article");
            article.classList.add("product-card");

            const categorias = Array.isArray(producto.categoria)
                ? producto.categoria
                : [producto.categoria];

            const esPlata925 = categorias.includes("plata-925");

            article.innerHTML = `
                ${
                  esPlata925
                        ? `<div class="badge-plata-925">
                            <span>Plata .925</span>
                            <span>${producto.stock} disponibles</span>
                           </div>`
                        : `<span class="badge">${producto.stock} disponibles</span>`
                }
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <button class="shopping-cart">
                    <img src="./assets/shopping_cart_24dp_000000_FILL0_wght200_GRAD0_opsz24.svg">
                </button>
                <p>${producto.nombre}</p>
                <p>S/. ${producto.precio}</p>
            `;

            track.appendChild(article);
        });

        /*Carrusel Button Prev and Next*/
        const gap = 16;
        let position = 0;

        const firstCard = carousel.querySelector('.product-card');
        let step = firstCard ? firstCard.offsetWidth + gap : 0;

        const getMaxScroll = () => track.scrollWidth - outer.offsetWidth;

        window.addEventListener('resize', () => {
            const firstCard = carousel.querySelector('.product-card');
            step = firstCard ? firstCard.offsetWidth + gap : 0;
        });

        btnNext.addEventListener('click', () => {
            position += step;
            if (position >= getMaxScroll()) {
                position = getMaxScroll();
            }
            track.style.transform = `translateX(-${position}px)`;
        });

        btnPrev.addEventListener('click', () => {
            position -= step;
            if (position <= 0) {
                position = 0;
            }
            track.style.transform = `translateX(-${position}px)`;
        });

    });
}

mostrarProductos();