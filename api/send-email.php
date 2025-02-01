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

require_once("../config-url.php");
require_once("../connect/connect.php");

// Get the request body
$requestBody = file_get_contents('php://input');
$data = json_decode($requestBody, true);

$subject = $data['subject'];
$content = $data['content'];

if (empty($subject) || empty($content)) {
    echo json_encode([
        'status' => false,
        'error' => 'Please provide subject and content.'
    ]);
    exit;
}

$sql = "SELECT * FROM `subscribers`;";

$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {

        $id = $row['id'];
        $name = $row['name'];
        $email = $row['email'];

        ob_start();
        include("./email-template.php");
        $email_template = ob_get_contents();
        ob_end_clean();

        $to = $email;
        $from = "info@portdoverservicecentre.com";
        $headers = 'MIME-Version: 1.0' . PHP_EOL;
        $headers .= 'Content-type: text/html; charset=utf-8' . PHP_EOL;
        $headers .= "From: Port Dover Service Centre <$from>" . PHP_EOL;
        $headers .= "Reply-To: $from" . PHP_EOL;
        $headers .= "Return-Path: $from" . PHP_EOL;
        $headers .= "X-Mailer: PHP/" . phpversion();
        $headers .= "X-Priority: 1 (Highest)" . PHP_EOL;
        $headers .= "X-MSMail-Priority: High" . PHP_EOL;
        $headers .= "Importance: High" . PHP_EOL;

        if (!mail($to, $subject, $email_template, $headers)) {
            echo json_encode([
                'status' => false,
                'error' => "Failed to send email At $id."
            ]);
            exit;
        }
    }

    echo json_encode([
        'status' => true,
        'message' => 'Emails sent successfully.'
    ]);
} else {
    echo json_encode([
        'status' => false,
        'error' => 'No Subscribers Found.'
    ]);
}
