<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCasosTable extends Migration
{
    /**
     * Ejecuta las migraciones.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('casos', function (Blueprint $table) {
            $table->id();
            $table->string('id2', 250)->nullable();
            $table->string('exp', 50)->nullable();
            $table->string('sala', 250)->nullable();
            $table->unsignedBigInteger('accion_const_id')->nullable();
            $table->unsignedBigInteger('accion_const2_id')->nullable();
            $table->unsignedBigInteger('res_emisor_id')->nullable();
            $table->unsignedBigInteger('departamento_id')->nullable();
            $table->unsignedBigInteger('municipio_id')->nullable();
            $table->date('fecha_ingreso')->nullable();
            $table->timestamps();
            // Claves foráneas
            $table->foreign('accion_const_id')->references('id')->on('subtipos_acciones')->onDelete('set null');
            $table->foreign('accion_const2_id')->references('id')->on('acciones_constitucionales')->onDelete('set null');
            $table->foreign('res_emisor_id')->references('id')->on('res_emisores')->onDelete('set null');
            $table->foreign('departamento_id')->references('id')->on('departamentos')->onDelete('set null');
            $table->foreign('municipio_id')->references('id')->on('municipios')->onDelete('set null');

        });

   }

    /**
     * Reversa las migraciones.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('casos');
    }
}
