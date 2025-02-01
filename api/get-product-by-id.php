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
require_once("../functions/organize-products.php");

$client = new SquareClient([
    'accessToken' => ACCESS_TOKEN,
    'environment' => ENVIRONMENT
]);

// Get the request body
$requestBody = file_get_contents('php://input');
$data = json_decode($requestBody, true);

if (empty($data['product_id'])) {
    echo json_encode(array(
        'status' => false,
        'message' => 'Product ID is required'
    ));
    exit;
}

$product_id = $data['product_id'];


$catalogApi = $client->getCatalogApi();
try {

    $response = $catalogApi->retrieveCatalogObject($product_id, true);

    if ($response->isSuccess()) {

        $catalogObject = $response->getResult()->getObject();
        $relatedObjects = $response->getResult()->getRelatedObjects();

        $data = [
            'objects' => array($catalogObject),
            'related_objects' => $relatedObjects
        ];

        $organized_products = OrganizeProducts($data, $client);

        echo json_encode(array(
            'status' => true,
            'data' => $organized_products
        ));
    } else {
        // Handle errors
        $errors = $response->getErrors();
        foreach ($errors as $error) {
            echo json_encode(array(
                'status' => false,
                'message' => $error->getDetail()
            ));
        }
    }
} catch (ApiException $e) {
    // Handle exceptions
    echo json_encode(array(
        'status' => false,
        'message' => $e->getMessage()
    ));
}
