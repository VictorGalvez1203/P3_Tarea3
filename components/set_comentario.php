<?php
header('Content-Type: application/json'); 

$servidor = "127.0.0.1:3307";
$usuario = "root";
$clave = "";  
$base_de_datos = "biblioteca";

$response = [
    'success' => false,
    'message' => 'Error desconocido',
    'redirect' => 'index.php'
];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    error_log("Datos recibidos: " . print_r($_POST, true));
    
    if (!isset($_POST['name']) || !isset($_POST['email']) || !isset($_POST['message'])) {
        $response['message'] = 'Faltan campos requeridos en el formulario.';
        echo json_encode($response);
        exit();
    }

    $nombre = trim(htmlspecialchars($_POST['name']));
    $email = trim(htmlspecialchars($_POST['email']));
    $mensaje = trim(htmlspecialchars($_POST['message']));

    if (empty($nombre) || empty($email) || empty($mensaje)) {
        $response['message'] = 'Todos los campos son obligatorios.';
        echo json_encode($response);
        exit();
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'Formato de correo no válido.';
        echo json_encode($response);
        exit();
    }

   $conn = new mysqli($servidor, $usuario, $clave, $base_de_datos);

    if ($conn->connect_error) {
        $response['message'] = 'Error de conexión: ' . $conn->connect_error;
        echo json_encode($response);
        exit();
    }

    $sql = "INSERT INTO comentario (nombre, correo, comentario) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("sss", $nombre, $email, $mensaje);
        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'Comentario agregado correctamente.';
        } else {
            $response['message'] = 'Error al insertar: ' . $stmt->error;
        }
        $stmt->close();
    } else {
        $response['message'] = 'Error en la preparación de la consulta.';
    }

    $conn->close();
} else {
    $response['message'] = 'Método no permitido.';
}

echo json_encode($response);
exit();
?>



