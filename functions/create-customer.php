<?php


function CreateCustomer($client, $customer_info)
{

    $body = new \Square\Models\CreateCustomerRequest();
    $uid = uniqid();
    $body->setIdempotencyKey($uid);
    $body->setGivenName($customer_info['first-name']);
    $body->setFamilyName($customer_info['last-name']);
    $body->setEmailAddress($customer_info['email']);
    $body->setPhoneNumber($customer_info['phone']);

    $api_response = $client->getCustomersApi()->createCustomer($body);

    if ($api_response->isSuccess()) {
        $result = $api_response->getResult();

        return ([
            'status' => true,
            'customer_id' => $result->getCustomer()->getId()
        ]);
    } else {
        $errors = $api_response->getErrors();
        return ([
            'status' => false,
            'error' => $errors
        ]);
    }
}
