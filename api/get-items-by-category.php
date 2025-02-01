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

require '../vendor/autoload.php'; // Ensure you have installed the Square SDK via Composer
require_once("../config-url.php");

// Initialize the Square client
$client = new SquareClient([
    'accessToken' => ACCESS_TOKEN,
    'environment' => ENVIRONMENT
]);

// Get the request body
$requestBody = file_get_contents('php://input');
$data = json_decode($requestBody, true);

$category_id = $data['category_id'];

try {

    $exact_query = new \Square\Models\CatalogQueryExact('category', $category_id);
    $query = new \Square\Models\CatalogQuery();
    $query->setExactQuery($exact_query);

    // Create the search request
    $body = new \Square\Models\SearchCatalogObjectsRequest();
    $body->setIncludeRelatedObjects(true); // Ensure related objects are included
    $body->setQuery($query);

    // Call the API
    $api_response = $client->getCatalogApi()->searchCatalogObjects($body);

    // Check if the response is successful
    if ($api_response->isSuccess()) {
        $result = $api_response->getResult();

        // Get primary objects and related objects
        $objects = $result->getObjects(); // Primary objects
        $related_objects = $result->getRelatedObjects(); // Related objects

        // Find the category name from the related objects
        $category_name = null;
        if ($related_objects) {
            foreach ($related_objects as $related_object) {
                if ($related_object->getType() === 'CATEGORY' && $related_object->getId() === $category_id) {
                    $category_name = $related_object->getCategoryData()->getName();
                    break;
                }
            }
        }

        // Combine the objects, related objects, and category name into a single response if necessary
        $response = [
            'status' => true,
            'objects' => $objects,
            'related_objects' => $related_objects,
            'category_name' => $category_name
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
