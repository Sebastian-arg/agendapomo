<?php

namespace App\Http\Controllers;

use App\Models\Tarea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TareaController extends Controller
{
    //traemos todas las tareas de la bdd
    public function index(Request $request)
    {
        $query = Tarea::where('user_id', Auth::id());

        // Filtrar por estado
        if ($request->has('estado')) {
            $query->where('estado', $request->estado);
        }

        // Filtrar por fecha
        if ($request->has('fecha')) {
            $query->whereDate('fecha_limite', $request->fecha);
        }

        $tareas = $query->get();

        return response()->json($tareas);
    }

    //creamos tareas
    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'fecha_limite' => 'nullable|date',
            'estado' => 'nullable|in:pendiente,completada'
        ]);

        $validated['user_id'] = Auth::id();

        $tarea = Tarea::create($validated);

        return response()->json($tarea, 201);
    }

    //solicitamos las tareas de la bdd por id
    public function show($id)
    {
        $tarea = Tarea::where('user_id', Auth::id())->findOrFail($id);
        return response()->json($tarea);
    }

    //actualizamos traeas
    public function update(Request $request, $id)
    {
        $tarea = Tarea::where('user_id', Auth::id())->findOrFail($id);

        $validated = $request->validate([
            'titulo' => 'sometimes|required|string|max:255',
            'descripcion' => 'nullable|string',
            'fecha_limite' => 'nullable|date',
            'estado' => 'nullable|in:pendiente,completada'
        ]);

        $tarea->update($validated);

        return response()->json($tarea);
    }


    //Eliminar alguna tarea
    public function destroy($id)
    {
        $tarea = Tarea::where('user_id', Auth::id())->findOrFail($id);
        $tarea->delete();

        return response()->json(['message' => 'Tarea eliminada correctamente']);
    }
}
