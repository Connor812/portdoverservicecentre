<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once("../connect/connect.php");

// Insert statement
$sql = "INSERT INTO `admin_users` (`username`, `email`, `password`) VALUES (?, ?, ?);";

$username = "Connor";
$email = "connor@businesslore.com";
$password = "CScs12!@";
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(array(
        'status' => false,
        'message' => 'Prepare failed: ' . $conn->error
    ));
    exit;
}

// Bind parameters to the prepared statement
$stmt->bind_param("sss", $username, $email, $hashed_password);

// Execute the statement
if ($stmt->execute()) {
    echo json_encode(array(
        'status' => true,
        'message' => 'User created successfully'
    ));
    $stmt->close();
    exit;
} else {
    echo json_encode(array(
        'status' => false,
        'message' => 'Execute failed: ' . $stmt->error
    ));
    $stmt->close();
    exit;
}
