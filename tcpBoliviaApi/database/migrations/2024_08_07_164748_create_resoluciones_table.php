<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateResolucionesTable extends Migration
{
    /**
     * Ejecuta las migraciones.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('resoluciones', function (Blueprint $table) {
            $table->id();
            $table->string('numres2', 100)->nullable();
            $table->date('res_fecha')->nullable();
            $table->unsignedBigInteger('res_tipo_id')->nullable();
            $table->unsignedBigInteger('res_tipo2_id')->nullable();
            $table->string('res_fondo_voto', 50)->nullable();
            $table->string('resresul', 50)->nullable();
            $table->string('revresul', 50)->nullable();
            $table->string('resfinal', 50)->nullable();
            $table->string('relator')->nullable();
            $table->float('restiempo')->nullable();
            $table->unsignedBigInteger('caso_id')->nullable();
            $table->timestamps();

            // Foreign keys
            $table->foreign('res_tipo_id')->references('id')->on('tipos_resoluciones')->onDelete('set null');
            $table->foreign('res_tipo2_id')->references('id')->on('tipos_resoluciones2')->onDelete('set null');
            $table->foreign('caso_id')->references('id')->on('casos')->onDelete('set null');
        });
    }

    /**
     * Reversa las migraciones.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('resoluciones');
    }
}
