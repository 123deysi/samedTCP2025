<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSubtiposAccionesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('subtipos_acciones', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 250)->nullable();
            $table->string('codigo', 10)->nullable();
            $table->foreignId('accion_id')->constrained('acciones_constitucionales');
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('subtipos_acciones');
    }
}
