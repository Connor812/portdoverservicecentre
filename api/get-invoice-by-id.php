<?php
// Allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
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

$invoice_id = $data['invoice_id'];

require_once('../functions/get-invoice-by-id.php');
require_once('../functions/get-order-by-id.php');
require_once('../functions/get-item-by-id.php');
require_once('../functions/get-inventory-count.php');

$invoiceObject = GetInvoice($client, $invoice_id);
if (!$invoiceObject['status']) {
    echo json_encode([
        'status' => false,
        'error' => $invoiceObject['error']
    ]);
    exit;
}

$invoice['id'] = $invoiceObject['invoice']->getId();
$invoice['status'] = $invoiceObject['invoice']->getStatus();
$invoice['version'] = $invoiceObject['invoice']->getVersion();

$orderObject = GetOrder($client, $invoiceObject['invoice']->getOrderId());
$fulfillments = $orderObject['order']->getFulfillments();
$lineItems = $orderObject['order']->getLineItems();
$items = [];

foreach ($lineItems as $lineItem) {
    $item_id = $lineItem->getCatalogObjectId();
    $itemResponse = GetItem($client, $item_id);

    if (!$itemResponse['status']) {
        echo json_encode([
            'status' => false,
            'error' => $itemResponse['error']
        ]);
        exit;
    }

    // Retrieve the main item and its related objects
    $itemObject = $itemResponse['item']->getObject();
    $relatedObjects = $itemResponse['item']->getRelatedObjects();
    $imageUrl = null;

    // Debugging: Output related objects to see their structure
    if (!empty($relatedObjects)) {
        foreach ($relatedObjects as $relatedObject) {
            if ($relatedObject->getItemData() !== null) {
                $imageIds = $relatedObject->getItemData()->getImageIds();

                // Check if image IDs exist
                if (!empty($imageIds)) {
                    // Fetch the image object
                    $imageObject = GetItem($client, $imageIds[0]);

                    if ($imageObject['status']) {
                        $itemImageObject = $imageObject['item']->getObject();
                        if ($itemImageObject->getType() === "IMAGE" && $itemImageObject->getImageData() !== null) {
                            $imageUrl = $itemImageObject->getImageData()->getUrl();
                        }
                    } else {
                        echo json_encode([
                            'status' => false,
                            'error' => "Image fetch error: " . $imageObject['error']
                        ]);
                        exit;
                    }
                } else {
                    error_log("No image IDs found in related objects for item: " . $item_id);
                }
            } else {
                error_log("No item data in related objects for item: " . $item_id);
            }
        }
    } else {
        error_log("No related objects for item: " . $item_id);
    }

    $item_name = $lineItem->getName();
    $item_variation_name = $lineItem->getVariationName();
    $item_price = $lineItem->getBasePriceMoney()->getAmount();
    $item_quantity = $lineItem->getQuantity();

    $item_data = [
        'name' => $item_name,
        'variation_name' => $item_variation_name,
        'price' => $item_price,
        'quantity' => $item_quantity,
        'image' => $imageUrl,
    ];

    $inventory = GetInventoryCount($client, $item_id);
    if (!$inventory['status']) {
        echo json_encode([
            'status' => false,
            'error' => $inventory['error']
        ]);
        exit;
    }
    $item_data['inventory'] = $inventory['inventory'];

    $items[] = $item_data;
}

echo json_encode([
    'status' => true,
    'invoice' => $invoice,
    'order' => $fulfillments,
    'items' => $items
]);
