<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Header extends Model
{
    protected $fillable = [
        'logo_name',
        'logo_icon',
        'search_placeholder',
        'nav_items',
        'hero_eyebrow',
        'hero_title',
        'hero_title_emphasis',
        'hero_subtitle',
        'hero_promo',
        'hero_cta_label',
        'hero_cta_page',
        'hero_main_book_page',
        'hero_main_book_bg',
        'hero_small_books',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'nav_items' => 'array',
        'hero_small_books' => 'array',
        'is_active' => 'boolean',
    ];
}
