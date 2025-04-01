window.addEventListener("DOMContentLoaded", event => {

function adjustProductsPerPage() {
    var screenWidth = window.innerWidth; 
    var perPage = 3; 

    if (screenWidth <= 984) {
        perPage = 4;
    }
    return perPage;
}

let perPage = adjustProductsPerPage();

window.onload = adjustProductsPerPage;

   let productoPage = 1;  
let totalPaginasProductos = 1; 
const productosContainer = document.getElementById('productosContainer');
const btnAnterior = document.getElementById('btnAnterior');
const btnSiguiente = document.getElementById('btnSiguiente');

function loadProductos(page) {
    let perPage = adjustProductsPerPage();

    fetch(`components/get_producto.php?page=${page}&perPage=${perPage}`)
        .then(response => response.json())
        .then(data => {
            totalPaginasProductos = data.pagination.totalPages;
            productosContainer.innerHTML = ''; 
            data.titulos.forEach((titulo) => {
                const card = document.createElement("div");
                card.className = "col-lg-4 col-sm-6 mb-4";
                card.innerHTML = `
                    <div class="portfolio-item productos">
                        <a class="portfolio-link" data-bs-toggle="modal" href="#portfolioModal">
                            <div class="portfolio-hover">
                                <div class="portfolio-hover-content"><i class="fas fa-plus fa-3x"></i></div>
                            </div>
                            <img class="img-fluid" src="assets/img/libroCerrado.svg" alt="logo representativo de los libros" />
                        </a>
                        <div class="portfolio-caption">
                            <div class="portfolio-caption-heading">${titulo.titulo}</div>
                            <div class="portfolio-caption-subheading text-muted">${titulo.precio ? `$${titulo.precio}` : "Precio no disponible"}</div>
                        </div>
                    </div>
                `;
                productosContainer.appendChild(card);

                function formatearFecha(fecha) {
                    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
                    const fechaFormateada = new Date(fecha).toLocaleDateString('es-ES', opciones);
                    return fechaFormateada;
                }

                const modalLink = card.querySelector('.portfolio-link');
                modalLink.addEventListener('click', () => {
                    const modal = document.getElementById('portfolioModal');
                    modal.querySelector('#modalNombre').textContent = titulo.titulo;
                    modal.querySelector('#modalImagen').src = "assets/img/libroAbierto.svg";
                    modal.querySelector('#modalImagen').alt = "logo representativo de libro abierto";
                    const descripcion = titulo.notas || "Información no disponible";
                    modal.querySelector('#modalDescripcion').textContent = descripcion;
                    const precio = titulo.precio ? `$${titulo.precio}` : "Información no disponible";
                    modal.querySelector('#modalPrecio').textContent = precio;
                    const fechaPub = formatearFecha(titulo.fecha_pub);
                    modal.querySelector('#modalCantidad').textContent = fechaPub;

                    const ciudad_donde_vive_autor = modal.querySelector('#nombremodalDescripcion');
                    ciudad_donde_vive_autor .style.display = 'none';
                });
            });

            btnAnterior.disabled = productoPage <= 1;
            btnSiguiente.disabled = productoPage >= totalPaginasProductos;
        })
        .catch(error => {
            console.error('Error al cargar productos:', error);
            productosContainer.innerHTML = `<div class="alert alert-danger">Error al cargar productos. Por favor intenta nuevamente.</div>`;
        });
}

function cambiarPagina(direccion) {
    if ((direccion === "anterior" && productoPage > 1) || (direccion === "siguiente" && productoPage < totalPaginasProductos)) {
        const container = document.querySelector(".row");
        container.classList.add("animated"); 

        setTimeout(() => {
            productoPage += direccion === "siguiente" ? 1 : -1;
            loadProductos(productoPage); 
            container.classList.remove("animated"); 
        }, 500);
    }
}

btnAnterior.addEventListener("click", () => {
    cambiarPagina("anterior");
});

btnSiguiente.addEventListener("click", () => {
    cambiarPagina("siguiente");
});

loadProductos(productoPage);

let paginaActualOfertas = 1;
let totalPaginasOfertas = 1;
const botonAnteriorOfertas = document.getElementById('btnAnteriorOfertas');
const botonSiguienteOfertas = document.getElementById('btnSiguienteOfertas');
const contenedorOfertas = document.getElementById('productosContainerOfertas');

function cargarOfertas(pagina) {
    fetch(`components/get_producto.php?page=${pagina}&perPage=3`)
        .then(response => response.json())
        .then(data => {
            totalPaginasOfertas = data.pagination.totalPages;
            contenedorOfertas.innerHTML = '';

            if (data.autores && data.autores.length > 0) {
                data.autores.forEach(itemautor => {
                    const card = document.createElement("div");
                    card.className = "col-lg-4 col-sm-6 mb-4";
                    card.innerHTML = `
                        <div class="portfolio-item productos">
                            <a class="portfolio-link" data-bs-toggle="modal" href="#portfolioModal">
                                <div class="portfolio-hover">
                                    <div class="portfolio-hover-content"><i class="fas fa-plus fa-3x"></i></div>
                                </div>
                                <img class="img-fluid" src="assets/img/user-circle-svgrepo-com.svg" alt="logo representativo del autor" />
                            </a>
                            <div class="portfolio-caption">
                                <div class="portfolio-caption-heading">${itemautor.nombre}</div>
                                <div class="portfolio-caption-subheading text-muted">${itemautor.apellido}</div>
                            </div>
                        </div>
                    `;
                    contenedorOfertas.appendChild(card);

                    const modalLink = card.querySelector('.portfolio-link');
                    modalLink.addEventListener('click', () => {
                        const modal = document.getElementById('portfolioModal');
                        modal.querySelector('#modalNombre').textContent = itemautor.nombre +" "+ itemautor.apellido;
                        modal.querySelector('#modalImagen').src = "assets/img/user-id-svgrepo-com.svg";
                        modal.querySelector('#modalImagen').alt = "logo representativo del autor";
                        modal.querySelector('#nombremodalPrecio').textContent = "País de residencia del autor:"; 
                        modal.querySelector('#modalDescripcion').textContent = itemautor.ciudad; 
                        modal.querySelector('#modalPrecio').textContent = itemautor.pais;

                        const ciudad_donde_vive_autor = modal.querySelector('#nombremodalDescripcion');
                        ciudad_donde_vive_autor.style.display = 'block'; 
                        const precioElement = modal.querySelector('#nombremodalCantidad');
                        const valorprecioElement = modal.querySelector('#modalCantidad');
                        precioElement.style.display = 'none';
                        valorprecioElement.style.display = 'none';
                    });
                });
            } else {
                contenedorOfertas.innerHTML = '<div class="alert alert-warning">No hay ofertas disponibles.</div>';
            }

            botonAnteriorOfertas.disabled = paginaActualOfertas <= 1;
            botonSiguienteOfertas.disabled = paginaActualOfertas >= totalPaginasOfertas;
        })
        .catch(error => {
            console.error('Error al cargar ofertas:', error);
            contenedorOfertas.innerHTML = `<div class="alert alert-danger">Error al cargar ofertas. Intenta nuevamente.</div>`;
        });
}

function cambiarPaginaOfertas(direccion) {
    if ((direccion === "anterior" && paginaActualOfertas > 1) || (direccion === "siguiente" && paginaActualOfertas < totalPaginasOfertas)) {
        const container = document.getElementById("productosContainerOfertas");
        container.classList.add("animated"); 

        setTimeout(() => {
            paginaActualOfertas += direccion === "siguiente" ? 1 : -1;
            cargarOfertas(paginaActualOfertas);
            container.classList.remove("animated");
        }, 500);
    }
}
botonAnteriorOfertas.addEventListener("click", () => cambiarPaginaOfertas("anterior"));
botonSiguienteOfertas.addEventListener("click", () => cambiarPaginaOfertas("siguiente"));
cargarOfertas(paginaActualOfertas);

});
