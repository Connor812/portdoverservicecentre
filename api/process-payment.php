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

use Square\SquareClient;
use Square\Exceptions\ApiException;

require '../vendor/autoload.php';
require_once("../config-url.php");

// Initialize the Square client
$client = new SquareClient([
    'accessToken' => ACCESS_TOKEN,
    'environment' => ENVIRONMENT
]);

// Get the request body
$requestBody = file_get_contents('php://input');
$data = json_decode($requestBody, true);

$order_amount = $data['order_amount'];
$order_id = $data['order_id'];
$token = $data['token'];

$amount_money = new \Square\Models\Money();
$amount_money->setAmount($order_amount);
$amount_money->setCurrency('CAD');

$body = new \Square\Models\CreatePaymentRequest($token, uniqid());
$body->setAmountMoney($amount_money);
$body->setOrderId($order_id);

$api_response = $client->getPaymentsApi()->createPayment($body);

if ($api_response->isSuccess()) {
    $result = $api_response->getResult();
    echo json_encode([
        'status' => true,
        'payment' => $result->getPayment()
    ]);
} else {
    $errors = $api_response->getErrors();
    echo json_encode([
        'status' => false,
        'errors' => $errors
    ]);
}
