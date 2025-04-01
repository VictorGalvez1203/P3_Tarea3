<?php
header('Content-Type: application/json');

$servidor = "127.0.0.1:3307";
$usuario = "root";
$clave = ""; 
$base_de_datos = "biblioteca";

$conn = new mysqli($servidor, $usuario, $clave, $base_de_datos);

if ($conn->connect_error) {
    echo json_encode(["error" => "Error de conexión: " . $conn->connect_error]);
    exit();
}

$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$perPage = isset($_GET['perPage']) ? (int)$_GET['perPage'] : 6;
$offset = ($page - 1) * $perPage;

$totalQueryTitulos = "SELECT COUNT(*) as total FROM titulos";
$totalResultTitulos = $conn->query($totalQueryTitulos);
$totalRowsTitulos = $totalResultTitulos->fetch_assoc()['total'];
$totalPagesTitulos = ceil($totalRowsTitulos / $perPage);


$sqlTitulos = "SELECT id_titulo, titulo, precio, notas, fecha_pub 
               FROM titulos 
               ORDER BY fecha_pub DESC 
               LIMIT $offset, $perPage";
$resultTitulos = $conn->query($sqlTitulos);

$titulos = [];

if ($resultTitulos->num_rows > 0) {
    while ($row = $resultTitulos->fetch_assoc()) {
        $titulos[] = [
            "id_titulo" => $row["id_titulo"],
            "titulo" => $row["titulo"],
            "precio" => $row["precio"],
            "notas" => $row["notas"],
            "fecha_pub" => $row["fecha_pub"]
        ];
    }
}

$totalQueryAutores = "SELECT COUNT(*) as total FROM autores";
$totalResultAutores = $conn->query($totalQueryAutores);
$totalRowsAutores = $totalResultAutores->fetch_assoc()['total'];
$totalPagesAutores = ceil($totalRowsAutores / $perPage);


$offsetAutores = ($page - 1) * $perPage;
$sqlAutores = "SELECT id_autor, nombre, apellido, ciudad, pais 
               FROM autores 
               ORDER BY apellido ASC 
               LIMIT $offsetAutores, $perPage";
$resultAutores = $conn->query($sqlAutores);

$autores = [];

if ($resultAutores->num_rows > 0) {
    while ($row = $resultAutores->fetch_assoc()) {
        $autores[] = [
            "id_autor" => $row["id_autor"],
            "nombre" => $row["nombre"],
            "apellido" => $row["apellido"],
            "ciudad" => $row["ciudad"],
            "pais" => $row["pais"]
        ];
    }
}


$conn->close();

echo json_encode([
    "titulos" => $titulos,
    "autores" => $autores,
    "pagination" => [
        "total" => $totalRowsTitulos,
        "perPage" => $perPage,
        "currentPage" => $page,
        "totalPages" => $totalPagesTitulos
    ],
    "paginationAutores" => [
        "total" => $totalRowsAutores,
        "perPage" => $perPage,
        "currentPage" => $page,
        "totalPages" => $totalPagesAutores
    ]
]);
?>

