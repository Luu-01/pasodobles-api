<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pasodoble;
use Illuminate\Http\Request;

class PasodobleController extends Controller
{
    public function index(){
        $pasodobles = Pasodoble::with('author', 'category')->get();
        return response()->json([
            "data" => $pasodobles
        ], 200);
    }
    public function show(Pasodoble $pasodoble){
        $pasodoble->load('author', 'category');
        return response()->json($pasodoble);
    }
    public function store(Request $request){
        //! replace by Resource
        $data = [
            "title" => $request->title,
            "description" => $request->description,
            "year" => $request->year,
            "pdf_url" => $request->pdf_url,
            "author_id" => $request->author_id,
            "category_id" => $request->category_id
        ];

        $pasodoble = Pasodoble::create($data);
        return response()->json([
            compact('pasodoble'),
            "message" => "Created"
        ], 201);
    }
    public function update(Pasodoble $pasodoble, Request $request){
         $data = [
            "title" => $request->title,
            "description" => $request->description,
            "year" => $request->year,
            "pdf_url" => $request->pdf_url,
            "author_id" => $request->author_id,
            "category_id" => $request->category_id
        ];
        $pasodoble->update($data);
        return response()->json([
            compact('pasodoble'),
            "message" => "Updated"
        ]);
    }
    public function destroy(Pasodoble $pasodoble){
        $pasodoble->delete();
        return response()->json([
            "message" => "Deleted pasodoble {$pasodoble->title}"
        ]);
    }
}
