<?php

function GetImage($client, $image_id)
{
    $api_response = $client->getCatalogApi()->retrieveCatalogObject($image_id);

    if ($api_response->isSuccess()) {
        $result = $api_response->getResult();
        $image_url = $result->getObject()->getImageData()->getUrl();

        return [
            'status' => true,
            'image_url' => $image_url
        ];
    } else {
        $errors = $api_response->getErrors();
        return [
            'status' => false,
            'error' => $errors
        ];
    }
}
