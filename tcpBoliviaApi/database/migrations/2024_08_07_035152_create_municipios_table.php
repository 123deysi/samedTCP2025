
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMunicipiosTable extends Migration
{
    /**
     * Ejecuta las migraciones.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('municipios', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->nullable(); // Nombre del municipio
            $table->unsignedBigInteger('departamento_id')->nullable(); // Relación con el departamento
            $table->timestamps();

            // Agregar la clave foránea si se relaciona con una tabla de departamentos
            $table->foreign('departamento_id')->references('id')->on('departamentos')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reversa las migraciones.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('municipios');
    }
}
