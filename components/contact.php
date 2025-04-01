<!-- Components Contact -->
<section class="page-section" id="contact">
    <div class="container">
        <div class="text-center">
            <h2 class="section-heading text-uppercase">¡Tu opinión nos ayuda a mejorar!</h2>
            <h3 class="section-subheading text-muted">Deja tu comentario</h3>
        </div>

        <form id="contactForm" action="components/set_comentario.php" method="POST">
            <!-- Nombre y Correo -->
            <div class="form-group nombre">
                <label for="name" class="form-label text-muted">Nombre</label>
                <input class="form-control" id="name" name="name" type="text" placeholder="Ingresa tu nombre" required />
            </div>
    
            <div class="form-group correo">
                <label for="email" class="form-label text-muted">Correo</label>
                <input class="form-control" id="email" name="email" type="email" placeholder="Escribe tu correo" required />
            </div>

            <!-- Comentario -->
            <div class="form-group form-group-textarea comentario">
                <label for="message" class="form-label text-muted">Comentario</label>
                <textarea class="form-control" id="message" name="message" placeholder="Escribe tu comentario" required></textarea>
            </div>

            <!-- Botón -->
            <button name="enviar" class="btn btn-primary btn-xl text-uppercase" id="submitButton" type="submit">Enviar comentario</button>
        </form>

        <!-- Aquí el listado de comentarios si es necesario -->
        <div class="text-center comentario">
            <h4 class="section-title section-heading">Comentarios recibidos</h4>
            <button id="commentCount">0 comentarios</button>
            <div id="commentsList"></div>

            <!-- Botones de navegación -->
            <div id= "commentnavegacion" class="d-flex justify-content-center gap-2 mt-2">
                <button id="prevBtn" class="btn btn-primary" disabled>Ver menos</button>
                <button id="nextBtn" class="btn btn-primary" disabled>Ver más</button>
            </div>
        </div>
    </div>
</section>