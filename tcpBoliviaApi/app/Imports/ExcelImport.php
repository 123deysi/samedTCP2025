<?php

namespace App\Imports;

use App\Models\ExcelDBRegistro;
use App\Models\Departamentos;
use App\Models\Municipio;
use App\Models\ResEmisor;
use App\Models\AccionConstitucional;
use App\Models\SubtipoAccion;
use App\Models\TipoResolucion2;
use App\Models\TipoResolucion;
use App\Models\Caso;
use App\Models\Resolucion;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class ExcelImport implements ToCollection, WithHeadingRow, WithChunkReading
{
    use Importable;

    public function collection(Collection $collection)
    {
        Log::info('Contenido del archivo importado: ' . json_encode($collection->toArray()));

        $rows = $collection->toArray();
        foreach ($rows as $index => $row) {
            try {
                // Departamentos
                $idDepartamento = null;
                $nombreDepartamento = trim($row['departamento'] ?? '');
                if ($nombreDepartamento !== '' && $nombreDepartamento !== 'NULL') {
                    $departamento = Departamentos::firstOrCreate(['nombre' => $nombreDepartamento]);
                    $idDepartamento = $departamento->id;
                }

                // Municipios
                $idMunicipio = null;
                $nombreMunicipio = trim($row['municipio'] ?? '');
                if ($nombreMunicipio !== '' && $nombreMunicipio !== 'NULL') {
                    $municipio = Municipio::firstOrCreate(
                        ['nombre' => $nombreMunicipio],
                        ['departamento_id' => $idDepartamento]
                    );
                    $idMunicipio = $municipio->id;
                }

                // Acciones Constitucionales
                $idAccionConstitucional = null;
                $nombreAccionConstitucional = trim($row['accion_const2'] ?? '');
                if ($nombreAccionConstitucional !== '' && $nombreAccionConstitucional !== 'NULL') {
                    $accionConstitucional = AccionConstitucional::firstOrCreate(['nombre' => $nombreAccionConstitucional]);
                    $idAccionConstitucional = $accionConstitucional->id;
                }

                // Subtipo Accion
                $idSubtipoAccion = null;
                $nombreSubtipoAccion = trim($row['accion_const'] ?? '');
                if ($nombreSubtipoAccion !== '' && $nombreSubtipoAccion !== 'NULL') {
                    $subtipoAccion = SubtipoAccion::firstOrCreate(
                        ['codigo' => $nombreSubtipoAccion],
                        ['accion_id' => $idAccionConstitucional]
                    );
                    $idSubtipoAccion = $subtipoAccion->id;
                }

                // Res Emisor
                $idResEmisor = null;
                $nombreResEmisor = trim($row['res_emisor'] ?? '');
                if ($nombreResEmisor !== '' && $nombreResEmisor !== 'NULL') {
                    $resEmisor = ResEmisor::firstOrCreate(['nombre' => $nombreResEmisor]);
                    $idResEmisor = $resEmisor->id;
                }

                // Tipo Resolución 2
                $idTipoResolucion2 = null;
                $descripcionTipoResolucion2 = trim($row['res_tipo2'] ?? '');
                if ($descripcionTipoResolucion2 !== '' && $descripcionTipoResolucion2 !== 'NULL') {
                    $tipoResolucion2 = TipoResolucion2::firstOrCreate(
                        ['codigo' => $descripcionTipoResolucion2],
                        ['descripcion' => null]
                    );
                    $idTipoResolucion2 = $tipoResolucion2->id;
                }

                // Tipo Resolución
                $idTipoResolucion = null;
                $descripcionTipoResolucion = trim($row['res_tipo'] ?? '');
                if ($descripcionTipoResolucion !== '' && $descripcionTipoResolucion !== 'NULL') {
                    $tipoResolucion = TipoResolucion::firstOrCreate(
                        ['codigo' => $descripcionTipoResolucion],
                        [
                            'descripcion' => null,
                            'res_tipo2_id' => $idTipoResolucion2,
                        ]
                    );
                    $idTipoResolucion = $tipoResolucion->id;
                }

                // CASO
                $id2 = trim($row['id2'] ?? '');
                if ($id2 !== '' && $id2 !== 'NULL') {
                    $caso = Caso::firstOrNew(['id2' => $id2]);
                    $caso->exp = $row['exp'] ?? null;
                    $caso->sala = $row['sala'] ?? null;
                    $caso->accion_const_id = $idSubtipoAccion;
                    $caso->accion_const2_id = $idAccionConstitucional;
                    $caso->res_emisor_id = $idResEmisor;
                    $caso->departamento_id = $idDepartamento;
                    $caso->municipio_id = $idMunicipio;
                    $caso->fecha_ingreso = $row['fecha_ingreso'] ?? null;
                    $caso->save();
                }

                // RESOLUCIÓN
                if ($id2 !== '' && $id2 !== 'NULL') {
                    $caso = Caso::where('id2', $id2)->first();

                    if ($caso) {
                        $resolucion = Resolucion::where('caso_id', $caso->id)
                            ->where('numres2', $row['numres2'])
                            ->first();

                        if (!$resolucion) {
                            $resolucion = new Resolucion();
                            $resolucion->caso_id = $caso->id;
                            $resolucion->numres2 = $row['numres2'];
                        }

                        $resolucion->res_fecha = !empty($row['res_fecha']) ? Carbon::parse($row['res_fecha'])->format('Y-m-d') : null;
                        $resolucion->res_tipo_id = $idTipoResolucion ?? null;
                        $resolucion->res_tipo2_id = $idTipoResolucion2 ?? null;
                        $resolucion->res_fondo_voto = is_numeric($row['res_fondo_voto']) ? (int)$row['res_fondo_voto'] : null;
                        $resolucion->resresul = $row['resresul'] ?? null;
                        $resolucion->revresul = $row['revresul'] ?? null;
                        $resolucion->resfinal = $row['resfinal'] ?? null;
                        $resolucion->relator = $row['relator'] ?? null;
                        $resolucion->restiempo = is_numeric(str_replace(',', '.', $row['restiempo']))
                            ? (float)str_replace(',', '.', $row['restiempo']) : null;

                        $resolucion->save();
                    }
                }

            } catch (\Exception $e) {
                Log::error('Error al guardar la fila: ' . json_encode($row) . ' - Error: ' . $e->getMessage());
            }
        }
    }

    // Chunking: divide el archivo en bloques de 500 filas
    public function chunkSize(): int
    {
        return 500;
    }
}
