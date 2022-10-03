<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Messages;
use App\Models\Block;
use App\Models\Favorite;

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

    function block(Request $request){
        $check_block = Block::
                    where([
                        ['blocker_id', '=', $request->id],
                        ['blocked_id', '=', $request->block]
                    ])
                    ->get();
        if(sizeof($check_block) != 0){
            return response()->json([
                "status" => "Failed",
                "message" => "User already blocked"
            ]);
        }
        $block = new Block;
        $block->blocker_id = $request->id;
        $block->blocked_id = $request->block;

        if($block->save()){
            return response()->json([
                "status" => "Success",
                "data" => $block
            ]);
        }
    }

    function unblock(Request $request){
        Block::
            where([
                ['blocker_id', '=', $request->id],
                ['blocked_id', '=', $request->unblock]
            ])
            ->delete();
        return response()->json([
            "status" => "Success",
            "data" => "Block Removed"
        ]);
    }

}
