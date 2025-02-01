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

$client = new SquareClient([
    'accessToken' => ACCESS_TOKEN,
    'environment' => ENVIRONMENT
]);

// Get Location Id
$locationId = GetLocationId($client);
if ($locationId['status'] == false) {
    echo json_encode([
        'status' => false,
        'error' => $locationId['error']
    ]);
    exit;
}

$api_response = $client->getInvoicesApi()->listInvoices($locationId['location_id']);

if ($api_response->isSuccess()) {
    $result = $api_response->getResult();
    $invoices = $result->getInvoices();

    // Prepare the array to hold invoice details
    $invoiceDetails = [];

    foreach ($invoices as $invoice) {

        $invoice_id = $invoice->getId();
        $order_id = $invoice->getOrderId();
        $customerName = $invoice->getPrimaryRecipient() ?? 'Unknown';
        $paymentRequests = $invoice->getPaymentRequests();
        $isDraft = $invoice->getStatus();
        $creationDate = $invoice->getCreatedAt();
        $formattedDate = (new DateTime($creationDate))->format('Y-d-m');

        // Append invoice details to array
        $invoiceDetails[] = [
            'invoice_id' => $invoice_id,
            'order_id' => $order_id,
            'customer_info' => $customerName,
            'price_info' => $paymentRequests,
            'status' => $isDraft,
            'creation_date' => $formattedDate
        ];
    }

    echo json_encode([
        'status' => true,
        'invoices' => $invoiceDetails
    ]);
} else {
    $errors = $api_response->getErrors();
    echo json_encode([
        'status' => false,
        'error' => $errors
    ]);
}
