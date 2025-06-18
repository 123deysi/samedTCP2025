<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTiposResolucionesTable extends Migration
{
    /**
     * Ejecuta las migraciones.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tipos_resoluciones', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 100)->nullable();
            $table->string('descripcion', 255)->nullable();
            $table->unsignedBigInteger('res_tipo2_id')->nullable(); // Relación con el tiporesolucion2
            // Agregar la clave foránea si se relaciona con una tabla de departamentos
            $table->foreign('res_tipo2_id')
            ->references('id')
            ->on('tipos_resoluciones2')
            ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reversa las migraciones.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tipos_resoluciones');
    }
}
