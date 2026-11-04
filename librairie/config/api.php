<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Front API configuration
    |--------------------------------------------------------------------------
    |
    | Ce projet est le front. Ces valeurs indiquent au JavaScript ou se trouve
    | l'autre projet API et quels endpoints utiliser pour charger le contenu.
    |
    */

    'enabled' => (bool) env('FRONT_API_ENABLED', false),

    'base_url' => env('FRONT_API_BASE_URL', 'http://127.0.0.1:8000/api'),

    'timeout' => (int) env('FRONT_API_TIMEOUT', 8000),

    'endpoints' => [
        'books' => env('FRONT_API_BOOKS_ENDPOINT', '/books'),
        'product' => env('FRONT_API_PRODUCT_ENDPOINT', '/products'),
        'orders' => env('FRONT_API_ORDERS_ENDPOINT', '/orders'),
        'delivery_options' => env('FRONT_API_DELIVERY_OPTIONS_ENDPOINT', '/delivery-options'),
        'advertisements' => env('FRONT_API_ADVERTISEMENTS_ENDPOINT', '/advertisements'),
        'filters' => env('FRONT_API_FILTERS_ENDPOINT', '/catalog/filters'),
        'categories' => env('FRONT_API_CATEGORIES_ENDPOINT', '/categories'),
        'search' => env('FRONT_API_SEARCH_ENDPOINT', '/search'),
    ],
];
