<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory; 
use Illuminate\Support\Facades\Auth;

class Tarea extends Model
{
 use HasFactory;

    protected $fillable = [
        'user_id',
        'titulo',
        'descripcion',
        'fecha_limite',
        'estado',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }}
