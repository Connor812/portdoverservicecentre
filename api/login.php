<?php

// Allow cross-origin requests
header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
header("Access-Control-Allow-Methods: POST"); // Allow POST requests
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow Content-Type and Authorization headers
header('Content-Type: application/json');

// Handle CORS preflight requests and main requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Handle preflight requests
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Max-Age: 86400"); // Cache the preflight response for 24 hours
    http_response_code(200);
    exit;
}


require_once("../connect/connect.php");

// Get the request body
$requestBody = file_get_contents('php://input');
$data = json_decode($requestBody, true);

$email = $data['email'];
$password = $data['password'];

$sql = "SELECT * FROM `admin_users` WHERE email = ? OR username = ?;";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(array(
        'status' => false,
        'message' => 'Prepare failed: ' . $conn->error
    ));
    exit;
}

$stmt->bind_param('ss', $email, $email);

if (!$stmt->execute()) {
    echo json_encode(array(
        'status' => false,
        'message' => 'Execute failed: ' . $stmt->error
    ));
    $stmt->close();
    exit;
}

$result = $stmt->get_result();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        if (password_verify($password, $row['password'])) {
            echo json_encode(array(
                'status' => true,
                'message' => 'Login successful',
                'data' => array(
                    'id' => $row['id'],
                    'username' => $row['username'],
                    'timestamp' => date('Y-m-d H:i:s')
                )
            ));
        } else {
            echo json_encode(array(
                'status' => false,
                'message' => 'Invalid password'
            ));
        }
    }
} else {
    echo json_encode(array(
        'status' => false,
        'message' => 'User not found'
    ));
    exit;
}
