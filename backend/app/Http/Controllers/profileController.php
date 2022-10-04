<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Messages;
use App\Models\Block;
use App\Models\Favorite;

class profileController extends Controller
{
    function getMessages($id, $id2){
        $messages = Messages::
            where([
                ["sender_id", $id],
                ["receiver_id", $id2]
                ])
                ->orWhere([
                    ["receiver_id", $id],
                    ["sender_id", $id2]
                    ])
                ->get();

        return response()->json([
        "status" => "Success",
        "data" => $messages
        ]);
    }

    function getContacts($id){
        $messages = Messages::
            where([
                ["sender_id", $id],
                ])
                ->orWhere([
                    ["receiver_id", $id],
                    ])
                ->with("senderInfo")
                ->with("receiverInfo")
                ->orderBy("created_at", "Desc")
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

    function getFavorites($id){
        $favlist = Favorite::
                        select("favorited_id")
                        ->where([
                            ["user_id", "=", $id]
                        ])
                        ->get();
        $favarray = [];
        foreach ($favlist as $x) {
            $favarray[] = $x['favorited_id'];
        }
        if(sizeof($favarray) != 0){
            return response()->json([
                "status" => "Success",
                "data" => $favarray
            ]);
        } else {
            return response()->json([
                "status" => "Failed",
                "data" => "No favorites"
            ]);
        }
    }

    function getBans($id){
        $banlist = Block::
                        select("blocked_id")
                        ->where([
                            ["blocker_id", "=", $id]
                        ])
                        ->get();
        $blockarray = [];
        foreach ($banlist as $x) {
            $blockarray[] = $x['blocked_id'];
        }
        if(sizeof($blockarray) != 0){
            return response()->json([
                "status" => "Success",
                "data" => $blockarray
            ]);
        } else {
            return response()->json([
                "status" => "Failed",
                "data" => "no blocks"
            ]);
        }
    }

    function block(Request $request){
        Favorite::
        where([
            ['user_id', '=', $request->id],
            ['favorited_id', '=', $request->block]
        ])
        ->delete();
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

    function favorite(Request $request){
        $check_favorite = Favorite::
                    where([
                        ['user_id', '=', $request->id],
                        ['favorited_id', '=', $request->favorite]
                    ])
                    ->get();
        if(sizeof($check_favorite) != 0){
            return response()->json([
                "status" => "Failed",
                "message" => "User already favorited"
            ]);
        }
        $favorite = new Favorite;
        $favorite->user_id = $request->id;
        $favorite->favorited_id = $request->favorite;

        if($favorite->save()){
            return response()->json([
                "status" => "Success",
                "data" => $favorite
            ]);
        }
    }

    function unfavorite(Request $request){
        Favorite::
            where([
                ['user_id', '=', $request->id],
                ['favorited_id', '=', $request->unfavorite]
            ])
            ->delete();
        return response()->json([
            "status" => "Success",
            "data" => "Favorite Removed"
        ]);
    }

}
