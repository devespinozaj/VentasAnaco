const productStorageKey = "ventas-anaco-demo-products-v1";
const sampleProducts = [
    {
        id: "demo-phone",
        name: "Smartphone Nova 128 GB",
        category: "Tecnología",
        price: 189.99,
        description: "Pantalla amplia, cámara de alta resolución y batería para todo el día.",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=760&q=82",
        tag: "DESTACADO"
    },
    {
        id: "demo-headphones",
        name: "Audífonos inalámbricos",
        category: "Audio",
        price: 34.5,
        description: "Sonido envolvente y conexión inalámbrica para música y llamadas.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=760&q=82",
        tag: "MÁS BUSCADO"
    },
    {
        id: "demo-watch",
        name: "Reloj inteligente Active",
        category: "Accesorios",
        price: 59.99,
        description: "Un compañero práctico para tus actividades y notificaciones diarias.",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=760&q=82",
        tag: ""
    },
    {
        id: "demo-speaker",
        name: "Corneta portátil",
        category: "Audio",
        price: 42,
        description: "Lleva tu música contigo con un formato compacto y fácil de usar.",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=760&q=82",
        tag: ""
    },
    {
        id: "demo-home",
        name: "Lámpara de mesa moderna",
        category: "Hogar",
        price: 28.75,
        description: "Diseño sencillo para darle un toque acogedor a cualquier espacio.",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=760&q=82",
        tag: "NOVEDAD"
    },
    {
        id: "demo-accessory",
        name: "Estuche protector universal",
        category: "Accesorios",
        price: 12.99,
        description: "Protección ligera y práctica para acompañarte todos los días.",
        image: "https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=760&q=82",
        tag: ""
    }
];

function getStoredProducts() {
    try {
        const stored = localStorage.getItem(productStorageKey);
        if (!stored) return [...sampleProducts];
        const products = JSON.parse(stored);
        if (!Array.isArray(products)) throw new TypeError("El catálogo guardado no tiene un formato válido.");
        return products;
    } catch (error) {
        console.error("No se pudo leer el catálogo de demostración.", error);
        return [...sampleProducts];
    }
}

function saveStoredProducts(products) {
    localStorage.setItem(productStorageKey, JSON.stringify(products));
}

function formatSamplePrice(price) {
    return new Intl.NumberFormat("es-VE", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
    }).format(price);
}

function createProductCard(product) {
    const article = document.createElement("article");
    article.className = "product-card";

    const imageWrap = document.createElement("div");
    imageWrap.className = "product-image-wrap";
    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;
    image.loading = "lazy";
    image.addEventListener("error", () => {
        imageWrap.classList.add("image-unavailable");
        image.removeAttribute("src");
        image.alt = "Imagen de ejemplo no disponible";
    }, { once: true });
    imageWrap.append(image);

    if (product.tag) {
        const tag = document.createElement("span");
        tag.className = "product-tag";
        tag.textContent = product.tag;
        imageWrap.append(tag);
    }

    const details = document.createElement("div");
    details.className = "product-details";
    const category = document.createElement("span");
    category.className = "product-category";
    category.textContent = product.category;
    const name = document.createElement("h3");
    name.textContent = product.name;
    const description = document.createElement("p");
    description.textContent = product.description;
    const footer = document.createElement("div");
    footer.className = "product-card-footer";
    const price = document.createElement("strong");
    price.className = "product-price";
    price.textContent = formatSamplePrice(product.price);
    const order = document.createElement("a");
    order.className = "product-order";
    order.href = `https://wa.me/584121857368?text=${encodeURIComponent(`Hola, quisiera consultar por ${product.name}.`)}`;
    order.target = "_blank";
    order.rel = "noopener noreferrer";
    order.textContent = "Consultar ↗";
    footer.append(price, order);
    details.append(category, name, description, footer);
    article.append(imageWrap, details);
    return article;
}

function initCatalog() {
    const grid = document.querySelector("#product-grid");
    if (!grid) return;

    const search = document.querySelector("#product-search");
    const sort = document.querySelector("#product-sort");
    const count = document.querySelector("#product-count");
    const emptyState = document.querySelector("#empty-state");
    const filters = [...document.querySelectorAll(".filter-chip")];
    let selectedCategory = "Todos";

    const render = () => {
        const query = search.value.trim().toLocaleLowerCase("es");
        let products = getStoredProducts().filter((product) => {
            const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
            const matchesQuery = `${product.name} ${product.category} ${product.description}`.toLocaleLowerCase("es").includes(query);
            return matchesCategory && matchesQuery;
        });

        if (sort.value === "price-asc") products.sort((a, b) => a.price - b.price);
        if (sort.value === "price-desc") products.sort((a, b) => b.price - a.price);
        if (sort.value === "name") products.sort((a, b) => a.name.localeCompare(b.name, "es"));

        grid.replaceChildren(...products.map(createProductCard));
        count.textContent = `${products.length} ${products.length === 1 ? "producto" : "productos"}`;
        emptyState.hidden = products.length > 0;
    };

    search.addEventListener("input", render);
    sort.addEventListener("change", render);
    filters.forEach((filter) => {
        filter.addEventListener("click", () => {
            selectedCategory = filter.dataset.category;
            filters.forEach((button) => {
                const isSelected = button === filter;
                button.classList.toggle("is-active", isSelected);
                button.setAttribute("aria-pressed", String(isSelected));
            });
            render();
        });
    });
    render();
}

function readImageAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => resolve(reader.result));
        reader.addEventListener("error", () => reject(new Error("No se pudo leer la imagen seleccionada.")));
        reader.readAsDataURL(file);
    });
}

function resizeImage(dataUrl) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => {
            const maxDimension = 900;
            const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
            const canvas = document.createElement("canvas");
            canvas.width = Math.round(image.naturalWidth * scale);
            canvas.height = Math.round(image.naturalHeight * scale);
            const context = canvas.getContext("2d");
            if (!context) {
                reject(new Error("No se pudo preparar la imagen."));
                return;
            }
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL("image/jpeg", 0.78));
        });
        image.addEventListener("error", () => reject(new Error("El archivo seleccionado no es una imagen válida.")));
        image.src = dataUrl;
    });
}

function initAdminPanel() {
    const form = document.querySelector("#admin-product-form");
    if (!form) return;

    const fileInput = document.querySelector("#product-image");
    const preview = document.querySelector("#image-preview");
    const previewImage = document.querySelector("#preview-image");
    const feedback = document.querySelector("#form-feedback");
    const list = document.querySelector("#admin-product-list");
    const total = document.querySelector("#admin-product-count");
    let selectedImage = "";

    const refresh = () => {
        const products = getStoredProducts();
        total.textContent = products.length;
        list.replaceChildren();
        products.forEach((product) => {
            const row = document.createElement("article");
            row.className = "admin-product-row";
            const title = document.createElement("div");
            title.className = "admin-product-title";
            const name = document.createElement("strong");
            name.textContent = product.name;
            const category = document.createElement("span");
            category.textContent = product.category;
            title.append(name, category);
            const price = document.createElement("span");
            price.className = "admin-row-price";
            price.textContent = formatSamplePrice(product.price);
            row.append(title, price);
            if (!product.id.startsWith("demo-")) {
                const remove = document.createElement("button");
                remove.className = "remove-demo-product";
                remove.type = "button";
                remove.textContent = "Quitar";
                remove.setAttribute("aria-label", `Quitar ${product.name} de esta demostración`);
                remove.addEventListener("click", () => {
                    const updated = getStoredProducts().filter((item) => item.id !== product.id);
                    saveStoredProducts(updated);
                    refresh();
                });
                row.append(remove);
            }
            list.append(row);
        });
    };

    fileInput.addEventListener("change", async () => {
        const [file] = fileInput.files;
        if (!file) return;
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            feedback.textContent = "Usa una imagen JPG, PNG o WebP.";
            fileInput.value = "";
            return;
        }
        if (file.size > 8 * 1024 * 1024) {
            feedback.textContent = "La imagen debe pesar menos de 8 MB.";
            fileInput.value = "";
            return;
        }
        try {
            const dataUrl = await readImageAsDataUrl(file);
            selectedImage = await resizeImage(dataUrl);
            previewImage.src = selectedImage;
            preview.hidden = false;
            feedback.textContent = "";
        } catch (error) {
            feedback.textContent = error.message;
            fileInput.value = "";
        }
    });

    document.querySelector("#remove-image").addEventListener("click", () => {
        selectedImage = "";
        fileInput.value = "";
        previewImage.removeAttribute("src");
        preview.hidden = true;
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const name = String(formData.get("name")).trim();
        const description = String(formData.get("description")).trim();
        const category = String(formData.get("category"));
        const price = Number(formData.get("price"));
        if (!name || !description || !category || !Number.isFinite(price) || price <= 0) {
            feedback.textContent = "Completa los campos con valores válidos.";
            return;
        }

        const products = getStoredProducts();
        products.unshift({
            id: `local-${Date.now()}`,
            name,
            category,
            price,
            description,
            image: selectedImage || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=760&q=82",
            tag: "AGREGADO EN ESTA DEMO"
        });
        try {
            saveStoredProducts(products);
        } catch (error) {
            console.error("No se pudo guardar el producto de demostración.", error);
            feedback.textContent = "No se pudo guardar localmente. Prueba con una imagen más pequeña.";
            return;
        }

        form.reset();
        selectedImage = "";
        previewImage.removeAttribute("src");
        preview.hidden = true;
        feedback.textContent = "Producto agregado a la maqueta de este navegador. No se publicó para otros visitantes.";
        refresh();
    });

    document.querySelector("#clear-demo-products").addEventListener("click", () => {
        if (!window.confirm("¿Quieres borrar los productos agregados en este navegador y restablecer la demo?")) return;
        localStorage.removeItem(productStorageKey);
        feedback.textContent = "Catálogo de ejemplo restablecido.";
        refresh();
    });

    refresh();
}

initCatalog();
initAdminPanel();
