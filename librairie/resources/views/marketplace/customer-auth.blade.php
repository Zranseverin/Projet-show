@extends('marketplace.layout')
@section('title', $register ? 'Créer mon compte · Zran Market' : 'Connexion · Zran Market')
@section('content')
<section class="panel" style="max-width:540px;margin:20px auto">
    <div class="eyebrow">MON ESPACE CLIENT</div>
    <h1 style="font-size:30px">{{ $register ? 'Créez votre compte.' : 'Heureux de vous retrouver.' }}</h1>
    <p class="muted">Connectez-vous pour ajouter des produits au panier et passer vos commandes.</p>
    <form method="post" action="{{ route($register ? 'register.store' : 'login.store') }}" class="form-grid">@csrf
        @if($register)<div class="full"><label for="name">Nom complet</label><input id="name" name="name" value="{{ old('name') }}" required maxlength="180" autocomplete="name"></div>@endif
        <div class="full"><label for="email">Adresse e-mail</label><input id="email" name="email" type="email" value="{{ old('email') }}" required maxlength="255" autocomplete="email"></div>
        <div class="full"><label for="password">Mot de passe{{ $register ? ' (8 caractères minimum)' : '' }}</label><input id="password" name="password" type="password" required @if($register) minlength="8" autocomplete="new-password" @else autocomplete="current-password" @endif></div>
        @if($register)<div class="full"><label for="password_confirmation">Confirmer le mot de passe</label><input id="password_confirmation" name="password_confirmation" type="password" required autocomplete="new-password"></div>@endif
        <button class="full">{{ $register ? 'Créer mon compte et continuer' : 'Me connecter' }}</button>
    </form>
    @if($register)
        <div class="panel" style="margin-top:24px;background:var(--cream)">
            <div class="eyebrow">Vous vendez des produits ?</div>
            <h2 style="font-size:21px">Ouvrez votre boutique</h2>
            <p class="muted">Créez un compte vendeur et configurez votre boutique avec votre compte Google.</p>
            <a class="btn" href="{{ route('seller.google') }}" style="width:100%">Continuer avec Google en tant que vendeur</a>
            <p class="muted" style="font-size:13px;margin:12px 0 0">Vous pourrez aussi choisir l’inscription par e-mail.</p>
        </div>
    @endif
    <p style="margin-top:22px">{{ $register ? 'Déjà inscrit ?' : 'Pas encore de compte ?' }} <a href="{{ route($register ? 'login' : 'register') }}"><strong>{{ $register ? 'Se connecter' : 'Créer mon compte' }}</strong></a></p>
    <p class="muted">Vous êtes vendeur ? <a href="{{ route('seller.login') }}">Accéder à votre boutique</a></p>
</section>
@endsection
