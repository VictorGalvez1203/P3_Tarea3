<?php
class Elementos {
    
    // Formulario
    function getformulario($mostrar = false) {
        if ($mostrar) {
            require "components/contact.php";
        }
    }

    // Navegación
    function getNavegacion($mostrar = false) {
        if ($mostrar) {
            require "components/Navigation.php";
        }
    }

    // Footer
    function getFooter($mostrar = false) {
        if ($mostrar) {
            require "components/footer.php";
        }
    }

    // Productos
    function getProductos($mostrar = false) {
        if ($mostrar) {
            require "components/productos.php";
        }
    }

    // Ofertas
    function getOfertas($mostrar = false) {
        if ($mostrar) {
            require "components/ofertas.php";
        }
    }
}
?>
