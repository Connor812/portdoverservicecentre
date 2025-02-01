<?php


function CreateInvoice($client, $order_id, $customer_info)
{

    $primary_recipient = new \Square\Models\InvoiceRecipient();
    $primary_recipient->setCustomerId($customer_info['customer_id']);

    $invoice_payment_request = new \Square\Models\InvoicePaymentRequest();
    $invoice_payment_request->setRequestType('BALANCE');
    $invoice_due_date = date('Y-m-d', strtotime('+30 days'));
    $invoice_payment_request->setDueDate($invoice_due_date);
    $invoice_payment_request->setAutomaticPaymentSource('NONE');

    $payment_requests = [$invoice_payment_request];
    $accepted_payment_methods = new \Square\Models\InvoiceAcceptedPaymentMethods();
    $accepted_payment_methods->setCard(true);
    $accepted_payment_methods->setSquareGiftCard(true);

    $invoice = new \Square\Models\Invoice();
    // # Gets Location Id
    $locationId = GetLocationId($client);
    if ($locationId['status'] == false) {
        return ([
            'status' => false,
            'error' => $locationId['error']
        ]);
    }
    $invoice->setLocationId($locationId['location_id']);
    $invoice->setOrderId($order_id);
    $invoice->setPrimaryRecipient($primary_recipient);
    $invoice->setPaymentRequests($payment_requests);
    $invoice->setDeliveryMethod('EMAIL');
    $invoice->setTitle("Invoice For {$customer_info['first-name']} {$customer_info['last-name']}");
    $invoice->setDescription('Invoice for the order');
    $invoice->setAcceptedPaymentMethods($accepted_payment_methods);

    $body = new \Square\Models\CreateInvoiceRequest($invoice);
    $uid = uniqid();
    $body->setIdempotencyKey($uid);

    $api_response = $client->getInvoicesApi()->createInvoice($body);

    if ($api_response->isSuccess()) {
        $result = $api_response->getResult();
        return [
            'status' => true,
            'invoice' => $result->getInvoice()
        ];
    } else {
        $errors = $api_response->getErrors();
        return [
            'status' => false,
            'error' => $errors
        ];
    }
}
