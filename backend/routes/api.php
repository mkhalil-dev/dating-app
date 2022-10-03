<?php

use App\Http\Controllers\profileController;
use App\Http\Controllers\userController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post("/getusers/{id}", [userController::class, "getUsers"])->name("get-user");
Route::post("/user/{id?}", [userController::class, "addOrUpdateUser"])->name("add-user");
Route::post("/login/{id}", [userController::class, "login"])->name("login-user");
Route::post("/messages/{id}", [profileController::class, "getMessages"])->name("user-messages");
Route::post("/sendmessage", [profileController::class, "sendMessage"])->name("send-messages");