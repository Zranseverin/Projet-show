@extends('marketplace.layout')
@section('title', 'Commande enregistrée · Zran Market')
@section('content')
<div class="confirmation"><div class="success-mark" aria-hidden="true">✓</div><h1>Votre commande est enregistrée.</h1><p class="muted">Elle est en attente de paiement. Conservez cette référence et suivez les instructions ci-dessous.</p><p class="reference">Référence : <strong>{{ $order['reference'] }}</strong></p><h2>Total : {{ number_format($order['total'], 0, ',', ' ') }} FCFA</h2>
@if($order['payment_mode'] === 'platform')<div class="notice"><h3>Un paiement à la plateforme</h3><p>Réglez le total ci-dessus en indiquant votre référence de commande.</p><p class="pre">{{ $order['sellers'][0]['payment_instructions'] }}</p></div>@endif
@foreach($order['sellers'] as $seller)<section class="panel"><h2>{{ $seller['name'] }}</h2><ul>@foreach($seller['items'] as $item)<li>{{ $item['name'] }} × {{ $item['quantity'] }}</li>@endforeach</ul><p><strong>{{ number_format($seller['total'], 0, ',', ' ') }} FCFA</strong></p>@if($order['payment_mode'] === 'direct')<h3>Instructions de paiement</h3><p class="pre">{{ $seller['payment_instructions'] }}</p>@endif</section>@endforeach
<p class="muted">Le paiement sera confirmé après vérification de sa réception. Conservez également la référence de votre transfert.</p><a class="btn" href="{{ route('catalogue') }}">Retour aux découvertes</a></div>
@endsection
