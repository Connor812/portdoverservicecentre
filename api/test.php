<?php
require '../vendor/autoload.php';
require_once("../config-url.php");
require_once("../functions/organize-products.php");

use Square\SquareClient;
use Square\Models\CatalogObject;
use Square\Models\CatalogItem;
use Square\Models\CatalogObjectCategory;
use Square\Exceptions\ApiException;

// Initialize the Square client
$client = new SquareClient([
    'accessToken' => ACCESS_TOKEN,
    'environment' => ENVIRONMENT
]);
// Initialize the CatalogApi
$catalogApi = $client->getCatalogApi();

// Define the item ID
$itemId = 'X3KJCJXJQFWG6UWOWAANCORO';  // Replace with the actual item ID

try {
    // Make the API call to retrieve the catalog object
    $api_response = $catalogApi->retrieveCatalogObject($itemId);

    if ($api_response->isSuccess()) {
        // Retrieve the CatalogObject from the response
        $catalogObject = $api_response->getResult()->getObject();

        // Ensure the object type is 'ITEM'
        if ($catalogObject->getType() == 'ITEM') {
            // Get the categories array from the item
            $categories = $catalogObject->getItemData()->getCategories(); // This contains the category objects

            // Extract the category IDs from the category objects
            $categoryIds = [];
            foreach ($categories as $category) {
                if ($category instanceof CatalogObjectCategory) {
                    $categoryIds[] = $category->getId(); // Get the category ID
                }
            }

            echo json_encode($categoryIds);
        } else {
            echo 'The retrieved object is not of type ITEM, it is of type ' . $catalogObject->getType();
        }
    } else {
        // If the API call fails, log the errors
        $errors = $api_response->getErrors();
        echo 'API Call Failed: ' . json_encode($errors);
    }
} catch (ApiException $e) {
    // Catch any exceptions thrown by the API call
    echo 'Error: ' . $e->getMessage();
}
