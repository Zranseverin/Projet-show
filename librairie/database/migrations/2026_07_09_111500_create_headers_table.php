<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('headers', function (Blueprint $table) {
            $table->id();
            $table->string('logo_name')->default('Chapitre');
            $table->text('logo_icon')->nullable();
            $table->string('search_placeholder')->default('Rechercher un livre, un auteur...');
            $table->json('nav_items')->nullable();
            $table->string('hero_eyebrow')->nullable();
            $table->string('hero_title')->nullable();
            $table->string('hero_title_emphasis')->nullable();
            $table->string('hero_subtitle')->nullable();
            $table->string('hero_promo')->nullable();
            $table->string('hero_cta_label')->nullable();
            $table->string('hero_cta_page')->default('catalogue');
            $table->string('hero_main_book_page')->default('product');
            $table->string('hero_main_book_bg')->nullable();
            $table->json('hero_small_books')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['is_active', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('headers');
    }
};
