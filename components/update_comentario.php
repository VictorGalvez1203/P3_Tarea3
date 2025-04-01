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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = isset($input['id']) ? (int)$input['id'] : null;
    $comentario = isset($input['comentario']) ? trim($input['comentario']) : null;
    $authorName = isset($_SERVER['HTTP_X_AUTHOR_NAME']) ? trim($_SERVER['HTTP_X_AUTHOR_NAME']) : null;
}

if (!$id || $id <= 0) {
    echo json_encode([
        'success' => false, 
        'message' => 'ID de comentario no proporcionado o inválido'
    ]);
    exit();
}

if (empty($comentario)) {
    echo json_encode([
        'success' => false, 
        'message' => 'El texto del comentario no puede estar vacío'
    ]);
    exit();
}

if (!$authorName) {
    echo json_encode([
        'success' => false, 
        'message' => 'No se encontró información de autoría'
    ]);
    exit();
}

$checkStmt = $conn->prepare("SELECT id FROM comentario WHERE id = ? AND nombre = ?");
$checkStmt->bind_param("is", $id, $authorName);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();

if ($checkResult->num_rows === 0) {
    echo json_encode([
        'success' => false, 
        'message' => 'No tienes permiso para editar este comentario o no existe'
    ]);
    exit();
}

$stmt = $conn->prepare("UPDATE comentario SET comentario = ? WHERE id = ? AND nombre = ?");
$stmt->bind_param("sis", $comentario, $id, $authorName);
$result = $stmt->execute();

if ($result) {
    if ($stmt->affected_rows > 0) {
        echo json_encode([
            'success' => true, 
            'message' => 'Comentario actualizado correctamente'
        ]);
    } else {
        echo json_encode([
            'success' => false, 
            'message' => 'No se encontró el comentario con el ID proporcionado o no hubo cambios'
        ]);
    }
} else {
    echo json_encode([
        'success' => false, 
        'message' => 'Error al actualizar comentario: ' . $conn->error
    ]);
}

$checkStmt->close();
$stmt->close();
$conn->close();
?>