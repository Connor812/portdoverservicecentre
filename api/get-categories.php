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

$object_types = ['CATEGORY'];
$body = new \Square\Models\SearchCatalogObjectsRequest();
$body->setObjectTypes($object_types);
$body->setIncludeRelatedObjects(true);

$api_response = $client->getCatalogApi()->searchCatalogObjects($body);

if ($api_response->isSuccess()) {
    $result = $api_response->getResult();

    // Use the getter method to retrieve the 'objects' field
    $categories = $result->getObjects();
    $organizedCategory = [];

    // Create an associative array to track categories by their IDs for easy lookup
    $categoryMap = [];

    // First, iterate through all categories and add top-level categories to the map
    foreach ($categories as $category) {
        $id = $category->getId();
        $categoryData = $category->getCategoryData();

        // If it's a top-level category, add it to the map and initialize subcategories array
        if ($categoryData->getIsTopLevel()) {
            $categoryMap[$id] = [
                'name' => $categoryData->getName(),
                'id' => $id,
                'subcategories' => []
            ];
        }
    }

    // Now, iterate through all categories again and assign subcategories to their respective parents
    foreach ($categories as $category) {
        $id = $category->getId();
        $categoryData = $category->getCategoryData();

        // If it's not a top-level category, find its parent and add it as a subcategory
        if (!$categoryData->getIsTopLevel() && $categoryData->getRootCategory()) {
            $parentCategoryId = $categoryData->getRootCategory();
            if (isset($categoryMap[$parentCategoryId])) {
                $categoryMap[$parentCategoryId]['subcategories'][] = [
                    'name' => $categoryData->getName(),
                    'id' => $id
                ];
            }
        }
    }

    // Convert the categoryMap to an array
    foreach ($categoryMap as $category) {
        $organizedCategory[] = $category;
    }

    echo json_encode(array(
        'status' => true,
        'category' => $organizedCategory
    ));
} else {
    $errors = $api_response->getErrors();
    echo json_encode(array(
        'status' => false,
        'errors' => $errors
    ));
}
