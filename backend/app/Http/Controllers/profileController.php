<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Messages;
use App\Models\User;

class profileController extends Controller
{
    function getMessages($id){
        $messages = Messages::
            where("sender_id", $id)
                ->orWhere("receiver_id", $id)
                ->with("User")
                ->get();

        return response()->json([
        "status" => "Success",
        "data" => $messages
        ]);
    }

    function sendMessage(Request $request){
        $message = new Messages;
        $message->sender_id = $request->sender_id;
        $message->receiver_id = $request->receiver_id;
        $message->content = $request->content;
        
        if($message->save()){
            return response()->json([
                "status" => "Success",
                "data" => $message
            ]);
        }
    }
}
