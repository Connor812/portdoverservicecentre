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

$searchTerm = $data['search_term'];

if (empty($searchTerm)) {
    echo json_encode([
        'status' => false,
        'error' => 'Please provide a search term.'
    ]);
    exit;
}

try {
    // Create a text query
    $queryText = new CatalogQueryText([$searchTerm]);  // Search term passed as a single-element array

    // Wrap it inside a CatalogQuery
    $catalogQuery = new CatalogQuery();
    $catalogQuery->setTextQuery($queryText);

    // Create the search request
    $searchRequest = new SearchCatalogObjectsRequest();
    $searchRequest->setObjectTypes(['ITEM']);
    $searchRequest->setQuery($catalogQuery);  // Use CatalogQuery, not CatalogQueryText directly

    // Send the request to the Square API
    $apiResponse = $client->getCatalogApi()->searchCatalogObjects($searchRequest);

    if ($apiResponse->isSuccess()) {
        $items = $apiResponse->getResult()->getObjects();
        echo json_encode([
            'status' => true,
            'items' => $items
        ]);
    } else {
        $errors = $apiResponse->getErrors();
        echo json_encode(['error' => 'Square API request failed', 'details' => $errors]);
    }
} catch (ApiException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
