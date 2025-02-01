<?php

// Allow cross-origin requests
header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
header("Access-Control-Allow-Methods: POST"); // Allow POST requests
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow Content-Type and Authorization headers
header('Content-Type: application/json');

// Handle CORS preflight requests and main requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Max-Age: 86400");
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
require_once("../functions/organize-products.php");

// Initialize the Square client
$client = new SquareClient([
    'accessToken' => ACCESS_TOKEN,
    'environment' => ENVIRONMENT
]);

try {
    // Create a search request without any specific query to get all catalog items
    $body = new \Square\Models\SearchCatalogObjectsRequest();
    $body->setIncludeRelatedObjects(true); // Include related objects like categories

    // Call the API
    $api_response = $client->getCatalogApi()->searchCatalogObjects($body);

    // Check if the response is successful
    if ($api_response->isSuccess()) {
        $result = $api_response->getResult();

        // Get primary objects and related objects
        $objects = $result->getObjects(); // Primary objects
        $related_objects = $result->getRelatedObjects(); // Related objects

        // Return all objects without any filtering
        $data = [
            'objects' => $objects,
            'related_objects' => $related_objects
        ];

        $organized_products = OrganizeProducts($data, $client);

        $response = [
            'status' => true,
            'data' => $organized_products
        ];

        echo json_encode($response);
    } else {
        // Handle API errors
        $errors = $api_response->getErrors();
        echo json_encode(array(
            'status' => false,
            'errors' => $errors
        ));
    }
} catch (ApiException $e) {
    echo json_encode(array(
        'status' => false,
        'error' => 'Caught exception: ' . $e->getMessage()
    ));
}
