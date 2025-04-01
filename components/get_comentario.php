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
$perPage = 10;
$offset = ($page - 1) * $perPage;

$totalQuery = "SELECT COUNT(*) as total FROM comentario";
$totalResult = $conn->query($totalQuery);
$totalRows = $totalResult->fetch_assoc()['total'];
$totalPages = ceil($totalRows / $perPage);

$sql = "SELECT id, nombre, comentario, fecha FROM comentario ORDER BY id DESC LIMIT $offset, $perPage";
$result = $conn->query($sql);

$comentarios = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $comentarios[] = [
            "id" => $row["id"],
            "nombre" => $row["nombre"],
            "comentario" => $row["comentario"],
            "fecha" => $row["fecha"]
        ];
    }
}

$conn->close();

echo json_encode([
    "comentarios" => $comentarios,
    "pagination" => [
        "total" => $totalRows,
        "perPage" => $perPage,
        "currentPage" => $page,
        "totalPages" => $totalPages
    ]
]);
?>
