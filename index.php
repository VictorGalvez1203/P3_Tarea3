<?php
    require("components/metodos.php");
    $GetFormulario = new Elementos();
    session_start();
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="description" content="" />
        <meta name="author" content="" />
        <title>Casa Libros</title>
        <!-- Favicon-->
        <link rel="icon" type="image/x-icon" href="assets\img\library-book-svgrepo-com.svg" />
        <!-- Font Awesome icons (free version)-->
        <script src="https://use.fontawesome.com/releases/v6.3.0/js/all.js" crossorigin="anonymous"></script>
        <!-- Google fonts-->
        <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Roboto+Slab:400,100,300,700" rel="stylesheet" type="text/css" />
        <!-- Core theme CSS (includes Bootstrap)-->
        <link href="css/styles.css" rel="stylesheet" />
    </head>
    <body id="page-top">

        <!--Aqui estoy llamando los demas elementos de la web-->
        <?=
        $GetFormulario->getNavegacion(true);
        $GetFormulario-> getProductos(true);
        $GetFormulario-> getOfertas(true);
        $GetFormulario-> getformulario(true);
        $GetFormulario-> getFooter(true);
        ?>

       <!-- Portfolio Modals-->
<div class="portfolio-modal modal fade" id="portfolioModal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="close-modal" data-bs-dismiss="modal"><img src="assets/img/close-icon.svg" alt="Close modal" /></div>
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-8">
                        <div class="modal-body">
                            <!-- Project details-->
                            <h2 class="text-uppercase" id="modalNombre">Nombre</h2>
                            <img class="img-fluid d-block mx-auto" id="modalImagen" src="url de la foto" alt="nombre de la foto" />
                            <strong id="nombremodalDescripcion">Ciudad donde vive el autor:</strong>
                            <p id="modalDescripcion">Descripción</p>
                            <ul class="list-inline">
                                <li>
                                    <strong id="nombremodalPrecio">Precio del libro:</strong>
                                    <span id="modalPrecio">$00.00</span>
                                </li>
                                <li>
                                    <strong id ="nombremodalCantidad">Fecha de publicación:</strong>
                                    <span id="modalCantidad">00</span>
                                </li>
                            </ul>
                            <button class="btn btn-primary btn-xl text-uppercase" data-bs-dismiss="modal" type="button">
                                <i class="fas fa-xmark me-1"></i>
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


        <!-- Bootstrap core JS-->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
        <script src="js/scripts.js"></script>
        <script src="js/animacion_productos.js"></script>
        <script src="js/comentarios.js"></script>
    </body>
</html>
