<?php

use Square\Models\CatalogObjectCategory;
use Square\Exceptions\ApiException;

function OrganizeProducts($products, $client)
{
    $organizedProducts = [];
    $related_objects = $products['related_objects'];

    // Create an associative array mapping image IDs to URLs from related objects
    $imageMap = [];

    // Iterate over the related objects to map images and categories
    if (!empty($related_objects)) {
        foreach ($related_objects as $relatedObj) {
            if ($relatedObj->getType() === 'IMAGE') {
                $imageData = $relatedObj->getImageData();
                $imageMap[$relatedObj->getId()] = $imageData->getUrl();
            }
        }
    }

    if (!empty($products['objects'])) {
        foreach ($products['objects'] as $productObj) {
            if ($productObj->getType() === 'ITEM') {
                $itemData = $productObj->getItemData();

                // Get image URLs and their corresponding image IDs
                $imageDetails = [];
                if (!empty($itemData->getImageIds())) {
                    foreach ($itemData->getImageIds() as $imageId) {
                        if (isset($imageMap[$imageId])) {
                            $imageDetails[] = ['id' => $imageId, 'url' => $imageMap[$imageId]];
                        }
                    }
                }

                $product = [
                    'name' => $itemData->getName() ?? '',
                    'description' => $itemData->getDescriptionPlaintext() ?? '',
                    'price' => (!empty($itemData->getVariations()[0]) && $itemData->getVariations()[0]->getItemVariationData()->getPriceMoney() !== null)
                        ? $itemData->getVariations()[0]->getItemVariationData()->getPriceMoney()->getAmount()
                        : 0,
                    'images' => $imageDetails, // Return images with their IDs
                    'id' => $productObj->getId() ?? '',
                    'is_taxable' => $itemData->getIsTaxable() ?? false,
                    'item_variations' => []
                ];

                // Get category IDs and names
                $categories = $itemData->getCategories() ?? []; // Ensure this is always an array
                $categoryDetails = [];

                foreach ($categories as $category) {
                    if ($category instanceof CatalogObjectCategory) {
                        $categoryDetails[] = [
                            'id' => $category->getId(),
                            'name' => getCategoryName($category->getId(), $client),
                        ];
                    }
                }


                $product['categories'] = $categoryDetails;

                // Loop through item variations
                foreach ($itemData->getVariations() as $variationObj) {
                    $variationData = $variationObj->getItemVariationData();
                    $priceMoney = $variationData->getPriceMoney();

                    // Get variation-specific image URLs with image IDs
                    $variationImageDetails = [];
                    if (!empty($variationData->getImageIds())) {
                        foreach ($variationData->getImageIds() as $imageId) {
                            if (isset($imageMap[$imageId])) {
                                $variationImageDetails[] = ['id' => $imageId, 'url' => $imageMap[$imageId]];
                            }
                        }
                    }

                    $variation = [
                        'name' => $variationData->getName() ?? '',
                        'price' => ($priceMoney !== null && $priceMoney->getAmount() !== null) ? $priceMoney->getAmount() : 0,
                        'id' => $variationObj->getId() ?? '',
                        'sku' => $variationData->getSku() ?? '', // Include SKU in the variation data
                        'image' => $variationImageDetails, // Store the variation-specific images with their IDs
                        'track_inventory' => $variationData->getTrackInventory() ?? false,
                        'sold_out' => !empty($variationData->getLocationOverrides()[0]) && $variationData->getLocationOverrides()[0]->getSoldOut()
                            ? $variationData->getLocationOverrides()[0]->getSoldOut()
                            : false
                    ];
                    $product['item_variations'][] = $variation;
                }

                $organizedProducts[] = $product;
            }
        }
    }
    return $organizedProducts;
}

function getCategoryName($category_id, $client)
{
    $catalogApi = $client->getCatalogApi();

    try {
        // Fetch the category object by ID
        $response = $catalogApi->retrieveCatalogObject($category_id);

        if ($response->isSuccess()) {
            $catalogObject = $response->getResult()->getObject();

            // Ensure the object exists and is a category
            if ($catalogObject && $catalogObject->getType() === 'CATEGORY') {
                return $catalogObject->getCategoryData()->getName();
            } else {
                return "Category not found or invalid type.";
            }
        } else {
            // Handle API errors
            $errors = $response->getErrors();
            foreach ($errors as $error) {
                error_log($error->getDetail());
            }
            return "Failed to retrieve category.";
        }
    } catch (ApiException $e) {
        // Log exception details
        error_log($e->getMessage());
        return "Error retrieving category.";
    }
}
