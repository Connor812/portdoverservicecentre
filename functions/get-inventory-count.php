<?php

function GetInventoryCount($client, $item_id)
{
    $api_response = $client->getInventoryApi()->retrieveInventoryCount($item_id);

    if ($api_response->isSuccess()) {
        $result = $api_response->getResult();
        return [
            'status' => true,
            'inventory' => $result->getCounts()
        ];
    } else {
        $errors = $api_response->getErrors();
        return [
            'status' => false,
            'error' => $errors
        ];
    }
}
