<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class CustomerAuthController extends Controller
{
    public function login() { return view('marketplace.customer-auth', ['register' => false]); }
    public function register() { return view('marketplace.customer-auth', ['register' => true]); }
    public function store(Request $request)
    {
        $data = $request->validate(['name' => 'required|string|max:180', 'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed']);
        $user = User::create($data);
        Auth::login($user);
        $request->session()->regenerate();
        return $this->resume($request);
    }
    public function authenticate(Request $request)
    {
        $credentials = $request->validate(['email' => 'required|email', 'password' => 'required|string']);
        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            throw ValidationException::withMessages(['email' => 'Adresse e-mail ou mot de passe incorrect.']);
        }
        $request->session()->regenerate();
        return $this->resume($request);
    }
    private function resume(Request $request)
    {
        $pending = $request->session()->pull('pending_cart_item');
        if ($pending) {
            $request->session()->forget('url.intended');
            return app(MarketplaceController::class)->addItem($request, $pending);
        }
        return redirect()->intended(route('account'));
    }
    public function account() { return view('marketplace.customer-account'); }
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('home');
    }
}
