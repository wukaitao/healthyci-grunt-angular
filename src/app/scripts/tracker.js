var newArrar=[]
function trackerApi(eventId, label, mapKv) {
    //talkingdata加载慢时,先存储数据
    if(typeof TDAPP =="undefined")
    {
        newArrar.push({eventId:eventId,label:label,mapKv:mapKv})
    }else{
        for(var i=0;i<newArrar.length;i++)
        {
            TDAPP.onEvent(newArrar[i].eventId, newArrar[i].label, newArrar[i].mapKv);
        }
        newArrar=[];
        TDAPP.onEvent(eventId, label, mapKv);
    }
    
}
