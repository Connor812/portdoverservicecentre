<?php

function GetItem($client, $item_id)
{
    $api_response = $client->getCatalogApi()->retrieveCatalogObject($item_id, true);

    if ($api_response->isSuccess()) {
        $result = $api_response->getResult();
        return [
            'status' => true,
            'item' => $result
        ];
    } else {
        $errors = $api_response->getErrors();
        return [
            'status' => false,
            'error' => $errors
        ];
    }
}
