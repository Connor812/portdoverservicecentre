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
require_once('../functions/get-location-id.php');

use Square\SquareClient;
use Square\Exceptions\ApiException;
use Square\Models\SearchCatalogObjectsRequest;
use Square\Models\CatalogQuery;
use Square\Models\CatalogQueryText;

$client = new SquareClient([
    'accessToken' => ACCESS_TOKEN,
    'environment' => ENVIRONMENT
]);

// Get the request body
$requestBody = file_get_contents('php://input');
$data = json_decode($requestBody, true);

$customer_info = $data['customer_info'];
$cart = $data['cart'];

if (empty($customer_info)) {
    echo json_encode([
        'status' => false,
        'error' => 'Please provide customer info.'
    ]);
    exit;
}

require_once('../functions/create-order.php');
require_once('../functions/create-invoice.php');
require_once('../functions/create-customer.php');


// # Get Customer Id
$customer_id = CreateCustomer($client, $customer_info);
if ($customer_id['status'] == false) {
    echo json_encode([
        'status' => false,
        'error' => $customer_id['error']
    ]);
}

$customer_info['customer_id'] = $customer_id['customer_id'];

$order = CreateOrder($client, $customer_info, $cart);

if ($order['status'] == false) {
    echo json_encode([
        'status' => false,
        'error' => $order['error']
    ]);
    exit;
}

$orderId = $order['order']->getId();

$invoice = CreateInvoice($client, $orderId, $customer_info);

if ($invoice['status'] == false) {
    echo json_encode([
        'status' => false,
        'error' => $invoice['error']
    ]);
    exit;
}

echo json_encode([
    'status' => true,
    'invoice' => $invoice['invoice']
]);
