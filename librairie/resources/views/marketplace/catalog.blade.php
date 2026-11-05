@extends('marketplace.layout')
@push('styles')
<link rel="stylesheet" href="{{ asset('css/catalogue.css') }}?v=3">
<script src="{{ asset('js/catalogue-advertising.js') }}?v=2" defer></script>
@endpush
@section('hero')
    @include('marketplace.hero')
@endsection
@section('content')
    @include('marketplace.catalog-content')
@endsection
