<?php


function GetLocationId($client)
{
    $api_response = $client->getLocationsApi()->listLocations();

    if ($api_response->isSuccess()) {
        $result = $api_response->getResult();
        $locations = $result->getLocations();
        $location_id = $locations[0]->getId();
        return array(
            'status' => true,
            'location_id' => $location_id
        );
    } else {
        $errors = $api_response->getErrors();
        return array(
            'status' => false,
            'error' => $errors
        );
    }
}
