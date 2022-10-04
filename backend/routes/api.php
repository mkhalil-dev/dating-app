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
Route::get("/messages/{id}/{id2}", [profileController::class, "getMessages"])->name("user-messages");
Route::post("/sendmessage", [profileController::class, "sendMessage"])->name("send-messages");
Route::post("/block", [profileController::class, "block"])->name("block");
Route::post("/unblock", [profileController::class, "unblock"])->name("unblock");
Route::post("/favorite", [profileController::class, "favorite"])->name("favorite");
Route::get("/getfavorites/{id}", [profileController::class, "getFavorites"])->name("get-favorites");
Route::get("/getbans/{id}", [profileController::class, "getBans"])->name("get-bans");
Route::post("/unfavorite", [profileController::class, "unfavorite"])->name("unfavorite");
Route::post("/login", [userController::class, "login"])->name("login-user");
Route::get("/contacts/{id}", [profileController::class, "getContacts"])->name("user-contacts");