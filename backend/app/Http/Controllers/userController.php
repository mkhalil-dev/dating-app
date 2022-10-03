<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class userController extends Controller
{
    function getUsers(Request $request, $id){
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
                        ->get();
        } else {
            $data = User::
                        where([
                            ['id', '!=', $id]
                            ])
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

        $user->name = $request->name ? $request->name : $user->name;
        $user->email = $request->email ? $request->email : $user->email;
        $user->password = $request->password ? $request->password : $user->password;
        $user->dob = $request->dob ? $request->dob : $user->dob;
        $user->gender = $request->gender ? $request->gender : $user->gender;
        $user->favgender = $request->favgender ? $request->favgender : $user->favgender;
        $user->image = $request->image ? $request->image : $user->image;
        $user->bio = $request->bio ? $request->bio : $user->bio;

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

    function login($id){
        $user = User::find($id);
        if(!$user){
            return response()->json([
                "status" => "Failed",
                "message" => "User not found"
            ]);
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
        $token = gen_uuid();
        $user->auth_token = $token;
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

    function get_feed(){
        
    }

}
