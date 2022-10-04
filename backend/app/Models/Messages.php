<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Messages extends Model
{
    use HasFactory;
    public function senderInfo(){
        return $this->belongsTo(User::class, "sender_id");
    }
    public function receiverInfo(){
        return $this->belongsTo(User::class, "receiver_id");
    }
}
