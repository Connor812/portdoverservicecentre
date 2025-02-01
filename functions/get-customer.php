<?php

function GetCustomer($client, $customerId)
{
    // Attempt to retrieve the customer using the provided customer ID
    $api_response = $client->getCustomersApi()->retrieveCustomer($customerId);

    if ($api_response->isSuccess()) {
        $customer = $api_response->getResult()->getCustomer();
        return [
            'status' => true,
            'customer' => $customer
        ];
    } else {
        $errors = $api_response->getErrors();
        return [
            'status' => false,
            'errors' => $errors
        ];
    }
}
