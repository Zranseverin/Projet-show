@php
    $apiConfig = [
        'enabled' => config('api.enabled'),
        'baseUrl' => rtrim(config('api.base_url'), '/'),
        'timeout' => config('api.timeout'),
        'endpoints' => config('api.endpoints'),
    ];
@endphp

<script>
    window.LIBRAIRIE_API = @json($apiConfig);
</script>
