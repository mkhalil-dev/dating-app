<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Block;

use Illuminate\Support\Facades\Auth;


class userController extends Controller
{
    function getUsers(Request $request, $id){
        $blocklist = Block::
                        select("blocked_id")
                        ->where([
                            ["blocker_id", "=", $id]
                        ])
                        ->get();
        $blockarray = [];
        foreach ($blocklist as $x) {
            $blockarray[] = $x['blocked_id'];
        }
        $user = User::
                    where([
                        ["id", '=', $id],
                        ["auth_token", '=', $request->authToken]
                    ])
                    ->whereNotIn('id', $blockarray)
                    ->get();
        $user = User::
                    where([
                        ["id", '=', $id],
                        ["auth_token", '=', $request->authToken]
                    ])
                    ->get();
        if(sizeof($user) == 0){
            return response()->json([
                "status" => "Failed",
                "message" => "User not found"
            ]);
        }
        if($user[0]["favgender"] == "M"){
            $gender = "M";
        } else if ($user[0]["favgender"] == "F"){
            $gender = "F";
        } else {
            $gender = "A";
        }
        if($gender != "A"){
            $data = User::
                        where([
                            ["gender", '=', $gender],
                            ['id', '!=', $id]
                            ])
                        ->whereNotIn('id', $blockarray)
                        ->get();
        } else {
            $data = User::
                        where([
                            ['id', '!=', $id]
                            ])
                        ->whereNotIn('id', $blockarray)
                        ->get();
        }
        return response()->json([
            "status" => "Success",
            "data" => $data
        ]);
    }

    function addOrUpdateUser(Request $request, $id = "add"){
        if($id == "add"){
            $user = new User;
        }else{
            $user = User::find($id);
        }
        if($request->email){
            $finduser = User::
            where([
                ["email", '=', $request->email],
            ])
            ->get();
            if(sizeof($finduser) != 0){
                return response()->json([
                    "status" => "Failed",
                    "message" => "email already exists"
                ]);
            }
        }

        $user->name = $request->name ? $request->name : $user->name;
        $user->email = $request->email ? $request->email : $user->email;
        $user->password = $request->password ? $request->password : $user->password;
        $user->dob = $request->dob ? $request->dob : $user->dob;
        $user->gender = $request->gender ? $request->gender : $user->gender;
        $user->favgender = $request->favgender ? $request->favgender : $user->favgender;
        $user->image = $request->image ? $request->image : $user->image;
        $user->bio = $request->bio ? $request->bio : $user->bio;
        if($id == "add") $user->auth_token = gen_uuid();

        if($user->save()){
            return response()->json([
                "status" => "Success",
                "data" => $user
            ]);
        }

        return response()->json([
            "status" => "Error",
            "data" => "Error creating a model"
        ]);

    }

    function login(Request $request){
        $user = User::
                where([
                    ["email", '=', $request->email],
                ])
                ->get();
        if(!$user){
            return response()->json([
                "status" => "Error",
                "message" => "User not found"
            ]);
        }
        if($user[0]["password"] != $request->password){
            return response()->json([
                "status" => "Error",
                "data" => "incorrect password"
            ]);
        }
        $user = User::find($user[0]["id"]);
        $user->auth_token = gen_uuid();
        if($user->save()){
            return response()->json([
                "status" => "Success",
                "userid" => $user["id"],
                "token" => $user["auth_token"]
            ]);
        }
        return response()->json([
            "status" => "Error",
            "data" => "Error creating a model"
        ]);

    }

}

function gen_uuid() {
    return sprintf( '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),
        mt_rand( 0, 0xffff ),
        mt_rand( 0, 0x0fff ) | 0x4000,
        mt_rand( 0, 0x3fff ) | 0x8000,
        mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff )
    );
}