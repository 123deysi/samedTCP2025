<?php

namespace App\Exports;

use App\Models\Departamentos;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;

class ExcelExport implements ToModel, WithHeadingRow, WithBatchInserts, WithChunkReading
{
    /**
     * Mapear los datos del Excel a las columnas de la tabla `casos`
     *
     * @param array $row
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        return new Departamentos([
            'nombre'  => $row['departamento'],
             ]);
       
    }

    public function batchSize(): int
    {
        return 1000;
    }
    public function chunkSize(): int
    {
        return 1000;
    }
}
