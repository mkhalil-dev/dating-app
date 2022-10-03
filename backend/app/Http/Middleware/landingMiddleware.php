<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

use Auth;

class StoreMiddleware
{
    public function handle(Request $request, Closure $next){

        $user = Auth::user();
        echo $user;
        if(true){
            return $next($request);
        }

        return redirect(route("not-found"));
    }