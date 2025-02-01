<?php

function GetInvoice($client, $invoice_id)
{

    $api_response = $client->getInvoicesApi()->getInvoice($invoice_id);

    if ($api_response->isSuccess()) {
        $result = $api_response->getResult();
        return [
            'status' => true,
            'invoice' => $result->getInvoice()
        ];
    } else {
        return [
            'status' => false,
            'error' => $api_response->getErrors()
        ];
    }
}
