<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="{{ asset('images/logo-librairie-dominion.png') }}">
    <link rel="apple-touch-icon" href="{{ asset('images/logo-librairie-dominion.png') }}">
    <title>@yield('title', 'Chapitre — Librairie en ligne')</title>
    <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/librairie.css') }}?v={{ filemtime(public_path('css/librairie.css')) }}">
</head>
<body>
    @include('partial.header')
    @yield('content')
    @include('partial.footer')
    @include('configuration.api')
    <script src="{{ asset('js/librairie.js') }}?v={{ filemtime(public_path('js/librairie.js')) }}"></script>
</body>
</html>
