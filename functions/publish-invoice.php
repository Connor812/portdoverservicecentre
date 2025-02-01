<?php

function PublishInvoice($client, $id, $version)
{

    $body = new \Square\Models\PublishInvoiceRequest($version);
    $body->setIdempotencyKey(uniqid());

    $api_response = $client->getInvoicesApi()->publishInvoice($id, $body);

    if ($api_response->isSuccess()) {
        $result = $api_response->getResult();
        return [
            "status" => "success",
            "invoice" => $result->getInvoice()
        ];
    } else {
        $errors = $api_response->getErrors();
        return [
            "status" => "error",
            "errors" => $errors
        ];
    }
}
