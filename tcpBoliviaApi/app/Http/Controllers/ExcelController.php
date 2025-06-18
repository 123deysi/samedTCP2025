<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\ExcelImport;
use Exception;

class ExcelController extends Controller
{
    public function upload(Request $request)

    {
        ini_set('max_execution_time', 0);
ini_set('memory_limit', '512M');

        
        Log::info('Solicitud recibida: ' . json_encode($request->all()));

        // Verifica si el archivo está en la solicitud
        if (!$request->hasFile('file')) {
            Log::error('No se ha recibido ningún archivo.');
            return response()->json(['error' => 'No se ha recibido ningún archivo.'], 422);
        }

        // Valida que se haya enviado un archivo
        try {
            $request->validate([
                'file' => 'required|file|max:20480',
            ]);
            Log::info('Validación del archivo pasada.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Error de validación: ' . $e->getMessage());
            return response()->json(['error' => 'Error de validación: ' . $e->getMessage()], 422);
        }

        $file = $request->file('file');
        Log::info('Archivo recibido: ' . $file->getClientOriginalName());

        if ($file) {
            // Almacena el archivo
            $path = $file->store('uploads', 'public');
            $fullPath = storage_path('app/public/' . $path);
            $url = Storage::url($path);

            Log::info('Archivo guardado en: ' . $fullPath);
            Log::info('URL del archivo: ' . $url);

            try {
                // Lee el contenido del archivo para verificar que tiene datos
                $content = file_get_contents($fullPath);
                Log::info('Contenido del archivo: ' . substr($content, 0, 500)); // Muestra solo los primeros 500 caracteres para evitar demasiada información

                // Verifica la extensión del archivo
                $fileExtension = $file->getClientOriginalExtension();
                Log::info('Extensión del archivo: ' . $fileExtension);

                if (in_array($fileExtension, ['csv', 'xlsx', 'xls'])) {
                    // Importa el archivo
                    Excel::import(new ExcelImport, $fullPath);
                    Log::info('Importación del archivo iniciada.');
                } else {
                    Log::warning('Archivo no es de tipo Excel: ' . $fileExtension);
                    return response()->json([
                        'message' => 'Archivo cargado pero no es de tipo Excel.',
                        'url' => $url
                    ], 422);
                }

                return response()->json([
                    'message' => 'Archivo cargado y datos importados con éxito.',
                    'url' => $url
                ]);
            } catch (Exception $e) {
                Log::error('Error al procesar el archivo: ' . $e->getMessage());
                return response()->json([
                    'error' => 'Error al procesar el archivo: ' . $e->getMessage(),
                    'url' => $url
                ], 422);
            }
        }

        Log::error('No se ha recibido ningún archivo.');
        return response()->json(['error' => 'No se ha recibido ningún archivo.'], 422);
    }
}
