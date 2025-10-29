<?php

namespace App\Http\Controllers;

use App\Models\Evento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventoController extends Controller
{

    public function index()
    {
        $eventos = Evento::where('user_id', Auth::id())->get();
        return response()->json($eventos);
    }

    // Crear un nuevo evento
    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
            'etiqueta' => 'nullable|string|max:50',
        ]);

        $evento = Evento::create([
            'user_id' => Auth::id(),
            ...$validated
        ]);

        return response()->json($evento, 201);
    }

    // Ver detalle de un evento
    public function show($id)
    {
        $evento = Evento::where('user_id', Auth::id())->findOrFail($id);
        return response()->json($evento);
    }

    // Actualizar un evento
    public function update(Request $request, $id)
    {
        $evento = Evento::where('user_id', Auth::id())->findOrFail($id);

        $validated = $request->validate([
            'titulo' => 'sometimes|required|string|max:255',
            'descripcion' => 'nullable|string',
            'fecha_inicio' => 'sometimes|required|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
            'etiqueta' => 'nullable|string|max:50',
        ]);

        $evento->update($validated);

        return response()->json($evento);
    }

    // Eliminar un evento
    public function destroy($id)
    {
        $evento = Evento::where('user_id', Auth::id())->findOrFail($id);
        $evento->delete();

        return response()->json(['message' => 'Evento eliminado correctamente']);
    }
}
