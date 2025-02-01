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

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require '../vendor/autoload.php';
require_once("../config-url.php");
require_once("../connect/connect.php");

// Get the request body
$requestBody = file_get_contents('php://input');
$data = json_decode($requestBody, true);

$name = $data['name'];
$email = $data['email'];

if (empty($name) || empty($email)) {
    echo json_encode([
        'status' => false,
        'error' => 'Please provide name and email.'
    ]);
    exit;
}

$sql = "INSERT INTO `subscribers` (`name`, `email`) VALUES (?, ?);";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        'status' => false,
        'error' => 'Prepare failed: (' . $conn->errno . ') ' . $conn->error
    ]);
    exit;
}

$stmt->bind_param("ss", $name, $email);

// Execute the statement
if ($stmt->execute()) {
    echo json_encode([
        'status' => true,
        'message' => 'Email added successfully.'
    ]);

    $stmt->close();
    exit;
} else {
    echo json_encode([
        'status' => false,
        'error' => 'Execute failed: (' . $stmt->errno . ') ' . $stmt->error
    ]);
    $stmt->close();
    exit;
}
