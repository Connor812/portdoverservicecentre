<?php

function GetOrder($client, $order_id)
{
    $api_response = $client->getOrdersApi()->retrieveOrder($order_id);

    if ($api_response->isSuccess()) {
        $result = $api_response->getResult();
        return [
            'status' => true,
            'order' => $result->getOrder()
        ];
    } else {
        return [
            'status' => false,
            'error' => $api_response->getErrors()
        ];
    }
}
